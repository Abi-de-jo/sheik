import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { getAllUsers } from "../utils/api";

function AllAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const users = await getAllUsers();
console.log(users)
        // Filter users who have "geomap" in their email
        const geomapUsers = users.filter((user) => user.email?.includes("geomap"));

        setAgents(geomapUsers); // Set filtered users
      } catch (err) {
        console.error(err);
        setError("Failed to fetch agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentClick = (email) => {
    navigate(`/profile/${email}`); // Redirect to the agent's profile
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading agents...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Agents with Geomap</h1>
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent.email)} // Click handler for redirection
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition cursor-pointer"
            >
              {/* Extract name from email if not provided */}
              <h2 className="text-xl font-semibold text-gray-800">
               </h2>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Email:</span> {agent.email}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Role:</span> Agent
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Telegram no:</span> {agent.teleNumber}
              </p>
              
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No agents found with geomap in their email.</p>
      )}
    </div>
  );
}

export default AllAgents;
