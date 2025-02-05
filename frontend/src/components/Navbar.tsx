import { Bell, Search, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import NotificationPanel from './NotificationPanel';
import SettingsPanel from './Settings';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Listen for new notifications
    const handleNewNotification = () => {
      setNotificationCount(prev => prev + 1);
      setShowNotifications(true);
    };

    window.addEventListener('newNotification', handleNewNotification);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">ProjectHub</h1>
            <div className="ml-10 flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
              title='Notifications'
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowSettings(!showSettings)}
              title='Settings'
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-blue-600 hover:underline" title='Logout'>
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {showNotifications && <NotificationPanel />}
      {showSettings && <SettingsPanel />}
    </nav>
  );
}