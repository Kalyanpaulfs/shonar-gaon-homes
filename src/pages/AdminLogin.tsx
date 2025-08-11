import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Home } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/admin-dashboard';
    } catch (error) {
      setError('Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // SECURITY CHECK: Verify if user is authorized admin
      const isAuthorizedAdmin = await checkAdminAuthorization(user);
      
      if (!isAuthorizedAdmin) {
        // Sign out the user immediately if not authorized
        await auth.signOut();
        setError('Access denied. You are not authorized to access the admin panel.');
        return;
      }
      
      console.log('Authorized admin login successful:', user.email);
      window.location.href = '/admin-dashboard';
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else {
        setError('Google login failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // SECURITY FUNCTION: Check if user is authorized admin
  const checkAdminAuthorization = async (user) => {
    try {
      // Method 1: Check against predefined admin emails
      const authorizedAdmins = [
        'paulkalyan3@gmail.com', // Add your authorized admin emails here
        
      ];
      
      // Method 2: Domain restriction (uncomment if you want domain-based access)
      // const authorizedDomains = ['sonargaon.com', 'yourcompany.com'];
      // const emailDomain = user.email.split('@')[1];
      // if (!authorizedDomains.includes(emailDomain)) {
      //   return false;
      // }
      
      // Method 3: Check against Firestore admin collection (recommended for production)
      /*
      import { doc, getDoc } from 'firebase/firestore';
      import { db } from '../firebase'; // Make sure to import your Firestore instance
      
      const adminDoc = await getDoc(doc(db, 'authorized_admins', user.uid));
      if (!adminDoc.exists()) {
        return false;
      }
      
      const adminData = adminDoc.data();
      return adminData.isActive === true && adminData.role === 'admin';
      */
      
      // For now, using email whitelist (Method 1)
      return authorizedAdmins.includes(user.email.toLowerCase());
      
    } catch (error) {
      console.error('Error checking admin authorization:', error);
      return false; // Deny access if there's an error
    }
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-pink-500/15 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl animate-bounce"></div>

      {/* Home button */}
      <button
        onClick={goToHome}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105 group"
      >
        <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-slate-200/80 text-sm">Sonar Gaon Bungalow Project</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {googleLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
                      Signing in with Google...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-slate-500 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  <input
                    type="email"
                    placeholder="admin@sonargaon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-700 placeholder-slate-400 group-hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-700 placeholder-slate-400 group-hover:border-slate-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailLogin(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Email Login Button */}
              <button
                onClick={handleEmailLogin}
                disabled={loading || googleLoading || !email || !password}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Sign In with Email
                    </>
                  )}
                </span>
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-300 underline-offset-4 hover:underline">
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                Authorized personnel only. All access attempts are logged.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure Admin Access Portal</span>
          </div>
        </div>
      </div>

      {/* Custom animations and styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-up {
            from { 
              transform: translateY(30px); 
              opacity: 0; 
            }
            to { 
              transform: translateY(0); 
              opacity: 1; 
            }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            }
            50% { 
              transform: translateY(-20px) rotate(3deg); 
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-out;
          }
          
          /* Enhanced input focus effects */
          .group:focus-within .absolute {
            transform: translateY(-50%) scale(1.1);
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(148, 163, 184, 0.1);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 3px;
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
        `
      }} />
    </div>
  );
};

export default AdminLogin;