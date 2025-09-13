# main.py
import asyncio, json
from fastapi import FastAPI
from dotenv import load_dotenv
from datetime import datetime
from kafka_client import get_consumer, send_out_event, get_producer
from db import orders_collection
from jwt_verify import verify_message_token
import os, logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("order-processor")

app = FastAPI(title="Order Processor")

@app.get("/health")
async def health():
    return {"status":"ok", "time": datetime.utcnow().isoformat()}

async def process_messages():
    consumer = await get_consumer()
    try:
        async for msg in consumer:
            try:
                raw = msg.value.decode()
                payload = json.loads(raw)

                # token from payload OR headers
                token = payload.pop("token", None)
                if not token and getattr(msg, "headers", None):
                    for k, v in msg.headers:
                        if k.lower() == "authorization":
                            token = v.decode() if isinstance(v, bytes) else v

                if not token:
                    logger.warning("no token -> skipping message")
                    await consumer.commit()
                    continue

                try:
                    verify_message_token(token)
                except Exception as e:
                    logger.warning("jwt verify failed: %s", e)
                    await consumer.commit()
                    continue

                order_id = payload.get("order_id") or f"ord_{int(datetime.utcnow().timestamp())}"

                # Check if order already exists
                exists = await orders_collection.find_one({"order_id": order_id})
                if exists:
                    await send_out_event({
                        "id": order_id,
                        "status": "already_exists",
                        "processed_at": datetime.utcnow().isoformat()
                    })
                    await consumer.commit()
                    continue

                # Build order document based on schema
                doc = {
                    "order_id": order_id,
                    "name": payload.get("name"),
                    "address": payload.get("address"),
                    "phone": payload.get("phone"),
                    "note": payload.get("note"),
                    "products": [
                        {
                            "productId": prod.get("product_id"),
                            "productName": prod.get("product_name"),
                        }
                        for prod in payload.get("products", [])
                    ],
                    "created_at": payload.get("created_at") or datetime.utcnow(),
                    "processed_at": datetime.utcnow(),
                    "status": "inserted",
                }

                # Insert into collection
                await orders_collection.insert_one(doc)
                await send_out_event({"order_id": order_id, "status":"inserted", "processed_at": datetime.utcnow().isoformat()})
                await consumer.commit()
                logger.info("inserted order %s", order_id)

            except Exception as e:
                logger.exception("processing error: %s", e)
    finally:
        logger.info("consumer loop finished")

@app.on_event("startup")
async def startup():
    app.state.task = asyncio.create_task(process_messages())

@app.on_event("shutdown")
async def shutdown():
    task = getattr(app.state, "task", None)
    if task:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
    pr = await get_producer()
    await pr.stop()
