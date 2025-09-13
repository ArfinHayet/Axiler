from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
_client = AsyncIOMotorClient(MONGO_URI)

# Explicitly select the 'test' database
db = _client["test"]

# Choose your collection
orders_collection = db["orders"]  # or "orders" if you want
