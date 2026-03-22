import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-gray-200">

      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <Car className="w-5 h-5 text-white" />
              </div>

              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ParkSmart
              </span>
            </Link>

            <p className="text-sm text-gray-600 leading-relaxed">
              Find and book parking spaces near you. Smart parking for smart cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <Link to="/" className="block hover:text-blue-600 transition">Home</Link>
              <Link to="/login" className="block hover:text-blue-600 transition">Login</Link>
              <Link to="/register" className="block hover:text-blue-600 transition">Register</Link>
            </div>
          </div>

          {/* Provider Links */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">For Providers</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <Link to="/register" className="block hover:text-blue-600 transition">List Your Space</Link>
              <Link to="/provider/dashboard" className="block hover:text-blue-600 transition">Provider Dashboard</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Contact</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>support@parksmart.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © 2026 <span className="font-semibold text-gray-700">QuickPark</span>. All rights reserved.
        </div>

      </div>
    </footer>
  );
}