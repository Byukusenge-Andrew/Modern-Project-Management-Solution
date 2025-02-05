import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Users, Clock, CheckCircle } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTimeTrackingStore } from '../store/timeTrackingStore';
import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();
  const { totalHours, fetchTimeStats } = useTimeTrackingStore();
  const { teamMembers, fetchTeamMembers } = useTeamStore();
  const navigate = useNavigate();
  const { setUser, login } = useAuthStore();

  useEffect(() => {
    // Check for user and token in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      // Parse the stored user data
      const user = JSON.parse(storedUser);

      // Update the auth store with the persisted user and token
      setUser(user);
      login(user, storedToken);

      // Fetch data if user and token are valid
      fetchProjects();
      fetchTimeStats();
      fetchTeamMembers();
    } else {
      // Redirect to login if no valid user or token
      navigate('/login');
    }
  }, [fetchProjects, fetchTimeStats, fetchTeamMembers, login, navigate, setUser]);

  const stats = [
    {
      name: 'Active Projects',
      value: projects.length,
      icon: PieChart,
      color: 'bg-blue-500',
      link: '/projects'
    },
    {
      name: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      color: 'bg-green-500',
      link: '/team'
    },
    {
      name: 'Hours Logged',
      value: Math.round(totalHours),
      icon: Clock,
      color: 'bg-purple-500',
      link: '/time-log'
    },
    {
      name: 'Tasks Completed',
      value: projects.reduce((acc, project) => 
        acc + project.tasks.filter(t => t.status === 'done').length, 0),
      icon: CheckCircle,
      color: 'bg-yellow-500',
      link: '/tasks'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              to={stat.link}
              key={stat.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Activity items would go here */}
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}