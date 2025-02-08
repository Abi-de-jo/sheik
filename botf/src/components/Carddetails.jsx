import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
const API_BASE_URL = "https://sheik-back.vercel.app/api"; // Replace with your backend base URL
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dbandd0k7/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "zf9wfsfi";
import {useTranslation} from "react-i18next"
const CardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(location.state?.card || {});
  const [isUploading, setIsUploading] = useState(false);
const {t} = useTranslation("home")
  // const email = "david@gmail.com";
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleBack = () => {
    navigate(-1);
  };






  const handleEdit = () => {
    setIsEditing(true);
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

  const handleImageRemove = (imageUrl) => {
    setEditedCard((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
  };



  const handleSave = async () => {
    try {
      console.log(editedCard)
      await axios.put(`${API_BASE_URL}/residency/update/${editedCard.id}`, editedCard);

      setIsEditing(false);
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API_BASE_URL}/residency/delete/${editedCard.id}`);
        alert('Property deleted successfully!');
        navigate(-1);
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
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



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCard({ ...editedCard, [name]: value });
  };

  if (!editedCard) {
    return (
      <div className="p-6 border border-gray-300 rounded-md shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">No Card Selected</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          onClick={handleBack}
        >
          {t("back")}
          </button>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-300 rounded-md shadow-md bg-white space-y-4 mb-5">
      {/* Image Carousel */}
      <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
          onClick={handleBack}
        >
          {t("back")}
        </button>
    {/* Image Carousel Section */}
    <div className="relative w-full h-full bg-gray-200 rounded-md overflow-hidden">
  {editedCard.images && editedCard.images.length > 0 ? (
    <div className="relative flex overflow-x-scroll snap-x space-x-4 p-4">
      {editedCard.images.map((image, index) => (
        <div
          key={index}
          className="relative flex-shrink-0 w-64 h-64 snap-center bg-gray-100 rounded-md shadow-md"
        >
          <img
            src={image}
            alt={`Property ${index + 1}`}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"; // Reliable placeholder
            }}
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

      {/* Upload New Image Button as the Last Card */}
      {isEditing && (
        <div
          className="relative flex-shrink-0 w-64 h-64 snap-center bg-gray-100 rounded-md shadow-md flex items-center justify-center"
          onClick={handleImageUpload}
        >
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload New Image"}
          </button>
        </div>
      )}
    </div>
  ) : (
    <p className="text-gray-400 text-center">No Images Available</p>
  )}

  {/* Submit All Images to Backend */}
  {isEditing && (
    <div className="mt-4">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        onClick={async () => {
          try {
            await axios.put(
              `${API_BASE_URL}/residency/update/${editedCard.id}`,
              { images: editedCard.images }  
            );
            alert("Images updated successfully!");
            navigate(-1)
          } catch (error) {
            console.error("Error updating images:", error);
            alert("Failed to update images. Please try again.");
          }
        }}
      >
        Save All Images
      </button>
    </div>
  )}
</div>



      {/* Property Details */}
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            value={editedCard.title || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Property Title"
          />
          <input
            type="text"
            name="address"
            value={editedCard.address || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Address"
          />
          <input
            type="text"
            name="type"
            value={editedCard.type || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Property Type"
          />
          <input
            type="text"
            name="term"
            value={editedCard.term || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Term"
          />
          <input
            type="text"
            name="termDuration"
            value={editedCard.termDuration || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Term Duration"
          />
          <input
            type="text"
            name="price"
            value={editedCard.price || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Price"
          />
          <input
            type="text"
            name="discount"
            value={editedCard.discount || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Discount"
          />
        </div>
      ) : (


        <div className="p-6 mb-6 rounded-lg shadow-lg  space-y-6 bg-white">
          {/* Title */}
          <h2 className="text-2xl -mt-8  font-bold text-gray-800 border-b pb-2">{editedCard.title || "Untitled Property"}</h2>

          {/* Price with Discount */}
          <div className="text-lg font-semibold">
            <span className="text-gray-800">          {t("price")}
            </span>
            <p className="text-sm text-gray-800 font-bold mt-1">
  {editedCard.discount ? (
    <>
      <span className="line-through text-gray-500">
        {editedCard.price} {editedCard.currency}
      </span>{" "}
      <span>
        {(editedCard.price - editedCard.discount).toFixed()} {editedCard.currency}
      </span>
    </>
  ) : (
    `${editedCard.price || "N/A"} ${editedCard.currency}`
  )}
</p>

          </div>

          {/* Address */}
          <div className="text-sm">
            <span className="font-medium text-gray-700"></span>
            <p className="text-sm text-gray-600">
              📍 {editedCard.addressURL ? (
                <a
                  href={
                    editedCard.addressURL.startsWith("http") // Check if it's a full URL
                      ? editedCard.addressURL
                      : `https://www.google.com/maps?q=${encodeURIComponent(
                        editedCard.addressURL
                      )}` // Construct a Google Maps search URL
                  }
                  target="_blank" // Opens in a new tab
                  rel="noopener noreferrer" // Security best practice
                  className="text-blue-500 hover:underline"
                >
                  {editedCard.address || "Click here for location"}
                </a>
              ) : (
                editedCard.address || "Location not provided"
              )}
            </p>
          </div>

          {/* City, Metro, and District */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
            <span className="font-medium text-gray-700">{t("city")}:</span> 
           {editedCard.city ? t(`${editedCard.city.toLowerCase()}`) : t("not_available")}

            </p>
            <p>
              <span className="font-medium text-gray-700">{t("metro")}</span>{" "}
              {editedCard.metro?.length > 0 
  ? editedCard.metro.map((item) => t(`${item.toLowerCase()}`)).join(", ") 
  : t("not_available")}
            </p>
            <p className="col-span-2">
              <span className="font-medium text-gray-700">{t("district")}</span>{" "}
              {editedCard.district?.length > 0 
  ? editedCard.district.map((item) => t(`${item.toLowerCase()}`)).join(", ") 
  : t("not_available")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
  <p>
    <span className="font-medium text-gray-700">{t("property")}:</span>{" "}
    {editedCard.propertyType ? t(`${editedCard.propertyType.toLowerCase()}`) : t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("residency")}:</span>{" "}
    {editedCard.residencyType ? t(`${editedCard.residencyType.toLowerCase()}`) : t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("size")}:</span>{" "}
    {editedCard.area || t("not_available")} {t("sq.m")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("room")}:</span>{" "}
    {editedCard.rooms || t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("bath")}:</span>{" "}
    {editedCard.bathrooms || t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("floor")}:</span>{" "}
    {editedCard.floor || t("not_available")} / {editedCard.totalFloors || t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("parking")}:</span>{" "}
    {editedCard.parking || t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("design")}:</span>{" "}
    {editedCard.design?.length > 0
      ? editedCard.design.map((item) => t(`${item.toLowerCase()}`)).join(", ")
      : t("not_available")}
  </p>
</div>


          {/* Term and Payment Details */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
  <p>
    <span className="font-medium text-gray-700">{t("term")}:</span>{" "}
    {editedCard.term ? t(`${editedCard.term.toLowerCase()}`) : t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("durations")}:</span>{" "}
    {editedCard.termDuration?.length > 0
      ? editedCard.termDuration.map((item) => t(`${item.toLowerCase()}`)).join(", ")
      : t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("payment")}:</span>{" "}
    {editedCard.paymentMethod ? t(`${editedCard.paymentMethod.toLowerCase()}`) : t("not_available")}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("deposit")}:</span>{" "}
    {editedCard.deposit || t("not_available")} {editedCard.currency || ""}
  </p>
  <p>
    <span className="font-medium text-gray-700">{t("commission")}:</span>{" "}
    {editedCard.commission || t("not_available")}%
  </p>
</div>


          {/* Video */}
          {editedCard.video && (
            <div className="border-t pt-4">
              <p className="text-sm">
                <a
                  href={editedCard.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
  {t("watch_video")}
  </a>
              </p>
            </div>
          )}

          {/* Additional Sections */}
          <div className="border-t pt-4 space-y-4">
  {/* Amenities */}
  <div>
    <h3 className="font-semibold text-gray-700">{t("amenities")}</h3>
    <ul className="list-disc ml-6">
      {editedCard.amenities && editedCard.amenities.length > 0 ? (
        editedCard.amenities.map((item, index) => (
          <li key={index} className="text-sm text-gray-600">
            {t(`${item.toLowerCase()}`)}
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500">{t("no_amenities_listed")}</p>
      )}
    </ul>
  </div>

  {/* Heating */}
  <div>
    <h3 className="font-semibold text-gray-700">{t("heating")}</h3>
    <ul className="list-disc ml-6">
      {editedCard.heating && editedCard.heating.length > 0 ? (
        editedCard.heating.map((item, index) => (
          <li key={index} className="text-sm text-gray-600">
            {t(`${item.toLowerCase()}`)}
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500">{t("no_heating_information")}</p>
      )}
    </ul>
  </div>

  {/* Additional Information */}
  <div>
    <h3 className="font-semibold text-gray-700">{t("additional_information")}</h3>
    <ul className="list-disc ml-6">
      {editedCard.selectedAdditional && editedCard.selectedAdditional.length > 0 ? (
        editedCard.selectedAdditional.map((item, index) => (
          <li key={index} className="text-sm text-gray-600">
            {t(`${item.toLowerCase()}`)}
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500">{t("no_additional_information")}</p>
      )}
    </ul>
  </div>
</div>

        </div>





      )}

      {/* Amenities */}


      {/* Buttons */}
      <div className="p-4 flex items-center justify-between">



        {role === "admin" || email == editedCard.email ? (
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                onClick={handleSave}
              >
                {t("save")}
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                onClick={handleEdit}
              >
                {t("edit")}
              </button>
            )}
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600"
              onClick={handleUpdate}
            >
              {t("update")}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
              onClick={handleDelete}
            >
              {t("delete")}
            </button>

          </div>
        ) : (
          <p className="text-gray-500">You cannot edit or delete this property.</p>
        )}




        
      </div>
    </div>
  );
};

CardDetails.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    address: PropTypes.string,
    price: PropTypes.string,
    type: PropTypes.string,
    term: PropTypes.string,
    termDuration: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    amenities: PropTypes.arrayOf(PropTypes.string),
    heating: PropTypes.arrayOf(PropTypes.string),
    selectedAdditional: PropTypes.arrayOf(PropTypes.string),
    userEmail: PropTypes.string,
  }),
};

export default CardDetails;
