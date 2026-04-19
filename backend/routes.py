from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks 
from sqlalchemy.orm import Session
import models, schemas, database
import requests

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/test-ticket"

def send_to_n8n(ticket_id: int, title: str, description: str):
    try:
        payload = {
            "ticket_id": ticket_id,
            "title": title,
            "description": description
        }
        requests.post(N8N_WEBHOOK_URL, json=payload, timeout=5)
    except Exception as e:
        print(f"Log: Gagal kirim ke n8n di background. Error: {e}")

@router.post("/", response_model=schemas.TicketResponse)
def create_ticket(
    ticket: schemas.TicketCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(database.get_db)
):
    new_ticket = models.Ticket(**ticket.model_dump())
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    
    background_tasks.add_task(send_to_n8n, new_ticket.id, new_ticket.title, new_ticket.description)
    
    return new_ticket


@router.get("/", response_model=list[schemas.TicketResponse])
def get_tickets(db: Session = Depends(database.get_db)):
    return db.query(models.Ticket).all()

@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(database.get_db)):
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
        
    return db_ticket

@router.patch("/{ticket_id}/analysis")
def update_ticket_analysis(
    ticket_id: int, 
    analysis: schemas.TicketAnalysisUpdate, 
    db: Session = Depends(database.get_db)
):
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    

    db_ticket.urgency_level = analysis.urgency_level
    db_ticket.severity_score = analysis.severity_score
    db_ticket.reasoning = analysis.reasoning
    db_ticket.status = "analyzed" 
    
    db.commit()
    return {"status": "success", "message": "Analisis tiket berhasil diperbarui"}