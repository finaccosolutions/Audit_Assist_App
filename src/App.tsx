import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import LeadsPage from './pages/Leads/LeadsPage';
import CustomersPage from './pages/Customers/CustomersPage';
import VATFilingPage from './pages/VATFiling/VATFilingPage';
import SimplePage from './pages/SimplePage';
import ServicesPage from './pages/Services/ServicesPage';
import TasksPage from './pages/Tasks/TasksPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';


function AppContent() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} />
    ) : (
      <Login onToggle={() => setShowRegister(true)} />
    );
  }

const renderPage = () => {
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard onNavigate={setCurrentPage} />;
    case 'leads':
      return <LeadsPage />;
    case 'customers':
      return <CustomersPage />;
    case 'services':
      return <ServicesPage />; // Changed from SimplePage
    case 'tasks':
      return <TasksPage />; // Changed from SimplePage
    case 'invoices':
      return <InvoicesPage />; // Changed from SimplePage
    case 'reports':
      return <ReportsPage />; // Changed from SimplePage
    case 'settings':
      return <SettingsPage />; // Changed from SimplePage
    default:
      return <Dashboard onNavigate={setCurrentPage} />;
  }
};

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 ml-64">
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
