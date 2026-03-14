# Tro-Go Frontend (Tro-Go FE)

## Project Overview

Tro-Go FE is a comprehensive property management dashboard and tenant exploration portal for rental houses and motels. It is designed to offer a professional management experience for administrators and a clean, modern interface for potential tenants.

### Main Technologies

- **Framework:** Vue 3 (Composition API with `<script setup lang="ts">`)
- **Language:** TypeScript (Strict mode enabled)
- **Build Tool:** Vite
- **UI Library:** Ant Design Vue (v4)
- **Styling:**
     - **Tailwind CSS:** Integrated via CDN for rapid utility-first styling.
     - **Vanilla CSS:** Minimal use for component-specific overrides.
- **Routing:** Vue Router (v5) with typed route records.
- **API Client:** Axios with custom TypeScript services and request interceptors for JWT authentication.
- **Containerization:** Docker Support (Dockerfile & docker-compose.yml provided).

---

## Building and Running

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Commands

- **Install Dependencies:**
     ```bash
     npm install
     ```
- **Development Server:**
     ```bash
     npm run dev
     ```
     Runs the application locally, typically at `http://localhost:5173`.
- **Type Checking and Production Build:**
     ```bash
     npm run build
     ```
     Runs `vue-tsc` to verify types and then generates optimized assets in `dist/`.
- **Preview Production Build:**
     ```bash
     npm run preview
     ```

---

## Project Structure

- `src/api/`: Typed service modules for all backend interactions. Includes `axios.ts` base configuration.
- `src/layouts/`: Core layout wrappers:
     - `AdminLayout.vue`: Modern dashboard with professional sidebar and header.
     - `CustomerLayout.vue`: Public-facing layout for tenants.
- `src/router/`: Typed routing configuration in `index.ts`.
- `src/views/`:
     - `manage/`: Admin-facing views (Dashboard, Houses, Rooms, Contracts, Users, Customers).
     - `customer/`: Public-facing views (Explore).
- `src/env.d.ts`: TypeScript environment declarations for Vue.

---

## Development Conventions

### Coding Style & Standards

- **TypeScript First:** All new components and services MUST use TypeScript. Use `lang="ts"` in SFCs.
- **Component Pattern:** Prefer the `<script setup>` syntax for better performance and readability.
- **UI Consistency:** Use Ant Design Vue components for core interactive elements (Tables, Forms, Modals).
- **Styling Strategy:** Use Tailwind CSS utility classes for layout, spacing, and minor stylistic adjustments to avoid bloating CSS files.

### API Integration

- Define `interface` types for all data models (e.g., `House`, `Room`, `Contract`) within their respective service files.
- All requests should go through services in `src/api/` to leverage the centralized `apiClient`.
- Backend URL defaults to `http://localhost:8080/api/v1` (configurable in `src/api/axios.ts`).

### Routing & Security

- Guard sensitive routes using `meta: { requiresAuth: true }` in `src/router/index.ts`.
- The `AdminLayout` is used for all routes under `/manage`.
- Navigation guards handle automatic redirection between `/login` and `/manage` based on the existence of a JWT token in `localStorage`.
