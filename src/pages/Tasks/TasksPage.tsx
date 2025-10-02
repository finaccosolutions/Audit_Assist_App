import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import type { Database } from '../../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadTasks();
      loadCustomers();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          customers (
            name,
            unique_code
          )
        `)
        .eq('user_id', user!.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true);

      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return AlertCircle;
    if (priority === 'medium') return Clock;
    return CheckCircle;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="Tasks Management" subtitle="Track and manage your tasks and deadlines" />

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{taskStats.total}</h3>
            <p className="text-slate-600 text-sm">Total Tasks</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{taskStats.pending}</h3>
            <p className="text-slate-600 text-sm">Pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-600 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{taskStats.inProgress}</h3>
            <p className="text-slate-600 text-sm">In Progress</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{taskStats.completed}</h3>
            <p className="text-slate-600 text-sm">Completed</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const PriorityIcon = getPriorityIcon(task.priority);
            return (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)} flex items-center space-x-1`}>
                            <PriorityIcon className="w-3 h-3" />
                            <span>{task.priority}</span>
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-slate-600 text-sm mb-3">{task.description}</p>
                        )}

                        <div className="flex items-center space-x-6 text-sm">
                          {task.customer_id && (
                            <div className="flex items-center space-x-2 text-slate-600">
                              <span className="font-medium">Customer:</span>
                              <span>{(task as any).customers?.name || 'N/A'}</span>
                            </div>
                          )}

                          {task.due_date && (
                            <div className="flex items-center space-x-2 text-slate-600">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-semibold">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No tasks found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <TaskFormModal
          customers={customers}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

function TaskFormModal({
  customers,
  onClose,
  onSuccess,
}: {
  customers: Customer[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_id: '',
    due_date: '',
    priority: 'medium' as const,
    status: 'pending' as const,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          ...formData,
          customer_id: formData.customer_id || null,
          user_id: user!.id,
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Add New Task</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer</label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select customer (optional)</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.unique_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
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
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
