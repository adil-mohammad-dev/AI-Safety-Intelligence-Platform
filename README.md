# AI-Powered Real-Time Safety Intelligence Platform

A production-style AI safety monitoring platform that analyzes uploaded workplace videos, detects safety incidents, creates restricted-zone violation records, and generates AI-powered incident reports using Groq API.

This project is designed for workplaces, campuses, warehouses, factories, and restricted operational areas where safety teams need a faster way to review incidents from uploaded video footage.

---

## Project Overview

The AI-Powered Real-Time Safety Intelligence Platform allows users to upload workplace safety footage and automatically analyze it using computer vision.

The system extracts video metadata, samples frames, runs object/person detection, evaluates restricted-zone violations, stores incidents in PostgreSQL, and generates AI-based incident reports using Groq API.

The platform includes a React dashboard for monitoring videos, incidents, severity levels, recent events, and downloadable reports.

---

## Problem Statement

Safety teams often need to manually review CCTV or workplace footage to identify restricted-zone violations, unsafe presence, or operational risks. Manual review is time-consuming and may delay response.

This platform helps automate the first level of incident detection and reporting by combining:

- Video processing
- Computer vision detection
- Restricted-zone rule logic
- Incident management
- AI-generated safety reports

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected backend APIs
- Secure frontend-backend communication

### Video Analysis

- Upload workplace safety videos
- Store uploaded video metadata
- Extract video details such as FPS, duration, total frames, and resolution
- Extract sample frames from uploaded videos
- Save extracted frames for analysis

### AI / Computer Vision Pipeline

- YOLOv3-Tiny object detection using OpenCV DNN
- OpenCV HOG fallback person detection
- Hybrid detection summary
- Restricted-zone rule engine
- High-severity incident creation based on detection results

### Incident Management

- View all detected incidents
- Track incident severity
- Track incident status
- Resolve open incidents
- Generate AI reports for incidents

### Dashboard Analytics

- Total uploaded videos
- Completed analyses
- Total incidents
- High-severity incidents
- Open incidents
- Recent incidents
- Severity breakdown

### AI Incident Reports

- Groq API integration
- Professional AI-generated safety reports
- Risk analysis
- Recommended actions
- Downloadable text reports

---

## Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router
- HTML
- CSS
- JavaScript

### Backend

- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- OpenCV
- YOLOv3-Tiny with OpenCV DNN
- Groq API

### Database

- PostgreSQL

### Tools

- Swagger UI for API testing
- pgAdmin for database management
- Git and GitHub

---

## Project Modules

- Authentication Module
- Video Upload Module
- Video Analysis Module
- Incident Management Module
- Dashboard Analytics Module
- AI Report Generation Module

---

## System Architecture

```text
React Frontend
      ↓
Axios API Requests
      ↓
FastAPI Backend
      ↓
JWT Authentication
      ↓
PostgreSQL Database
      ↓
OpenCV Video Processing
      ↓
YOLOv3-Tiny Object Detection
      ↓
OpenCV HOG Fallback Detection
      ↓
Restricted-Zone Rule Engine
      ↓
Incident Creation
      ↓
Groq AI Report Generation
```

---

## AI Detection Pipeline

```text
Upload Video
      ↓
Store Video File
      ↓
Extract Video Metadata
      ↓
Extract Sample Frames
      ↓
Run YOLOv3-Tiny Detection
      ↓
Run OpenCV HOG Fallback Detection
      ↓
Evaluate Restricted-Zone Rule
      ↓
Create Safety Incident
      ↓
Generate AI Incident Report
      ↓
Display on Dashboard
```

---

## Database Modules

The system uses PostgreSQL with the following main entities:

- Users
- Videos
- Incidents
- Incident Reports

### Users

Stores registered user details and authentication-related information.

### Videos

Stores uploaded video file name, file path, upload status, user ID, and upload timestamp.

### Incidents

Stores incident type, severity, description, confidence score, status, video ID, user ID, and creation timestamp.

### Incident Reports

Stores AI-generated report summary, risk analysis, recommended action, user ID, incident ID, and report creation timestamp.

---

## API Modules

### Authentication APIs

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Video APIs

- `POST /videos/upload`
- `GET /videos/`
- `POST /videos/{video_id}/analyze`

### Incident APIs

- `GET /incidents/`
- `PATCH /incidents/{incident_id}/resolve`

### Dashboard APIs

- `GET /dashboard/summary`
- `GET /dashboard/recent-incidents`
- `GET /dashboard/severity-breakdown`

### Report APIs

- `POST /reports/incidents/{incident_id}/generate`
- `GET /reports/incidents/{incident_id}`

---

## Frontend Pages

- Login Page
- Register Page
- Dashboard Page
- Video Analysis Page
- Incident Management Page
- AI Incident Report Page

---

## Screenshots

### Login Page

![Login Page](screenshots/login-page.png)

### Dashboard

![Dashboard](screenshots/dashboard-page.png)

### Video Analysis

![Video Analysis](screenshots/video-analysis-page.png)

### Incident Management

![Incident Management](screenshots/incidents-page.png)

### AI Incident Report

![AI Incident Report](screenshots/ai-report-page.png)

---

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Safety-Intelligence-Platform
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
APP_NAME=AI Safety Intelligence Platform
APP_VERSION=1.0.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_dev_platform
SECRET_KEY=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend server:

```bash
python -m uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## YOLO Model Setup

Create this folder:

```text
backend/models/yolo/
```

Place these files inside:

```text
coco.names
yolov3-tiny.cfg
yolov3-tiny.weights
```

Expected folder structure:

```text
backend/
└── models/
    └── yolo/
        ├── coco.names
        ├── yolov3-tiny.cfg
        └── yolov3-tiny.weights
```

---

## Project Workflow

1. User registers or logs in.
2. User uploads a workplace safety video.
3. Backend stores the uploaded video.
4. OpenCV extracts video metadata such as FPS, duration, resolution, and total frames.
5. Frames are sampled and saved.
6. YOLOv3-Tiny checks for object detections.
7. OpenCV HOG works as fallback person detection.
8. Restricted-zone rule engine evaluates possible safety violation.
9. Incident is created and stored in PostgreSQL.
10. Groq API generates AI incident report.
11. User views dashboard, incidents, reports, and downloads reports.

---

## Advanced Highlights

- Modular FastAPI backend architecture
- JWT-secured protected routes
- PostgreSQL relational database design
- Hybrid computer vision detection pipeline
- YOLOv3-Tiny integration using OpenCV DNN
- OpenCV HOG fallback detection
- Restricted-zone rule engine
- AI report generation using Groq API
- React dashboard with operational analytics
- Downloadable incident reports

---

## Future Improvements

- Add live webcam monitoring
- Add WebSocket-based real-time alerts
- Add user-defined restricted zones from frontend
- Add YOLOv8 support with newer Python environment
- Add fire and smoke detection model
- Add Docker and Docker Compose setup
- Add cloud deployment using Render and Vercel
- Add automated backend tests using Pytest
- Add role-based access control for admin and safety officer users

---

## Project Status

MVP completed with advanced AI pipeline upgrades.

Current version includes:

- Full-stack frontend and backend
- Authentication
- Video upload
- Computer vision pipeline
- Hybrid detection engine
- Restricted-zone rule engine
- Incident management
- Groq AI reports
- Dashboard analytics