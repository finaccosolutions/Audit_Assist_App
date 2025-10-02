import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, Send, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import type { Database } from '../../lib/database.types';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadInvoices();
      loadCustomers();
    }
  }, [user]);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            unique_code,
            email
          )
        `)
        .eq('user_id', user!.id)
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
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
      draft: 'bg-slate-100 text-slate-700',
      sent: 'bg-blue-100 text-blue-700',
      partially_paid: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice as any).customers?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const invoiceStats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    balanceDue: invoices.reduce((sum, inv) => sum + inv.balance_due, 0),
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
      <Header title="Invoices Management" subtitle="Create and manage your invoices" />

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{invoiceStats.total}</h3>
            <p className="text-slate-600 text-sm">Total Invoices</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">${invoiceStats.totalRevenue.toFixed(2)}</h3>
            <p className="text-slate-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">${invoiceStats.balanceDue.toFixed(2)}</h3>
            <p className="text-slate-600 text-sm">Balance Due</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{invoiceStats.overdue}</h3>
            <p className="text-slate-600 text-sm">Overdue</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-900 font-semibold">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    {(invoice as any).customers?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    ${invoice.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    ${invoice.balance_due.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No invoices found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create your first invoice
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <InvoiceFormModal
          customers={customers}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadInvoices();
          }}
        />
      )}
    </div>
  );
}

function InvoiceFormModal({
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
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceNumber = generateInvoiceNumber();
      
      const { error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_id: formData.customer_id,
          user_id: user!.id,
          invoice_date: formData.invoice_date,
          due_date: formData.due_date || null,
          subtotal: formData.subtotal,
          tax_amount: formData.tax_amount,
          total_amount: formData.total_amount,
          balance_due: formData.total_amount,
          notes: formData.notes,
          status: 'draft',
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const total = formData.subtotal + formData.tax_amount;
    setFormData({ ...formData, total_amount: total });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Create Invoice</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.unique_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Date *</label>
              <input
                type="date"
                required
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Subtotal *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
                onBlur={calculateTotal}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tax Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => setFormData({ ...formData, tax_amount: parseFloat(e.target.value) || 0 })}
                onBlur={calculateTotal}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Total Amount *</label>
              <input
                type="number"
                required
                readOnly
                value={formData.total_amount}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
