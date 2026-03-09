import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { name: 'Total Doctors', value: '45', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Doctors', value: '42', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Suspended Doctors', value: '3', icon: UserX, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Total Patients', value: '1,245', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            System Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500 font-medium">Activity Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
