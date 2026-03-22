<div align="center">

<img src="https://img.shields.io/badge/CRMPro-Lead%20Management-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xNiAxMWMxLjY2IDAgMi45OS0xLjM0IDIuOTktM1MxNy42NiA1IDE2IDVjLTEuNjYgMC0zIDEuMzQtMyAzczEuMzQgMyAzIDN6bS04IDBjMS42NiAwIDIuOTktMS4zNCAyLjk5LVNTOC42NiA1IDcgNUM1LjM0IDUgNCA2LjM0IDQgOHMxLjM0IDMgMyAzem0wIDJjLTIuMzMgMC03IDEuMTctNyAzLjV2Mi41aDE0di0yLjVDMTUgMTQuMTcgMTAuMzMgMTMgOCAxM3ptOCAwaC0uMjljLjk3LjUzIDEuNzQgMS4yNyAyLjI5IDIuMTd2Mi44M0gyNHYtMi41QzI0IDE0LjE3IDE5LjMzIDEzIDE2IDEzeiIvPjwvc3ZnPg==&logoColor=white" alt="CRMPro" />

# CRMPro — Lead Management System

**A modern, full-stack CRM built with the MERN stack**

Track leads · Manage contacts · Visualise analytics · Close more deals

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=flat-square&logo=chart.js)](https://chartjs.org)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io)

<br/>

![Dashboard Preview](https://via.placeholder.com/900x500/0f1117/3b82f6?text=CRMPro+Dashboard)

</div>

---

## ✨ What is CRMPro?

CRMPro is a production-ready **Lead Management CRM** that helps you capture, track, and convert leads from your website and other sources. Built with a clean SaaS-style dark/light UI, it gives you real-time analytics, pipeline visibility, and full lead lifecycle management — all in one place.

---

## 🖥️ Screenshots

| Dashboard | Leads | Analytics |
|-----------|-------|-----------|
| Stat cards, sparkline chart, pipeline progress bars | Full table with search, filter, add/edit/delete | Date & source filters, live charts |

---

## 🚀 Features

### 🔑 Authentication
- Static admin login — no Firebase, no third-party auth
- JWT token stored in `localStorage`, auto-attached to every API request
- Protected routes — redirects to login if unauthenticated

### 📊 Dashboard
- **4 stat cards** — Total Leads, New, Contacted, Converted (all clickable)
- **Mini sparkline** — last 7 days lead activity with today's count badge
- **Pipeline overview** — animated progress bars showing each status as % of total
- **Quick KPIs** — Conversion rate & urgent follow-ups due in 3 days
- **Recent leads table** — desktop table + mobile card view with follow-up urgency indicator

### 📋 Leads
- Full CRUD — Add, Edit, Delete leads
- **Search** across name, email, company
- **Filter** by status (New / Contacted / Qualified / Converted / Lost)
- **Pagination** — 10 per page
- **Per-lead notes** with timestamps
- **Follow-up date** tracking
- **CSV export** — Excel-friendly with BOM, proper phone number formatting, summary section

### 📞 Contacts
- Tabbed view — Contacted / Qualified / Converted
- Clickable stat cards per status
- Desktop table + responsive mobile card list

### 📈 Analytics
- **Period filter** — 7d / 30d / 90d
- **Source filter** — Website, Referral, Social Media, Email, Cold Call, Other
- **Line chart** — lead volume over selected period
- **Doughnut chart** — status distribution
- **Bar chart** — leads by source
- Powered by imperative Chart.js (zero lag on filter changes)

### 🌗 Theme
- Dark mode by default
- Light/Dark toggle with smooth transition
- All colours via CSS custom properties — no hardcoded hex in components

### 📱 Responsive
- Mobile-first design
- Tables switch to card lists below 600px
- Modals become bottom-sheets on mobile (full screen height, no inner scroll)
- Sidebar collapses with hamburger on mobile

---

## 🗂️ Project Structure

```
crm-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js      # Static admin login + JWT
│   │   └── leadController.js      # CRUD, stats, CSV export
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   └── Lead.js                # Mongoose schema
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/login
│   │   └── leads.js               # /api/leads/* (all protected)
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── common/
        │   │   └── index.js       # Button, Badge, Card, Modal, Input,
        │   │                      # Select, Spinner, Pagination, ConfirmModal
        │   ├── layout/
        │   │   ├── Header.js      # Sticky header with page title
        │   │   ├── Layout.js      # Sidebar + main content wrapper
        │   │   └── Sidebar.js     # Fixed nav with active state + mobile drawer
        │   └── leads/
        │       ├── LeadForm.js    # Add / Edit modal (bottom-sheet on mobile)
        │       └── NotesModal.js  # Per-lead notes
        ├── context/
        │   └── AuthContext.js     # Login state + localStorage persistence
        ├── hooks/
        │   └── useLeads.js        # useLeads (paginated) + useStats hooks
        ├── pages/
        │   ├── LoginPage.js
        │   ├── DashboardPage.js
        │   ├── LeadsPage.js
        │   ├── ContactsPage.js
        │   └── AnalyticsPage.js
        ├── utils/
        │   └── api.js             # Axios instance + JWT + 401 interceptors
        ├── App.js                 # Router + theme toggle + protected routes
        ├── index.css              # CSS variables, dark/light tokens, animations
        └── index.js
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js ≥ 16
- MongoDB Atlas account (free tier works)

---

### 1 — Clone the project

```bash
git clone https://github.com/yourusername/crm-app.git
cd crm-app
```

---

### 2 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT        = 5000
MONGODB_URI = mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET  = replace_with_a_long_random_secret
CLIENT_URL  = http://localhost:3000
```

Start the server:

```bash
npm run dev     # development — auto-restarts with nodemon
npm start       # production
```

✅ Server: `http://localhost:5000`
✅ Health: `http://localhost:5000/health`

---

### 3 — Frontend setup

```bash
cd ../frontend
npm install
npm start
```

✅ App: `http://localhost:3000`

---

## 🔐 Login Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | `admin@crm.com` |
| Password | `Admin@123`     |

> You can change these in `backend/controllers/authController.js`

---

## 📡 API Reference

### Auth

| Method | Endpoint           | Description      | Auth |
|--------|--------------------|------------------|------|
| POST   | `/api/auth/login`  | Admin login      | ❌   |
| GET    | `/api/auth/verify` | Verify JWT token | ✅   |

### Leads

| Method | Endpoint                    | Description                  | Auth |
|--------|-----------------------------|------------------------------|------|
| GET    | `/api/leads`                | List leads (filter/search/page) | ✅ |
| POST   | `/api/leads`                | Create lead                  | ✅   |
| PUT    | `/api/leads/:id`            | Update lead                  | ✅   |
| DELETE | `/api/leads/:id`            | Delete lead                  | ✅   |
| POST   | `/api/leads/:id/notes`      | Add note to lead             | ✅   |
| GET    | `/api/leads/stats/summary`  | Dashboard stats + charts     | ✅   |
| GET    | `/api/leads/export`         | Download CSV                 | ✅   |

### Query Parameters — `GET /api/leads`

| Param    | Example              | Description                |
|----------|----------------------|----------------------------|
| `status` | `?status=New`        | Filter by status           |
| `search` | `?search=priya`      | Search name / email / company |
| `page`   | `?page=2`            | Page number (default: 1)   |
| `limit`  | `?limit=10`          | Results per page           |

---

## 🗄️ Lead Schema

```js
{
  name:         String   // required
  email:        String   // required, unique
  phone:        String
  company:      String
  source:       'Website' | 'Referral' | 'Social Media' | 'Email' | 'Cold Call' | 'Other'
  status:       'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
  notes:        [{ text: String, createdAt: Date }]
  followUpDate: Date
  createdAt:    Date     // auto
  updatedAt:    Date     // auto
}
```

---

## 🛠️ Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React 18, React Router 6, Hooks              |
| Styling     | CSS Custom Properties — no Tailwind needed   |
| Charts      | Chart.js 4 (imperative, zero-lag updates)    |
| HTTP Client | Axios with JWT interceptors                  |
| Backend     | Node.js, Express.js                          |
| Database    | MongoDB Atlas, Mongoose ODM                  |
| Auth        | JSON Web Tokens (jsonwebtoken)               |
| Dev Tools   | nodemon, react-hot-toast                     |

---

## 🚀 Production Deployment

### Backend → Railway / Render / Fly.io

1. Push your code to GitHub
2. Connect the repo to Railway or Render
3. Set environment variables in the dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend URL)
4. Deploy — it runs `npm start` automatically

### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
```

Deploy the `/build` folder to Vercel or Netlify.

Set environment variable:
```
REACT_APP_API_URL = https://your-backend-url.com/api
```

### Combined deployment (single Express server)

Add to `backend/server.js`:

```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout                                          |
|------------|-------------------------------------------------|
| `> 900px`  | Full desktop — 4-col stat grid, sidebar visible |
| `≤ 900px`  | Tablet — 2-col stat grid                        |
| `≤ 700px`  | Mid-mobile — stacked sections                   |
| `≤ 600px`  | Mobile — tables replaced by card lists          |
| `≤ 480px`  | Small mobile — single column, bottom-sheet modals |

---

## 📄 License

MIT © 2026 — Free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ using the MERN stack

**[⬆ Back to top](#)**

</div>
