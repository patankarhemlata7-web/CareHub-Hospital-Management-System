# CareHub — Hospital Management System v2

## 📌 Project Overview

**CareHub Hospital Management System v2** is a modern web-based hospital management application developed by replacing the old PHP interface with a React frontend and Python backend.

The application uses **React, FastAPI, SQLAlchemy, and MySQL** to manage hospital information through a responsive dashboard and REST API.

---

## 🎯 Project Objectives

- Modernize the existing PHP-based hospital management application
- Provide Admin and Doctor login functionality
- Display hospital statistics through dashboard KPIs
- Search and add patient records
- Display doctor information
- Integrate the application with an existing MySQL database
- Build a modular architecture for future hospital management features

---

## 🛠️ Tools & Technologies

- **Frontend:** React.js, Vite, JavaScript, CSS
- **Routing:** React Router
- **API Communication:** Axios
- **UI Icons:** Lucide React
- **Backend:** Python, FastAPI
- **ORM:** SQLAlchemy
- **Database:** MySQL
- **API Documentation:** Swagger UI
- **Architecture:** React SPA → REST API → MySQL

---

## 📁 Database Overview

The project uses the existing MySQL database named `hmisphp`.

The database structure and data are retained from the original Hospital-PHP project through the SQL file.

### Database Setup

1. Install and start MySQL.
2. Open `database/hmisphp.sql` in MySQL Workbench or phpMyAdmin.
3. Execute the SQL script to create or import the database structure and data.
4. Configure the database credentials in the backend `.env` file.

---

## 🔐 Authentication

The application provides login functionality for two user types.

### 1. Admin Login

Provides access to the administrator login flow.

**Demo credentials:**
- Email: `admin@mail.com`
- Password: `Password@123`

### 2. Doctor Login

Provides access to the doctor login flow.

**Demo credentials:**
- Doctor ID: `YDS7L`
- Password: `password`

*These are development demo credentials. Do not use them for a production deployment.*

---

## 📊 Current Working Modules

### 1. Dashboard

Displays live KPI summaries using data retrieved from the backend.

### 2. Patient Management

- Search patient records
- Add new patients using the patient form

### 3. Doctor Listing

Displays doctor information from the application data.

### 4. Responsive Navigation

Provides a responsive sidebar and navigation for accessing the application modules.

### 5. Medical Records

The module is currently a placeholder for future implementation.

### 6. Laboratory

The module is currently a placeholder for future implementation.

---

## 🏗️ Application Architecture

The application follows a three-layer architecture:

1. **React Frontend:** Provides the user interface and navigation.
2. **FastAPI Backend:** Handles API requests and application logic.
3. **MySQL Database:** Stores and provides hospital-related data through SQLAlchemy.

The frontend communicates with the backend using REST API endpoints.

---

## 🔄 Project Workflow

1. The user opens the React application.
2. The user logs in as Admin or Doctor.
3. The frontend sends API requests to the FastAPI backend.
4. The backend processes the requests and interacts with MySQL through SQLAlchemy.
5. The database returns the requested information.
6. The frontend displays dashboard KPIs, patient information, or doctor listings.

---

## 📂 Project Structure

```text
CareHub-Hospital-Management-System/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── models.py
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   └── hmisphp.sql
│
├── frontend/
│   ├── src/
│   ├── api.js
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/patankarhemlata7-web/CareHub-Hospital-Management-System.git
cd CareHub-Hospital-Management-System
```

### 2. Set Up the Backend

Open a terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Create the environment configuration file:

```bash
copy .env.example .env
```

Edit `.env` and configure your MySQL password and other required environment variables.

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend URL: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, normally:

`http://localhost:5173`

---

## 🔮 Future Enhancements

The architecture can support additional modules, including:

- Pharmacy Management
- Equipment Management
- Payroll Management
- Surgery Management
- Prescription Management
- Additional role-based permissions and access controls

These are planned extensions, not currently implemented working modules.

---

## 💼 Skills Demonstrated

- React.js Frontend Development
- Python Programming
- FastAPI and REST API Development
- MySQL Database Integration
- SQLAlchemy ORM
- API Integration using Axios
- JWT-Based Authentication
- Full-Stack Application Architecture
- Responsive UI Development

---

## 🚀 Project Outcome

CareHub demonstrates the modernization of a legacy PHP hospital management application into a React-based frontend and Python API architecture.

The current version includes Admin/Doctor login, dashboard KPIs, patient search and registration, and doctor listing, while providing a foundation for implementing additional hospital management modules.

---

## 👩‍💻 Author

**Hemlata Patankar**

M.Sc. Computer Science  
Savitribai Phule Pune University

**Skills:** Python | React.js | FastAPI | MySQL | SQLAlchemy | REST APIs | JavaScript



