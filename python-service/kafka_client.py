# kafka_client.py
import os
import json
import asyncio
import logging
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
load_dotenv()

# Kafka configuration from environment
BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
TOPIC_IN = os.getenv("KAFKA_TOPIC_IN", "orders.in")
TOPIC_OUT = os.getenv("KAFKA_TOPIC_OUT", "orders.out")
GROUP = os.getenv("CONSUMER_GROUP", "order-processor-group")
CLIENT_ID = os.getenv("SERVICE_ID", "order-processor")

# Global producer/consumer instances
producer = None
consumer = None

# Retry configuration
RETRY_COUNT = 10
RETRY_DELAY = 5  # seconds


async def get_producer():
    global producer
    if producer is None:
        for attempt in range(1, RETRY_COUNT + 1):
            try:
                producer = AIOKafkaProducer(bootstrap_servers=BOOTSTRAP, client_id=CLIENT_ID)
                await producer.start()
                logging.info(f"✅ Kafka producer connected to {BOOTSTRAP}")
                break
            except Exception as e:
                logging.error(f"Attempt {attempt}/{RETRY_COUNT} - Kafka producer not ready: {e}")
                await asyncio.sleep(RETRY_DELAY)
        else:
            raise RuntimeError(f"Unable to connect Kafka producer after {RETRY_COUNT} attempts")
    return producer


async def get_consumer():
    global consumer
    if consumer is None:
        for attempt in range(1, RETRY_COUNT + 1):
            try:
                consumer = AIOKafkaConsumer(
                    TOPIC_IN,
                    bootstrap_servers=BOOTSTRAP,
                    group_id=GROUP,
                    client_id=CLIENT_ID,
                    auto_offset_reset="earliest",
                    enable_auto_commit=False
                )
                await consumer.start()
                logging.info(f"✅ Kafka consumer connected to {BOOTSTRAP}, subscribed to {TOPIC_IN}")
                break
            except Exception as e:
                logging.error(f"Attempt {attempt}/{RETRY_COUNT} - Kafka consumer not ready: {e}")
                await asyncio.sleep(RETRY_DELAY)
        else:
            raise RuntimeError(f"Unable to connect Kafka consumer after {RETRY_COUNT} attempts")
    return consumer


async def send_out_event(obj: dict):
    """
    Send a message to the OUT topic
    """
    p = await get_producer()
    await p.send_and_wait(TOPIC_OUT, json.dumps(obj).encode("utf-8"))
    logging.info(f"➡️ Event sent to {TOPIC_OUT}: {obj}")


async def consume_events(process_func):
    """
    Consume messages from the IN topic and process them with `process_func`
    """
    c = await get_consumer()
    try:
        async for msg in c:
            data = json.loads(msg.value.decode("utf-8"))
            logging.info(f"⬅️ Event received from {TOPIC_IN}: {data}")
            await process_func(data)
            await c.commit()
    finally:
        await c.stop()


# Example usage:
# async def process(event):
#     print("Processing:", event)
# asyncio.run(consume_events(process))
