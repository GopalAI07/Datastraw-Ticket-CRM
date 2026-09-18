import sqlite3
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "crm.db")

def get_db_connection():
    """
    Establishes and returns a connection to the SQLite database file.
    Configures row_factory to sqlite3.Row for dictionary-like access.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """
    Initializes the SQLite database with the 2 required tables:
    1. tickets table
    2. notes table (foreign key to tickets)
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Tickets Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT CHECK(status IN ('Open', 'In Progress', 'Closed')) DEFAULT 'Open',
            priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
    """)

    # 2. Notes Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id TEXT NOT NULL,
            note_text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
        );
    """)

    conn.commit()

    # Check if empty, then seed starter data
    cursor.execute("SELECT COUNT(*) as count FROM tickets;")
    count = cursor.fetchone()["count"]
    if count == 0:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    """
    Seeds initial sample tickets into the SQLite database.
    """
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    sample_tickets = [
        (
            "TKT-1001",
            "Aarav Sharma",
            "aarav.sharma@example.com",
            "Payment gateway timeout during checkout",
            "Customer was charged twice while paying for annual subscription, but order confirmation page failed to load.",
            "Open",
            "Urgent",
            now_iso,
            now_iso
        ),
        (
            "TKT-1002",
            "Priya Nair",
            "priya.nair@techcorp.in",
            "Unable to invite team members to workspace",
            "The invite modal shows a 403 Forbidden error when trying to invite email addresses with custom domains.",
            "In Progress",
            "High",
            now_iso,
            now_iso
        ),
        (
            "TKT-1003",
            "Rohan Gupta",
            "rohan.gupta@startup.io",
            "Feature Request: Dark mode for analytics dashboard",
            "Would love to have an eye-friendly dark mode for the analytics charts during nighttime monitoring.",
            "Closed",
            "Low",
            now_iso,
            now_iso
        )
    ]

    cursor.executemany("""
        INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, sample_tickets)

    sample_notes = [
        ("TKT-1002", "Investigated backend logs. Custom domain verification check is timing out. Assigned to infra team.", now_iso),
        ("TKT-1003", "Dark mode feature logged into roadmap backlog. Marked ticket as closed.", now_iso)
    ]

    cursor.executemany("""
        INSERT INTO notes (ticket_id, note_text, created_at)
        VALUES (?, ?, ?);
    """, sample_notes)

    conn.commit()

def generate_next_ticket_id():
    """
    Generates the next sequential Ticket ID (e.g. TKT-1001, TKT-1002...).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ticket_id FROM tickets ORDER BY id DESC LIMIT 1;")
    row = cursor.fetchone()
    conn.close()

    if not row:
        return "TKT-1001"
    
    last_id = row["ticket_id"]
    try:
        num = int(last_id.split("-")[1])
        return f"TKT-{num + 1}"
    except (IndexError, ValueError):
        return "TKT-1001"
