import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Building2, CheckCircle } from 'lucide-react';
import api from '@/src/services/api';

interface HealthCenter {
  health_center_id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

const ManageHealthCenters = () => {
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<HealthCenter | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/health-centers');
      setCenters(res.data.data.health_centers);
    } catch {
      setError('Failed to load health centers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCenters(); }, []);

  const resetForm = () => {
    setForm({ name: '', address: '', phone: '', email: '' });
    setEditingCenter(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCenter) {
        await api.put(`/health-centers/${editingCenter.health_center_id}`, form);
      } else {
        await api.post('/health-centers', form);
      }
      resetForm();
      fetchCenters();
    } catch {
      setError('Operation failed');
    }
  };

  const handleEdit = (center: HealthCenter) => {
    setEditingCenter(center);
    setForm({
      name: center.name || '',
      address: center.address || '',
      phone: center.phone || '',
      email: center.email || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this health center?')) return;
    try {
      await api.delete(`/health-centers/${id}`);
      fetchCenters();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cannot delete this health center');
    }
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Health Centers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Center
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search centers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading && <p className="p-6 text-sm text-slate-500">Loading...</p>}
          {error && <p className="p-6 text-sm text-red-500">{error}</p>}

          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredCenters.map(center => (
                <tr key={center.health_center_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{center.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{center.address || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{center.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{center.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(center)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(center.health_center_id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCenters.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No health centers found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingCenter ? 'Edit Health Center' : 'Add Health Center'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: 'name', placeholder: 'Center name', required: true },
                { key: 'address', placeholder: 'Address' },
                { key: 'phone', placeholder: 'Phone' },
                { key: 'email', placeholder: 'Email' },
              ].map(({ key, placeholder, required }) => (
                <input
                  key={key}
                  required={required}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                />
              ))}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  {editingCenter ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHealthCenters;