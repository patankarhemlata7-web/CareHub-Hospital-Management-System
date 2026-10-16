🏥 CareHub
Hospital Management System v2
🌟 Overview
CareHub Hospital Management System v2 is a modern rewrite of a legacy Hospital-PHP application. It replaces traditional PHP pages with a responsive React dashboard and a Python-based REST API while retaining the existing MySQL database structure and data through `database/hmisphp.sql`.
CareHub is designed to make essential hospital workflows easier to access through a clean interface, simple navigation, and API-driven data.
> **Project type:** Full-stack web application  
> **Frontend:** React + Vite  
> **Backend:** Python + FastAPI + SQLAlchemy  
> **Database:** MySQL (`hmisphp`)  
> **Architecture:** React Single-Page Application → REST API → MySQL
---
✨ Highlights
🔐 Admin and Doctor Login — dedicated sign-in flow for supported roles.
📊 Live Dashboard KPIs — quick summaries of hospital data from the API.
🧑‍🤝‍🧑 Patient Management — search patient records and add patients.
🩺 Doctor Listing — view doctor directory information.
📋 Medical Records — module placeholder ready for future development.
🧪 Laboratory — module placeholder ready for future development.
📱 Responsive Navigation — sidebar layout for moving between modules.
🔌 REST API Architecture — separates frontend UI from backend logic.
🗄️ Legacy Database Support — uses the existing `hmisphp` MySQL database.
Medical Records and Laboratory are placeholders in the current version; they are not described as fully implemented workflows.
---
🧰 Tech Stack
Technology	Role
React	Frontend UI
Vite	Frontend development and build tooling
React Router	Client-side navigation
Axios	HTTP requests to the API
Lucide React	Interface icons
Python	Backend programming
FastAPI	REST API framework
SQLAlchemy	Database access and ORM
MySQL	Relational database
Uvicorn	ASGI server
---
🖥️ Application Modules
📊 Dashboard
Displays live KPI summaries from the backend to provide a quick overview of hospital operations.
🧑‍🤝‍🧑 Patient Management
Search patient records and use the add-patient form to register new patient information.
🩺 Doctor Directory
View the available doctor listing and related information.
📋 Medical Records
A placeholder module intended for future medical history and prescription workflows.
🧪 Laboratory
A placeholder module intended for future laboratory tests, reports, and result workflows.
🔐 Authentication
Provides the Admin/Doctor sign-in flow included in this development version.
---
🏗️ Architecture
```text
┌─────────────────────────────────┐
│       React + Vite SPA          │
│ React Router · Axios · Lucide   │
└────────────────┬────────────────┘
                 │ HTTP / REST
                 ▼
┌─────────────────────────────────┐
│        FastAPI Backend          │
│ Python · SQLAlchemy · Auth      │
└────────────────┬────────────────┘
                 │ SQL queries
                 ▼
┌─────────────────────────────────┐
│        MySQL Database           │
│          hmisphp                │
└─────────────────────────────────┘
```
The API-first structure allows future modules such as Pharmacy, Equipment, Payroll, Surgery, and Prescriptions to be added without replacing the frontend architecture.
---
📁 Project Structure
```text
CareHub-Hospital-Management-System/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── db.py
│   │   ├── main.py
│   │   └── models.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                 # Local secrets — never commit
│
├── database/
│   └── hmisphp.sql
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── api.js
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```
Adjust this tree if the files in your current repository differ.
---
🚀 Getting Started
Prerequisites
Install these tools before starting:
Python
Node.js (LTS)
MySQL Server
Git
1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```
Replace the placeholders with your actual GitHub username and repository name.
2. Set up the database
Start MySQL Server.
Open `database/hmisphp.sql` in MySQL Workbench or phpMyAdmin.
Run/import the SQL file.
Confirm that the database is named `hmisphp`.
Configure the matching database connection settings in the backend `.env` file.
> Import the SQL file only into the intended development database. Back up any existing database before changing it.
3. Start the Python backend
Open a terminal in the project root:
```bash
cd backend
python -m venv venv
```
Activate the environment on Windows:
Command Prompt
```bat
venv\Scripts\activate
```
PowerShell
```powershell
.\venv\Scripts\Activate.ps1
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Create your local environment file:
```bat
copy .env.example .env
```
The command above is for Windows Command Prompt. On PowerShell, `Copy-Item .env.example .env` can be used; on macOS/Linux, use `cp .env.example .env`.
Edit `.env` and set your local MySQL connection details and required secrets. Then start the backend:
```bash
uvicorn app.main:app --reload
```
Backend URL: http://localhost:8000  
Interactive API documentation: http://localhost:8000/docs
4. Start the React frontend
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite, normally:
http://localhost:5173
---
🔑 Demo Login
Use these development credentials only if they match the local database and authentication configuration.
Role	Login	Password
Admin	`admin@mail.com`	`Password@123`
Doctor	`YDS7L` (Doctor ID)	`password`
Security warning: These are demo credentials, not production credentials. Change or disable them before deployment and never reuse them for real accounts.
---
🔗 Local Development URLs
Service	URL
React frontend	`http://localhost:5173`
FastAPI backend	`http://localhost:8000`
Swagger API docs	`http://localhost:8000/docs`
Ports may differ depending on your local configuration.
---
🛣️ Roadmap
[ ] Complete Medical Records workflows
[ ] Implement Laboratory report management
[ ] Add role-based authorization to every protected endpoint
[ ] Add form validation and consistent error handling
[ ] Add pagination and advanced search
[ ] Add audit logging for sensitive operations
[ ] Expand Pharmacy, Equipment, Payroll, Surgery, and Prescriptions modules
[ ] Add automated tests and deployment documentation
---
🔐 Security Checklist
Before using this project beyond a local demo:
Replace legacy SHA-1 password hashes with a modern password hashing algorithm such as Argon2id or bcrypt.
Store JWT secrets and database credentials in environment variables or a secret manager.
Ensure `.env` and other secret files are excluded by `.gitignore`.
Implement and test role-based authorization on every protected endpoint.
Add input validation, audit logging, pagination, HTTPS, and secure error handling.
Use synthetic or anonymized patient records in screenshots and demos.
Do not use real patient data until the application has undergone appropriate security and privacy review.
---
🧩 Troubleshooting
Frontend does not open
Run `npm install` and `npm run dev` from the `frontend` directory.
Open the URL displayed in the Vite terminal.
Backend does not start
Activate the backend virtual environment.
Run `pip install -r requirements.txt`.
Confirm the command matches the FastAPI app module.
Database connection fails
Verify that MySQL is running and the `hmisphp` database exists.
Check the local database credentials and connection settings in `.env`.
Confirm that the SQL import completed successfully.
Login fails
Verify the demo credentials and authentication configuration.
Confirm that the expected database records and password hashes exist.
Check the browser console and backend terminal for errors.
---
💡 Project Value
CareHub demonstrates practical experience with:
Full-stack application development
React-based user interfaces
Python and FastAPI backend development
REST API integration
SQLAlchemy and MySQL
Authentication flow integration
Dashboard design and data presentation
Git and GitHub version control
---
🔮 Future Vision
CareHub's modular API architecture provides a foundation for expanding into a broader Hospital Information Management System with additional clinical and administrative workflows.
Potential extensions include appointment scheduling, pharmacy inventory, equipment tracking, surgery management, payroll, prescriptions, and more comprehensive medical records.
---
📄 License
No license has been specified yet. Add a `LICENSE` file and update this section if you intend to distribute the project under a specific open-source license.
---
👩‍💻 Author
Hemlata Patankar  
M.Sc. Computer Science  
Savitribai Phule Pune University
Technologies: React · Python · FastAPI · SQLAlchemy · MySQL · JavaScript · REST APIs
