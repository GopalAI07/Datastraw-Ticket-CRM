import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_fastapi_backend():
    print("=== Testing FastAPI + SQLite Backend Endpoints ===")

    # 1. Stats
    print("\n1. GET /api/stats")
    res = requests.get(f"{BASE_URL}/stats")
    assert res.status_code == 200, f"Failed stats: {res.text}"
    print("Stats Response:", res.json())

    # 2. Create Ticket
    print("\n2. POST /api/tickets")
    payload = {
        "customer_name": "Meera Patel",
        "customer_email": "meera.patel@acme.com",
        "subject": "SSO login failure with Google Workspace",
        "description": "Users clicking Login with Google are receiving an invalid callback URI error.",
        "priority": "Urgent"
    }
    res = requests.post(f"{BASE_URL}/tickets", json=payload)
    assert res.status_code == 201, f"Failed create ticket: {res.text}"
    ticket = res.json()
    ticket_id = ticket["ticket_id"]
    print("Created Ticket Response:", ticket)

    # 3. List & Search
    print("\n3. GET /api/tickets?search=Meera")
    res = requests.get(f"{BASE_URL}/tickets", params={"search": "Meera"})
    assert res.status_code == 200
    search_results = res.json()
    print("Search Results:", search_results)
    assert len(search_results) >= 1

    # 4. Get Ticket by ID
    print(f"\n4. GET /api/tickets/{ticket_id}")
    res = requests.get(f"{BASE_URL}/tickets/{ticket_id}")
    assert res.status_code == 200
    details = res.json()
    print("Ticket Details:", details)
    assert details["ticket_id"] == ticket_id

    # 5. Update Status and Add Note
    print(f"\n5. PUT /api/tickets/{ticket_id}")
    update_payload = {
        "status": "In Progress",
        "notes": "Verified OAuth client ID credentials in admin panel. Updating redirect URIs."
    }
    res = requests.put(f"{BASE_URL}/tickets/{ticket_id}", json=update_payload)
    assert res.status_code == 200
    print("Update Response:", res.json())

    # 6. Verify notes attached
    print(f"\n6. Verify Updated Details for {ticket_id}")
    res = requests.get(f"{BASE_URL}/tickets/{ticket_id}")
    assert res.status_code == 200
    updated_details = res.json()
    print("Updated Details with Notes:", updated_details)
    assert updated_details["status"] == "In Progress"
    assert len(updated_details["notes"]) == 1

    # 7. Check SPA HTML endpoint
    print("\n7. GET / (Testing React SPA serving from FastAPI)")
    res = requests.get("http://127.0.0.1:8000/")
    assert res.status_code == 200
    print("HTML served successfully, size:", len(res.text))

    print("\n>>> ALL FASTAPI + SQLITE + REACT TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_fastapi_backend()
