# MediCare – Hospital & Doctor Appointment System

MediCare is a full-stack hospital and doctor appointment management system designed to simplify interactions between patients, doctors, and hospital administrators.

The application provides separate dashboards and workflows for **Patients, Doctors, and Administrators**, with data stored and managed through a Node.js, Express.js, and MongoDB backend.

## Features

### Patient Module
- Patient registration and login
- Patient dashboard
- Browse doctors
- View doctor information
- Book doctor appointments
- View appointment status
- Medical records
- Prescriptions
- Bills and payments
- Notifications
- Patient logout and online status

### Doctor Module
- Doctor login
- Doctor dashboard
- Doctor profile management
- View assigned patients
- View and manage appointments
- Mark confirmed appointments as completed
- Manage doctor schedule
- Medical records
- Prescriptions
- Notifications
- Doctor account enable/disable
- Password reset functionality

### Admin Module
- Admin dashboard
- Manage doctors
- Add and edit doctor information
- Manage doctor access
- Reset doctor passwords
- Manage departments
- Activate/deactivate departments
- Assign doctors to departments
- Manage patients
- Manage appointments
- View appointment status
- Dashboard statistics
- Monitor patient and doctor login status

## Appointment Workflow

The system supports the complete appointment lifecycle:

```text
Patient Books Appointment
          ↓
       Pending
          ↓
    Admin Confirms
          ↓
      Confirmed
          ↓
 Doctor Completes Visit
          ↓
      Completed
```

The appointment information is stored in MongoDB and is reflected across the relevant patient, doctor, and admin dashboards.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

### Development Tools
- Visual Studio Code
- MongoDB Compass
- Postman
- Git
- GitHub

## Project Structure

```text
Hospital Appointment System
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Main Backend Modules

The backend contains separate controllers, models, and routes for:

- Patients
- Doctors
- Departments
- Appointments
- Medical Records
- Prescriptions
- Bills
- Notifications
- Doctor Schedules
- Admin operations

## Database

The application uses **MongoDB** with **Mongoose** for database management.

Main collections include:

- Patients
- Doctors
- Departments
- Appointments
- Medical Records
- Prescriptions
- Bills
- Notifications
- Doctor Schedules

## How to Run the Project

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- MongoDB Compass (optional)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sayalimore2004/MediCare-Hospital-Appointment-System.git
```

### 2. Open the Project

```bash
cd MediCare-Hospital-Appointment-System
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Do not commit your `.env` file to GitHub.

### 5. Start the Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Structure

The backend provides REST API endpoints for the major modules.

Examples:

```text
/api/patients
/api/doctors
/api/departments
/api/appointments
/api/medical-records
/api/prescriptions
/api/bills
/api/notifications
/api/doctor-schedules
```

## User Roles

| Role | Main Responsibilities |
|---|---|
| Patient | Book appointments, view records, prescriptions, bills and notifications |
| Doctor | Manage appointments, patients, schedules, medical records and prescriptions |
| Admin | Manage doctors, departments, patients and appointments |

## Project Highlights

- Full-stack React and Node.js application
- REST API based backend
- MongoDB database integration
- Role-based application workflows
- Separate dashboards for Patient, Doctor and Admin
- Real-time data retrieval from MongoDB
- Complete appointment status workflow
- Doctor schedule management
- Medical record and prescription management
- Billing and notification modules

## Future Enhancements

Possible future improvements include:

- Online payment gateway integration
- Email/SMS appointment notifications
- Advanced appointment slot generation
- Hospital analytics and reporting
- Doctor availability calendar
- Cloud deployment
- Enhanced authentication and authorization
- Automated testing

## Author

**Sayali More**

B.E. Electronics & Telecommunication Engineering  
JSPM's Imperial College of Engineering and Research, Pune

GitHub:  
https://github.com/Sayalimore2004

## License

This project was developed as an academic/internship project for learning and demonstration purposes.
