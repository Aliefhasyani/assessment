<!-- backend -->
<!-- lakukan step by step -->
1. CD backend
2. python -m venv venv
3. .\venv\Scripts\activate
4. pip install -r requirements.txt
<!-- jalankan docker untuk n8nnya -->
5. docker compose up 
<!-- jalankan backendnya -->
6. uvicorn main:app --reload


<!-- frontend -->
<!-- lakukan step by step -->
1. npm install (kalau belum ada nodemodules)
2. npm run dev