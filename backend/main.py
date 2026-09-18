from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Optional
from datetime import datetime, timezone
import os

from database import init_db, get_db_connection, generate_next_ticket_id
from models import (
    TicketCreate,
    TicketCreateResponse,
    TicketOut,
    TicketDetail,
    TicketUpdate,
    TicketUpdateResponse,
    StatsOut
)

app = FastAPI(
    title="Datastraw Customer Support CRM API",
    description="Backend REST API built with FastAPI & SQLite for managing support tickets",
    version="1.0.0"
)

# Enable CORS for React frontend (Local development + Vercel deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://frontend-five-psi-fwfthsuuog.vercel.app",
        "*"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# -------------------------------------------------------------
# 1. POST /api/tickets - Create a new ticket
# -------------------------------------------------------------
@app.post(
    "/api/tickets",
    response_model=TicketCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new support ticket"
)
def create_ticket(ticket_data: TicketCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    ticket_id = generate_next_ticket_id()
    now_iso = datetime.now(timezone.utc).isoformat()
    priority = ticket_data.priority if ticket_data.priority in ["Low", "Medium", "High", "Urgent"] else "Medium"

    cursor.execute("""
        INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?);
    """, (
        ticket_id,
        ticket_data.customer_name.strip(),
        str(ticket_data.customer_email).strip(),
        ticket_data.subject.strip(),
        ticket_data.description.strip(),
        priority,
        now_iso,
        now_iso
    ))

    conn.commit()
    conn.close()

    return TicketCreateResponse(
        ticket_id=ticket_id,
        created_at=now_iso,
        message="Support ticket created successfully"
    )

# -------------------------------------------------------------
# 2. GET /api/tickets - List tickets with status filter & search
# -------------------------------------------------------------
@app.get(
    "/api/tickets",
    response_model=List[TicketOut],
    summary="List all tickets with optional search and status filter"
)
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by: Open, In Progress, Closed"),
    search: Optional[str] = Query(None, description="Search across ID, name, email, subject, description")
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT id, ticket_id, customer_name, customer_email, subject, status, priority, created_at, updated_at
        FROM tickets
        WHERE 1=1
    """
    params = []

    if status and status in ["Open", "In Progress", "Closed"]:
        query += " AND status = ?"
        params.append(status)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query += """
            AND (
                ticket_id LIKE ? OR
                customer_name LIKE ? OR
                customer_email LIKE ? OR
                subject LIKE ? OR
                description LIKE ?
            )
        """
        params.extend([term, term, term, term, term])

    query += " ORDER BY id DESC;"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

# -------------------------------------------------------------
# 3. GET /api/tickets/{ticket_id} - Get single ticket details with notes
# -------------------------------------------------------------
@app.get(
    "/api/tickets/{ticket_id}",
    response_model=TicketDetail,
    summary="Get detailed view of a ticket including internal notes"
)
def get_ticket_details(ticket_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tickets WHERE ticket_id = ?;", (ticket_id,))
    ticket_row = cursor.fetchone()

    if not ticket_row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found"
        )

    # Fetch notes
    cursor.execute("SELECT id, note_text, created_at FROM notes WHERE ticket_id = ? ORDER BY id ASC;", (ticket_id,))
    notes_rows = cursor.fetchall()
    conn.close()

    ticket_dict = dict(ticket_row)
    ticket_dict["notes"] = [dict(n) for n in notes_rows]
    return ticket_dict

# -------------------------------------------------------------
# 4. PUT /api/tickets/{ticket_id} - Update status and add notes
# -------------------------------------------------------------
@app.put(
    "/api/tickets/{ticket_id}",
    response_model=TicketUpdateResponse,
    summary="Update ticket status and/or append internal notes"
)
def update_ticket(ticket_id: str, update_data: TicketUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM tickets WHERE ticket_id = ?;", (ticket_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found"
        )

    now_iso = datetime.now(timezone.utc).isoformat()

    # Update status
    if update_data.status and update_data.status in ["Open", "In Progress", "Closed"]:
        cursor.execute("UPDATE tickets SET status = ?, updated_at = ? WHERE ticket_id = ?;", (update_data.status, now_iso, ticket_id))
    else:
        cursor.execute("UPDATE tickets SET updated_at = ? WHERE ticket_id = ?;", (now_iso, ticket_id))

    # Append internal note if provided
    if update_data.notes and update_data.notes.strip():
        cursor.execute("INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?);", (ticket_id, update_data.notes.strip(), now_iso))

    conn.commit()
    conn.close()

    return TicketUpdateResponse(
        success=True,
        updated_at=now_iso,
        message="Ticket updated successfully"
    )

# -------------------------------------------------------------
# 5. GET /api/stats - Dashboard summary counters
# -------------------------------------------------------------
@app.get(
    "/api/stats",
    response_model=StatsOut,
    summary="Get ticket count metrics by status"
)
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM tickets;")
    total = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM tickets WHERE status = 'Open';")
    open_count = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM tickets WHERE status = 'In Progress';")
    progress_count = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM tickets WHERE status = 'Closed';")
    closed_count = cursor.fetchone()["count"]

    conn.close()

    return StatsOut(
        total=total,
        open=open_count,
        inProgress=progress_count,
        closed=closed_count
    )

# Serve React static build if available
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        index_file = os.path.join(dist_dir, "index.html")
        return FileResponse(index_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
