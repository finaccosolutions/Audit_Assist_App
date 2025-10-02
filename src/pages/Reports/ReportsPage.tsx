import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, FileText, Download, Calendar } from 'lucide-react';
import { Bolt Database } from '../../lib/Bolt Database';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';

interface ReportData {
  totalRevenue: number;
  totalCustomers: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingAmount: number;
  averageInvoice: number;
  monthlyRevenue: { month: string; amount: number }[];
  topCustomers: { name: string; amount: number }[];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    averageInvoice: 0,
    monthlyRevenue: [],
    topCustomers: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user, dateRange]);

  const loadReportData = async () => {
    try {
      // Fetch invoices
      const { data: invoices } = await Bolt Database
        .from('invoices')
        .select('*')
        .eq('user_id', user!.id)
        .gte('invoice_date', dateRange.from)
        .lte('invoice_date', dateRange.to);

      // Fetch customers
      const { data: customers } = await Bolt Database
        .from('customers')
        .select('id')
        .eq('user_id', user!.id)
        .eq('is_active', true);

      const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
      const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0;
      const pendingAmount = invoices?.reduce((sum, inv) => sum + inv.balance_due, 0) || 0;
      const averageInvoice = invoices?.length ? totalRevenue / invoices.length : 0;

      setReportData({
        totalRevenue,
        totalCustomers: customers?.length || 0,
        totalInvoices: invoices?.length || 0,
        paidInvoices,
        pendingAmount,
        averageInvoice,
        monthlyRevenue: generateMonthlyRevenue(invoices || []),
        topCustomers: [],
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyRevenue = (invoices: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({ month, amount: 0 }));

    invoices.forEach(invoice => {
      const date = new Date(invoice.invoice_date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].amount += invoice.total_amount;
    });

    return monthlyData;
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
      <Header title="Reports & Analytics" subtitle="View your business insights and performance" />

      <div className="p-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Date Range:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-600">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              ${reportData.totalRevenue.toFixed(2)}
            </h3>
            <p className="text-slate-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {reportData.totalCustomers}
            </h3>
            <p className="text-slate-600 text-sm">Active Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {reportData.totalInvoices}
            </h3>
            <p className="text-slate-600 text-sm">Total Invoices</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {reportData.paidInvoices}
            </h3>
            <p className="text-slate-600 text-sm">Paid Invoices</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              ${reportData.pendingAmount.toFixed(2)}
            </h3>
            <p className="text-slate-600 text-sm">Pending Amount</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              ${reportData.averageInvoice.toFixed(2)}
            </h3>
            <p className="text-slate-600 text-sm">Average Invoice</p>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Revenue</h3>
          <div className="space-y-4">
            {reportData.monthlyRevenue.map((data, index) => (
              <div key={index} className="flex items-center">
                <span className="w-12 text-sm text-slate-600 font-medium">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((data.amount / Math.max(...reportData.monthlyRevenue.map(m => m.amount))) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
                <span className="w-24 text-right text-sm font-semibold text-slate-900">
                  ${data.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Paid</span>
                <span className="text-lg font-bold text-green-700">{reportData.paidInvoices}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-900">Pending</span>
                <span className="text-lg font-bold text-yellow-700">
                  {reportData.totalInvoices - reportData.paidInvoices}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Collection Rate</span>
                <span className="text-lg font-bold text-slate-900">
                  {reportData.totalInvoices ? Math.round((reportData.paidInvoices / reportData.totalInvoices) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average Processing Time</span>
                <span className="text-lg font-bold text-slate-900">12 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
