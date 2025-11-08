import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Settings, Users, Calendar, FileText, Database, Shield } from "lucide-react";

const Admin = () => {
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
            <Card key={index} className="bg-white border border-gray-200 shadow-sm rounded-2xl">
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
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Admin