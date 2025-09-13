import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload, logLevel } from 'kafkajs';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor() {
    this.kafka = new Kafka({
      brokers: ['kafka:9092'],
      logLevel: logLevel.ERROR, // prevent noisy logs
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'order-processor-group' });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
    } catch (err) {
      this.logger.error('Error disconnecting from Kafka', err);
    }
  }

  private async connectWithRetry(retries = 5, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.producer.connect();
        await this.consumer.connect();

        this.logger.log('Kafka connected successfully');
        return;
      } catch (err) {
        this.logger.error(
          `Kafka connection attempt ${attempt} failed: ${err.message}`,
        );
        if (attempt === retries) {
          this.logger.error('Max retries reached. Continuing without Kafka.');
          return; // Don't crash app
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  /** Send message to Kafka topic */
  async sendMessage(topic: string, payload: object) {
    try {
      const privateKey = fs.readFileSync('./keys/nest_private.pem');
      const token = jwt.sign({ iss: 'nestjs-api' }, privateKey, {
        algorithm: 'RS256',
        expiresIn: '120s',
      });

      const message = { ...payload, token };

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (err) {
      this.logger.error(`Failed to send message to topic ${topic}`, err);
    }
  }

  /** Consume messages from Kafka topic */
  async consume(topic: string, callback: (payload: any) => Promise<void>) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
          try {
            const value = message.value?.toString();
            if (value) {
              const data = JSON.parse(value);
              await callback(data);
            }
          } catch (err) {
            this.logger.error(`Error processing message from ${topic}`, err);
          }
        },
      });
    } catch (err) {
      this.logger.error(`Failed to consume from topic ${topic}`, err);
    }
  }
}
