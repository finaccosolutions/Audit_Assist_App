import { useEffect, useState } from 'react';
import { Plus, FileText, Download, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import type { Database } from '../../lib/database.types';

type VATReturn = Database['public']['Tables']['vat_returns']['Row'] & {
  customer?: Database['public']['Tables']['customers']['Row'];
  vat_return_data?: Database['public']['Tables']['vat_return_data']['Row'];
};

export default function VATFilingPage() {
  const { user } = useAuth();
  const [vatReturns, setVatReturns] = useState<VATReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadVATReturns();
    }
  }, [user]);

  const loadVATReturns = async () => {
    try {
      const { data, error } = await supabase
        .from('vat_returns')
        .select(`
          *,
          customer:customers(*),
          vat_return_data(*)
        `)
        .eq('user_id', user!.id)
        .order('period_year', { ascending: false })
        .order('period_number', { ascending: false });

      if (error) throw error;
      setVatReturns(data as VATReturn[] || []);
    } catch (error) {
      console.error('Error loading VAT returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      submitted: 'bg-green-100 text-green-700',
      filed: 'bg-emerald-100 text-emerald-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPeriodLabel = (periodType: string, year: number, number: number) => {
    if (periodType === 'quarterly') {
      return `Q${number} ${year}`;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[number - 1]} ${year}`;
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
      <Header title="VAT Filing" subtitle="Manage VAT returns for your customers" />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-slate-600">
            Total Returns: <span className="font-bold text-slate-900">{vatReturns.length}</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            <span>New VAT Return</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Period</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Net VAT</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vatReturns.map((vatReturn) => (
                <tr key={vatReturn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{vatReturn.customer?.name}</p>
                      <p className="text-sm text-slate-500">{vatReturn.customer?.unique_code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {getPeriodLabel(vatReturn.period_type, vatReturn.period_year, vatReturn.period_number)}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(vatReturn.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vatReturn.status)}`}>
                      {vatReturn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    ${vatReturn.vat_return_data?.[0]?.net_vat_payable?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {vatReturns.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No VAT returns found</p>
              <p className="text-slate-400 text-sm mt-1">Create your first VAT return to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
