import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { Bolt Database } from '../../lib/Bolt Database';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import type { Database } from '../../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

interface ServiceStats {
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
  topService: string;
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
    topService: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadServices();
      loadStats();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      const { data, error } = await Bolt Database
        .from('services')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: servicesData } = await Bolt Database
        .from('services')
        .select('*')
        .eq('user_id', user!.id);

      const { data: customerServices } = await Bolt Database
        .from('customer_services')
        .select('price, service_id, services(name)')
        .eq('status', 'active');

      const totalServices = servicesData?.length || 0;
      const activeServices = servicesData?.filter(s => s.is_active).length || 0;
      const totalRevenue = customerServices?.reduce((sum, cs) => sum + cs.price, 0) || 0;

      setStats({
        totalServices,
        activeServices,
        totalRevenue,
        topService: 'VAT Filing'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && service.is_active) ||
                         (filterStatus === 'inactive' && !service.is_active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="Services Management" subtitle="Manage all services offered by your firm" />

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalServices}</h3>
            <p className="text-slate-600 text-sm">Total Services</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.activeServices}</h3>
            <p className="text-slate-600 text-sm">Active Services</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-emerald-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</h3>
            <p className="text-slate-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-orange-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{stats.topService}</h3>
            <p className="text-slate-600 text-sm">Top Service</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-slate-500">{service.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-slate-900">${service.default_price.toFixed(2)}</p>
                <p className="text-sm text-slate-500 capitalize">{service.billing_cycle}</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No services found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Add your first service
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <ServiceFormModal
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadServices();
            loadStats();
          }}
        />
      )}
    </div>
  );
}

function ServiceFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_price: 0,
    billing_cycle: 'monthly' as const,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  // Predefined services for quick selection
  const predefinedServices = [
    { name: 'VAT Filing', description: 'VAT return preparation and filing', price: 500, cycle: 'quarterly' },
    { name: 'Annual Audit', description: 'Complete financial audit service', price: 5000, cycle: 'yearly' },
    { name: 'Bookkeeping', description: 'Monthly bookkeeping services', price: 300, cycle: 'monthly' },
    { name: 'Tax Consultation', description: 'Professional tax advisory', price: 150, cycle: 'one-time' },
    { name: 'Financial Statement Preparation', description: 'Prepare financial statements', price: 1000, cycle: 'yearly' },
    { name: 'Payroll Services', description: 'Complete payroll management', price: 250, cycle: 'monthly' },
    { name: 'Company Formation', description: 'Business registration services', price: 2000, cycle: 'one-time' },
    { name: 'Internal Audit', description: 'Internal control review', price: 3000, cycle: 'yearly' },
    { name: 'Management Consulting', description: 'Business advisory services', price: 200, cycle: 'monthly' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await Bolt Database
        .from('services')
        .insert({
          ...formData,
          user_id: user!.id,
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Add New Service</h2>
          <p className="text-sm text-slate-600 mt-1">Choose from predefined services or create custom</p>
        </div>

        {/* Predefined Services */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Select</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {predefinedServices.map((service, index) => (
              <button
                key={index}
                onClick={() => setFormData({
                  name: service.name,
                  description: service.description,
                  default_price: service.price,
                  billing_cycle: service.cycle as any,
                  is_active: true,
                })}
                className="p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <p className="font-semibold text-slate-900 text-sm">{service.name}</p>
                <p className="text-xs text-slate-500 mt-1">${service.price} / {service.cycle}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Service Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default Price *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.default_price}
                onChange={(e) => setFormData({ ...formData, default_price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Billing Cycle *</label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one-time">One-time</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-slate-700">Service is active</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
