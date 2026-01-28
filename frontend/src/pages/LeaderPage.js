/* "use client"

const LeaderPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Leader Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to the Leader Dashboard. Here you can manage helpers, events, and more.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Helper Management</h2>
          <p className="text-gray-600 mb-4">View and manage helper information.</p>
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Manage Helpers
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Event Management</h2>
          <p className="text-gray-600 mb-4">Create and manage events.</p>
          <button
            onClick={() => (window.location.href = "/events")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Manage Events
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Badge Management</h2>
          <p className="text-gray-600 mb-4">Manage badges and track achievements.</p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/admin/badges")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Manage Badges
            </button>
            <button
              onClick={() => (window.location.href = "/admin/achievements")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Track Achievements
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Photo Management</h2>
          <p className="text-gray-600 mb-4">Upload and manage photos.</p>
          <button
            onClick={() => (window.location.href = "/photos")}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            Manage Photos
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeaderPage
 */