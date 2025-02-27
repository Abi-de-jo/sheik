import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
 
const API_BASE_URL = "https://sheik-back.vercel.app/api";

const AgentCard = () => {
  const {t} = useTranslation("home")
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dbandd0k7/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "zf9wfsfi";
  const [isEditing, setIsEditing] = useState(false);
  const [showRentForm, setShowRentForm] = useState(false); // To show/hide the rent form
  const [rentDetails, setRentDetails] = useState({
    username: "",
    telephoneNumber: "",
     codastral: "",
    startDate:"", 
    endDate:""
   }); // Form fields for rent
  const [editedCard, setEditedCard] = useState(location.state?.property || {});

  const role = localStorage.getItem("role");
 const email = localStorage.getItem("teleNumber")
//  const email ="1469627446";
  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/residency/update/${editedCard.id}`, editedCard);
      setIsEditing(false);
      alert("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property. Please try again.");
    }
  };

    const handleUpdate = async () => {
    try {
      // Perform the update API call
      await axios.put(`${API_BASE_URL}/residency/update/${editedCard.id}`, editedCard);
      alert("Property updated successfully!");
      setIsEditing(false); // Exit editing mode if needed
      navigate(-1); // Navigate back or reload the page
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property. Please try again.");
    }
  };

  const handleRentFormSubmit = async () => {
    try {
      // Add editedCard.title to rentDetails
      const rentData = {
        ...rentDetails,
        residency: editedCard.title, // Include the property title as residency
      };
  
      await axios.post(
        `${API_BASE_URL}/user/rentedbyagent/${editedCard.id}`,
        rentData
      );
  
      alert("Property marked as rented successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to mark property as rented. Please try again.");
    }

    try {
      await axios.post(`${API_BASE_URL}/residency/rented/${editedCard.id}`);
      setIsEditing(false);
      alert("Property rented successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property. Please try again.");
    }
  
    console.log(rentDetails);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCard({ ...editedCard, [name]: value });
  };

  const handleRentFormChange = (e) => {
    const { name, value } = e.target;
    setRentDetails({ ...rentDetails, [name]: value });
  };
  const handleArchive = async () => {
    try {
      await axios.post(`${API_BASE_URL}/residency/archieve/${editedCard.id}`);
      alert("Property archived successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error archiving property:", error);
      alert("Failed to archive property. Please try again.");
    }
  };

   const handleReupload = async () => {
    try {
      await axios.post(`${API_BASE_URL}/residency/drafttores/${editedCard.id}`);
      alert("Property reuploaded successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error reuploading property:", error);
      alert("Failed to reupload property. Please try again.");
    }
  };

  const handleImageRemove = (imageUrl) => {
    setEditedCard((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
  };
  const handleImageUpload = async () => {
    try {
      setIsUploading(true);
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.click();

      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        const uploadedImageUrl = response.data.secure_url;

        setEditedCard((prev) => ({
          ...prev,
          images: [...(prev.images || []), uploadedImageUrl],
        }));
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setIsUploading(false);
    }
  };
  return (
    <div className="p-6 border border-gray-300 rounded-md shadow-md bg-white space-y-4 mb-11">
      <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={handleBack}
        >
          {t("back")}
        </button>
        {editedCard.images && editedCard.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {editedCard.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Property Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border border-gray-300"
              />
              {isEditing && (
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleImageRemove(image)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              className="w-full h-32 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-md"
              onClick={handleImageUpload}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No images available for this property.</p>
      )}

    {isEditing ? (
  <div className="space-y-2">
  <input
    type="text"
    name="title"
    value={editedCard.title || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("property_title")}
  />
  <input
    type="text"
    name="address"
    value={editedCard.address || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("address")}
  />
  <input
    type="text"
    name="addressURL"
    value={editedCard.addressURL || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("address_url")}
  />
  <input
    type="text"
    name="googleaddressurl"
    value={editedCard.googleaddressurl || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("address_url")}
  />
  <input
    type="text"
    name="price"
    value={editedCard.price || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("price")}
  />
  <input
    type="text"
    name="discount"
    value={editedCard.discount || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("discount")}
  />
  <input
    type="text"
    name="rooms"
    value={editedCard.rooms || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("rooms")}
  />
  <input
    type="text"
    name="floor"
    value={editedCard.floor || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("floor")}
  />
  <input
    type="text"
    name="totalFloors"
    value={editedCard.totalFloors || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("total_floors")}
  />
  <input
    type="text"
    name="termDuration"
    value={editedCard.termDuration || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("term_duration")}
  />
  <input
    type="text"
    name="city"
    value={editedCard.city || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("city")}
  />
  <input
    type="text"
    name="district"
    value={editedCard.district || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("district")}
  />
  <input
    type="text"
    name="propertyType"
    value={editedCard.propertyType || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("property_type")}
  />
  <input
    type="text"
    name="residencyType"
    value={editedCard.residencyType || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("residency_type")}
  />
  <input
    type="text"
    name="bathrooms"
    value={editedCard.bathrooms || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("bathrooms")}
  />
  <textarea
    name="description"
    value={editedCard.description || ""}
    onChange={handleInputChange}
    className="w-full p-2 border rounded"
    placeholder={t("description")}
    rows="4"
  ></textarea>
</div>
) : (
  <div className="space-y-2">
  <h2 className="text-xl font-bold">
    {editedCard.title || t("untitled_property")}
  </h2>

  <p className="text-gray-700">
    <span className="font-semibold">{t("address")}: </span>
    {editedCard.address || t("no_address_provided")}
  </p>

  <p className="text-gray-700">
    <span className="font-semibold">{t("address_url")}: </span>
    {editedCard.googleaddressurl || t("no_url_provided")}
  </p>

  <p className="text-gray-700">
    <span className="font-semibold">{t("rooms")}: </span>
    {editedCard.rooms || t("not_specified")}
  </p>

  <p className="text-gray-700">
  <span className="font-semibold">{t("city")}: </span>
  {editedCard.city ? t(editedCard.city.toLowerCase(), { defaultValue: editedCard.city }) : t("not_specified")}
</p>


  <p className="font-semibold">
    <span className="font-semibold">{t("price")}: </span>
    {editedCard.discount ? (
      <>
        <span className="line-through text-gray-500">
          ${editedCard.price}
        </span>{" "}
        <span>${editedCard.price - editedCard.discount}</span>
      </>
    ) : editedCard.price ? (
      `$${editedCard.price}`
    ) : (
      t("not_available")
    )}
  </p>

  {editedCard.description && (
    <p className="text-gray-600">
      <span className="font-semibold">{t("description")}: </span>
      {editedCard.description}
    </p>
  )}

  <p className="text-sm text-gray-500">
    <span className="font-semibold">{t("status")}: </span>
    {editedCard.status || t("unknown")}
  </p>
</div>
)}

      <div className="flex items-center -ml-4 justify-center ">
        {role === "admin" || email === editedCard.userTeleNumber ? (
          <div >
            {editedCard.status === "published" && (
              <>
                {isEditing ? (
                  <button
                    className="px-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleSave}
                  >
                    {t("save")}
                  </button>
                ) : (
                  <button
                    className="px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleEdit}
                  >
                                        {t("edit")}

                  </button>
                )}
                <button
                  className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4"
                  onClick={handleArchive}
                >
                                      {t("archive")}

                </button>
                <button
                  className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 ml-4"
                  onClick={() => setShowRentForm(true)} // Show the rent form
                >
                  {t("rent")}
                </button>
                <button
            className="px-2 py-2 mt-3 -ml-0  bg-purple-500 text-white rounded-md hover:bg-purple-600  ml-3"
            onClick={handleUpdate}
          >
            {t("update")}
          </button>
               
                
              </>
            )}
             {editedCard.status === "rented" && (
              <>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={handleReupload}
                >
                  Reupload
                </button>
              </>
            )}
             {editedCard.status === "archieve" && (
              <>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={handleReupload}
                >
                  Reupload
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">You cannot edit or delete this property.</p>
        )}
        {editedCard.status === "draft" ? (
          <>
            {isEditing ? (
              <button
                className="px-5 py-2 mr-[230px] bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="px-5 py-2 mr-[230px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </>
        ) : (
         ""
        )}
        
          
      </div>

      {/* Rent Form */}
      {showRentForm && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-100">
          <h3 className="text-lg font-bold mb-4">Rent Details</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="username"
              value={rentDetails.username}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="Renter Name"
            />
            <input
              type="text"
              name="telephoneNumber"
              value={rentDetails.telephoneNumber}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="Renter Contact"
            />
            <input
              type="text"
              name="startDate"
              value={rentDetails.startDate}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="start Period"
            />
            <input
              type="text"
              name="endDate"
              value={rentDetails.endDate}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="End Period"
            />
           
            <input
              type="text"
              name="codastral"
              value={rentDetails.codastral}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="codastral code"
            />
            
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleRentFormSubmit} // Submit rent form
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4"
              onClick={() => setShowRentForm(false)} // Close rent form
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
