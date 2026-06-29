# 🧵 ThreadCounty – AI-Powered Textile Analysis Platform

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge\&logo=vercel)

</p>

---

## 🌐 Live Demo

🚀 **Website**

https://threadcounty-ai-insights1.vercel.app/

💻 **GitHub Repository**

https://github.com/prajwalkarajange/threadcounty-ai-insights1

---

# ✨ About The Project

**ThreadCounty** is a modern AI-powered textile analysis platform designed for textile manufacturers, students, researchers, and quality control professionals.

Users can upload a fabric image and instantly receive AI-generated insights including:

* Fabric Type
* Quality Score
* Confidence Score
* Texture Analysis
* Color Analysis
* Weave Pattern
* Recommendations
* PDF Report

The platform combines a modern SaaS interface with secure authentication, analytics, role-based administration, and a responsive design.

---

# 🚀 Key Features

### 👤 Authentication

* Secure Login
* User Registration
* Protected Routes
* Role-Based Access
* Session Management

---

### 🧵 AI Fabric Analysis

* Upload Fabric Images
* AI-Based Fabric Identification
* Confidence Score
* Quality Score
* Texture Detection
* Color Analysis
* Weave Pattern Detection
* Recommendations
* PDF Export

---

### 📚 Upload History

* Search Reports
* Card View
* Table View
* Delete Reports
* View Detailed Analysis

---

### 📊 User Dashboard

* Total Uploads
* Recent Activity
* Average Quality
* Quality Graph
* Quick Navigation

---

### 🛠 Admin Dashboard

* User Management
* Upload Management
* AI Analysis Management
* Analytics Dashboard
* Platform Statistics

---

### 📈 Analytics

* Total Users
* Total Uploads
* Total AI Analyses
* Average Quality
* Fabric Distribution
* AI Statistics
* Recent Activity

---

### 🎨 UI / UX

* Responsive Design
* Mobile Friendly
* Dark Mode
* Light Mode
* Modern SaaS Layout
* Smooth Animations

---

# 🛠 Tech Stack

| Category       | Technology            |
| -------------- | --------------------- |
| Frontend       | React 19 + TypeScript |
| Routing        | TanStack Router       |
| Styling        | Tailwind CSS          |
| Components     | ShadCN UI             |
| Backend        | Supabase              |
| Authentication | Supabase Auth         |
| Database       | PostgreSQL (Supabase) |
| AI             | Gemini AI             |
| Deployment     | Vercel                |

---
# 📸 Application Preview

## 🏠 Landing Page

<p align="center">
<img src="./README/landing.png" width="100%">
</p>

---

## 📤 Fabric Upload

<p align="center">
<img src="./README/upload.png" width="100%">
</p>

---

## 🤖 AI Analysis Report

<p align="center">
<img src="./README/analysis.png" width="100%">
</p>

---

## 📚 Upload History

<p align="center">
<img src="./README/history.png" width="100%">
</p>

---

## 📊 User Dashboard

<p align="center">
<img src="./README/dashboard.png" width="100%">
</p>

---

## 👨‍💻 Admin Dashboard

<p align="center">
<img src="./README/admin-dashboard.png" width="100%">
</p>

---

## 📈 Analytics Dashboard

<p align="center">
<img src="./README/analytics.png" width="100%">
</p>

---

## 👥 User Management

<p align="center">
<img src="./README/users.png" width="100%">
</p>

---

## 🌙 Dark Mode

<p align="center">
<img src="./README/darkmode1.png" width="100%">
</p>

---

## 📱 Mobile Responsive

<p align="center">
<img src="./README/mobile.png" width="35%">
</p>

---

# 🏗 System Architecture

```text
                    User
                      │
                      ▼
            React + TypeScript
                      │
                      ▼
          TanStack Router + ShadCN UI
                      │
                      ▼
              Supabase Authentication
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 Upload Fabric                 User Dashboard
        │                           │
        └─────────────┬─────────────┘
                      ▼
                Gemini AI Analysis
                      │
                      ▼
              AI Analysis Results
                      │
                      ▼
            PostgreSQL (Supabase)
                      │
                      ▼
        Analytics + Admin Dashboard
```

---

# 🗄 Database Schema

## Tables

* profiles
* uploads
* analysis_results
* user_roles

---

### Relationships

```text
profiles
    │
    ├──────── uploads
    │             │
    │             ▼
    │      analysis_results
    │
    ▼
user_roles
```

---

# 🤖 AI Analysis Workflow

```text
Upload Image
      │
      ▼
Validate Image
      │
      ▼
Store in Supabase Storage
      │
      ▼
Gemini AI Analysis
      │
      ▼
Generate Report
      │
      ▼
Store Results
      │
      ▼
Display Dashboard
```

---

# 📊 Admin Features

✔ User Management

✔ Upload Management

✔ AI Analysis Monitoring

✔ Analytics Dashboard

✔ Platform Statistics

✔ Search Users

✔ Delete Records

✔ Role-Based Access

---

