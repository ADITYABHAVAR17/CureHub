# AI-Powered Digital Health Platform

An AI-powered, role-based digital health platform designed to streamline doctor-patient interactions, automate appointment bookings, and provide predictive health insights. The platform is built with modularity in mind, catering to **Patients**, **Doctors**, and **Admins** while leveraging artificial intelligence to enhance decision-making.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Dependencies & Showstoppers](#dependencies--showstoppers)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a scalable, role-based digital health platform that serves as a digital hub for health management. The platform aims to:
- **Enhance patient experience:** by offering an intuitive user interface and AI-driven symptom analysis.
- **Improve efficiency:** through automated appointment scheduling and doctor recommendations based on real-time availability.
- **Empower healthcare providers:** with digital insights and analytics to manage appointments and monitor health trends.

## Features

### Patient Features
- **User Registration & Profile Management:** Create and update profiles with essential health details.
- **Symptom Checker (AI):** Input symptoms to receive tailored doctor and specialization recommendations.
- **Appointment Booking:** Choose from available slots based on doctor availability.
- **Appointment History:** View past appointments and consultation details.
- **Notification System:** Receive reminders and booking confirmations via Email/SMS.

### Doctor Features
- **Secure Login & Profile Management:** Manage professional details, availability, and credentials.
- **Availability Management:** Set or update available 1-hour time slots.
- **Appointment Management:** Accept or reject patient appointment requests.
- **Patient History Overview:** Access medical histories and consultation records of accepted appointments.
- **AI-Driven Insights:** Receive suggestions for patient follow-ups based on AI analysis.

### Admin Features
- **User & Role Management:** Add or remove doctors, manage patient and doctor lists.
- **System Analytics & Monitoring:** View usage analytics such as popular specializations, appointment trends, etc.
- **Dashboard Reports:** Generate reports based on system data to assist in decision-making.

### AI & Additional Enhancements
- **Symptom-to-Specialist Matching:** NLP-based analysis maps patient symptoms to appropriate specializations.
- **Smart Time Slot Optimization:** Predict high-demand slots and optimize scheduling.
- **Chatbot Assistant:** Provide basic guidance and support (optional integration with Dialogflow/Rasa).

## Tech Stack

### Backend
- **Node.js** and **Express.js** for building RESTful APIs.
- **MongoDB** with **Mongoose** for NoSQL database operations.
- **JWT** for secure authentication and role-based access.
- **bcrypt** for password hashing.

### Frontend
- **React.js** for building dynamic user interfaces.
- **React Router** for client-side routing.
- **Axios** for making API calls.
- **Tailwind CSS** or **Material UI** for styling.

### AI/ML Service
- **Python** with **Flask** or **FastAPI** to create a microservice handling AI logic.
- Libraries such as **scikit-learn**, **TensorFlow**, or **spaCy** for implementing AI models.

### Optional Mobile Integration
- **React Native** (with **Expo**) for building cross-platform mobile applications.

### Additional Tools
- **Cloudinary / AWS S3:** For storing profile images and other media.
- **Nodemailer** and **Twilio:** For sending notifications via email and SMS.

## Architecture

The project is designed with a modular architecture where each role has specific endpoints and a dedicated dashboard:
1. **Authentication and Role Management:** Secure login and role-based route protection.
2. **Microservices Architecture for AI:** A separate Python-based service handles AI functionalities, communicating with the main server via REST or gRPC.
3. **Data Storage:** MongoDB serves as the backbone for storing user profiles, appointment details, and AI-generated insights.
4. **Third-Party Integrations:** Cloud storage, notification services, and optional telemedicine integrations.

See the [Process Flow Chart](#process-flow-chart) section for more details on the application's flow.

## Process Flow Chart

The platform's process flow is structured as follows:
- **User logs in** and the system checks their role.
- **Admins** manage doctor profiles and view overall analytics.
- **Doctors** update their profiles, manage their availability, and handle appointment requests.
- **Patients** manage their profiles, book appointments, and use the AI symptom checker for doctor recommendations.
- Final notifications (via Email/SMS) are sent upon successful bookings.

For a graphical representation, refer to the [PlantUML code](#plantuml-code) provided in the documentation.

## Installation & Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Python 3.7+ (for AI microservice)
- npm or yarn package manager

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/ADITYABHAVAR17/CureHub.git

   cd frontend
   npm i
   npm run build

   cd ..

   cd Backend
   npm i
   npm run dev

 ## Ensure You have added .env in Backend



---

This `README.md` covers project purpose, features, tech stack, architecture, setup steps, and potential challenges, making it suitable for onboarding developers or stakeholders to the project.
