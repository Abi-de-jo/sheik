import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
const API_BASE_URL = "https://add-bot-server.vercel.app/api"; // Replace with your backend base URL

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
        <>
          <h2 className="text-xl font-bold">{editedCard.title || 'Untitled Property'}</h2>

          
          <p className="text-sm text-gray-600">
          📍 {editedCard.addressURL ? (
    <a
      href={editedCard.addressURL}
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

          <p className="text-sm text-blue-500">{editedCard?.type}</p>
          <p className="text-sm text-blue-500">{editedCard?.term} {editedCard?.termDuration}</p>
          <p className="text-lg font-semibold">
  Price:{" "}
  {editedCard.discount ? (
    <>
      <span className="text-gray-500 line-through mr-2">
        {editedCard.price} $
      </span>
      <span className="text-yellow-500">
        {(
          editedCard.price -
          (editedCard.price * editedCard.discount) / 100
        ).toFixed(2)}{" "}
        $
      </span>
      <span className="text-green-500 ml-2">
        ({editedCard.discount}% off)
      </span>
    </>
  ) : (
    <span className="text-yellow-500">{editedCard.price || "N/A"} $</span>
  )}
</p>
        </>
      )}

      {/* Amenities */}
      <div>
        <h3 className="font-semibold">Amenities</h3>
        <ul className="list-disc ml-6">
          {editedCard.amenities && editedCard.amenities.length > 0 ? (
            editedCard.amenities.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No amenities listed</p>
          )}
        </ul>
      </div>

      {/* Heating */}
      <div>
        <h3 className="font-semibold">Heating</h3>
        <ul className="list-disc ml-6">
          {editedCard.heating && editedCard.heating.length > 0 ? (
            editedCard.heating.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No heating information</p>
          )}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Additional Information</h3>
        <ul className="list-disc ml-6">
          {editedCard.selectedAdditional && editedCard.selectedAdditional.length > 0 ? (
            editedCard.selectedAdditional.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No additional information</p>
          )}
        </ul>
      </div>

      {/* Buttons */}
      <div className="p-4 flex items-center justify-between">
        
        
        
        {role ==="admin" || email==editedCard.email ? (
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
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
              onClick={handleDelete}
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
