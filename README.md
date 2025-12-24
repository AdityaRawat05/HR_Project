TalentSync-AI – Smart Recruitment & Interview Management System

TalentSync-AI is a full-stack AI-powered recruitment platform that streamlines hiring by automating resume screening, candidate shortlisting, and interview scheduling with role-based access for HR, Candidates, and Employees.

📌 Features
👩‍💼 HR Module

Create & manage job postings

View ranked candidates based on resume score

Shortlist / reject candidates

Create interview slots (date & time)

View booked interviews (job-wise)

Automatic interview email notifications

👨‍🎓 Candidate Module

Register & login securely (JWT)

Upload resume for specific jobs

Track application status (Pending / Shortlisted / Rejected)

View available interview slots

Book interview slots

Receive interview confirmation via email

👨‍💻 Employee Module

Secure login

Talk with HR chatbot

🛠 Tech Stack
Backend

Django

Django REST Framework

JWT Authentication

SQLite / PostgreSQL

Email SMTP (Gmail / Custom SMTP)

Frontend

React (Vite)

Tailwind CSS

Axios

React Router DOM

Context API

🔐 Authentication & Roles
Role	Access
HR	Job, slots, candidates, interviews
Candidate	Resume upload, interview booking
Employee	Dashboard access

Authentication is handled using JWT tokens with role-based route protection.

📂 Project Structure
Backend
backend/
│── accounts/
│   ├── models.py
│   ├── views.py
│   ├── permissions.py
│
│── jobs/
│── candidates/
│── interviews/
│
│── manage.py
│── settings.py

Frontend
frontend/
│── src/
│   ├── pages/
│   │   ├── auth/
│   │   ├── hr/
│   │   ├── candidate/
│   │   ├── employee/
│   │
│   ├── context/
│   ├── components/
│   ├── utils/
│   └── App.jsx

⚙️ Backend Setup
1️⃣ Create virtual environment
python -m venv venv
source venv/bin/activate

2️⃣ Install dependencies
pip install -r requirements.txt

3️⃣ Run migrations
python manage.py makemigrations
python manage.py migrate

4️⃣ Run server
python manage.py runserver

⚙️ Frontend Setup
1️⃣ Install dependencies
npm install

2️⃣ Run frontend
npm run dev

🔗 API Endpoints (Important)
Auth
POST /api/accounts/register/
POST /api/accounts/login/

Jobs
GET  /api/jobs/
POST /api/jobs/create/

Resume
POST /api/candidates/upload/
GET  /api/candidates/my-resumes/

Interviews
POST /api/interviews/slots/create/        (HR)
GET  /api/interviews/slots/<job_id>/      (HR / Candidate)
POST /api/interviews/book/<slot_id>/      (Candidate)
GET  /api/interviews/my/                  (Candidate)
GET  /api/interviews/booked/<job_id>/     (HR)

📧 Email Notification

Interview confirmation emails are sent automatically when a candidate books a slot.

Email logic handled in:

interviews/email_service.py


SMTP can be configured via settings.py.

🧪 Testing via cURL (Example)
curl -X POST http://127.0.0.1:8000/api/interviews/slots/create/ \
  -H "Authorization: Bearer HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job": 1,
    "date": "2025-12-28",
    "start_time": "10:00",
    "end_time": "10:30"
  }'

🚧 Known Issues (Handled)

Role mismatch (fixed using lowercase role storage)

Missing job_id in slot creation (validated)

Blank interview UI due to serializer mismatch (fixed)

🌟 Future Enhancements

AI resume scoring improvements

Calendar integration (Google Calendar)

Video interview links

HR analytics dashboard

Admin panel

👨‍💻 Author
Neha Tyagi
Aditya Rawat
Ayush Butola
Divyam Samant
