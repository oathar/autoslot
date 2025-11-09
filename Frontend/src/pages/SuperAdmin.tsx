import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, FileText, Database, Shield, Users, Calendar, FolderOpen, Settings } from "lucide-react";
import axios from 'axios';

const SuperAdmin = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState<number | null>(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:5858/documents', {
        withCredentials: true
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post('http://localhost:5858/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Upload response:', response.data);
      setSelectedFile(null);
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleExtract = async (documentId: number) => {
    setExtracting(documentId);
    
    try {
      const response = await axios.post(`http://localhost:5858/documents/extract/${documentId}`, {}, {
        withCredentials: true
      });
      
      console.log('Extract response:', response.data);
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error('Error extracting document:', error);
    } finally {
      setExtracting(null);
    }
  };

  const adminActions = [
    { title: "User Management", description: "Manage faculty and staff accounts", icon: Users, color: "bg-blue-500" },
    { title: "Schedule Settings", description: "Configure timetable parameters", icon: Calendar, color: "bg-green-500" },
    { title: "Request Management", description: "Oversee all period requests", icon: FileText, color: "bg-yellow-500" },
    { title: "System Settings", description: "Configure application settings", icon: Settings, color: "bg-purple-500" },
    { title: "Data Management", description: "Backup and restore data", icon: Database, color: "bg-indigo-500" },
    { title: "Security Settings", description: "Manage access and permissions", icon: Shield, color: "bg-red-500" },
    { title: "Document Management", description: "Upload and extract PDF documents", icon: FolderOpen, color: "bg-teal-500" },
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
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
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

        {/* Document Upload Section */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Document Management</CardTitle>
            <CardDescription className="text-gray-600">
              Upload PDF documents and extract data into the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Upload Form */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
                {documents.length === 0 ? (
                  <p className="text-gray-500">No documents uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((document) => (
                      <Card key={document.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="font-medium text-gray-900 truncate">{document.filename}</h4>
                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                document.extracted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {document.extracted ? 'Extracted' : 'Pending'}
                              </span>
                              <Button
                                onClick={() => handleExtract(document.id)}
                                disabled={document.extracted || extracting === document.id}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                {extracting === document.id ? 'Extracting...' : 'Extract Data'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Super Administrative Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Quick access to common super administrative tasks
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
      </div>
    </main>
  );
};

export default SuperAdmin;