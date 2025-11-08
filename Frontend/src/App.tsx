import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Requests from "./pages/Requests";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Component to handle layout with header
function AppLayout() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    
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

    // Mock pending requests - in a real app, this would come from an API
    setPendingRequests(2);
  }, []);

  // Show header for all routes except login
  const showHeader = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && user && (
        <Header 
          userRole={user.role} 
          userName={user.name}
          pendingRequests={pendingRequests}
        />
      )}
      
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Main App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/admin" element={<Admin />} />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;