import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  ClipboardList,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: UserPlus },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'services', label: 'Services', icon: Briefcase }, // Now includes VAT Filing
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { signOut, profile } = useAuth();

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col fixed left-0 top-0 shadow-2xl border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{profile?.company_name || 'Auditing Firm'}</h1>
            <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 border-r-4 border-blue-400 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
