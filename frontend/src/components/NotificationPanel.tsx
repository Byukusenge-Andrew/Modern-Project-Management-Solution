
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { formatRelativeTime } from '../utils/date';
import {  Check} from 'lucide-react';

export default function NotificationPanel() {
  const { user } = useAuthStore();
  const { notifications, markAsRead, clearAll } = useNotificationStore();

  const userNotifications = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {userNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          userNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                <button
                title='Mark as read'
                  onClick={() => markAsRead(notification.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <span className="text-xs text-gray-500 mt-2 block">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
      {userNotifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => clearAll(user?.id || '')}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}