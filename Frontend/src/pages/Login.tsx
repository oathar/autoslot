import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5858/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();

      // Store user data and token in localStorage
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        programs: data.user.programs,
        semester: data.user.semester,
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("Cannot connect to server. Please ensure the backend is running on http://localhost:5858");
      } else {
        setError("Network error. Please check your connection and ensure backend is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 px-4 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-6 animate-bounce">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slideInLeft">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-8 animate-slideInRight">
          Sign in to your timetable management account
        </p>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full border border-white/20 animate-scaleIn">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-900">Sign In</h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Enter your credentials to access your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-center gap-3 animate-slideInLeft shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600 animate-pulse" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5 transform transition-all duration-300 hover:scale-102">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 hover:shadow-md">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 ml-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6 transform transition-all duration-300 hover:scale-102">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 hover:shadow-md">
                <Lock className="h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 ml-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 btn-hover"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 animate-slideInRight shadow-md">
            <p className="text-xs text-blue-900 font-bold mb-2 flex items-center">
              <span className="h-2 w-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Demo Credentials:
            </p>
            <p className="text-xs text-blue-800 font-medium">Email: demouser1@gmail.com</p>
            <p className="text-xs text-blue-800 font-medium">Password: demouser@123</p>
            <p className="text-xs text-blue-700 mt-2 italic">Make sure you've inserted this user in your database!</p>
          </div>
          
          {/* Footer */}
          <p className="text-gray-400 text-xs text-center mt-4">
            Having trouble? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
}