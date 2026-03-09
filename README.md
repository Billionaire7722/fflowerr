# 🌸 Boutique Flower Shop: Full-Stack Enterprise

A premium, dual-interface web application for a niche florist boutique. This project features a vibrant customer EXPERIENCE and a robust data-driven management portal.

## 🚀 Architecture Overview

The project is structured as a monorepo-style workspace with three distinct services:

- **`/client`**: Customer-facing storefront (Next.js 14).
- **`/admin`**: Business management dashboard (Next.js 14).
- **`/backend`**: Central API service (NestJS).
- **`docker-compose.yml`**: Infrastructure (PostgreSQL).

## 🛠 Technical Stack

### Frontend & UI
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Visualization**: Recharts (Admin only)

### Backend & Database
- **Framework**: NestJS
- **ORM**: Prisma 7 (using `prisma.config.ts`)
- **Database**: PostgreSQL (Docker)
- **Communication**: REST API with CORS enabled

## 🌐 Network Configuration

Service | Port | URL
--- | --- | ---
**Backend** | 3000 | `http://localhost:3000`
**Client** | 3001 | `http://localhost:3001`
**Admin** | 3002 | `http://localhost:3002`

## 📦 Key Features

### Client Portal
- High-contrast floral aesthetic with glassmorphism UI.
- Interactive product grid with Framer Motion hover effects.
- Multi-step checkout flow with real-time backend integration.

### Admin Portal
- Real-time order monitoring (5s polling verification).
- Business Intelligence Dashboard using Recharts for revenue/profit.
- Material Inventory tracking and cost analysis.

## ⚡ Quick Start

### Prerequisites
- Node.js & npm
- Docker Desktop

### 1-Click Execution (Windows)
Double-click `run_project.bat` in the root directory. This script will:
1. Initialize the PostgreSQL container.
2. Generate the Prisma client.
3. Launch all three services in separate command windows.

### Manual Setup
```bash
# Start Database
docker-compose up -d

# Start Backend
cd backend && npm install && npx prisma generate && npm run start:dev

# Start Client
cd client && npm install && npm run dev

# Start Admin
cd admin && npm install && npm run dev
```

## 🛠 AI Agent Context
- **Prisma 7**: Note that `url` is handled via `prisma.config.ts`, not directly in `schema.prisma`.
- **CORS**: Enabled on port 3000 to allow requests from 3001 and 3002.
- **Components**: Shared logic is currently localized but follows modular NestJS/Next.js conventions.
