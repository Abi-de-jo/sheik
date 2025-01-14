import { useState, useEffect } from "react";
 import { getAllUsers } from "../utils/api";
import axios from "axios";

function AllOwners() {
  const [owner, setOwner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store the selected user's data
  const [email, setEmail] = useState(""); // Email input value
 
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const users = await getAllUsers();
        console.log(users);
        // Filter users who have "geomap" in their email
        const geomapUsers = users.filter((user) => !user.email);

        setOwner(geomapUsers); // Set filtered users
      } catch (err) {
        console.error(err);
        setError("Failed to fetch owner");
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, []);

  const handleSave = async() => {
      
      const userId = selectedUser.teleNumber;
    console.log("Appointed Agent Email:", email);
    console.log("Assigned to User ID:", selectedUser.teleNumber);


    closeModal(); 
    if (email ) {

        try{
   
          await axios.put("https://sheik-back.vercel.app/api/user/updateuser",{
             email,
             userId
             
          })
  
        }catch(err){
  console.log(err)
        }
        localStorage.setItem("teleEmail", email);
        alert("Logged in successfully");
        window.location.reload();
  
      }


    
  };

 

  const openModal = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Clear the selected user
    setEmail(""); // Clear the email field
  };



  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading owner...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Owner with Geomap</h1>
      {owner.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {owner.map((owner) => (
            <div
              key={owner.id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">{owner.username || "Unnamed Owner"}</h2>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Email:</span> {owner.email || "N/A"}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Role:</span> Owner
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Telegram no:</span> {owner.teleNumber || "N/A"}
              </p>
              <button
                onClick={() => openModal(owner)} // Open the modal with the selected user's data
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Appoint Agent
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No owner found with geomap in their email.</p>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[90%] sm:w-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Appoint Agent</h2>
            <p className="text-gray-600 mb-4">
              Assign an agent email for <span className="font-medium">{selectedUser?.username || "Unknown User"}</span>.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email input value
              placeholder="Enter agent email"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllOwners;
