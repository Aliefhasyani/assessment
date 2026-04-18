from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
import models
from database import engine
from routes import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Ticket Triage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Message: Selamat Datang!"}

app.include_router(router)