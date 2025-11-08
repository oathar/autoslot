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
      const response = await fetch("http://localhost:5000/users/signin", {
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

      const data = await response.json();

      if (response.ok) {
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
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F1]">
      <div className="w-full max-w-md bg-[#FFF7F1] rounded-2xl p-8 flex flex-col items-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#E9F1FF] p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#3B82F6]"
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
        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your timetable management account
        </p>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 w-120">
          <h3 className="text-xl font-bold text-center mb-1">Sign In</h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Enter your credentials to access your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Email Address</label>
              <div className="flex items-center border border-[#EDE4DC] rounded-lg px-3 bg-[#FFF7F1]">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 p-2 bg-transparent outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm mb-1">Password</label>
              <div className="flex items-center border border-[#EDE4DC] rounded-lg px-3 bg-[#FFF7F1]">
                <Lock className="h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 p-2 bg-transparent outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: demouser1@gmail.com</p>
            <p className="text-xs text-blue-700">Password: demouser@123</p>
            <p className="text-xs text-blue-600 mt-1">Make sure you've inserted this user in your database!</p>
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