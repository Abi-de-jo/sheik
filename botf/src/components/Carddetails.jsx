import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
const API_BASE_URL = "https://sheik-back.vercel.app/api"; // Replace with your backend base URL

const CardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(location.state?.card || {});

  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-300 rounded-md shadow-md bg-white space-y-4 mb-5">
      {/* Image Carousel */}
      <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
        {editedCard.images && editedCard.images.length > 0 ? (
          <div className="flex overflow-x-auto snap-x space-x-2">
            {editedCard.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-64 object-cover snap-center rounded-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No Images Available</p>
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
            <span className="text-gray-800">Price: </span>
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
              <span className="font-medium text-gray-700">City:</span> {editedCard.city || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Metro:</span>{" "}
              {editedCard.metro?.length > 0 ? editedCard.metro.join(", ") : "N/A"}
            </p>
            <p className="col-span-2">
              <span className="font-medium text-gray-700">District:</span>{" "}
              {editedCard.district?.length > 0 ? editedCard.district.join(", ") : "N/A"}
            </p>
          </div>

          {/* editedCard Details */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
            <p>
              <span className="font-medium text-gray-700">Property:</span>{" "}
              {editedCard.propertyType || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Residency:</span>{" "}
              {editedCard.residencyType || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Size:</span> {editedCard.area || "N/A"} sq. mt
            </p>
            <p>
              <span className="font-medium text-gray-700">Room:</span> {editedCard.rooms || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Bathroom:</span>{" "}
              {editedCard.bathrooms || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Floor:</span>{" "}
              {editedCard.floor || "N/A"} / {editedCard.totalFloors || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Parking:</span> {editedCard.parking || "N/A"}
            </p>
            
            <p className="">
              <span className="font-medium text-gray-700">Design:</span>{" "}
              {editedCard.design?.length > 0 ? editedCard.design.join(", ") : "N/A"}
            </p>
          </div>

          {/* Term and Payment Details */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
            <p>
              <span className="font-medium text-gray-700">Term:</span> {editedCard.term || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Duration:</span>{" "}
              {editedCard.termDuration?.length > 0 ? editedCard.termDuration.join(",") : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Payment:</span>{" "}
              {editedCard.paymentMethod || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Deposit:</span> {editedCard.deposit || "N/A"} {editedCard.currency}
            </p>
            <p>
              <span className="font-medium text-gray-700">Commission:</span>{" "}
              {editedCard.commission || "N/A"}%
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
                  Watch Video
                </a>
              </p>
            </div>
          )}

          {/* Additional Sections */}
          <div className="border-t pt-4 space-y-4">
            {/* Amenities */}
            <div>
              <h3 className="font-semibold text-gray-700">Amenities</h3>
              <ul className="list-disc ml-6">
                {editedCard.amenities && editedCard.amenities.length > 0 ? (
                  editedCard.amenities.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No amenities listed</p>
                )}
              </ul>
            </div>

            {/* Heating */}
            <div>
              <h3 className="font-semibold text-gray-700">Heating</h3>
              <ul className="list-disc ml-6">
                {editedCard.heating && editedCard.heating.length > 0 ? (
                  editedCard.heating.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No heating information</p>
                )}
              </ul>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="font-semibold text-gray-700">Additional Information</h3>
              <ul className="list-disc ml-6">
                {editedCard.selectedAdditional && editedCard.selectedAdditional.length > 0 ? (
                  editedCard.selectedAdditional.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No additional information</p>
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
                Save
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600"
              onClick={handleDelete}
            >
              Update
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
              onClick={handleUpdate}
            >
              Delete
            </button>

          </div>
        ) : (
          <p className="text-gray-500">You cannot edit or delete this property.</p>
        )}




        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
          onClick={handleBack}
        >
          Back
        </button>
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
