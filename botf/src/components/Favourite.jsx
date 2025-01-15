import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { getAllLikes, getAllProperties } from "../utils/api";
import axios from "axios";
import { BiHeart } from "react-icons/bi";

function Favourite() {
   const {t} = useTranslation("home")
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const [allProperties, setAllProperties] = useState([]); // Track all properties
  const navigate = useNavigate(); // Navigation hook
  const email = localStorage.getItem("teleNumber");  
  // const email = "1776941770";

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
  const Write = async (property) => {
    const teleNumber = localStorage.getItem("teleNumber")
    console.log("Property ID:", property.id);
    console.log("Property Details:", property);

    try {


        const propertyDetails = `
  🏡 *Property Details* 🏡

  📍 *Location:* ${property.address || "N/A"}  
  💰 *Price:* $${property.price || "N/A"} ${property.currency || "N/A"}
  
  🛏️ *Rooms:* ${property.rooms || "N/A"}  
  🚿 *Bathrooms:* ${property.bathrooms || "N/A"}  
  📐 *Area:* ${property.area || "N/A"} sq. ft.
  
  🏢 *Building Type:* ${property.propertyType || "N/A"}  
  🏢 *Residency Type:* ${property.residencyType || "N/A"}  
  🔢 *Floor:* ${property.floor || "N/A"} / ${property.totalFloors || "N/A"}

  📅 *Term Duration:* ${property.termDuration.length > 0 ? property.termDuration.join(', ') : "N/A"}  
  📜 *Term:* ${property.term || "N/A"}  
  🚗 *Parking:* ${property.parking || "N/A"}  

  🌆 *City:* ${property.city || "N/A"}  
  🏙️ *District:* ${property.district.length > 0 ? property.district.join(', ') : "N/A"}  
  🏠 *Position:* ${property.position || "N/A"}  
  
  💳 *Payment Method:* ${property.paymentMethod || "FirstDeposit"}  

  ✨ *Design Features:* ${property.design.length > 0 ? property.design.join(', ') : "N/A"}

   
  🔗 *More Info:* [Click Here](https://sheik-front.vercel.app/properties/${property.id})

  ✨ *Contact for more details or to schedule a visit!*
`.trim();
// Redirect to Telegram with the message
const encodedMessage = encodeURIComponent(propertyDetails);
window.open(
  `https://t.me/David_Tibelashvili?text=${encodedMessage}`,
  "_blank"
);
      
      const response = await axios.post(`https://sheik-back.vercel.app/api/user/addInterest/${property.id}`, {
        teleNumber,
      });
      console.log('Interest added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding interest:', error.response?.data || error.message);
      throw error;
    }
  

  };
  const getTimeDifference = (updatedAt, discount) => {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const diffInMs = now - updatedTime;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
  
    if (diffInHours < 24) {
      return  t("new")
    } else if (discount) {
      return  t("discounted")
    } else if (diffInHours >= 24) {
      const diffInDays = Math.floor(diffInHours / 24);
      return t("daysAgo", { count: diffInDays });

    }
  };

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


  const toggleFavorite = async (propertyId) => {
    try {
      const isLiked = favorites.includes(propertyId);
  
      if (isLiked) {
        // Send a DELETE request to remove the like
        await axios.delete(`https://sheik-back.vercel.app/api/user/dislikes/${propertyId}`, {
          data: { email },
        });
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        // Send a POST request to add the like
        await axios.post(`https://sheik-back.vercel.app/api/user/likes/${propertyId}`, { email });
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error.message || error);
      alert("Failed to update favorite status. Please try again.");
    }
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
    <h1 className="text-2xl font-bold text-gray-800">{t("fav")}</h1>
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
                  src={
                    property.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt="Property"
                  className="w-full h-40 object-cover"
                />
        
                {/* Dynamic Labels */}
                <div className="absolute top-2 left-2 space-y-1">
                 <span
    className={`${
      getTimeDifference(property.updatedAt, property.discount) === "New"
        ? "bg-green-500"
        : getTimeDifference(property.updatedAt, property.discount) === "Discounted"
        ? "bg-red-500"
        : "bg-blue-500"
    } text-white text-xs font-medium px-2 py-1 text-center rounded`}
  >
    {getTimeDifference(property.updatedAt, property.discount)}
  </span>
                </div>
              </div>

          {/* Property Details */}
          <div className="p-3">
                {/* Profile Icon */}
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600">
                  <img src="./david.jpg" alt="" className="rounded-full" />

                  </div>
                  <span className="ml-2 text-xs text-gray-600">{property.owner || "David_Tibelashvili"}</span>
                </div>
        
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {property.title || "Untitled Property"}
                </h3>
                <p className="text-xs text-gray-600 mt-1 truncate">
                {property.city ? t(property.city.toLowerCase()) : t("noDistrictAvailable")}               
                

                </p>
                <p className="text-sm text-gray-800 font-bold mt-1">
  {property.discount ? (
    <>
      <span className="line-through text-gray-500">
        {property.price} {property.currency}
      </span>{" "}
      <span>
        {(property.price - property.discount).toFixed()} {property.currency}
      </span>
    </>
  ) : (
    `${property.price || "N/A"} ${property.currency}`
  )}
</p>
<p className="text-xs text-gray-600 mt-1">
                {t("propertyInfo", {
  type: t(property.type.toLowerCase()) || "N/A", // Translate the type
  bathrooms: property.bathrooms || "N/A",
  area: property.area || "N/A"
})}
   </p>
              </div>

          {/* Write Button */}
          <div className="px-3 pb-3">
              <button
    className="px-4 py-1 bg-blue-500 text-white text-xs font-medium rounded shadow hover:bg-blue-600 transition"
    onClick={() => {
      Write(property);
      window.open("https://t.me/David_Tibelashvili", "_blank");
    }}
  >
        {t("contact")}
        </button>

  {/* View Button */}
  <button
    className="px-4 py-1 bg-blue-500 ml-5 text-white text-xs font-medium rounded shadow hover:bg-blue-600 transition"
    onClick={() => navigate(`/card/${property.id}`, { state: { card: property } })}
  >
        {t("view")}
        </button>
              </div>

          {/* Favorite Icon */}
         <div
                          className="cursor-pointer absolute right-2 top-2 "
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                        >
                          {favorites?.includes(property.id) ? (
                            <AiFillHeart color="red" size={20} />
                          ) : (
                            <BiHeart color="gray" size={20} />
                          )}
                        </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}

export default Favourite;
