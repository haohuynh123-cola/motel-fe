# 🏠 Tro-Go Frontend

**Tro-Go Frontend** is a comprehensive property management dashboard and tenant exploration portal. It provides a professional management experience for administrators and a sleek, modern interface for potential tenants.

---

## 🏗️ Project Structure

The project follows a modular structure designed for scalability and maintainability:

```text
motel-fe/
├── public/                 # Static assets (Vite logo, etc.)
├── src/
│   ├── api/                # Typed service modules for backend interactions (Axios)
│   ├── assets/             # Global CSS and media files
│   ├── components/         # Reusable Vue UI components
│   ├── composables/        # Reusable business logic (Composition API hooks)
│   ├── layouts/            # Core layout wrappers (Admin, Customer)
│   ├── router/             # Typed routing configuration and navigation guards
│   ├── stores/             # Global state management (Pinia)
│   ├── utils/              # Helper functions (Formatters, validators)
│   ├── views/              # Page components
│   │   ├── manage/         # Admin views (Dashboard, Houses, Contracts, Users)
│   │   └── customer/       # Public-facing views (Marketplace, Room Explore)
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── package.json            # Scripts and dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 🛠️ Technology Stack

- **Framework:** Vue 3 (Composition API with `<script setup>`)
- **Language:** TypeScript (Strict mode enabled)
- **UI Library:** Ant Design Vue v4
- **State Management:** Pinia
- **Styling:**
    - **Tailwind CSS:** Utility-first styling via CDN for rapid prototyping.
    - **Vanilla CSS:** Minimal use for targeted component overrides.
- **Build Tool:** Vite
- **Routing:** Vue Router v5 with typed route records.
- **API Client:** Axios with custom services and JWT interceptors.

---

## 🌟 Core Features

- ✅ **Professional Admin Dashboard:** Real-time metrics and management tools.
- ✅ **House & Room Management:** Detailed CRUD operations with Ant Design Tables.
- ✅ **Contract Lifecycle:** Manage tenant agreements and digital records.
- ✅ **Marketplace Explorer:** Modern, responsive interface for searching rental listings.
- ✅ **User Management:** RBAC-aware interface for managing users and roles.
- ✅ **Authentication:** Seamless login/register flows with JWT persistence.

---

## 🚀 Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📝 Coding Conventions & Standards

- **TypeScript Mandatory:** All new code must be fully typed. Use `interface` for API models.
- **Component Pattern:** Always use `<script setup lang="ts">` for SFCs.
- **UI Consistency:** Rely on Ant Design Vue components for core interactive elements (Tables, Forms, Modals).
- **Service-Oriented API:** Never call Axios directly in components; use the `src/api/` services.
- **Tailwind for Layout:** Use Tailwind utility classes for spacing, margins, and simple layout adjustments.

---
© 2026 Tro-Go Team
