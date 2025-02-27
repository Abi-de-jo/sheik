import axios from "axios";
import { useTranslation } from "react-i18next";


 


import { useLocation, useNavigate } from "react-router-dom";

const PropertyMap =   () => {
  const { t } = useTranslation("home")   

  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigating back
  const property = location.state?.property; // Get the property details from state
  
  const Write = async (property) => {

     console.log("Property ID:", property.id);
    console.log("Property Details:", property);
    
    try {

  // Prepare property details message
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

      const teleNumber = localStorage.getItem("teleNumber")
      const response = await axios.post(`https://sheik-back.vercel.app/api/user/addInterest/${property.id}`, {
        teleNumber,
      });
      console.log("Interest added:", response.data);

    

      return response.data;
    } catch (error) {
      console.error("Error adding interest:", error.response?.data || error.message);
      throw error;
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-9">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-200"
        >
      {t("back")}
      </button>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {property.title || "Property Title"}
        </h1>

        {/* Image Gallery and Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <img
            src={property.images?.[0] || "https://via.placeholder.com/300"}
            alt={property.title}
            className="w-full h-auto rounded-lg shadow-md"
          />

          {/* Details */}
          <div>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("type")}:</span>{" "}
   { t(property.type.toLowerCase()) || "N/A"  } 
    </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("price")}:</span> 
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
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("room")}:</span>{" "}
    {property.rooms || "N/A"}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("bath")}:</span>{" "}
    {property.bathrooms || "N/A"}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("size")}:</span>{" "}
    {property.area || "N/A"} {t("sq.m")}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("floor")}:</span>{" "}
    {property.floor || "N/A"} / {property.totalFloors || "N/A"}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("city")}:</span>{" "}
    {t(property.city.toLowerCase() || "N/A")}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("address")}:</span>{" "}
    <a
      href={property.googleaddressurl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      {property.address || "N/A"}
    </a>
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("term")}:</span>{" "}
    {t(property.term ? property.term.replace(/[-\s]/g, "_").toLowerCase() : "first_deposit")}
  </p>
  <p className="text-lg text-gray-700 mb-4">
    <span className="font-semibold text-gray-900">{t("payment")}:</span>{" "}
    {t(property.paymentMethod || "FirstDeposit")}
    </p>
</div>

        </div>

        {/* Additional Information */}
      <div className="mt-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    {t("additional_information")}
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Heating */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("heating")}</h4>
      <ul className="list-disc ml-5 text-gray-700">
        {property.heating?.length > 0 ? (
          property.heating.map((item, index) => (
            <li key={index}>{t(item.replace(/[-\s]/g, "_").toLowerCase())}</li>
          ))
        ) : (
          <li className="text-gray-500">{t("no_heating_info")}</li>
        )}
      </ul>
    </div>

    {/* Amenities */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("amenities")}</h4>
      <ul className="list-disc ml-5 text-gray-700">
        {property.amenities?.length > 0 ? (
          property.amenities.map((item, index) => (
            <li key={index}>{t(item.replace(/[-\s]/g, "_").toLowerCase())}</li>
          ))
        ) : (
          <li className="text-gray-500">{t("no_amenities_info")}</li>
        )}
      </ul>
    </div>

    {/* Additional Features */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("additional_features")}</h4>
      <ul className="list-disc ml-5 text-gray-700">
        {property.selectedAdditional?.length > 0 ? (
          property.selectedAdditional.map((item, index) => (
            <li key={index}>{t(item.replace(/[-\s]/g, "_").toLowerCase())}</li>
          ))
        ) : (
          <li className="text-gray-500">{t("no_additional_features")}</li>
        )}
      </ul>
    </div>
  </div>

  {/* Contact Button */}
  <button
    className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded shadow hover:bg-blue-600 transition"
    onClick={() => Write(property)}
  >
    {t("contact")}
  </button>
</div>

      </div>
    </div>
  );
};

export default PropertyMap;
