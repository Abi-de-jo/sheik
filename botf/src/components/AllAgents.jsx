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
        console.log(users);
        // Filter users who have "geomap" in their email
        const geomapUsers = users.filter((user) => user.email?.includes("rentintbilisi"));

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

  const handleAgentClick = (id) => {
    navigate(`/profile/${id}`);  
    console.log("hello", id)
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading agents...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Agents with RentInTbilisi</h1>
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent.id)} // Click handler for redirection
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition cursor-pointer"
            >
              <div className="flex items-center mb-4">
                {/* Extract initials from username */}
                <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-semibold mr-4">
                  {agent.username ? agent.username[0].toUpperCase() : "A"}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {agent.username || "Unnamed Agent"}
                </h2>
              </div>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Email:</span> {agent.email || "N/A"}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Role:</span> Agent
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Telegram No:</span> {agent.teleNumber || "N/A"}
              </p>
              <div className="flex justify-end mt-4">
               
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No agents found with rRentInTbilisi in their email.</p>
      )}
    </div>
  );
}

export default AllAgents;
