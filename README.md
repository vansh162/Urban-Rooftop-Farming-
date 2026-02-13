# Leafinity - Urban Rooftop Farming Platform

A comprehensive MERN stack application for urban rooftop farming with e-commerce, service booking, and admin management.

## 🏗️ Project Structure

```
urban/
├── client/          # React frontend (Vite + Tailwind + Redux + Framer Motion)
│   ├── src/
│   │   ├── components/    # Reusable components (Hero, etc.)
│   │   ├── pages/         # Page components (Home, AdminDashboard)
│   │   ├── routes/        # Route guards (ProtectedRoute)
│   │   └── store/         # Redux store & slices
│   └── package.json
│
└── server/          # Node.js backend (Express + MongoDB + JWT)
    ├── src/
    │   ├── models/        # Mongoose schemas (User, Product, Booking)
    │   ├── middleware/    # Auth & role-based access control
    │   ├── utils/         # Utilities (priceEstimator)
    │   └── config/        # Database configuration
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
JWT_SECRET=your_super_secret_key_here
```

5. Start the development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Client will run on `http://localhost:5173`

## 📦 Key Deliverables

### ✅ Mongoose Schemas

**Product Schema** (`server/src/models/Product.js`)
- Categories: containers, growing-media, irrigation-tech, vertical-gardening, pest-management, monitoring-tools
- Fields: name, description, price (INR), stock, images (Cloudinary), SKU, specifications
- Indexed for search and filtering

**Booking Schema** (`server/src/models/Booking.js`)
- Tracks rooftop size, system type (soil/hydro), location
- Media uploads (1 video or 3 images)
- Status workflow: pending → approved → designing → installation → maintenance → completed
- Maintenance scheduling with staff assignment

### ✅ Price Estimator Logic

**Function**: `server/src/utils/priceEstimator.js`

Calculates instant quotes in INR:
- **Soil-based systems**: ₹100 per sq ft
- **Hydroponic systems**: ₹250 per sq ft
- Tiered discounts for large installations (>2000 sq ft: 3%, >5000 sq ft: 5%)
- Validates size constraints (min: 50 sq ft, max: 10,000 sq ft)

**Usage Example**:
```javascript
import { estimateBookingPriceINR } from './utils/priceEstimator.js';

const result = estimateBookingPriceINR({
  rooftopSizeSqFt: 500,
  systemType: 'hydro'
});
// Returns: { success: true, estimatedPriceINR: 125000, breakdown: {...} }
```

### ✅ React Components

**Hero Section** (`client/src/components/Hero.jsx`)
- Biophilic design with forest green and wood tones
- Smooth Framer Motion animations
- Responsive mobile-first layout
- Call-to-action buttons for booking and shopping

**Protected Admin Route** (`client/src/routes/ProtectedRoute.jsx`)
- Role-based access control (admin only)
- Redirects unauthenticated users
- Shows access denied for non-admin users

**Admin Dashboard** (`client/src/pages/admin/AdminDashboard.jsx`)
- Analytics overview (sales, bookings, revenue, stock alerts)
- Quick action cards for:
  - Inventory Management
  - Booking Management
  - Maintenance Scheduler
- Placeholder for recent activity feed

## 🎨 Design System

**Colors**:
- Forest Green: Primary brand color (#2a744d)
- Wood tones: Secondary accents
- Clean whites and grays for backgrounds

**Typography**: Inter font family

**Icons**: Lucide React icon library

## 🔐 Authentication & Authorization

- JWT-based authentication with HTTP-only cookies
- Role-based access control (RBAC): `customer` vs `admin`
- Protected routes using middleware (`requireAuth`, `requireRole`)

## 📝 Next Steps

1. **Implement Authentication Flow**:
   - User registration/login endpoints
   - Cookie-based session management
   - Password hashing (bcrypt)

2. **Product Catalog**:
   - Seed database with products (containers, growing media, irrigation tech, etc.)
   - Product listing page with filters
   - Shopping cart functionality

3. **Booking System**:
   - Multi-step booking form
   - Cloudinary integration for media uploads
   - Email notifications

4. **Admin Features**:
   - Full CRUD for products
   - Booking approval workflow
   - Maintenance scheduling interface

5. **Service Dashboard**:
   - Customer dashboard for tracking maintenance
   - Harvest logs and progress tracking

## 🛠️ Tech Stack

**Frontend**:
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- Framer Motion
- React Router v6
- Lucide React (icons)

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Cloudinary (for media)
- Cookie-parser

## 📄 License

Private project - All rights reserved

