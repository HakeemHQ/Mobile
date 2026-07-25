# Hakeem Mobile App

> A patient-owned medical history organizer that transforms scattered medical records into a structured, chronological **Medical CV**.

## Overview

Hakeem is a patient-facing healthcare mobile application designed to help patients and caregivers organize medical documents and maintain a clear, reviewable medical history.

Patients can upload records such as prescriptions, lab reports, medical scans, discharge summaries, and clinical notes. Hakeem extracts useful information from these documents, allows the patient to review and confirm the extracted data, and uses approved information to build a structured **Medical CV**.

The patient remains in control of their medical information and decides whether to keep the Medical CV private, download it, or share it externally with a doctor or trusted healthcare provider.

Hakeem is **not a diagnostic or treatment tool**.

---

## Target Users

The MVP is designed for:

- Patients
- Caregivers

There is no dedicated doctor-facing interface in the MVP.

---

## Core Mobile Features

### Medical Document Management

Patients can upload and manage:

- Prescriptions
- Lab reports
- Medical scans
- Discharge summaries
- Clinical notes

The system extracts useful information from uploaded records while keeping the original document as a source reference.

### Patient-Verified Medical History

Extracted information can include:

- Medications and doses
- Allergies
- Medical conditions
- Lab results
- Surgeries
- Medical visits
- Dates and healthcare facilities

Patients review and confirm extracted information before it becomes part of their official medical profile.

Unclear or low-confidence information should be presented for confirmation instead of being automatically accepted.

### Medical CV

Hakeem generates a structured, chronological **Medical CV** from the patient's approved medical records.

The Medical CV can include:

- Medical history
- Medications
- Allergies
- Conditions
- Surgeries
- Lab information
- Relevant visits
- Source references
- Missing or uncertain information
- Conflicting information between records

The generated Medical CV remains a draft until reviewed and approved by the patient.

Patients control whether the Medical CV is:

- Kept private
- Downloaded
- Shared externally

### Reminders

Hakeem can create record-based reminders using confirmed information, including:

- Medication reminders
- Refill reminders
- Appointment reminders
- Follow-up lab reminders

The application does not independently recommend medications or modify prescription instructions.

### Alerts and Data Quality

The mobile experience may surface alerts such as:

- Missing medication information
- Missing or unclear dosage
- Missing dates
- Allergy/history flags
- Conflicting information between records
- Information requiring patient confirmation

### Patient Chat

The system includes AI support for patient chat using the patient's medical context.

Responses must remain grounded in approved patient records and must not provide diagnosis, treatment recommendations, or unsupported medical claims.

---

## Main User Flow

```text
Create Account / Sign In
        ↓
Set Up Patient Profile
        ↓
Upload Medical Document
        ↓
Document Processing & Information Extraction
        ↓
Review Extracted Information
        ↓
Confirm or Correct Data
        ↓
Approved Medical History
        ↓
Generate Medical CV
        ↓
Review Medical CV
        ↓
Keep Private / Download / Share
```

Confirmed information may also be used to create medication, refill, appointment, and follow-up reminders.

---

## Safety Boundaries

Hakeem organizes medical information but does **not** replace professional medical consultation.

The application must not:

- Diagnose diseases
- Predict medical emergencies
- Recommend treatments
- Prescribe medication
- Stop or replace medication
- Modify medication doses
- Approve treatment plans
- Rank treatment options
- Generate unsupported medical claims

When information is missing or unclear, the system should explicitly indicate uncertainty instead of guessing.

---

## Mobile Technical Overview

The Hakeem mobile application is built as a:

```text
React Native Mobile Client
```

The mobile client communicates with the Hakeem backend API for functionality such as:

- Authentication
- Patient profile management
- Medical document management
- Document extraction
- Patient confirmation
- Medical history retrieval
- Medical CV generation
- Reminders
- AI-assisted workflows

The backend API is implemented using **ASP.NET Core**.

```text
React Native Mobile App
        │
        │ HTTPS
        ▼
ASP.NET Core API
        │
        ├── Authentication & Patient Profiles
        ├── Medical Document Processing
        ├── Extraction & Confirmation
        ├── Patient-Specific RAG
        ├── Medical CV Generation
        ├── Reminder Management
        └── Controlled AI Workflows
```

The pitch document does not define the exact React Native project structure, package manager, state-management approach, navigation library, or networking library.

---

## Prerequisites

The pitch deck confirms that the mobile client uses **React Native**, but does not specify the required development environment or versions.

```text
| Requirement                    | Recommended version    |
| ------------------------------ | ---------------------- |
| Node.js                        | 22.13.x LTS            |
| React Native                   | 0.86.0                 |
| Expo SDK                       | 57.0.6                 |
| Java Development Kit           | JDK 17                 |
| Android Studio                 | Current stable release |
| Android SDK Platform           | Android 15 / API 35    |
| Android SDK Build-Tools        | 36.0.0                 |
| Android SDK Command-line Tools | Latest                 |
| Android Platform Tools         | Latest                 |
| Android Virtual Device         | API 35 system image    |

```

---

## Project Structure

The pitch deck does not define the mobile repository architecture or folder structure.

Document the actual repository structure once finalized:

```text
├── 📁 Mobile
│ ├── 📁 android
│ ├── 📁 app
│ │ ├── 📁 (auth)
│ │ ├── 📁 (onboarding)
│ │ ├── 📁 (tabs)
│ │ ├── 🟦 +html.tsx
│ │ ├── 🟦 +not-found.tsx
│ │ ├── 🟦 index.tsx
│ │ ├── 🟦 _layout.tsx
│ ├── 📁 assets
│ │ ├── 📁 fonts
│ │ ├── 📁 images
│ ├── 📁 components
│ │ ├── 📁 icons
│ │ ├── 📁 ui
│ ├── 📁 lib
│ │ ├── 📁 theme
│ │ ├── 🟨 utils.ts
│ ├── 📁 localization
│ │ ├── 📁 AR
│ │ ├── 📁 EN
│ │ ├── 🟨 i18n.ts
```

---

## Building the App

### Android

```bash
[npx expo run:android]
```

### iOS

```bash
[npx expo run:ios]
```

Add signing, release configuration, and deployment instructions once the mobile build process is finalized.

---

## AI & Medical Data Principles

AI-generated information must remain grounded in the patient's approved records.

The application experience should clearly communicate when information is:

```text
Confirmed
Needs Review
Missing
Uncertain
Conflicting
```

Important generated Medical CV information should be traceable to source documents whenever possible.

The application should clearly display that:

> **Hakeem is not a diagnostic tool and does not replace professional medical advice or clinical consultation.**

---

## MVP Scope

The mobile MVP focuses on:

```text
Medical Documents
        ↓
Structured Medical History
        ↓
Patient Confirmation
        ↓
Medical CV
        ↓
Reminders
        ↓
Patient-Controlled Export & Sharing
```

The MVP does **not** include:

- Diagnosis
- Treatment recommendations
- Emergency triage
- Medication modification
- Automatic refill ordering
- Hospital EMR functionality
- Insurance management
- Doctor/clinical portal
- Medical booking platform
- Automated clinical workflows without patient approval
- Real-time voice assistants
- Image or video generation

---

## Source

This README is based exclusively on the **Hakeem Project**, with content filtered to the patient-facing mobile application and its required dependencies.
