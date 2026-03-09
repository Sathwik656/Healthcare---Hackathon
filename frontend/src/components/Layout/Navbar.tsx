import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Bell, Globe, Activity, LogOut } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const patientLinks = [
    { name: t('dashboard'), path: '/patient/dashboard' },
    { name: t('doctors'), path: '/patient/doctors' },
    { name: t('my_appointments'), path: '/patient/appointments' },
    { name: t('profile'), path: '/patient/profile' },
  ];

  const doctorLinks = [
    { name: t('dashboard'), path: '/doctor/dashboard' },
    { name: t('pending_requests'), path: '/doctor/requests' },
    { name: 'Previous Appointments', path: '/doctor/previous-appointments' },
    { name: t('profile'), path: '/doctor/profile' },
  ];

  const adminLinks = [
    { name: t('dashboard'), path: '/admin/dashboard' },
    { name: t('manage_doctors'), path: '/admin/doctors' },
    { name: t('manage_health_centers'), path: '/admin/health-centers' },
  ];

  const links = user?.role === 'patient' ? patientLinks 
              : user?.role === 'doctor' ? doctorLinks 
              : user?.role === 'admin' ? adminLinks : [];

  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center">
          <Activity className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">HealthCare</span>
        </Link>
        
        <nav className="hidden md:flex space-x-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center text-slate-600 hover:text-green-600 transition-colors">
            <Globe className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium uppercase">{i18n.language}</span>
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-slate-100">
            <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">English</button>
            <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Hindi</button>
            <button onClick={() => changeLanguage('kn')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Kannada</button>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative text-slate-600 hover:text-green-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg border border-green-200">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
          </div>
          
          <button 
            onClick={logout}
            className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
