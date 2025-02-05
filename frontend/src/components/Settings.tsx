

export default function Settings() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Preferences
            </label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2" title="notification">
              <option>Email</option>
              <option>SMS</option>
              <option>Push Notifications</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2" title="theme">
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <button onClick={() => {window.location.reload(); }} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
