import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProperties from "../hooks/useProperties";
import Map from "./Map";
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { getAllLikes } from "../utils/api";
import { LoadScript } from "@react-google-maps/api";

function Home() {
  const { data, isLoading, error } = useProperties(); // Fetch properties using the hook
  const [isMapView, setIsMapView] = useState(false); // Toggle between List and Map view
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const navigate = useNavigate();
  const [userdetails, setUserDetails] = useState({});

  // Fetch URL parameters and store in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const queryUsername = params.get("username");
    const queryUserId = params.get("userId");
    const queryFirstName = params.get("firstName");
    const queryLastName = params.get("lastName");

    // Store values in localStorage
    if (queryUsername) localStorage.setItem("username", queryUsername);
    if (queryUserId) localStorage.setItem("userId", queryUserId);
    if (queryFirstName) localStorage.setItem("firstName", queryFirstName);
    if (queryLastName) localStorage.setItem("lastName", queryLastName);

    // Set state for user details
    setUserDetails({
      username: queryUsername || localStorage.getItem("username") || "",
      userId: queryUserId || localStorage.getItem("userId") || "",
      firstName: queryFirstName || localStorage.getItem("firstName") || "",
      lastName: queryLastName || localStorage.getItem("lastName") || "",
    });

    // Register user automatically if values exist
    const registerUser = async () => {
      try {
        if (queryUsername || queryUserId) {
          const response = await axios.post("https://nothing-server.vercel.app/api/user/register", {
            username: queryUsername || "aa",
            surname: queryLastName || "aa",
            teleNumber: queryUserId || "",
          });
          console.log("User registered successfully:", response.data.message);
          console.log("User registered successfully:", response.data.email);

          if (response.data.message === "Admin") {
            localStorage.setItem("email",response.data.email)
            localStorage.setItem("role", "admin");
          } else if (response.data.message === "Agent") {
            localStorage.setItem("role", "agent");
            localStorage.setItem("email",response.data.email)
          } else {
            localStorage.setItem("role", "user");
          }

          localStorage.setItem("teleNumber", queryUserId || "");
        }
      } catch (err) {
        console.error("Error registering user:", err.message);
      }
    };

    registerUser();
  }, []);

  // Fetch liked properties
   const email = localStorage.getItem("teleNumber");  

   useEffect(() => {
    const fetchLikes = async () => {
      if (email) {
        try {
          const likedProperties = await getAllLikes();
          console.log(likedProperties,"1111111111111111111")
          setFavorites(likedProperties || []); // Ensure favorites is an array
          console.log("Fetched liked properties:", likedProperties);
        } catch (error) {
          console.error("Error fetching liked properties:", error);
        }
      }
    };
    fetchLikes();
  }, [email]);

  // Handle favorite toggle
  const toggleFavorite = async (propertyId) => {
    try {
      const isLiked = favorites.includes(propertyId);
  
      if (isLiked) {
        // Send a DELETE request to remove the like
        await axios.delete(`https://nothing-server.vercel.app/api/user/dislikes/${propertyId}`, {
          data: { email },
        });
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        // Send a POST request to add the like
        await axios.post(`https://nothing-server.vercel.app/api/user/likes/${propertyId}`, { email });
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error.message || error);
      alert("Failed to update favorite status. Please try again.");
    }
  };
  
  const Write = async (property) => {
    const teleNumber = localStorage.getItem("teleNumber")
    console.log("Property ID:", property.id);
    console.log("Property Details:", property);

    try {
      const response = await axios.post(`https://nothing-server.vercel.app/api/user/addInterest/${property.id}`, {
        teleNumber,
      });
      console.log('Interest added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding interest:', error.response?.data || error.message);
      throw error;
    }


  };
  if (isLoading) return <p className="text-gray-600 text-center">Loading properties...</p>;
  if (error) return <p className="text-red-500 text-center">Error fetching properties.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button
          onClick={() => setIsMapView(!isMapView)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {isMapView ? "View List" : "View Map"}
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isMapView ? (
                 <Map />  
         ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {data?.map((property) => (
              <div
                key={property.id}
                className="flex flex-col bg-gray-50 border rounded-md shadow cursor-pointer relative"
                onClick={() => navigate(`/card/${property.id}`, { state: { card: property } })}
                >
                <img
                  src={property.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt="Property"
                  className="w-full h-48 object-cover rounded-t-md"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{property.title || "Untitled Property"}</h3>
                  <p>Price: {property.price || "N/A"}</p>
                </div>
                <div>
                <button
    className="px-6 py-2 bg-gradient-to-r ml-5 mb-4 from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
    onClick={() => Write(property)} // Pass the property details to the Write function
  >
    Write
  </button>
                  </div>
                <div
                  className="absolute bottom-4 right-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  {favorites?.includes(property.id) ? (
                    <AiFillHeart color="red" size={30} />
                  ) : (
                    <BiHeart color="gray" size={30} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
