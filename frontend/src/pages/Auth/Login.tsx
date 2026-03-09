import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, Role } from "../../store/useAuthStore";
import { Activity, Mail, Lock, ArrowLeft } from "lucide-react";
import api from "@/src/services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const user = res.data?.data?.user;

      if (!user) {
        throw new Error("Invalid server response");
      }

      const role = user.roles?.[0];

      setUser({
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: role,
      });

      if (role === "patient") navigate("/patient/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err: any) {
      if (err.response) {
        // Server responded but with error
        setErrorMessage(
          err.response.data?.message || "Invalid email or password",
        );
      } else if (err.request) {
        // Network issue
        setErrorMessage(
          "Network error. Please check your internet connection.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header with Home Link */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center text-slate-700 hover:text-green-600 transition-colors"
        >
          <Activity className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-xl font-bold tracking-tight">HealthCare</span>
        </Link>
        <Link
          to="/"
          className="flex items-center text-sm font-medium text-slate-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Or{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                register as a new patient
              </Link>
            </p>
          </div>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-md hover:shadow-lg disabled:opacity-60`}
                disabled={loading}
              >
               {loading ? 'Signing In...' :  'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HealthCare Platform. All rights
            reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/"
              className="text-slate-500 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="text-slate-500 hover:text-green-600 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#about"
              className="text-slate-500 hover:text-green-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-slate-500 hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
