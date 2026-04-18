from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False) 
    submitted_by = Column(String(255), nullable=False) 
    
   
    status = Column(String(50), default="pending") 
    
    urgency_level = Column(String(50), nullable=True) 
    severity_score = Column(Integer, nullable=True) 
    reasoning = Column(Text, nullable=True)
    

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())