import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import UseAll from "../hooks/useall";
import axios from "axios";
import { getAllUsers } from "../utils/api";
import { useTranslation} from 'react-i18next'

const Profile = () => {
  const {t} = useTranslation("home");
  // const teleNumber = "1469627446"; 
  // const role = "agent";  
    const [matchedResidencies, setMatchedResidencies] = useState([]); // State for matched residencies

   const teleNumber = localStorage.getItem("teleNumber")
  const role = localStorage.getItem("role")
    const navigate = useNavigate();
  const { data, isLoading, error } = UseAll();
  const [filterStatus, setFilterStatus] = useState("published");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const userId = localStorage.getItem("userId");
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Toggle form visibility
  const API_BASE_URL = "https://sheik-back.vercel.app/api";

  const toggleUpdateForm = () => {
    setShowUpdateForm((prev) => !prev);
  };

  const Remove = async (residencyId) => {
    const teleNumber = localStorage.getItem("teleNumber")
    try {
      const response = await axios.put(
        `https://sheik-back.vercel.app/api/user/removeInterest/${residencyId}`,
        {
           teleNumber 
        }
      );
      console.log("Interest removed:", response.data);
  
      // Optional: Add logic to refresh the list or update UI after removal
      alert("Interest removed successfully!");
      return response.data;
    } catch (error) {
      console.error("Error removing interest:", error.response?.data || error.message);
      alert("Failed to remove interest. Please try again.");
      throw error;
    }
  };
  

    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(); // Fetch all users
        console.log("Fetched Users: ", JSON.stringify(users, null, 2)); // Log users in a readable format
  
        // Get teleNumber from localStorage
         const teleNumber = localStorage.getItem("teleNumber");
        //  const teleNumber = "999";
  
        if (!teleNumber) {
          console.log("No teleNumber found in localStorage.");
          return;
        }
  
        // Check if teleNumber matches
        const matchedUser = users.find((user) => user.teleNumber === teleNumber);
  
        if (matchedUser) {
          // Print the username, surname, and email
          console.log("Matched User:", {
            username: matchedUser.username,
            surname: matchedUser.surname,
            email: matchedUser.email,
          });
  
          // Set state for UI display
          setFirstName(matchedUser.username || ""); // Fallback to empty string if username is undefined
          setLastName(matchedUser.surname || ""); // Fallback to empty string if surname is undefined
          setEmail(matchedUser.email || ""); // Fallback to empty string if email is undefined
        } else {
          console.log("No matching user found for the given teleNumber.");
        }
      } catch (error) {
        console.error("Error fetching users:", error); // Log any errors
      }
    };
  
    fetchUsers();
  }, []);  

  // Handle profile updates
  const handleProfileUpdate = async () => {
    try {
      // Build payload dynamically based on the role
      const payload = {
        teleNumber, // Include teleNumber for identification
        username: firstName, // Map firstName to username
        surname: lastName,   // Map lastName to surname
      };
  
      // Include email only if the role is "agent"
      if (role === "agent") {
        payload.email = email;
      }
  
      const endpoint = role === "agent" ? `${API_BASE_URL}/user/updateAgent` : `${API_BASE_URL}/user/updateUser`;
  
      const response = await axios.put(endpoint, payload);
  
      console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} profile updated:`, response.data);
      alert("Profile updated successfully!");
      return response.data;
    } catch (error) {
      console.error(`Error updating ${role} profile:`, error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    }
  };
  

  // Handle status filtering
  const handleStatusClick = (status) => {
  setFilterStatus(status);

  if (status === "") {
    // History logic
    const fetchResidencies = async () => {
      try {
        const users = await getAllUsers(); // Fetch all users
        const matchedUser = users.find((user) => user.teleNumber === teleNumber);

        if (matchedUser?.interested?.length > 0) {
          const matchedResidencies = data.filter((property) =>
            matchedUser.interested.includes(property.id)
          );
          setMatchedResidencies(matchedResidencies); // Update state
        } else {
          setMatchedResidencies([]); // Clear state if no matches
        }
      } catch (error) {
        console.error("Error fetching matched residencies:", error);
      }
    };

    fetchResidencies();
  }
};

 

  // Handle email form submission
  const handleLoginSubmit =async (e) => {
    e.preventDefault();
    if (email) {
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

  // Filtered properties logic
  const filteredProperties = data
  ? data.filter(
      (property) =>
        property.userTeleNumber === teleNumber && // Ensure the teleNumber matches
        (filterStatus === "" || property.status === filterStatus) // Match status or show all if filterStatus is empty
    )
  : [];
  

  if (!teleNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <p className="text-xl font-bold text-gray-700"> {t("login")}</p>
            <input
  type="email"
  placeholder={t("enter_email")}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
  required
/>

          <button
  type="submit"
  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
>
  {t("login")}
</button>

          </form>
        </div>
      </div>
    );
  }

  const handleCardClick = (property) => {
    navigate(`/agentPub/${property.id}`, { state: { property } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center relative">
        <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
        <p className="mt-4 text-xl font-bold text-gray-700">{firstName}{lastName}</p>
        <p className="text-sm text-gray-500">Welcome back! {role} Here is your dashboard.</p>
       { role ==="agent" && <button
          onClick={toggleUpdateForm}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
{showUpdateForm ? t("hide_update_form") : t("update")}
</button>}
      </div>

      {/* Profile Update Section */}
     
      {showUpdateForm && (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
      {t("update_profile")}
    </h2>
    <div className="space-y-4">
      <input
        type="text"
        placeholder={t("first_name")}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder={t("last_name")}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      {role === "agent" && (
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      )}
      <button
        onClick={handleProfileUpdate}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
      >
        {t("save_changes")}
      </button>
    </div>
  </div>
)}
{role === "user" && (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
      {t("login")}
    </h2>
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <input
        type="email"
        placeholder={t("enter_email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {t("login")}
      </button>
    </form>
  </div>
)}


      {/* Filter Buttons for Agents */}
      {role === "agent" ? (
       <div className="flex justify-center flex-wrap space-x-4 mb-4">
       <button
         onClick={() => handleStatusClick("published")}
         className={`px-4 py-2 rounded shadow ${
           filterStatus === "published"
             ? "bg-blue-500 text-white"
             : "bg-gray-200 text-gray-700"
         } hover:bg-blue-400 transition`}
       >
         {t("published")}
       </button>
     
       <button
         onClick={() => handleStatusClick("draft")}
         className={`px-4 py-2 rounded shadow ${
           filterStatus === "draft"
             ? "bg-yellow-500 text-white"
             : "bg-gray-200 text-gray-700"
         } hover:bg-yellow-400 transition`}
       >
         {t("requested")}
       </button>
     
       <button
         onClick={() => handleStatusClick("rented")}
         className={`px-4 py-2 rounded shadow ${
           filterStatus === "rented"
             ? "bg-green-500 text-white"
             : "bg-gray-200 text-gray-700"
         } hover:bg-green-400 transition`}
       >
         {t("rented")}
       </button>
       <button
         onClick={() => handleStatusClick("archieve")}
         className={`px-4 py-2 mt-3 rounded shadow ${
           filterStatus === "archieve"
             ? "bg-red-500 text-white"
             : "bg-gray-200 text-gray-700"
         } hover:bg-red-400 transition`}
       >
         {t("archived")}
       </button>
     </div>
      )
     :(
// USer
<div className="flex justify-center space-x-4 mb-4">
  <button
    onClick={() => handleStatusClick("draft")}
    className={`px-4 py-2 rounded shadow ${
      filterStatus === "draft"
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-700"
    } hover:bg-blue-400 transition`}
  >
    {t("creation")}
  </button>
  <button
    onClick={() => handleStatusClick("")} // Show history
    className={`px-4 py-2 rounded shadow ${
      filterStatus === ""
        ? "bg-red-500 text-white"
        : "bg-gray-200 text-gray-700"
    } hover:bg-red-400 transition`}
  >
    {t("history")}
  </button>
</div>
     )
    }

      {/* Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
  {role === "user" && filterStatus === "draft"
    ? t("creation")
    : role === "user" && filterStatus === ""
    ? t("history")
    : `${t(filterStatus)} ${t("properties")}`}
</h2>


      {isLoading ? (
        <p className="text-gray-600 text-center">Loading properties...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error fetching properties.</p>
      ) :
       
       
  filterStatus === "" && matchedResidencies?.length > 0 ? (

 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {matchedResidencies.map((property) => (
      <div
        key={property.id}
        className="flex flex-col sm:flex-row p-4 bg-gray-50 border rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow duration-200"
        onClick={() => handleCardClick(property)}
      >
        <div className="w-full sm:w-1/2 flex-shrink-0">
          <img
            src={property.images[0] || "https://via.placeholder.com/150"}
            alt={property.title || "Untitled"}
            className="w-full h-32 object-cover rounded"
          />
          <div className="mt-2 sm:mt-4">
            <p className="text-sm font-medium">{t("price")}: {property.price || "N/A"}</p>
            <p className="text-sm">{t("type")}:: {property.type || "N/A"}</p>
            <p className="text-sm">{t("type")}:: {property.area || "N/A"} sqft</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex flex-col justify-between px-4 mt-2 sm:mt-0">
          <h3 className="text-lg font-semibold mb-2">
            {property.title || "Untitled"}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description || "No description available."}
          </p>
          <div className="flex gap-2 mt-auto">
            <button
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent onClick event
                handleCardClick(property);
              }}
            >
              View Details
            </button>
            <button
  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
  onClick={(e) => {
    e.stopPropagation(); // Prevent parent onClick event
    Remove(property.id); // Call the Remove function with the property ID
  }}
>
  Remove
</button>

          </div>
        </div>
      </div>
    ))}
  </div>

  ) :    filteredProperties.length > 0 ? (
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

       
       {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col sm:flex-row p-4 bg-gray-50 border rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow duration-200"
              onClick={() => handleCardClick(property)}
            >
              <div className="w-full sm:w-1/2 flex-shrink-0">
                <img
                  src={property.images[0] || "https://via.placeholder.com/150"}
                  alt={property.title || "Untitled"}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="mt-2 sm:mt-4">
                  <p className="text-sm font-medium">
                  {t("price")}:: {property.price || "N/A"}
                  </p>
                  <p className="text-sm">{t("type")}: {property.type || "N/A"}</p>
                  <p className="text-sm">{t("sq.m")}: {property.area || "N/A"} sqft</p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 flex flex-col justify-between px-4 mt-2 sm:mt-0">
                <h3 className="text-lg font-semibold mb-2">
                  {property.title || "Untitled"}
                </h3>
                
                <button
                  className="mt-auto self-start px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent onClick event
                    handleCardClick(property);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No properties found.</p>
      )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  teleNumber: PropTypes.string,
};

export default Profile;
