import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hook';
import { logout } from '../redux/slices/authSlice';
import { Button } from './ui/Button';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'provider') return '/provider/dashboard';
    return '/user/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/30 shadow-sm">

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            QuickPark
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">
                  {user?.name}
                </span>

                <Button
                  size="icon"
                  className="bg-red-100 hover:bg-red-200 text-red-600 rounded-xl"
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl px-4 py-2">
                  Log In
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 py-2 hover:scale-105 transition">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-xl bg-white/80 border-t border-white/30 px-4 py-4 space-y-3 shadow-lg">

          <Link
            to="/"
            className="block py-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="block py-2 text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>

              <button
                className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                  setMobileOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="block py-2 text-blue-600 font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}