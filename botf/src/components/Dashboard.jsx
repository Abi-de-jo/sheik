import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllUsers, getAllProperties } from "../utils/api";

function Dashboard() {
  const [chartData, setChartData] = useState([]); // Combined chart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmails, setUserEmails] = useState([]); // User email list
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]); // Specific user property data

  // Fetch user and property data for the main chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const users = await getAllUsers();
        const emails = users.map((user) => user.email || "Unknown");
        setUserEmails(emails);

        // Aggregate user roles
        const userRoles = users.reduce((acc, user) => {
          const role = user.role || "Unknown";
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});

        // Fetch all properties
        const properties = await getAllProperties();
        const propertyStatuses = properties.reduce((acc, property) => {
          const status = property.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Combine user roles and property statuses into chart data
        const combinedData = [];
        const allKeys = new Set([...Object.keys(userRoles), ...Object.keys(propertyStatuses)]);
        allKeys.forEach((key) => {
          combinedData.push({
            name: key,
            Users: userRoles[key] || 0,
            Properties: propertyStatuses[key] || 0,
          });
        });

        setChartData(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle click on user to fetch user-specific property data
  const handleUserClick = async (teleNumber) => {
    setSelectedUser(teleNumber);
    setError(null); // Clear previous errors

    try {
      const properties = await getAllProperties();
      const userProperties = properties.filter(
        (property) => property.email === teleNumber
      );

      const propertyStatuses = userProperties.reduce((acc, property) => {
        const status = property.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const userData = Object.keys(propertyStatuses).map((status) => ({
        name: status,
        Properties: propertyStatuses[status],
      }));

      setSelectedUserData(userData);
    } catch (err) {
      console.error("Error fetching user-specific data:", err);
      setError("Failed to fetch user-specific properties.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Dashboard
      </h1>

      {/* Combined Chart Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          User Roles & Property Status Overview
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="Users" fill="#4caf50" barSize={30} />
            <Bar dataKey="Properties" fill="#3b82f6" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Email List */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">User List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userEmails.map((teleNumber) => (
            <button
              key={teleNumber}
              onClick={() => handleUserClick(teleNumber)}
              className={`p-4 text-center rounded-lg shadow-md ${
                selectedUser === teleNumber
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              } hover:bg-blue-200 transition`}
            >
              {teleNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Selected User Properties */}
      {selectedUser && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Properties for {selectedUser}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={selectedUserData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Properties" fill="#ff7300" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
