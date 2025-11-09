import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Settings, Users, Calendar, FileText, Database, Shield, X, Plus, Download } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleActionClick = (title: string) => {
    setModalType(title);
    setShowModal(true);
    toast.success(`Opening ${title}`, {
      icon: '⚙️',
      style: { background: '#3B82F6', color: '#fff', padding: '16px', borderRadius: '12px' },
    });
  };

  const handleBackup = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Creating backup...',
        success: 'Database backup created successfully! 💾',
        error: 'Failed to create backup',
      },
      { style: { padding: '16px', borderRadius: '12px' } }
    );
    setTimeout(() => setShowModal(false), 2500);
  };
  const adminActions = [
    { title: "User Management", description: "Manage faculty and staff accounts", icon: Users, color: "bg-blue-500" },
    { title: "Schedule Settings", description: "Configure timetable parameters", icon: Calendar, color: "bg-green-500" },
    { title: "Request Management", description: "Oversee all period requests", icon: FileText, color: "bg-yellow-500" },
    { title: "System Settings", description: "Configure application settings", icon: Settings, color: "bg-purple-500" },
    { title: "Data Management", description: "Backup and restore data", icon: Database, color: "bg-indigo-500" },
    { title: "Security Settings", description: "Manage access and permissions", icon: Shield, color: "bg-red-500" },
  ];

  const stats = [
    { label: "Total Faculty", value: "45", change: "+2 this month" },
    { label: "Active Sessions", value: "12", change: "Currently online" },
    { label: "Pending Requests", value: "8", change: "Awaiting review" },
    { label: "System Uptime", value: "99.9%", change: "Last 30 days" },
  ];

  return (
    <main className="container mx-auto px-6 py-8">
      <Toaster position="top-right" />
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage system settings, users, and monitor application performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toast(
                `${stat.label}: ${stat.value}\n${stat.change}`,
                { icon: '📊', style: { padding: '16px', borderRadius: '12px' } }
              )}
            >
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Actions */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Administrative Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Quick access to common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-start space-y-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left"
                    onClick={() => handleActionClick(action.title)}
                  >
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent System Activity</CardTitle>
            <CardDescription className="text-gray-600">
              Latest administrative actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New faculty member added", user: "System Admin", time: "5 minutes ago" },
                { action: "Timetable updated for Semester 2", user: "Dr. Johnson", time: "1 hour ago" },
                { action: "Bulk request approval processed", user: "HOD Mathematics", time: "2 hours ago" },
                { action: "System backup completed", user: "System", time: "6 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      By {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600"
                    onClick={() => toast.success('Activity details loaded!', {
                      icon: '📄',
                      style: { background: '#10B981', color: '#fff', padding: '16px', borderRadius: '12px' },
                    })}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">{modalType}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {modalType === "User Management" && (
                  <div className="space-y-4">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                    <div className="space-y-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">Dr. Smith</p>
                        <p className="text-sm text-gray-600">smith@example.com - Teacher</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">Prof. Johnson</p>
                        <p className="text-sm text-gray-600">johnson@example.com - HOD</p>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === "Schedule Settings" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Working Days</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Monday to Friday</option>
                        <option>Monday to Saturday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Periods per Day</label>
                      <input type="number" className="w-full p-2 border rounded-lg" defaultValue={6} />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Save Settings</Button>
                  </div>
                )}

                {modalType === "Request Management" && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Manage all pending requests from faculty members.</p>
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => window.location.href = '/requests'}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Go to Requests Page
                    </Button>
                  </div>
                )}

                {modalType === "System Settings" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" defaultChecked />
                      <label htmlFor="email">Enable email notifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto" defaultChecked />
                      <label htmlFor="auto">Auto-approve leave requests</label>
                    </div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">Update Settings</Button>
                  </div>
                )}

                {modalType === "Data Management" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900">Database Backup</p>
                      <p className="text-sm text-blue-700">Create a backup of all system data</p>
                    </div>
                    <Button 
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                      onClick={handleBackup}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup Now
                    </Button>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="font-semibold text-green-900">Last Backup</p>
                      <p className="text-sm text-green-700">Today at 12:00 AM</p>
                    </div>
                    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download Backup
                    </Button>
                  </div>
                )}

                {modalType === "Security Settings" && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="font-semibold text-red-900">Security Status</p>
                      <p className="text-sm text-red-700">All systems secure ✓</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                      <input type="number" className="w-full p-2 border rounded-lg" defaultValue={30} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="2fa" defaultChecked />
                      <label htmlFor="2fa">Require 2-factor authentication</label>
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Update Security
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin