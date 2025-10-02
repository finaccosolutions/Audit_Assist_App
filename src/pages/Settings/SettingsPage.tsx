import { useState, useEffect } from 'react';
import { User, Building, Mail, Phone, Lock, Save, Bell, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    company_name: '',
    company_address: '',
    tax_id: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Here you would save to your user profile table
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated save
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={profileData.company_name}
                        onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Address</label>
                      <textarea
                        value={profileData.company_address}
                        onChange={(e) => setProfileData({ ...profileData, company_address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID / VAT Number</label>
                      <input
                        type="text"
                        value={profileData.tax_id}
                        onChange={(e) => setProfileData({ ...profileData, tax_id: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new leads', description: 'Receive email when a new lead is added' },
                    { label: 'Invoice reminders', description: 'Get notified about upcoming invoice due dates' },
                    { label: 'Task deadlines', description: 'Receive reminders for task due dates' },
                    { label: 'Customer updates', description: 'Get notified about customer profile changes' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Lock className="w-5 h-5" />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h3>
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 font-medium">Current Plan: Professional</p>
                  <p className="text-sm text-blue-700 mt-2">Your subscription renews on January 1, 2025</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Payment Methods</h4>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-8 h-8 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-slate-600">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
