import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { FileText, Plus, RefreshCw } from "lucide-react";

const Requests = () => {
  // Mock data - in a real app, this would come from an API
  const requests = [
    { id: 1, type: "Swap Period", from: "Dr. Smith", status: "pending", time: "2 hours ago", details: "Mathematics with Physics" },
    { id: 2, type: "Leave Request", from: "Prof. Johnson", status: "approved", time: "1 day ago", details: "Medical appointment" },
    { id: 3, type: "Take Period", from: "Dr. Wilson", status: "pending", time: "3 hours ago", details: "Chemistry - Room 203" },
    { id: 4, type: "Swap Period", from: "Dr. Brown", status: "rejected", time: "2 days ago", details: "Biology with English" },
  ];

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
            <p className="text-gray-600">
              Manage period swaps, leave requests, and substitutions
            </p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {requests.filter(r => r.status === "pending").length}
              </div>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              <RefreshCw className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {requests.filter(r => r.status === "approved").length}
              </div>
              <p className="text-xs text-gray-500">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
              <p className="text-xs text-gray-500">All requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">All Requests</CardTitle>
            <CardDescription className="text-gray-600">
              View and manage all period requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{request.type}</h3>
                        <Badge 
                          variant={request.status === "pending" ? "default" : request.status === "approved" ? "secondary" : "outline"}
                          className={
                            request.status === "pending" ? "bg-yellow-500 text-white" : 
                            request.status === "approved" ? "bg-green-500 text-white" : 
                            "bg-red-500 text-white"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{request.details}</p>
                      <p className="text-xs text-gray-500">
                        From {request.from} • {request.time}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Requests