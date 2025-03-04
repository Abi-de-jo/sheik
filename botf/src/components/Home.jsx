import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProperties from "../hooks/useProperties";
import Map from "./Map";
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { getAllLikes } from "../utils/api";
 import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../LanguageSwitcher";

function Home() {

  const { t } = useTranslation("home");


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
  
  
  
    // Generate 10 random watermarks
    const generateWatermarks = (count) => {
      const watermarks = [];
      for (let i = 0; i < count; i++) {
        const randomTop = Math.floor(Math.random() * 100); // Random top position
        const randomLeft = Math.floor(Math.random() * 100); // Random left position
        watermarks.push(
          <img
            key={i}
            src="./abi.jpg"
            alt="Watermark"
            className="absolute w-5 h-5 rounded-full mix-blend-screen
 opacity-40 pointer-events-none mix-blend-multiply"
            style={{ top: `${randomTop}%`, left: `${randomLeft}%` }}
          />
        );
      }
      return watermarks;
    }

  const { data, isLoading, error } = useProperties(); // Fetch properties using the hook
  const [isMapView, setIsMapView] = useState(false); // Toggle between List and Map view
  const [favorites, setFavorites] = useState([]); // Track favorite propertie
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
          const response = await axios.post("https://sheik-back.vercel.app/api/user/register", {
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
  
  const Write = async (property) => {
    const teleNumber = localStorage.getItem("teleNumber")
    const username = localStorage.getItem("firstName")
    // const username = "Abisheik"
    console.log("Property ID:", property.id);
    console.log("Property Details:", property);

    const TELEGRAM_BOT_TOKEN = "7712916176:AAF15UqOplv1hTdJVxILWoUOEefEKjGJOso";
    const userChatId = property.userTeleNumber; // Assuming this exists

    const notificationMessage = `
    🏡 *Property Contacted* 🏡
    
    📌 *Title:* ${property.title || "Untitled"}
    🏷️ *Type:* ${property.type || "N/A"}
    💰 *Price:* ${property.price ? `$${property.price}` : "N/A"} ${property.currency || "N/A"}
    📍 *Address:* ${property.address || "No Address Provided"}
    🔗 *Address URL:* ${property.addressURL || "No URL Provided"}
    
    ✨ Your property has been contacted by a ${username}!
    `.trim();
    
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: userChatId,
        text: notificationMessage,
      }
    );

    console.log("Notification sent to property owner:", userChatId);

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
  if (isLoading) return <p className="text-gray-600 text-center">Loading properties...</p>;
  if (error) return <p className="text-red-500 text-center">Error fetching properties.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
     
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-lg font-bold text-gray-800">      {t("propertiesTitle")}
  </h1>
         <div  className="ml-20">
 <LanguageSwitcher />

 </div>
  <button
    onClick={() => setIsMapView(!isMapView)}
    className="flex items-center px-4 py-2 text-sm font-medium border rounded-lg bg-white text-gray-700 border-gray-300 hover:bg-blue-100 transition"
  >
    {isMapView ? (
      <>
        {/* List View Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        {t("listView")}

      </>
    ) : (
      <>
        {/* Map View Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3l14 9-14 9V3z"
          />
        </svg>
        {t("mapView")}

      </>
    )}
  </button>
</div>


      {/* Content Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isMapView ? (
                 <Map />  
         ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {data?.slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((property) => (
            <div
              key={property.id}
              className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative">
      {/* Main Image */}
      <img
        src={property.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
        alt="Property"
        className="w-full h-32 object-cover"
      />

      {/* Watermark Images */}
      {generateWatermarks(5)}

      {/* Dynamic Labels */}
      <div className="absolute top-2 left-2 z-10">
        <span
          className={`${
            getTimeDifference(property.updatedAt, property.discount) === t("new")
              ? "bg-green-500"
              : getTimeDifference(property.updatedAt, property.discount) === t("discounted")
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white text-xs font-medium px-2 py-1 text-center rounded`}
        >
          {getTimeDifference(property.updatedAt, property.discount)}
        </span>
      </div>
    </div>

        
              {/* Content Section */}
              <div className="p-3">
                {/* Default Profile Icon */}
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center ">
                  <div className="flex flex-col items-center p-4 rounded-lg shadow-lg">
  {/* Profile Image */}
  

   
</div>
<img src="./david.jpg" alt="" className="mr-11 rounded-full" />


                  </div>
                  <span className="ml-2 text-xs text-gray-600">{property.owner || "David_Tibelashvili"}</span>
                </div>
        
                {/* Property Details */}
                <h3 className="text-sm font-semibold text-gray-800">{property.title || "Untitled Property"}</h3>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {property.address || "No Address Available"}
                </p>
                <p className="text-sm text-gray-800 font-bold mt-1">
  
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


</p>
                <p className="text-xs text-gray-600 mt-1">
                {t("propertyInfo", {
  type: t(property.type.toLowerCase()) || "N/A", // Translate the type
  bathrooms: property.bathrooms || "N/A",
  area: property.area || "N/A"
})}
   </p>
              </div>
        
              {/* Actions Section */}
              
              <div className="flex items-center justify-between px-3 pb-3">
  {/* Contact Button */}
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
    className="px-4 py-1 bg-blue-500 mr-20 text-white text-xs font-medium rounded shadow hover:bg-blue-600 transition"
    onClick={() => navigate(`/card/${property.id}`, { state: { card: property } })}
  >
        {t("view")}

  </button>

  {/* Favorites Icon */}
  <div
    className="cursor-pointer"
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


            </div>
          ))}
        </div>
        
        )}
      </div>
    </div>
  );
}

export default Home;
