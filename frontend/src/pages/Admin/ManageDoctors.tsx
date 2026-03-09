import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Search, CheckCircle, XCircle, X,
  User, Stethoscope, Copy, Building2, Phone,
  Mail, BookOpen, Languages, Eye, EyeOff
} from 'lucide-react';
import api from '@/src/services/api';

interface Doctor {
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'suspended';
  specialty_name?: string;
  health_center_name?: string;
  experience_years?: number;
}

interface Specialty {
  specialty_id: number;
  name: string;
}

interface HealthCenter {
  health_center_id: number;
  name: string;
}

const ManageDoctors = () => {
  const { t } = useTranslation();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty_id: '',
    health_center_id: '',
    experience_years: '',
    bio: '',
    language_preference: 'en',
  });

  // ── Fetch all data ────────────────────────────────────────────────────────
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      setDoctors(res.data.data.doctors || []);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [specRes, hcRes] = await Promise.all([
        api.get('/specialties'),
        api.get('/health-centers'),
      ]);
      setSpecialties(specRes.data.data.specialties || []);
      setHealthCenters(hcRes.data.data.health_centers || []);
    } catch {
      // handle silently
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDropdowns();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const resetForm = () => {
    setForm({
      name: '', email: '', password: '', phone: '',
      specialty_id: '', health_center_id: '',
      experience_years: '', bio: '', language_preference: 'en',
    });
    setGeneratedCredentials(null);
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleAutoFill = () => {
    const generatedPassword = generatePassword();
    setForm(f => ({ ...f, password: generatedPassword }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        specialty_id: form.specialty_id ? Number(form.specialty_id) : undefined,
        health_center_id: form.health_center_id ? Number(form.health_center_id) : undefined,
        experience_years: form.experience_years ? Number(form.experience_years) : undefined,
        bio: form.bio || undefined,
        language_preference: form.language_preference,
      };

      await api.post('/admin/doctors', payload);
      setGeneratedCredentials({ email: form.email, password: form.password });
      fetchDoctors();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create doctor.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle status ─────────────────────────────────────────────────────────
  const handleToggleStatus = async (doctor: Doctor) => {
    const action = doctor.status === 'active' ? 'suspend' : 'activate';
    try {
      await api.patch(`/admin/doctors/${doctor.user_id}/${action}`);
      fetchDoctors();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.specialty_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{t('manage_doctors')}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Search */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl bg-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading && <p className="p-6 text-sm text-slate-500">Loading...</p>}
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Doctor', 'Specialty', 'Health Center', 'Experience', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredDoctors.map((doc) => (
                <tr key={doc.user_id} className="hover:bg-slate-50 transition-colors">

                  {/* Doctor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                        {doc.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Specialty */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {doc.specialty_name || <span className="text-slate-400">—</span>}
                  </td>

                  {/* Health Center */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {doc.health_center_name || <span className="text-slate-400">—</span>}
                  </td>

                  {/* Experience */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {doc.experience_years != null
                      ? `${doc.experience_years} yr${doc.experience_years !== 1 ? 's' : ''}`
                      : <span className="text-slate-400">—</span>}
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleToggleStatus(doc)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white shadow-sm transition-colors ${
                        doc.status === 'active'
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {doc.status === 'active'
                        ? <><XCircle className="w-3.5 h-3.5 mr-1" />Suspend</>
                        : <><CheckCircle className="w-3.5 h-3.5 mr-1" />Activate</>}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No doctors found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Doctor Modal ───────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                {generatedCredentials ? '✅ Doctor Created' : 'Add New Doctor'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Form ── */}
            {!generatedCredentials ? (
              <form onSubmit={handleAddDoctor} className="p-6 space-y-4 overflow-y-auto">

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      {showPassword
                        ? <Eye className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        : <EyeOff className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                      <input required type={showPassword ? 'text' : 'password'} value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-green-500 focus:border-green-500 transition-colors" />
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button type="button" onClick={handleAutoFill}
                      className="px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
                      Auto-generate
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                  </div>
                </div>

                {/* Specialty + Health Center — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <select value={form.specialty_id} onChange={e => setForm({ ...form, specialty_id: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white">
                        <option value="">Select...</option>
                        {specialties.map(s => (
                          <option key={s.specialty_id} value={s.specialty_id}>{s.specialty_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Health Center</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <select value={form.health_center_id} onChange={e => setForm({ ...form, health_center_id: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white">
                        <option value="">Select...</option>
                        {healthCenters.map(h => (
                          <option key={h.health_center_id} value={h.health_center_id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Experience + Language — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input type="number" min="0" max="60" value={form.experience_years}
                        onChange={e => setForm({ ...form, experience_years: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <select value={form.language_preference} onChange={e => setForm({ ...form, language_preference: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Brief professional biography..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 transition-colors resize-none" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors">
                    {submitting ? 'Creating...' : 'Create Profile'}
                  </button>
                </div>

              </form>
            ) : (

              /* ── Credentials display ── */
              <div className="p-6 space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Profile Created Successfully</h4>
                    <p className="text-sm text-green-700 mt-1">Share these credentials securely with the new doctor.</p>
                  </div>
                </div>

                {[
                  { label: 'Email Address', value: generatedCredentials.email, mono: false },
                  { label: 'Password', value: generatedCredentials.password, mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                      <span className={`text-sm font-medium text-slate-900 ${mono ? 'font-mono' : ''}`}>{value}</span>
                      <button onClick={() => copyToClipboard(value)} className="text-slate-400 hover:text-green-600 transition-colors ml-3">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={resetForm}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageDoctors;