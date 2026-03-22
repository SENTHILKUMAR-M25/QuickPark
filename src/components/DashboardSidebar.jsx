import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardSidebar({ items, title, collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col backdrop-blur-xl bg-white/70 border-r border-white/30 shadow-md transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/30">
        {!collapsed && (
          <span className="font-semibold text-gray-800 text-sm truncate">
            {title}
          </span>
        )}

        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">

        {items.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />

              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </RouterNavLink>
          );
        })}

      </nav>
    </aside>
  );
}