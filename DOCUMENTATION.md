# Supply Chain Management System

## Project Overview

This is a full-stack Supply Chain Management System designed for college project demonstration. It provides comprehensive tools for inventory management, supplier relationships, purchase order tracking, and demand forecasting.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Core Features](#core-features)
6. [Authentication & Authorization](#authentication--authorization)
7. [Frontend Pages](#frontend-pages)
8. [Workflows](#workflows)
9. [Setup Instructions](#setup-instructions)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 (Vite), Redux Toolkit, React Router DOM, TailwindCSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (HttpOnly cookies), bcrypt, Google OAuth 2.0 |

---

## Project Structure

```
SupplyLens/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic (register, login, logout, Google auth)
│   │   ├── productController.js    # Product CRUD, stock movements, reorder point
│   │   ├── supplierController.js # Supplier CRUD, score breakdown
│   │   ├── orderController.js      # Purchase order CRUD, status updates
│   │   ├── dashboardController.js  # Aggregated statistics
│   │   ├── forecastController.js   # Demand forecasting algorithms
│   │   └── alertController.js      # Notification/alert management
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT protection, RBAC authorization
│   ├── models/
│   │   ├── User.js                 # User schema with role-based access
│   │   ├── Product.js              # Product inventory schema
│   │   ├── Supplier.js             # Supplier schema
│   │   ├── PurchaseOrder.js        # Purchase order schema
│   │   ├── StockMovement.js        # Stock transaction log
│   │   └── Notification.js         # Alert/notification schema
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth endpoints
│   │   ├── userRoutes.js           # /api/users endpoints
│   │   ├── productRoutes.js        # /api/products endpoints
│   │   ├── supplierRoutes.js       # /api/suppliers endpoints
│   │   ├── orderRoutes.js          # /api/orders endpoints
│   │   ├── dashboardRoutes.js      # /api/dashboard endpoints
│   │   ├── stockRoutes.js          # /api/stock endpoints
│   │   ├── alertRoutes.js          # /api/alerts endpoints
│   │   └── forecastRoutes.js       # /api/forecast endpoints
│   ├── utils/
│   │   └── inventoryUtils.js       # Reorder point & supplier score calculations
│   ├── server.js                   # Main entry point
│   └── .env                        # Environment variables
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx         # Landing page
    │   │   ├── Dashboard.jsx       # Main dashboard
    │   │   ├── Inventory.jsx       # Inventory management
    │   │   ├── Suppliers.jsx       # Supplier management
    │   │   ├── Orders.jsx            # Purchase order management
    │   │   ├── Forecast.jsx          # Demand forecasting
    │   │   ├── Alerts.jsx            # Alert notifications
    │   │   ├── Login.jsx             # User login
    │   │   ├── Signup.jsx            # User registration
    │   │   └── AddProduct.jsx        # Add/edit product form
│   ├── components/
│   │   └── app/                # Application UI components
    │   ├── redux/
    │   │   └── slices/             # Redux state management
    │   ├── hooks/                  # Custom React hooks
    │   └── Instance/
    │       └── API.js              # API service layer
    ├── package.json
    └── vite.config.js
```

---

## Database Models

### User Model
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (lowercase)
  password: String,       // Hashed password (required if not Google auth)
  googleId: String,       // Google OAuth ID (sparse index)
  role: String,           // 'admin' | 'manager' | 'staff' (default: 'staff')
  organization: String,   // Organization/workspace identifier
  timestamps: true        // createdAt, updatedAt
}
```

### Product Model
```javascript
{
  name: String,             // Product name
  sku: String,              // Unique stock keeping unit
  description: String,      // Product description
  category: String,         // Product category (default: 'General')
  unitPrice: Number,        // Price per unit
  price: Number,            // Synced with unitPrice
  currentStock: Number,     // Current stock level
  stockQuantity: Number,    // Synced with currentStock
  minimumStockLevel: Number,// Reorder threshold
  lowStockThreshold: Number,// Synced with minimumStockLevel
  safetyStock: Number,      // Safety buffer stock
  reorderPoint: Number,     // Calculated reorder point
  user: ObjectId,           // Owner reference
  supplierId: ObjectId,     // Primary supplier
  supplier: ObjectId,       // Synced with supplierId
  organization: String,     // Multi-tenant support
  timestamps: true
}
```

### Supplier Model
```javascript
{
  name: String,                 // Supplier company name
  contactPerson: String,        // Contact person name
  email: String,                // Unique email
  phone: String,                // Phone number
  address: String,              // Full address
  averageDeliveryDays: Number,  // Avg. delivery time (default: 0)
  reliabilityScore: Number,     // Score 0-100 (default: 100)
  user: ObjectId,               // Owner reference
  organization: String,
  timestamps: true
}
```

### PurchaseOrder Model
```javascript
{
  supplier: ObjectId,           // Reference to Supplier
  items: [{
    product: ObjectId,          // Product reference
    quantity: Number,           // Quantity ordered
    unitPrice: Number           // Price at time of order
  }],
  status: String,               // 'pending' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: Number,          // Total order value
  expectedDeliveryDate: Date,     // Expected delivery
  user: ObjectId,               // Owner reference
  organization: String,
  timestamps: true
}
```

### StockMovement Model
```javascript
{
  productId: ObjectId,          // Reference to Product
  product: ObjectId,            // Synced with productId
  type: String,                 // 'in' | 'out' | 'adjustment' | 'SOLD' | 'RETURNED' | 'DAMAGED' | 'TRANSFERRED'
  quantity: Number,               // Quantity changed
  previousStock: Number,          // Stock before movement
  newStock: Number,               // Stock after movement
  reason: String,                 // Reason for movement
  performedBy: ObjectId,         // User who performed action
  user: ObjectId,                 // Synced with performedBy
  organization: String,
  timestamps: true
}
```

### Notification Model
```javascript
{
  type: String,                 // 'LOW_STOCK' | 'REORDER_RECOMMENDED' | 'SUPPLIER_DELAY'
  message: String,                // Alert message
  priority: String,               // 'HIGH' | 'MEDIUM' | 'LOW'
  productId: ObjectId,            // Related product (optional)
  read: Boolean,                // Read status (default: false)
  organization: String,
  timestamps: true
}
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login with email/password | Public |
| POST | `/logout` | User logout | Public |
| POST | `/google` | Google OAuth login | Public |
| GET | `/me` | Get current user info | Private |

### Products (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all products (paginated) | Private |
| POST | `/` | Create new product | Admin, Manager |
| GET | `/:id` | Get single product | Private |
| PUT | `/:id` | Update product | Admin, Manager |
| DELETE | `/:id` | Delete product | Admin only |
| POST | `/:id/movements` | Create stock movement | Private |
| GET | `/:id/movements` | Get product movements | Private |
| GET | `/:id/reorder-point` | Get calculated reorder point | Private |

### Suppliers (`/api/suppliers`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all suppliers (paginated) | Private |
| POST | `/` | Create new supplier | Admin, Manager |
| GET | `/:id` | Get single supplier | Private |
| PUT | `/:id` | Update supplier | Admin, Manager |
| DELETE | `/:id` | Delete supplier | Admin only |
| GET | `/:id/score-breakdown` | Get supplier performance metrics | Private |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all purchase orders (paginated) | Private |
| POST | `/` | Create purchase order | Admin, Manager |
| PUT | `/:id/status` | Update order status | All roles |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Get aggregated business statistics | Private |
| GET | `/alerts` | Get low stock products | Private |

### Forecast (`/api/forecast/:productId`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/:productId` | Get demand forecast | Manager, Admin |

### Stock (`/api/stock`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/in` | Record stock receipt | Private |
| POST | `/out` | Record stock reduction | Private |
| POST | `/sell` | Record product sale | Staff, Manager, Admin |
| POST | `/adjust` | Adjust stock quantity | Staff, Manager, Admin |
| GET | `/history/:productId` | Get stock movement history | Private |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all users | Admin only |
| PUT | `/:id/role` | Update user role | Admin only |

### Alerts (`/api/alerts`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all notifications/alerts | Private |
| PUT | `/:id/read` | Mark alert as read | Private |

---

## Core Features

### 1. Inventory Management
- **Real-time Stock Tracking**: Monitor current stock levels across all products
- **Product CRUD**: Create, read, update, delete products with SKU management
- **Stock Adjustments**: Record sales, returns, damages, and manual corrections
- **Low Stock Alerts**: Automatic detection when stock falls below threshold
- **Reorder Point Calculation**: Automatic calculation based on:
  - Average daily demand (from sales history)
  - Supplier lead time
  - Safety stock buffer

### 2. Supplier Management
- **Supplier CRUD**: Add and manage supplier information
- **Reliability Scoring**: Automated score (0-100) based on on-time delivery rate
- **Performance Metrics**: Track total orders, on-time vs late deliveries
- **Contact Management**: Store contact person, email, phone, address

### 3. Purchase Order Management
- **Order Creation**: Create orders with multiple line items
- **Status Tracking**: Track orders through pending → shipped → delivered → cancelled
- **Stock Reconciliation**: Automatic stock update when order is delivered
- **Auto Alert Resolution**: Clears reorder alerts when orders are delivered

### 4. Demand Forecasting
- **Moving Average Algorithm**: 4-week window forecast
- **Exponential Smoothing**: α=0.3 smoothing factor
- **Confidence Scoring**: Based on data completeness (0.2-0.8)
- **Data Point Tracking**: Warning for insufficient historical data

### 5. Dashboard Analytics
- **Total Products Count**: Inventory item count
- **Total Inventory Value**: Calculated from stock × price
- **Success Rate**: Percentage of delivered orders
- **Pending Reorders**: Count of pending/shipped orders
- **Alert Summary**: Critical stock warnings

---

## Authentication & Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: CRUD all resources, delete products/suppliers |
| **Manager** | CRUD products/suppliers, create orders, update statuses |
| **Staff** | View products/orders/suppliers, update order status |

### JWT Authentication Flow
1. User logs in with credentials
2. Server generates JWT token (7-day expiry)
3. Token stored in HttpOnly cookie with `SameSite=None, Secure` flags
4. Protected routes verify token and attach user to request
5. Authorization middleware checks user role against allowed roles

---

## Frontend Pages

### Landing Page (`/`)
- Clean demonstration entry point
- Sign in / Create account options

### Dashboard (`/dashboard`)
- Business overview statistics
- Action required alerts
- Supplier reliability chart

### Inventory (`/dashboard/inventory`)
- Product listing with search/filter
- Stock level indicators
- Record sale / adjust stock modals
- Role-guarded delete button

### Suppliers (`/dashboard/suppliers`)
- Supplier list with contact details
- Reliability scores display

### Orders (`/dashboard/orders`)
- Purchase order management
- Status update functionality
- Order details view

### Forecast (`/dashboard/forecast`)
- Demand prediction visualization
- Moving average vs exponential smoothing comparison

### Alerts (`/dashboard/alerts`)
- Notification listing
- Mark as read functionality

### Authentication Pages
- `/login` - Email/password login
- `/signup` - New user registration

---

## Workflows

### 1. User Registration and Setup
```
Sign Up → Login → Add Suppliers → Add Products → View Dashboard
```

### 2. Stock Management Workflow
```
Add Product → Record Sales (stock decreases) → 
System detects low stock → Create Purchase Order → 
Mark Order Delivered → Stock increases → Reorder alerts cleared
```

### 3. Forecast Generation Workflow
```
Product has sales history → 
Forecast endpoint calculates moving average & exponential smoothing → 
Returns daily/weekly predictions with confidence score
```

### 4. Alert Generation Workflow
```
Dashboard stats check → 
Products with stock ≤ threshold → 
Alerts displayed on dashboard
```

### 5. Supplier Score Calculation Workflow
```
Order marked delivered → 
Compare delivery date with expected date → 
Update on-time delivery rate → 
Recalculate reliability score (0-100)
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or pnpm

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# FRONTEND_URL=http://localhost:5173
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (.env - Backend)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/supplylens
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

---

## API Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "User registered successfully, please log in"
}
```

### Create Product
```http
POST /api/products
Authorization: Bearer <token>

{
  "name": "Basmati Rice",
  "sku": "BR-001",
  "price": 120,
  "stockQuantity": 100,
  "lowStockThreshold": 20,
  "supplier": "<supplier_id>"
}

Response:
{
  "success": true,
  "product": { ... }
}
```

### Record Stock Movement (Sale)
```http
POST /api/products/:id/movements
Authorization: Bearer <token>

{
  "type": "out",
  "quantity": 5,
  "reason": "Sale - Invoice #123"
}

Response:
{
  "success": true,
  "movement": { ... },
  "currentStock": 95
}
```

### Get Forecast
```http
GET /api/forecast/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "productId": "...",
    "methods": {
      "movingAverage": { "predictedWeeklyDemand": 45, "predictedDailyDemand": 6 },
      "exponentialSmoothing": { "predictedWeeklyDemand": 42, "predictedDailyDemand": 6 }
    },
    "confidenceScore": 0.8,
    "warning": null
  }
}
```

---

## Algorithms

### Reorder Point Calculation
```
reorderPoint = (averageDailyDemand × supplierLeadDays) + safetyStock

Where:
- averageDailyDemand = Total units sold in last 30 days / 30
- supplierLeadDays = Supplier's average delivery time
- safetyStock = Product's configured safety buffer
```

### Exponential Smoothing
```
S[t+1] = α × X[t] + (1 - α) × S[t]

Where:
- α = 0.3 (smoothing factor)
- X[t] = Actual demand in period t
- S[t] = Smoothed statistic at time t
```

---

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Token Storage**: HttpOnly, Secure, SameSite cookies
3. **RBAC Middleware**: Role-based route protection
4. **Input Validation**: Server-side validation for all inputs
5. **Multi-tenancy**: Organization-level data isolation

---

## Demo Data Seeding

A seed script is provided to populate demo data:

```bash
cd backend
node seed.js
```

This creates:
- Demo admin user (admin@demo.com / password123)
- 3 suppliers with reliability scores
- 4 sample products (2 food, 2 electronics)
- 2 purchase orders in different states
- Stock movement history
- Sample notifications

---

## Additional Files

- `backend/seed.js` - Demo data seeding script
- `frontend/.env.example` - Frontend environment template
- `backend/.env.example` - Backend environment template

---

## Project Purpose

This project demonstrates a complete supply chain management workflow suitable for educational purposes, including:
- MERN stack architecture
- RESTful API design
- Database modeling with relationships
- Authentication and authorization patterns
- Real-time inventory tracking concepts
- Business analytics and forecasting