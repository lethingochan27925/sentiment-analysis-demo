pip install -r backend/requirements.txt

run backend
cd backend
uvicorn app.main:app --reload

run frontend
cd frontend
npm run dev


