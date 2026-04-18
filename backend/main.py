from fastapi import FastAPI
import models
from database import engine

print("=========================================")
print("Mengecek dan membuat tabel database...")
models.Base.metadata.create_all(bind=engine)
print("Selesai mengecek database!")
print("=========================================")

app = FastAPI(title="AI Ticket Triage API")

@app.get("/")
def read_root():
    return {"message": "Halo dari FastAPI! Setup backend berhasil."}