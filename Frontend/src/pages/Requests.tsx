import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { FileText, Plus, RefreshCw, X, Clock, CheckCircle } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { api } from "../utils/api";

const Requests = () => {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        setUser({ id: 1, name: "Arg", role: "HOD" });
      }
    } else {
      setUser({ id: 1, name: "Arg", role: "HOD" });
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllRequests();
      const mappedRequests = data.map((req: any) => ({
        id: req.id,
        type: req.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        from: req.from?.username || 'Unknown',
        status: req.status.toLowerCase(),
        time: getTimeAgo(new Date(req.created_at)),
        details: req.details,
        created_at: req.created_at,
      }));
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleApprove = async (requestId: number) => {
    try {
      await toast.promise(
        api.approveRequest(requestId, user?.id || 1),
        {
          loading: 'Approving request...',
          success: 'Request approved successfully! ✓',
          error: 'Failed to approve request',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '✅', style: { background: '#10B981', color: '#fff' } },
        }
      );
      await fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await toast.promise(
        api.rejectRequest(requestId, user?.id || 1),
        {
          loading: 'Rejecting request...',
          success: 'Request rejected.',
          error: 'Failed to reject request',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '🚫', style: { background: '#EF4444', color: '#fff' } },
        }
      );
      await fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      await toast.promise(
        api.createRequest({
          type: requestData.type,
          from_id: user?.id || 1,
          details: requestData.details,
        }),
        {
          loading: 'Creating request...',
          success: 'Request created successfully! ✓',
          error: 'Failed to create request',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '✅', style: { background: '#10B981', color: '#fff' } },
        }
      );
      await fetchRequests();
      setShowNewRequestModal(false);
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  return (
    <main className="container mx-auto px-6 py-8">
      <Toaster position="top-right" />
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
            <p className="text-gray-600">
              Manage period swaps, leave requests, and substitutions
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            onClick={() => setShowNewRequestModal(true)}
          >
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
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No requests found</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="p-4 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
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
                        <p className="text-sm text-gray-600">
                          {request.details?.reason || 'No details available'}
                        </p>
                        <p className="text-xs text-gray-500">
                          From {request.from} • {request.time}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                        >
                          View Details
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleReject(request.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.type}</h2>
                  <p className="text-sm text-gray-500 mt-1">From: {selectedRequest.from}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)} className="hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedRequest.time}</span>
                  </div>
                  <Badge className={selectedRequest.status === "pending" ? "bg-yellow-500 text-white" : selectedRequest.status === "approved" ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-2">DETAILS</p>
                  <p className="text-sm text-gray-800">{JSON.stringify(selectedRequest.details, null, 2)}</p>
                </div>
                {selectedRequest.status === "pending" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">New Request</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowNewRequestModal(false)} className="hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                    <option>Swap Period</option>
                    <option>Leave Request</option>
                    <option>Take Period</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                    rows={3}
                    placeholder="Explain your request..."
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  onClick={() => handleCreateRequest({ type: 'SWAP_PERIOD', details: { reason: 'Test request' } })}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Requests