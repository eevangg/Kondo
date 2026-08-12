# 🏢 Kondo — Personal Household Management OS

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Realtime-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![PWA](https://img.shields.io/badge/PWA-Mobile%20Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**Kondo** is a full-stack, real-time web application built for my roommate and I to seamlessly manage shared condo expenses, monthly utilities, pantry inventory, cleaning routines, and repair queues.

Designed with a sleek glassmorphic dark UI, real-time WebSockets synchronization, mobile PWA capabilities, and instant Telegram notification dispatches.

---

## 🔥 Key Features

### 💰 1. Shared Expenses & Debt Settlement
- **Smart Expense Logger**: Log shared grocery trips and condo utilities with Equal or Full split rules.
- **Automated Balance Ledger**: Real-time room-by-room net balance calculation with 1-click payer/payee swapping.
- **Instant Settle Up**: Clear outstanding balances in one tap with instant automated Telegram alerts.
- **Parent Statement Export**: Generate downloadable PNG statements formatted for parental bill breakdowns and reimbursements.

### 📅 2. Monthly Bills & Cycle Renewals
- **Utility & Rent Tracking**: Tracks monthly rent, internet, water, and Meralco electricity.
- **Automated Rollover**: Paid recurring bills automatically advance due dates by +1 month while carrying over overdue balances.
- **Variable Amount Prompts**: Prompt for next month's variable billing amount when clearing electric bills.

### 🛒 3. Pantry Inventory & Restock Checklist
- **Visual Stock Tracking**: Categorized inventory status (`Full`, `Low`, `Out`).
- **Automated Shopping Dispatch**: Items tagged `Low` or `Out` automatically populate the shared shopping checklist.
- **1-Tap Restock**: Tapping "Restock" on completed items instantly replenishes pantry inventory levels.

### 🧹 4. Chore Routine & Repair Queue
- **Cleaning Streaks & Logs**: Track cleaning duties with streak counters and date-only completion stamps.
- **Maintenance Ticketing**: Log household repair requests with priority levels (`High`, `Medium`, `Low`) and resolution stages (`To Fix`, `In Progress`, `Done`).

### 📱 5. Mobile-First PWA & Real-Time Sync
- **Supabase Realtime WebSockets**: Multi-device database sync broadcasts updates to all connected phones without page reloads.
- **Mobile PWA & Safe Area Insets**: Responsive bottom navigation bar, Floating Action Button (`+`), bottom sheet drawers, and iOS safe area inset support (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`).
- **Security Portal**: Personal 6-digit PIN authentication with mobile 10-key numeric keypad integration.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 5, Lucide React Icons, Canvas Confetti.
- **Styling**: Modern Glassmorphic CSS Design System with custom tokens, responsive breakpoints, and theme toggling.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS).
- **Real-Time Engine**: Supabase WebSockets (`supabase_realtime` publication channel).
- **Integrations**: Telegram Bot API for instant cross-device notifications.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/eevangg/HomeSync.git
cd HomeSync
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root folder:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
VITE_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
VITE_TELEGRAM_CHAT_ID=your-telegram-chat-id
```

### 3. Database Schema Migration
Run the SQL queries in [`supabase_schema.sql`](./supabase_schema.sql) via your Supabase SQL Editor to initialize tables and enable Realtime WebSockets broadcasting.

### 4. Run Development Server
```bash
npm run dev
```

---

## 📱 Mobile Installation (PWA)

1. Open the deployed web app on iOS Safari or Android Chrome.
2. Tap **Share** (iOS) or **Options** (Android).
3. Select **Add to Home Screen** to install as a standalone, native-feeling web application.
