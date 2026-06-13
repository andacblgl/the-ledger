# 🍸 Curator: Diary for Cocktails

A premium, dark-themed cocktail journaling and inventory management application built for cocktail enthusiasts. Track your tastings, visualize your flavor profile, and manage your personal bar with a sleek, modern UI.

## ✨ Features

*   **📖 Tasting Diary:** Log your cocktail experiences. Supports multiple logs per cocktail (1:N) chronologically, featuring exclusive "First Taste" badges for new discoveries.
*   **🕸️ Flavor Profile Chart:** A dynamic, interactive radar chart that visualizes your palate preferences based on your tasting history (powered by Recharts).
*   **🥃 My Bar & Top Shelf:** Manage your home inventory and pin your signature drinks.
*   **✨ Premium UI/UX:** A carefully crafted dark mode aesthetic with golden accents, glassmorphism, and optimistic UI updates for a seamless experience.

## 🛠️ Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, Radix UI (Headless components)
*   **Data Visualization:** Recharts
*   **Backend & Database:** Supabase (PostgreSQL, RPCs, RLS)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
Set up your environment variables by creating a .env.local file in the root directory:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
Open http://localhost:3000 with your browser to see the application.


