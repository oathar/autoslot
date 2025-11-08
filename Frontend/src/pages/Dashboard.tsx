import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, FileText, RefreshCw, Download, Plus } from "lucide-react";

// Mock data - in a real app, this would come from an API
const todaySchedule = [
  { time: "09:00 - 10:00", subject: "Mathematics", room: "Room 101", class: "B.Ed. Sem 2" },
  { time: "10:00 - 11:00", subject: "Physics", room: "Lab 1", class: "M.Ed. Sem 1" },
  { time: "11:30 - 12:30", subject: "Chemistry", room: "Room 203", class: "FYUP Year 1" },
  { time: "14:00 - 15:00", subject: "Biology", room: "Lab 2", class: "ITEP Batch A" },
];

const recentRequests = [
  { id: 1, type: "Swap Period", from: "Dr. Smith", status: "pending", time: "2 hours ago" },
  { id: 2, type: "Leave Request", from: "Prof. Johnson", status: "approved", time: "1 day ago" },
  { id: 3, type: "Take Period", from: "Dr. Wilson", status: "pending", time: "3 hours ago" },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("Dashboard - Retrieved user data:", userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Set a default user for demo purposes
        setUser({ name: "Arg", role: "HOD", email: "demo@college.edu" });
      }
    } else {
      // Set a default user for demo purposes when no user data is found
      setUser({ name: "Arg", role: "HOD", email: "demo@college.edu" });
    }
    
    setIsLoading(false);
  }, []);

  const handleQuickAction = (action: string) => {
    console.log(`${action} process started successfully.`);
    // You can implement actual toast functionality later
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Good morning, {user.name}!</h1>
          <p className="text-gray-600">
            Here's your schedule for today, {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Classes</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{todaySchedule.length}</div>
                <p className="text-xs text-gray-500">Scheduled periods</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {recentRequests.filter(r => r.status === "pending").length}
                </div>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Next Class</CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">09:00</div>
                <p className="text-xs text-gray-500">Mathematics - Room 101</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Free Periods</CardTitle>
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">2</div>
                <p className="text-xs text-gray-500">Available today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    Today's Schedule
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-600">Your teaching schedule for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySchedule.map((item, index) => (
                      <div key={index} className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                                {item.time}
                              </Badge>
                              <span className="font-medium text-gray-900">{item.subject}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.room} • {item.class}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-orange-100">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Requests */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600">Common tasks and requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50" 
                    variant="outline"
                    onClick={() => handleQuickAction("Raise Request")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Raise Request
                  </Button>
                  <Button 
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50" 
                    variant="outline"
                    onClick={() => handleQuickAction("Swap Period")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Swap Period
                  </Button>
                  <Button 
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50" 
                    variant="outline"
                    onClick={() => handleQuickAction("View Requests")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View All Requests
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Requests */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Requests</CardTitle>
                  <CardDescription className="text-gray-600">Latest activity from colleagues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{request.type}</p>
                          <p className="text-xs text-gray-500">
                            {request.from} • {request.time}
                          </p>
                        </div>
                        <Badge 
                          variant={request.status === "pending" ? "default" : "secondary"}
                          className={request.status === "pending" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
}