import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Stethoscope, Clock, Edit3 } from 'lucide-react';

const DoctorProfile = () => {
  const { t } = useTranslation();
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
            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-4xl border-4 border-white shadow-lg">
              {user?.name?.charAt(4) || 'D'}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Dr. Smith'}</h2>
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
                <p className="text-slate-900 font-semibold">{user?.name || 'Dr. Smith'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="text-slate-900 font-semibold">{user?.email || 'dr.smith@example.com'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Specialty</p>
                <p className="text-slate-900 font-semibold">Cardiologist</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Availability Schedule</p>
                <p className="text-slate-900 font-semibold">Mon - Fri, 9 AM - 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
