from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from scanner import scan_receipt
from healer import heal_item
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scan")
async def scan(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = scan_receipt(image_bytes)
    return result

@app.get("/health")
async def health():
    return {"status": "ok"}

class HealRequest(BaseModel):
    item_name: str
    restaurant_name: str

@app.post("/heal")
async def heal(request: HealRequest):
    result = heal_item(request.item_name, request.restaurant_name)
    return result
