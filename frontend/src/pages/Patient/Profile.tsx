import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Globe, Calendar, Edit3 } from 'lucide-react';

const PatientProfile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('profile')}</h1>
        <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
          <Edit3 className="w-4 h-4 mr-2 text-slate-400" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-4xl border-4 border-white shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'John Doe'}</h2>
              <p className="text-slate-500 font-medium capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Full Name</p>
                <p className="text-slate-900 font-semibold">{user?.name || 'John Doe'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="text-slate-900 font-semibold">{user?.email || 'john.doe@example.com'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Language Preference</p>
                <p className="text-slate-900 font-semibold uppercase">{i18n.language === 'en' ? 'English' : i18n.language === 'hi' ? 'Hindi' : 'Kannada'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Member Since</p>
                <p className="text-slate-900 font-semibold">October 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Appointment Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Total</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-bold text-green-600">10</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Completed</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-bold text-amber-600">2</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Upcoming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
