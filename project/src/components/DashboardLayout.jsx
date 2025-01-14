import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
            <h2 className="text-xl font-semibold text-white">Sistem Parkir</h2>
          </div>
          
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-1">
              {user.role === 'admin' && (
                <>
                  <a href="/admin/dashboard" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Dashboard</span>
                  </a>
                  <a href="/admin/users" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Manajemen User</span>
                  </a>
                  <a href="/admin/logs" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Log Aktivitas</span>
                  </a>
                </>
              )}

              {user.role === 'manager' && (
                <>
                  <a href="/manager/dashboard" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Dashboard</span>
                  </a>
                  <a href="/manager/parking-slots" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Slot Parkir</span>
                  </a>
                  <a href="/manager/reservations" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Reservasi</span>
                  </a>
                </>
              )}

              {user.role === 'user' && (
                <>
                  <a href="/dashboard" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Dashboard</span>
                  </a>
                  <a href="/reservations" 
                     className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                    <span>Reservasi Saya</span>
                  </a>
                </>
              )}
            </nav>
          </div>

          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-blue-300">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout; 