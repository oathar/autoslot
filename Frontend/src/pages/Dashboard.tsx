import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, FileText, RefreshCw, Download, Plus, X, Users, BookOpen, MapPin, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast, { Toaster } from 'react-hot-toast';
import { api } from "../utils/api";

// Mock data - in a real app, this would come from an API
const todaySchedule = [
  { time: "09:00 - 10:00", subject: "Mathematics", room: "Room 101", class: "B.Ed. Sem 2" },
  { time: "10:00 - 11:00", subject: "Physics", room: "Lab 1", class: "M.Ed. Sem 1" },
  { time: "11:30 - 12:30", subject: "Chemistry", room: "Room 203", class: "FYUP Year 1" },
  { time: "14:00 - 15:00", subject: "Biology", room: "Lab 2", class: "ITEP Batch A" },
];

const recentRequests = [
  { 
    id: 1, 
    type: "Swap Period", 
    from: "Dr. Smith", 
    status: "pending", 
    time: "2 hours ago",
    details: {
      originalPeriod: "Tuesday, 10:00 - 11:00 AM",
      originalSubject: "Physics",
      originalRoom: "Lab 1",
      swapPeriod: "Wednesday, 02:00 - 03:00 PM",
      swapSubject: "Mathematics",
      swapRoom: "Room 101",
      reason: "Medical appointment scheduled"
    }
  },
  { 
    id: 2, 
    type: "Leave Request", 
    from: "Prof. Johnson", 
    status: "approved", 
    time: "1 day ago",
    details: {
      leaveDate: "Jan 15, 2025",
      leaveDuration: "Full Day",
      reason: "Personal emergency",
      coverageArranged: "Dr. Williams",
      affectedClasses: ["Chemistry - B.Ed Sem 1", "Organic Chemistry - M.Ed"]
    }
  },
  { 
    id: 3, 
    type: "Take Period", 
    from: "Dr. Wilson", 
    status: "pending", 
    time: "3 hours ago",
    details: {
      periodTime: "Friday, 11:30 AM - 12:30 PM",
      subject: "Biology",
      room: "Lab 2",
      class: "ITEP Batch A",
      reason: "Covering for absent colleague",
      originalTeacher: "Dr. Brown"
    }
  },
];

interface ScheduleDetail {
  time: string;
  subject: string;
  room: string;
  class: string;
  teacher?: string;
  students?: number;
  syllabus?: string;
  attendanceMarked?: boolean;
  totalLectures?: number;
  completedLectures?: number;
  nextTopic?: string;
  resources?: Array<{
    name: string;
    type: 'pdf' | 'doc' | 'link' | 'video';
    size?: string;
    url?: string;
  }>;
}

interface RequestDetail {
  id: number;
  type: string;
  from: string;
  status: string;
  time: string;
  details: any;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDetail | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [requests, setRequests] = useState<typeof recentRequests>([]);
  const [schedules, setSchedules] = useState<typeof todaySchedule>(todaySchedule);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string>('');
  const scheduleRef = useRef<HTMLDivElement>(null);

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
        setUser({ id: 1, name: "Arg", role: "HOD", email: "demo@college.edu" });
      }
    } else {
      // Set a default user for demo purposes when no user data is found
      setUser({ id: 1, name: "Arg", role: "HOD", email: "demo@college.edu" });
    }
    
    // Fetch requests from API
    fetchRequests();
    
    setIsLoading(false);
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.getAllRequests();
      // Map API response to match component structure
      const mappedRequests = data.map((req: any) => ({
        id: req.id,
        type: req.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        from: req.from.username,
        status: req.status.toLowerCase(),
        time: getTimeAgo(new Date(req.created_at)),
        details: req.details,
      }));
      setRequests(mappedRequests.length > 0 ? mappedRequests : recentRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests(recentRequests); // Fallback to mock data
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleQuickAction = (action: string) => {
    setQuickActionType(action);
    setShowQuickActionModal(true);
  };

  const handleSubmitQuickAction = async (actionData: any) => {
    try {
      if (quickActionType === 'Raise Request' || quickActionType === 'Swap Period') {
        await toast.promise(
          api.createRequest({
            type: actionData.type || 'SWAP_PERIOD',
            from_id: user?.id || 1,
            details: actionData,
          }),
          {
            loading: 'Creating request...',
            success: () => {
              setShowQuickActionModal(false);
              fetchRequests(); // Refresh requests
              return 'Request created successfully! ✓';
            },
            error: 'Failed to create request',
          },
          {
            style: { padding: '16px', borderRadius: '12px' },
            success: { icon: '✅', style: { background: '#10B981', color: '#fff' } },
          }
        );
      } else {
        toast.success(`${quickActionType} initiated!`, {
          duration: 3000,
          position: 'top-right',
          icon: '🚀',
          style: { background: '#10B981', color: '#fff', padding: '16px', borderRadius: '12px' },
        });
        setShowQuickActionModal(false);
      }
    } catch (error) {
      console.error('Error in quick action:', error);
    }
  };

  const handleViewDetails = (schedule: typeof todaySchedule[0]) => {
    // Check if attendance was already marked for this schedule
    const hasAttendance = false; // In real app, check from schedule.attendances array
    
    const detailedSchedule: ScheduleDetail = {
      ...schedule,
      teacher: user?.name || "Dr. Smith",
      students: Math.floor(Math.random() * 30) + 20,
      syllabus: "Chapter 5: Advanced Concepts",
      attendanceMarked: hasAttendance,
      totalLectures: 40,
      completedLectures: 26,
      nextTopic: "Applications and Problem Solving",
      resources: [
        {
          name: "Lecture Notes - Chapter 5.pdf",
          type: 'pdf',
          size: "2.4 MB",
          url: "/resources/lecture-notes-ch5.pdf"
        },
        {
          name: "Practice Problems Set 3",
          type: 'doc',
          size: "1.1 MB",
          url: "/resources/practice-problems-3.docx"
        },
        {
          name: "Reference: Advanced Mathematics Textbook",
          type: 'link',
          url: "https://example.com/textbook"
        },
        {
          name: "Video Tutorial - Chapter 5",
          type: 'video',
          size: "45 MB",
          url: "/resources/video-ch5.mp4"
        }
      ]
    };
    setSelectedSchedule(detailedSchedule);
    setAttendanceMarked(hasAttendance);
    setShowModal(true);
  };

  const handleExportPDF = async () => {
    const loadingToast = toast.loading('Generating PDF...', {
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
      },
    });

    try {
      if (!scheduleRef.current) {
        toast.error('Schedule not found!', { id: loadingToast });
        return;
      }

      // Create a temporary container for PDF generation
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '800px';
      pdfContent.style.padding = '40px';
      pdfContent.style.backgroundColor = '#ffffff';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      
      pdfContent.innerHTML = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">Today's Schedule</h1>
          <p style="color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Teacher: ${user?.name || 'Dr. Smith'}</p>
        </div>
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
          ${todaySchedule.map((item, index) => `
            <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #FDE68A;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                  <span style="background: #fff; color: #92400E; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid #FCD34D;">
                    ${item.time}
                  </span>
                </div>
              </div>
              <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${item.subject}</h3>
              <p style="color: #4b5563; font-size: 14px; margin-bottom: 4px;"><strong>Room:</strong> ${item.room}</p>
              <p style="color: #4b5563; font-size: 14px;"><strong>Class:</strong> ${item.class}</p>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Generated by AutoSlot - AI-Powered Timetable Management</p>
          <p style="margin-top: 4px;">© ${new Date().getFullYear()} - All rights reserved</p>
        </div>
      `;
      
      document.body.appendChild(pdfContent);

      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: 800
      });
      
      document.body.removeChild(pdfContent);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `schedule-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF exported successfully! 🎉', {
        id: loadingToast,
        duration: 4000,
        icon: '📄',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.', {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedSchedule || !user || attendanceMarked) return;
    
    try {
      const result = await toast.promise(
        api.markAttendance({
          schedule_id: 1, // This should come from selectedSchedule.id when available
          teacher_id: user.id || 1,
          present: selectedSchedule.students || 0,
          absent: 0,
          remarks: "Attendance marked via dashboard",
        }),
        {
          loading: 'Marking attendance...',
          success: 'Attendance marked successfully! ✓',
          error: 'Failed to mark attendance',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '✅', style: { background: '#10B981', color: '#fff' } },
          loading: { style: { background: '#3B82F6', color: '#fff' } },
        }
      );
      
      // Update state to prevent re-marking
      setAttendanceMarked(true);
      
      // Update the schedule in state to reflect attendance marked
      if (selectedSchedule) {
        setSelectedSchedule({
          ...selectedSchedule,
          attendanceMarked: true,
        });
      }
      
      // Update the schedules array to mark this schedule as having attendance
      setSchedules(prevSchedules => 
        prevSchedules.map(s => 
          s.time === selectedSchedule.time && s.subject === selectedSchedule.subject
            ? { ...s, attendanceMarked: true }
            : s
        )
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleRequestClick = (request: typeof recentRequests[0]) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest || !user) return;
    
    try {
      await toast.promise(
        api.approveRequest(selectedRequest.id, user.id || 1),
        {
          loading: 'Processing request...',
          success: `${selectedRequest.type} approved successfully! ✓`,
          error: 'Failed to approve request',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '✅', style: { background: '#10B981', color: '#fff' } },
        }
      );
      
      setShowRequestModal(false);
      
      // Update the request in state immediately
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      // Fetch fresh data from server
      await fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !user) return;
    
    try {
      await toast.promise(
        api.rejectRequest(selectedRequest.id, user.id || 1),
        {
          loading: 'Processing request...',
          success: `${selectedRequest.type} rejected.`,
          error: 'Failed to reject request',
        },
        {
          style: { padding: '16px', borderRadius: '12px' },
          success: { icon: '🚫', style: { background: '#EF4444', color: '#fff' } },
        }
      );
      
      setShowRequestModal(false);
      
      // Update the request in state immediately
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'rejected' }
            : req
        )
      );
      
      // Fetch fresh data from server
      await fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleDownloadResource = (resource: any) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Downloading ${resource.name}...`,
        success: () => {
          // In a real app, this would trigger actual download
          return `${resource.name} downloaded successfully!`;
        },
        error: 'Download failed',
      },
      {
        style: {
          padding: '16px',
          borderRadius: '12px',
        },
        success: {
          icon: '📥',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        },
        loading: {
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        },
      }
    );
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'video':
        return '🎥';
      case 'link':
        return '🔗';
      default:
        return '📎';
    }
  };

  const handleCardClick = (cardType: string) => {
    switch(cardType) {
      case 'classes':
        toast(
          <div>
            <p className="font-bold text-gray-900 mb-1">Today's Classes</p>
            <p className="text-sm text-gray-600">Total: {schedules.length} scheduled periods</p>
            <p className="text-xs text-gray-500 mt-1">Click to view full schedule</p>
          </div>,
          {
            duration: 3000,
            icon: '📚',
            style: {
              background: '#fff',
              color: '#1f2937',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #E5E7EB',
              cursor: 'pointer',
            },
            onClick: () => window.location.href = '/timetable',
          }
        );
        break;
      case 'requests':
        const pendingCount = requests.filter(r => r.status === "pending").length;
        toast(
          <div>
            <p className="font-bold text-yellow-700 mb-1">Pending Requests</p>
            <p className="text-sm text-gray-600">{pendingCount} requests awaiting your approval</p>
            <p className="text-xs text-gray-500 mt-1">Click to manage requests</p>
          </div>,
          {
            duration: 3000,
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #FCD34D',
              cursor: 'pointer',
            },
            onClick: () => window.location.href = '/requests',
          }
        );
        break;
      case 'nextClass':
        const nextClass = schedules[0];
        toast(
          <div>
            <p className="font-bold text-gray-900 mb-1">Next Class: {nextClass?.time.split(' - ')[0] || '09:00'}</p>
            <p className="text-sm text-gray-600">{nextClass?.subject || 'Mathematics'} - {nextClass?.room || 'Room 101'}</p>
            <p className="text-xs text-gray-500 mt-1">{nextClass?.class || 'B.Ed. Sem 2'}</p>
          </div>,
          {
            duration: 3000,
            icon: '⏰',
            style: {
              background: '#DBEAFE',
              color: '#1E40AF',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #93C5FD',
            },
          }
        );
        break;
      case 'freePeriods':
        toast(
          <div>
            <p className="font-bold text-green-700 mb-1">Free Periods: 2</p>
            <p className="text-sm text-gray-600">Available for substitution or meetings</p>
            <p className="text-xs text-gray-500 mt-1">12:30 PM - 2:00 PM</p>
          </div>,
          {
            duration: 3000,
            icon: '✨',
            style: {
              background: '#D1FAE5',
              color: '#065F46',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #6EE7B7',
            },
          }
        );
        break;
    }
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
            <Card 
              className="bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick('classes')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Classes</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{schedules.length}</div>
                <p className="text-xs text-gray-500">Scheduled periods</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick('requests')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {requests.filter(r => r.status === "pending").length}
                </div>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick('nextClass')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Next Class</CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">09:00</div>
                <p className="text-xs text-gray-500">Mathematics - Room 101</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick('freePeriods')}
            >
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handleExportPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-600">Your teaching schedule for today</CardDescription>
                </CardHeader>
                <CardContent ref={scheduleRef}>
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-600 hover:text-gray-800 hover:bg-orange-100"
                              onClick={() => handleViewDetails(item)}
                            >
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
                    onClick={() => window.location.href = '/requests'}
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
                    {requests.map((request) => (
                      <div 
                        key={request.id} 
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
                        onClick={() => handleRequestClick(request)}
                      >
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

        {/* Details Modal */}
        {showModal && selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Class Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowModal(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Time & Subject */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-sm border-orange-300 text-orange-700 bg-white px-3 py-1">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      {selectedSchedule.time}
                    </Badge>
                    <Badge className={attendanceMarked ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                      {attendanceMarked ? "Attendance Marked" : "Scheduled"}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {selectedSchedule.subject}
                  </h3>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-700 font-medium">Class/Program</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedSchedule.class}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-sm text-purple-700 font-medium">Room</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedSchedule.room}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-sm text-green-700 font-medium">Teacher</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedSchedule.teacher}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-pink-600 mr-2" />
                      <p className="text-sm text-pink-700 font-medium">Students Enrolled</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedSchedule.students}</p>
                  </div>
                </div>

                {/* Syllabus Progress */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                      <p className="text-sm text-indigo-700 font-semibold">Course Progress</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">
                      {selectedSchedule.completedLectures}/{selectedSchedule.totalLectures} Lectures
                    </span>
                  </div>
                  
                  <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase">Current Topic:</p>
                  <p className="text-lg font-bold text-gray-900 mb-3">{selectedSchedule.syllabus}</p>
                  
                  <div className="w-full bg-indigo-200 rounded-full h-3 mb-2 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(selectedSchedule.completedLectures! / selectedSchedule.totalLectures!) * 100}%` }}
                    >
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-indigo-700 font-medium">
                    {Math.round((selectedSchedule.completedLectures! / selectedSchedule.totalLectures!) * 100)}% syllabus completed
                  </p>
                  
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase">Next Topic:</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedSchedule.nextTopic}</p>
                  </div>
                </div>

                {/* Learning Resources */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Download className="h-5 w-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-700 font-semibold">Learning Resources</p>
                  </div>
                  <div className="space-y-2">
                    {selectedSchedule.resources?.map((resource, index) => (
                      <div 
                        key={index} 
                        className="group flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleDownloadResource(resource)}
                      >
                        <div className="flex items-center flex-1">
                          <span className="text-2xl mr-3">{getResourceIcon(resource.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                              {resource.name}
                            </p>
                            {resource.size && (
                              <p className="text-xs text-gray-500 mt-0.5">{resource.size}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {resource.type === 'link' ? (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                              Open Link
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                              Download
                            </Badge>
                          )}
                          <Download className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-all"
                      onClick={() => toast.success('Upload functionality coming soon!', {
                        icon: '📤',
                        style: {
                          background: '#3B82F6',
                          color: '#fff',
                          padding: '16px',
                          borderRadius: '12px',
                        },
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Resource
                    </Button>
                  </div>
                </div>

                {/* Attendance Status */}
                {attendanceMarked && (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">Attendance Marked Successfully</p>
                      <p className="text-sm text-green-600">All students present: {selectedSchedule.students}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleMarkAttendance}
                    disabled={attendanceMarked}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all"
                    onClick={() => toast.success('Full details view coming soon!', {
                      icon: '🔍',
                      style: {
                        background: '#3B82F6',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                      },
                    })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Request Details Modal */}
        {showRequestModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.type}</h2>
                  <p className="text-sm text-gray-500 mt-1">From: {selectedRequest.from}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowRequestModal(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedRequest.time}</span>
                  </div>
                  <Badge 
                    className={selectedRequest.status === "pending" 
                      ? "bg-yellow-500 text-white text-sm px-4 py-1" 
                      : "bg-green-500 text-white text-sm px-4 py-1"}
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>

                {/* Swap Period Details */}
                {selectedRequest.type === "Swap Period" && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                      <p className="text-xs text-red-600 font-semibold mb-2 uppercase">Original Period</p>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-semibold text-gray-900">Time:</span> {selectedRequest.details.originalPeriod}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Subject:</span> {selectedRequest.details.originalSubject}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Room:</span> {selectedRequest.details.originalRoom}</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <RefreshCw className="h-6 w-6 text-orange-500" />
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-2 uppercase">Swap With</p>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-semibold text-gray-900">Time:</span> {selectedRequest.details.swapPeriod}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Subject:</span> {selectedRequest.details.swapSubject}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Room:</span> {selectedRequest.details.swapRoom}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-2">REASON</p>
                      <p className="text-sm text-gray-800">{selectedRequest.details.reason}</p>
                    </div>
                  </div>
                )}

                {/* Leave Request Details */}
                {selectedRequest.type === "Leave Request" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                        <p className="text-xs text-purple-600 font-semibold mb-2">LEAVE DATE</p>
                        <p className="text-lg font-bold text-gray-900">{selectedRequest.details.leaveDate}</p>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                        <p className="text-xs text-indigo-600 font-semibold mb-2">DURATION</p>
                        <p className="text-lg font-bold text-gray-900">{selectedRequest.details.leaveDuration}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-2">REASON</p>
                      <p className="text-sm text-gray-800">{selectedRequest.details.reason}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-2">COVERAGE ARRANGED</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRequest.details.coverageArranged}</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                      <p className="text-xs text-orange-600 font-semibold mb-2">AFFECTED CLASSES</p>
                      <div className="space-y-1">
                        {selectedRequest.details.affectedClasses.map((cls: string, idx: number) => (
                          <p key={idx} className="text-sm text-gray-800">• {cls}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Take Period Details */}
                {selectedRequest.type === "Take Period" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-3 uppercase">Period Details</p>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-semibold text-gray-900">Time:</span> {selectedRequest.details.periodTime}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Subject:</span> {selectedRequest.details.subject}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Room:</span> {selectedRequest.details.room}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-900">Class:</span> {selectedRequest.details.class}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <p className="text-xs text-yellow-700 font-semibold mb-2">COVERING FOR</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRequest.details.originalTeacher}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-2">REASON</p>
                      <p className="text-sm text-gray-800">{selectedRequest.details.reason}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedRequest.status === "pending" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all"
                      onClick={handleApproveRequest}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 transition-all"
                      onClick={handleRejectRequest}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}

                {selectedRequest.status === "approved" && (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">Request Already Approved</p>
                      <p className="text-sm text-green-600">This request has been processed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Quick Action Modal */}
        {showQuickActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">{quickActionType}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQuickActionModal(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                {quickActionType === "Raise Request" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>Swap Period</option>
                        <option>Leave Request</option>
                        <option>Take Period</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        rows={3}
                        placeholder="Explain your request..."
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => handleSubmitQuickAction({ type: 'SWAP_PERIOD', reason: 'Test request' })}
                    >
                      Submit Request
                    </Button>
                  </div>
                )}
                
                {quickActionType === "Swap Period" && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                      <p className="text-xs text-red-600 font-semibold mb-2">YOUR PERIOD</p>
                      <select className="w-full p-2 border border-red-300 rounded-lg mb-2">
                        <option>Monday, 09:00 - 10:00 - Mathematics</option>
                        <option>Tuesday, 10:00 - 11:00 - Physics</option>
                        <option>Wednesday, 11:30 - 12:30 - Chemistry</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-center">
                      <RefreshCw className="h-6 w-6 text-orange-500" />
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-2">SWAP WITH</p>
                      <select className="w-full p-2 border border-green-300 rounded-lg mb-2">
                        <option>Monday, 14:00 - 15:00 - Biology</option>
                        <option>Tuesday, 14:00 - 15:00 - English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Swap</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        rows={2}
                        placeholder="Reason for swap request..."
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => handleSubmitQuickAction({ 
                        type: 'SWAP_PERIOD',
                        originalPeriod: 'Monday, 09:00 - 10:00',
                        swapPeriod: 'Monday, 14:00 - 15:00',
                        reason: 'Need to swap for appointment'
                      })}
                    >
                      Request Swap
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
  );
}