<!-- backend -->
<!-- lakukan step by step -->
1. CD backend
2. python -m venv venv
3. .\venv\Scripts\activate
4. pip install -r requirements.txt
<!-- jalankan docker untuk n8nnya -->
5. docker compose up(tidak perlu berada di direktori backend) 
<!-- jalankan backendnya -->
6. uvicorn main:app --reload


<!-- frontend -->
<!-- lakukan step by step -->
1. cd frontend
2. npm install (kalau belum ada nodemodules)
3. npm run dev