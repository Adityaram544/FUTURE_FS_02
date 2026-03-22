# CRMPro — Lead Management System

A full-stack MERN CRM application for managing leads with analytics, notes, and follow-up tracking.

---

## 🗂️ Project Structure

```
crm-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Login & token verify
│   │   └── leadController.js  # Full CRUD + stats + CSV export
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   └── Lead.js            # Mongoose Lead schema
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/login
│   │   └── leads.js           # All /api/leads/* routes
│   ├── .env.example           # Env template — copy to .env
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── index.js   # Button, Badge, Card, Modal, Input, Select, Pagination…
    │   │   ├── layout/
    │   │   │   ├── Header.js
    │   │   │   ├── Layout.js
    │   │   │   └── Sidebar.js
    │   │   └── leads/
    │   │       ├── LeadForm.js    # Add/Edit modal
    │   │       └── NotesModal.js  # Per-lead notes
    │   ├── context/
    │   │   └── AuthContext.js # Login state + localStorage
    │   ├── hooks/
    │   │   └── useLeads.js    # useLeads + useStats hooks
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── LeadsPage.js
    │   │   ├── ContactsPage.js
    │   │   └── AnalyticsPage.js
    │   ├── utils/
    │   │   └── api.js         # Axios instance with JWT interceptors
    │   ├── App.js
    │   ├── index.css          # Global CSS + dark/light theme tokens
    │   └── index.js
    └── package.json
```

---

## ⚡ Quick Start

### 1. Clone / unzip the project

```bash
cd crm-app
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy the env template and fill in your MongoDB Atlas URI:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET=pick_a_long_random_string_here
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev        # development (nodemon)
# or
npm start          # production
```

Server runs at: `http://localhost:5000`
Health check:   `http://localhost:5000/health`

---

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm start
```

App opens at: `http://localhost:3000`

---

## 🔐 Login Credentials

| Field    | Value          |
|----------|----------------|
| Email    | admin@crm.com  |
| Password | Admin@123      |

---

## 📡 API Reference

| Method | Endpoint                  | Description            | Auth |
|--------|---------------------------|------------------------|------|
| POST   | /api/auth/login           | Admin login            | ❌   |
| GET    | /api/auth/verify          | Verify JWT token       | ✅   |
| GET    | /api/leads                | List leads (filter/search/page) | ✅ |
| POST   | /api/leads                | Create a lead          | ✅   |
| PUT    | /api/leads/:id            | Update a lead          | ✅   |
| DELETE | /api/leads/:id            | Delete a lead          | ✅   |
| POST   | /api/leads/:id/notes      | Add a note to a lead   | ✅   |
| GET    | /api/leads/stats/summary  | Dashboard stats        | ✅   |
| GET    | /api/leads/export         | Download CSV           | ✅   |

### Query parameters for GET /api/leads

| Param    | Example          | Description               |
|----------|------------------|---------------------------|
| status   | `?status=New`    | Filter by status          |
| search   | `?search=priya`  | Search name/email/company |
| page     | `?page=2`        | Page number (default: 1)  |
| limit    | `?limit=10`      | Results per page          |

---

## 🗄️ Lead Schema

```js
{
  name:         String  (required)
  email:        String  (required)
  phone:        String
  company:      String
  source:       'Website' | 'Referral' | 'Social Media' | 'Email' | 'Cold Call' | 'Other'
  status:       'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
  notes:        [{ text: String, createdAt: Date }]
  followUpDate: Date
  createdAt:    Date  (auto)
  updatedAt:    Date  (auto)
}
```

---

## 🛠️ Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | React 18, React Router 6        |
| Styling    | CSS custom properties (no Tailwind needed) |
| Charts     | Chart.js + react-chartjs-2      |
| HTTP       | Axios                           |
| Backend    | Node.js + Express.js            |
| Database   | MongoDB Atlas + Mongoose        |
| Auth       | JWT (jsonwebtoken)              |
| Dev server | nodemon                         |
| Toasts     | react-hot-toast                 |

---

## 📱 Features

- ✅ Dark / Light theme toggle
- ✅ Responsive — mobile, tablet, desktop
- ✅ Dashboard with stat cards + 3 charts
- ✅ Leads table — add, edit, delete, search, filter, paginate
- ✅ Per-lead notes & follow-up dates
- ✅ Contacts page — view Contacted / Qualified / Converted
- ✅ Analytics — Line, Pie, Bar, Funnel charts
- ✅ CSV export
- ✅ JWT authentication with localStorage persistence
- ✅ Loading states & skeleton indicators
- ✅ Toast notifications

---

## 🚀 Production Deployment

**Backend** — deploy to Railway, Render, or any Node host. Set all `.env` variables in the platform dashboard.

**Frontend** — run `npm run build` inside `/frontend`, then deploy the `/build` folder to Vercel, Netlify, or serve via Express:

```js
// Add to server.js for combined deployment
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```
