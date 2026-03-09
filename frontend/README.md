# Healthcare Application Frontend

This is the frontend application for the Healthcare Appointment Booking System. It is built using modern web development practices and technologies to provide a fast, responsive, and seamless user experience for patients, doctors, and administrators.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **UI Components & Icons**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Internationalization**: [react-i18next](https://react.i18next.com/)

## 🛠️ Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
- Node.js >= 20.x recommended
- npm (comes with Node.js)

## 📦 Installation

1. Clone the repository and navigate to the `frontend` directory:
   ```bash
   cd d:\Healthcare\frontend
   ```

2. Install the backend dependencies separately (if required), and then install frontend dependencies:
   ```bash
   npm install
   ```

## 💻 Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` or depending on the port Vite selects.

## 🏗️ Build for Production

To create a production build of the project:

```bash
npm run build
```

The compiled assets will be placed in the `dist` folder. You can preview the production build locally using:

```bash
npm run preview
```

## 📁 Project Structure

A brief overview of the `src` directory:

```
src/
├── assets/          # Static assets like images and global CSS
├── components/      # Reusable UI components
├── layouts/         # Page layout components (e.g., AuthLayout, DashboardLayout)
├── pages/           # Application route pages
├── services/        # API integration and services (via Axios)
├── store/           # Global state management using Zustand
├── hooks/           # Custom React hooks
├── utils/           # Utility and helper functions
├── locales/         # i18n translation files
├── App.tsx          # Main application component & Router configuration
└── main.tsx         # Application entry point
```

## ✨ Key Features

- **Role-Based Access Control**: Different dashboards and permissions for Patients, Doctors, and Admins.
- **Modern UI**: Clean and intuitive interface optimized for both desktop and mobile devices.
- **State Management**: Lightweight and fast global state handling via Zustand.
- **Secure Authentication**: Integrated token-based authentication (JWT).

## 📝 License

This project is proprietary and confidential.
