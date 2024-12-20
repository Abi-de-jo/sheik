import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://nothing-client.vercel.app/api";

const AgentCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showRentForm, setShowRentForm] = useState(false); // To show/hide the rent form
  const [rentDetails, setRentDetails] = useState({
    username: "",
    telephoneNumber: "",
    residency: "",
    codastral: "",
    startDate:"", 
    endDate:""
   }); // Form fields for rent
  const [editedCard, setEditedCard] = useState(location.state?.property || {});

  const role = localStorage.getItem("role");
 const email = localStorage.getItem("teleNumber")
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

  return (
    <div className="p-6 border border-gray-300 rounded-md shadow-md bg-white space-y-4 mb-5">
      {editedCard.images && editedCard.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {editedCard.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Property Image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md border border-gray-300"
            />
          ))}
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
            placeholder="Property Title"
          />
          <input
            type="text"
            name="address"
            value={editedCard.address || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Address"
          />
          <input
            type="text"
            name="type"
            value={editedCard.type || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Property Type"
          />
          <input
            type="text"
            name="price"
            value={editedCard.price || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Price"
          />
          <textarea
            name="description"
            value={editedCard.description || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
            rows="4"
          ></textarea>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{editedCard.title || "Untitled Property"}</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Address: </span>
            {editedCard.address || "No address provided"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Type: </span>
            {editedCard.type || "Type not specified"}
          </p>
          <p className="text-yellow-500 font-semibold">
            <span className="font-semibold">Price: </span>
            {editedCard.price ? `$${editedCard.price}` : "N/A"}
          </p>
          {editedCard.description && (
            <p className="text-gray-600">
              <span className="font-semibold">Description: </span>
              {editedCard.description}
            </p>
          )}
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Status: </span>
            {editedCard.status || "Unknown"}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        {role === "admin" || email === editedCard.userTeleNumber ? (
          <div>
            {editedCard.status === "published" && (
              <>
                {isEditing ? (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4"
                  onClick={handleArchive}
                >
                  Archive
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 ml-4"
                  onClick={() => setShowRentForm(true)} // Show the rent form
                >
                  Rent
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">You cannot edit or delete this property.</p>
        )}
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={handleBack}
        >
          Back
        </button>
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
              name="residency"
              value={rentDetails.residency}
              onChange={handleRentFormChange}
              className="w-full p-2 border rounded"
              placeholder="Residency Name"
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
