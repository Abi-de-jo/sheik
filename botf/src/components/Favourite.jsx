import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { getAllLikes, getAllProperties } from "../utils/api";

function Favourite() {
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const [allProperties, setAllProperties] = useState([]); // Track all properties
  const navigate = useNavigate(); // Navigation hook
  const email = localStorage.getItem("teleNumber");  
  // const email = "123456";

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const properties = await getAllProperties(); // Fetch all properties
        setAllProperties(properties);
      } catch (error) {
        console.error("Error fetching all properties:", error);
      }
    };

    fetchAllProperties();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
        
      if (email && allProperties.length > 0) {
        try {
          const likedProperties = await getAllLikes(); // Fetch liked properties
          console.log("Fetched liked properties:", likedProperties);
          console.log("All properties:", allProperties);

          // Filter and combine liked properties with their full data
          const fullFavorites = likedProperties.map((likedProperty) => {
            const fullPropertyData = allProperties.find(
              (property) => property.id === likedProperty
            );
            return { ...likedProperty, ...fullPropertyData }; // Merge liked and full data
          });

          setFavorites(fullFavorites.filter(Boolean)); // Update favorites state with valid data
        } catch (error) {
          console.error("Error fetching liked properties", error);
        }
      }
    };

    fetchLikes();
  }, [email, allProperties]);

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

  if (!favorites.length) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <p className="text-gray-500 text-lg">No liked properties to display.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
  {/* Header Section */}
  <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Favourite Properties</h1>
  </div>

  {/* Liked Properties */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((property) => (
        <div
          key={property.id}
          className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden relative cursor-pointer"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              onClick={() => handleCardClick(property)}
              src={
                property.images && property.images.length > 0
                  ? property.images[0]
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt="Property"
              className="w-full h-40 object-cover"
            />

            {/* Dynamic Labels */}
            <div className="absolute top-2 left-2 space-y-1">
              {property.heating?.[0] && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
                  {property.heating[0]}
                </span>
              )}
              {property.additional?.[0] && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-md shadow">
                  {property.additional[0]}
                </span>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {property.title || "Untitled Property"}
            </h3>
            <p className="text-xs text-gray-600 mt-1 truncate">
              {property.address || "No Address Available"}
            </p>
            <p className="text-sm text-gray-800 font-bold mt-1">{property.price || "N/A"} USD</p>
            <p className="text-xs text-gray-600 mt-1">
              {property.type || "N/A"} • {property.city || "N/A"}
            </p>
          </div>

          {/* Write Button */}
          <div className="px-3 pb-3">
            <button
              className="w-full px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded shadow hover:bg-blue-600 transition"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                 window.open("https://t.me/David_Tibelashvili", "_blank");
              }}
            >
              Write
            </button>
          </div>

          {/* Favorite Icon */}
          <div className="absolute top-4 right-4">
            <AiFillHeart color="red" size={20} className="animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}

export default Favourite;
