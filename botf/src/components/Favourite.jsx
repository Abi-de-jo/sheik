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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {favorites.map((property) => (
            <div
              key={property.id}
              className="flex flex-col bg-gray-50 border border-gray-200 rounded-md shadow cursor-pointer relative"
              onClick={() => handleCardClick(property)}
            >
              {/* Image */}
              <img
                src={
                  property.images && property.images.length > 0
                    ? property.images[0]
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt="Property"
                className="w-full h-48 object-cover rounded-t-md"
              />

              {/* Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {property.title || "Untitled Property"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Price:</span> {property.price || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Type:</span> {property.type || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">City:</span> {property.city || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Address:</span> {property.address || "N/A"}
                </p>
              </div>

              {/* Favorite Icon */}
              <div className="absolute bottom-4 right-4">
                <AiFillHeart color="red" size={30} className="animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favourite;
