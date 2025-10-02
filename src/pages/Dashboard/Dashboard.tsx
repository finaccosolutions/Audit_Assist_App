import { useEffect, useState } from 'react';
import { Users, UserPlus, Briefcase, Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';

interface Stats {
  totalCustomers: number;
  activeLeads: number;
  activeServices: number;
  pendingInvoices: number;
  totalRevenue: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    activeLeads: 0,
    activeServices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const [customers, leads, services, invoices, tasks] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('user_id', user!.id).eq('is_active', true),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', user!.id).in('status', ['new', 'contacted', 'qualified', 'negotiating']),
        supabase.from('customer_services').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('invoices').select('balance_due', { count: 'exact' }).eq('user_id', user!.id).in('status', ['sent', 'partially_paid', 'overdue']),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', user!.id).in('status', ['pending', 'in_progress']),
      ]);

      const totalRevenue = invoices.data?.reduce((sum, inv) => sum + (inv.balance_due || 0), 0) || 0;

      setStats({
        totalCustomers: customers.count || 0,
        activeLeads: leads.count || 0,
        activeServices: services.count || 0,
        pendingInvoices: invoices.count || 0,
        totalRevenue,
        pendingTasks: tasks.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Active Customers', 
      value: stats.totalCustomers, 
      icon: Users, 
      color: 'bg-blue-500', 
      change: '+12%',
      onClick: () => onNavigate('customers')
    },
    { 
      label: 'Active Leads', 
      value: stats.activeLeads, 
      icon: UserPlus, 
      color: 'bg-green-500', 
      change: '+8%',
      onClick: () => onNavigate('leads')
    },
    { 
      label: 'Active Services', 
      value: stats.activeServices, 
      icon: Briefcase, 
      color: 'bg-orange-500', 
      change: '+5%',
      onClick: () => onNavigate('services')
    },
    { 
      label: 'Pending Invoices', 
      value: stats.pendingInvoices, 
      icon: Receipt, 
      color: 'bg-red-500', 
      change: '+3%',
      onClick: () => onNavigate('invoices')
    },
    { 
      label: 'Total Revenue Pending', 
      value: `$${stats.totalRevenue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'bg-emerald-500', 
      change: '+15%',
      onClick: () => onNavigate('reports')
    },
    { 
      label: 'Pending Tasks', 
      value: stats.pendingTasks, 
      icon: AlertCircle, 
      color: 'bg-amber-500', 
      change: '+2%',
      onClick: () => onNavigate('tasks')
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="Dashboard" subtitle="Welcome back! Here's what's happening with your firm." />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={stat.onClick}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">New activity item</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">VAT Return Due</p>
                    <p className="text-xs text-slate-500">Due in 3 days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
