from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, description="Full name of customer")
    customer_email: EmailStr = Field(..., description="Valid customer email address")
    subject: str = Field(..., min_length=1, description="Issue subject / title")
    description: str = Field(..., min_length=1, description="Detailed problem description")
    priority: Optional[str] = Field("Medium", description="Priority level: Low, Medium, High, Urgent")

class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: str
    message: str = "Support ticket created successfully"

class NoteOut(BaseModel):
    id: int
    note_text: str
    created_at: str

class TicketOut(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    priority: str
    created_at: str
    updated_at: str

class TicketDetail(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: str
    updated_at: str
    notes: List[NoteOut] = []

class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Open, In Progress, or Closed")
    notes: Optional[str] = Field(None, description="Optional internal comment to append")

class TicketUpdateResponse(BaseModel):
    success: bool = True
    updated_at: str
    message: str = "Ticket updated successfully"

class StatsOut(BaseModel):
    total: int
    open: int
    inProgress: int
    closed: int
