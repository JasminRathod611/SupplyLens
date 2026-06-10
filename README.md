# Supply Chain Management System

A comprehensive inventory and supply chain management solution built for college project demonstration.

---

## Features

- **Inventory Management**: Real-time stock tracking with CRUD operations
- **Supplier Management**: Vendor relationships with reliability scoring
- **Purchase Orders**: Order lifecycle from creation to delivery
- **Demand Forecasting**: Moving average & exponential smoothing algorithms
- **Dashboard Analytics**: Business metrics and alerts overview
- **Role-Based Access**: Admin, Manager, and Staff permissions

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19, Redux Toolkit, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt, Google OAuth |

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `backend/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Project Structure

```
SupplyLens/
├── backend/          # Express API server
│   ├── controllers/  # Business logic
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & authorization
│   └── utils/        # Helper functions
└── frontend/         # React application
    ├── src/pages/    # Application views
    ├── src/components/ # Reusable UI
    └── src/redux/    # State management
```

---

## API Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth` | POST | Register, login, logout |
| `/api/products` | GET, POST, PUT, DELETE | Inventory management |
| `/api/suppliers` | GET, POST, PUT, DELETE | Supplier management |
| `/api/orders` | GET, POST, PUT | Purchase orders |
| `/api/dashboard` | GET | Statistics & alerts |
| `/api/forecast/:id` | GET | Demand prediction |
| `/api/alerts` | GET, PUT | Notifications |

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete API details.

---

## Demo Data

To seed demo data for testing:
```bash
cd backend && node seed.js
```

Creates demo admin (admin@demo.com / password123) with sample suppliers, products, and orders.