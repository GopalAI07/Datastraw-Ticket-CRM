# Datastraw - Customer Support CRM System

A full-stack Customer Support Ticket Management CRM built with **FastAPI (Python)**, **SQLite**, and **React (Vite + Tailwind CSS)**. Featuring a dark Red & Brown themed user interface with real-time ticket tracking, multi-criteria filtering, internal activity timeline, metric analytics, and mobile responsiveness.

---

## 🌐 Live Deployments

- **Frontend (Vercel)**: [https://frontend-five-psi-fwfthsuuog.vercel.app/](https://frontend-five-psi-fwfthsuuog.vercel.app/)
- **Backend API (Render)**: [https://datastraw-ticket-crm-bp5s.onrender.com/](https://datastraw-ticket-crm-bp5s.onrender.com/)
- **Interactive API Docs (Swagger)**: [https://datastraw-ticket-crm-bp5s.onrender.com/docs](https://datastraw-ticket-crm-bp5s.onrender.com/docs)

---

## 🚀 Features

- **Ticket Lifecycle Management**: Create, view, update status (`Open`, `In Progress`, `Closed`), and assign priorities (`Low`, `Medium`, `High`, `Urgent`).
- **Real-Time Search**: Search tickets across Ticket ID, customer name, email address, or issue description keywords.
- **Interactive Metric Cards**: Top analytics dashboard showing counts for Total Tickets, Open Issues, In Progress, and Resolved & Closed tickets with one-click filtering.
- **Internal Activity Notes**: Add and view internal timestamped collaboration remarks for support team members.
- **CSV Export**: Export filtered or complete ticket lists to CSV directly from the browser.
- **Color-Coded Status & Priority Badges**:
  - **Open**: Yellow theme badge
  - **In Progress**: Blue theme badge
  - **Closed**: Green theme badge
  - **Priorities**: Red (Urgent), Yellow (High), Blue (Medium), Green (Low)
- **Responsive Mobile Layout**: Single-line 4-column compact metric cards, touch-optimized header, and horizontal-scrolling ticket data table.

---

## 🛠️ Tech Stack

### **Backend**
- **Python 3.10+**
- **FastAPI**: Modern, high-performance web framework for building REST APIs.
- **SQLite3**: Lightweight relational database (`crm.db`) with 2-table schema (`tickets`, `notes`).
- **Pydantic v2**: Data validation, email regex verification, and schema definitions.
- **Uvicorn**: ASGI web server implementation.

### **Frontend**
- **React 18**: Component-driven UI architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS v3**: Utility-first styling with custom Red & Brown design tokens.
- **Lucide React**: Modern icon set.


## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and **npm** installed

---

### 2. Backend Setup (FastAPI + SQLite)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv myvenv
     .\myvenv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv myvenv
     source myvenv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - API will be live at: `http://127.0.0.1:8000`
   - Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Access the CRM application at: `http://localhost:5173`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Retrieve aggregate counts (Total, Open, In Progress, Closed) |
| `GET` | `/api/tickets` | List tickets with optional `?status=` and `?search=` filters |
| `POST` | `/api/tickets` | Create a new ticket (Generates `TICK-XXXX` ID) |
| `GET` | `/api/tickets/{ticket_id}` | Fetch full ticket details with internal notes timeline |
| `PUT` | `/api/tickets/{ticket_id}` | Update ticket status and optionally append an internal note |

---

## 🧪 Running Backend Tests

An automated API test script is included to test all endpoints:
```bash
cd backend
python test_backend.py
```

---

## 🎨 Design Guidelines
- **Palette**: Dark Red & Brown (`#0e0808`, `#140c0c`, `#1a1010`) with vibrant yellow, blue, and emerald accents.
- **Terminology**: The dialog containers follow the strict naming convention of **"model"** (`CreateTicketModel`, `TicketDetailModel`).
