import { useState, useEffect } from "react";
import useProperties from "../hooks/useProperties";
import { useNavigate } from "react-router-dom"; // Import the hook for navigation
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { getAllLikes } from "../utils/api";

function Search() {
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const { data, isLoading, error } = useProperties(); // Fetch all properties using the hook
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [filters, setFilters] = useState({
    price: "",
    city: "",
    category: "",
    amenities: [],
    rooms: "",
    heating: [], // Term duration as replacement for heating
    pets: "",
    residencyType: "",
    designStyle: [],
  });
  

  const filterPriceRange = (propertyPrice, selectedRange) => {
    const price = parseInt(propertyPrice, 10);
    switch (selectedRange) {
      case "0-1200":
        return price >= 0 && price <= 1200;
      case "1500-1700":
        return price > 1200 && price <= 1700;
      case "1700-1900":
        return price > 1700 && price <= 1900;
      case "1900-2100":
        return price > 1900 && price <= 2100;
      case "2100-2500":
        return price > 2100 && price <= 2500;
      case "2500-3000":
        return price > 2500 && price <= 3000;
      case "3000-4000":
        return price > 3000 && price <= 4000;
      case "4000-5000":
        return price > 4000 && price <= 5000;
          default:
        return true;
    }
  };


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
  
  const filteredProperties = data?.filter((property) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = property.title?.toLowerCase().includes(searchValue);
  
    // Price Range
    const matchesPrice = !filters.price || filterPriceRange(property.price, filters.price);
  
    // City Filter
    const matchesCity = !filters.city || property.city === filters.city;
  
    // Category Filter
    const matchesCategory = !filters.category || property.type === filters.category;
  
    // Bedrooms
    const matchesRooms = !filters.rooms || property.rooms?.toString() === filters.rooms;
  
    // Amenities
    const matchesAmenities =
      !filters.amenities.length ||
      filters.amenities.every((amenity) => property.amenities?.includes(amenity));
  
    // Term Duration
    const matchesTermDuration =
      !filters.heating.length ||
      filters.heating.every((term) => property.termDuration?.includes(term));
  
    // Pets
    const matchesPets = !filters.pets || property.pets === filters.pets;
  
    // Residency Type
    const matchesResidencyType = !filters.residencyType || property.residencyType === filters.residencyType;
  
    // Design Style
    const matchesDesignStyle =
      !filters.designStyle.length ||
      filters.designStyle.every((style) => property.designStyle?.includes(style));
  
    return (
      matchesSearch &&
      matchesPrice &&
      matchesCity &&
      matchesCategory &&
      matchesRooms &&
      matchesAmenities &&
      matchesTermDuration &&
      matchesPets &&
      matchesResidencyType &&
      matchesDesignStyle
    );
  });
  
  // Utility to filter price ranges
  
  
  // Clear All Filters
  const clearFilters = () => {
    setFilters({
      price: "",
      city: "",
      category: "",
      amenities: [],
      rooms: "",
      heating: [],
      pets: "",
      residencyType: "",
      designStyle: [],
    });
  };
  
  const navigate = useNavigate(); // Hook for navigation
  const email = localStorage.getItem("teleNumber");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (email) {
        try {
          const likedProperties = await getAllLikes(); // Fetch liked properties
          setFavorites(likedProperties); // Update favorites state
          console.log("Fetched liked properties:", likedProperties);
        } catch (error) {
          console.error("Error fetching liked properties", error);
        }
      }
    };
    fetchLikes();
  }, [email]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = async (propertyId) => {
    const isLiked = favorites.includes(propertyId);

    try {
      if (isLiked) {
        await axios.delete(
          `https://sheik-back.vercel.app/api/user/dislikes/${propertyId}`,
          { data: { email } }
        );
        setFavorites((prev) => prev.filter((id) => id !== propertyId)); // Remove from favorites
        console.log(`Property Disliked: ${propertyId}`);
      } else {
        await axios.post(`https://sheik-back.vercel.app/api/user/likes/${propertyId}`, {
          email,
        });
        setFavorites((prev) => [...prev, propertyId]); // Add to favorites
        console.log(`Property Liked: ${propertyId}`);
      }
    } catch (error) {
      console.error("Error toggling favorite status", error);
    }
  };

  // Filter properties based on the search term and filters
 
  

  // Handle card click to navigate to the details page
  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

   

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 p-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Properties</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="🔍 Search properties by title, address, city, or type..."
          />
        </div>
      </div>

      {/* Filters Section */}
      
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Filters</h2>
          <button
            onClick={() => setIsFilterPopupOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full shadow-lg"
          >
            Open Filters
          </button>
        </div>
        {/* Display current filter values */}
        
        <div className="mt-4">
          <p className="text-gray-700 text-sm">Max Price: <span className="font-semibold">{filters.price || 'Not set'}</span></p>
          <p className="text-gray-700 text-sm">City: <span className="font-semibold">{filters.city || 'Not set'}</span></p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>


      </div>

      {/* Properties Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">
          Properties
        </h2>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties.</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => handleCardClick(property)} // Attach click handler
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
                {/* Profile Icon */}
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A4 4 0 015 15m5 5a4 4 0 004-4m0 4a4 4 0 004-4m-4 4a4 4 0 01-4-4m0 0a4 4 0 01-4-4m0 0a4 4 0 004-4m0 0a4 4 0 004-4m0 4a4 4 0 004 4"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-xs text-gray-600">{property.owner || "Owner"}</span>
                </div>
        
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
              onClick={() => Write(property)}

                >
                  Write
                </button>
              </div>
        
              {/* Favorite Icon */}
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card click
                  toggleFavorite(property.id);
                }}
              >
                {favorites.includes(property.id) ? (
                  <AiFillHeart color="red" size={20} className="animate-pulse" />
                ) : (
                  <BiHeart color="gray" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
        
        
        ) : (
          <p className="text-gray-500 text-center">No properties found matching your search.</p>
        )}
      </div>

      {/* Filter Popup */}

      {isFilterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 mb-24">
          <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Filters</h2>

            {/* City */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select City</option>
                <option value="Tblisi">Tbilisi</option>
                <option value="Batumi">Batumi</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
    <div className="relative">
      <select
        value={filters.price}
        onChange={(e) => handleFilterChange("price", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select Price Range</option>
        <option value="0-1200">0 - 1200</option>
        <option value="1500-1700">1500-1700</option>
        <option value="1700-1900">1700-1900</option>
        <option value="1900-2100">1900-2100</option>
        <option value="2100-2500">2100-2500</option>
        <option value="2500-3000">2500-3000</option>
        <option value="3000-4000">3000-4000</option>
        <option value="4000-5000">4000-5000</option>
      </select>
    </div>
  </div>

  <hr className="mt-5" />


            {/* Category */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <div className="flex gap-2 mt-1">
                {["All", "Rent", "Sale"].map((option) => (
                  <label key={option} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="category"
                      value={option === "All" ? "" : option}
                      checked={filters.category === (option === "All" ? "" : option)}
                      onChange={() => handleFilterChange("category", option === "All" ? "" : option)}
                      className="mr-1"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <hr className="mt-5" />

            {/* Number of Rooms */}
            <div className="mb-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
  <div className="relative">
    <select
      value={filters.rooms}
      onChange={(e) => handleFilterChange("rooms", e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select Bedrooms</option>
      <option value="1">1 Bedroom</option>
      <option value="2">2 Bedrooms</option>
      <option value="3">3 Bedrooms</option>
      <option value="4+">4+ Bedrooms</option>
    </select>
  </div>
</div>


<hr className="mb-5" />

            {/* Heating */}
            <div className="mb-3">

  <h3 className="text-sm font-medium text-gray-700 mb-2">Rental Period</h3>
 
  <div className="grid grid-cols-2 gap-2">
  {[
    "1Day",
    "1Month",
    "2Month",
    "3Month",
    "4Month",
    "5Month",
    "6Month",
    "12Month",
  ].map((option) => (
    <label key={option} className="flex items-center text-xs gap-2">
      <input
        type="checkbox"
        checked={filters.termDuration?.includes(option)}
        onChange={() =>
          setFilters((prev) => ({
            ...prev,
            termDuration: prev.termDuration?.includes(option)
              ? prev.termDuration.filter((item) => item !== option)
              : [...(prev.termDuration || []), option],
          }))
        }
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <span className="text-gray-700">
        {option.replace(/(\d+)([A-Za-z]+)/, "$1 $2")} {/* Adds space */}
      </span>
    </label>
  ))}
</div>

<hr className="mt-5" />


</div>


{/* Residency Type */}
<div className="mb-4">
  <h3 className="text-sm font-medium text-gray-700 mb-2">Residency Type</h3>
  <div className="grid grid-cols-2 gap-2">
  {[
    { value: "New", label: "New Residency" },
    { value: "Old", label: "Old Residency" },
    { value: "Mixed", label: "Mixed Residency" },
    { value: "historical", label: "Historical Residency" },
  ].map((option) => (
    <label key={option.value} className="flex items-center text-sm gap-2">
      <input
        type="radio"
        name="residencyType"
        value={option.value}
        checked={filters.residencyType === option.value}
        onChange={() => handleFilterChange("residencyType", option.value)}
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <span className="text-gray-700">{option.label}</span>
    </label>
  ))}
</div>



</div>

<hr className="mt-5" />


<div className="mb-4 mt-2">
  <h3 className="text-sm font-medium text-gray-700 mb-2">Design Style</h3>
  <div className="grid grid-cols-2 gap-2">
  {[
    "White",
    "Grey",
    "Yellow",
    "New Apartment",
    "Mixed",
    "Old",
    "Retro",
    "Under Repair",
  ].map((style) => (
    <label key={style} className="flex items-center text-sm gap-2">
      <input
        type="checkbox"
        value={style}
        checked={filters.designStyle?.includes(style)}
        onChange={() =>
          setFilters((prev) => ({
            ...prev,
            designStyle: prev.designStyle?.includes(style)
              ? prev.designStyle.filter((item) => item !== style)
              : [...(prev.designStyle || []), style],
          }))
        }
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <span className="text-gray-700">{style}</span>
    </label>
  ))}
</div>

</div>

<hr className="mt-5" />


<div className="mb-4">
  <h3 className="text-sm font-medium text-gray-700 mb-2">Pets</h3>
  <div className="grid grid-cols-2 gap-2">
    {[
      { value: "Allowed", label: "Allowed" },
      { value: "NotAllowed", label: "Not Allowed" },
      { value: "ByAgreement", label: "By Agreement" },
    ].map((option) => (
      <label key={option.value} className="flex items-center text-sm gap-2">
        <input
          type="radio"
          name="pets"
          value={option.value}
          checked={filters.pets === option.value}
          onChange={() => handleFilterChange("pets", option.value)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span className="text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
</div>

<hr className="mt-5" />

            {/* Amenities */}
            <div className="mb-4">
  <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
  <div className="grid grid-cols-2 gap-2">
  {[
    "Bath",
    "Shower",
    "Balcony",
     "Courtyard",
    "ParkingPlace",
    "Conditioner",
    "Dishwasher",
    "Oven",
    "Stove",
    "CentralHeating",
    "Fireplace",
  ].map((option) => (
    <label key={option} className="flex items-center text-sm gap-2">
      <input
        type="checkbox"
        checked={filters.amenities.includes(option)}
        onChange={() =>
          setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(option)
              ? prev.amenities.filter((item) => item !== option)
              : [...prev.amenities, option],
          }))
        }
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <span className="text-gray-700">
        {option.replace(/([A-Z])/g, " $1").trim()} {/* Makes labels clean */}
      </span>
    </label>
  ))}
</div>

</div>
<hr className="mt-5" />




            {/* Buttons */}
            <div className="sticky bottom-0 bg-white border-t pt-3 flex justify-between">
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="w-1/3 bg-gray-300 px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={clearFilters}
                className="w-1/3 bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Clear
              </button>
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="w-1/3 bg-blue-500 px-4 py-2 rounded-r-lg text-white hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
    </div>
  </div>
)}





    </div>
  );
}

export default Search;
