import { Bell, LogOut, User, Calendar, FileText, Settings, X, Check, Trash2, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { api } from "../../utils/api";
import toast from 'react-hot-toast';

interface HeaderProps {
  userRole: string;
  userName: string;
  pendingRequests?: number;
}

export function Header({ userRole, userName, pendingRequests = 0 }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const teacherId = user.id;

  useEffect(() => {
    if (teacherId) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [teacherId]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications(teacherId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadCount(teacherId);
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await api.markAsRead(notificationId);
      await fetchNotifications();
      await fetchUnreadCount();
      toast.success('Notification marked as read', {
        icon: '✓',
        style: { background: '#10B981', color: '#fff', padding: '12px', borderRadius: '8px' },
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead(teacherId);
      await fetchNotifications();
      await fetchUnreadCount();
      toast.success('All notifications marked as read', {
        icon: '✓✓',
        style: { background: '#10B981', color: '#fff', padding: '12px', borderRadius: '8px' },
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await api.deleteNotification(notificationId);
      await fetchNotifications();
      await fetchUnreadCount();
      toast.success('Notification deleted', {
        icon: '🗑️',
        style: { background: '#EF4444', color: '#fff', padding: '12px', borderRadius: '8px' },
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '❌';
      case 'REQUEST': return '📝';
      case 'APPROVAL': return '✅';
      case 'REJECTION': return '❌';
      case 'REMINDER': return '⏰';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'from-green-50 to-green-100 border-green-200';
      case 'WARNING': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'ERROR': return 'from-red-50 to-red-100 border-red-200';
      case 'REQUEST': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'APPROVAL': return 'from-green-50 to-green-100 border-green-200';
      case 'REJECTION': return 'from-red-50 to-red-100 border-red-200';
      case 'REMINDER': return 'from-purple-50 to-purple-100 border-purple-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Calendar },
    { name: "Timetable", href: "/timetable", icon: Calendar },
    { name: "Requests", href: "/requests", icon: FileText },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm animate-fadeIn">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform transition-transform group-hover:rotate-12">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AutoSlot</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 animate-slideInLeft stagger-${index + 1} ${
                location.pathname === item.href
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) {
                  fetchNotifications();
                }
              }}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-50 animate-scaleIn max-h-[500px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between rounded-t-xl">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 h-8 px-2 text-xs"
                        onClick={handleMarkAllAsRead}
                      >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No notifications</p>
                      <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                            !notification.read 
                              ? `bg-gradient-to-r ${getNotificationColor(notification.type)} shadow-md hover:shadow-lg`
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-semibold ${
                                    !notification.read ? 'text-gray-900' : 'text-gray-600'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${
                                    !notification.read ? 'text-gray-700' : 'text-gray-500'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-green-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification.id);
                                      }}
                                    >
                                      <Check className="h-3 w-3 text-green-600" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-red-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notification.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 hover:bg-gray-100 transition-all duration-300"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-md transform transition-transform hover:scale-110">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </Button>
            
            {/* Simple User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-scaleIn">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center transition-all duration-200 rounded-lg mx-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}