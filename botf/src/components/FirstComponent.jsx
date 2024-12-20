import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useProperties from '../hooks/useProperties';
import "../Fcss.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = "https://add-bot-server.vercel.app"; // Replace with your backend base URL
const FirstComponent = ({ setStep }) => {
  const [localFormData, setLocalFormData] = useState({
    address: '',
    dealType: 'Rental',
  });
  
  const navigate = useNavigate();
  const [setDropdownVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  
  const { data, error } = useProperties();
  const email = localStorage.getItem('email'); // Retrieve email from localStorage
  const filteredData = data?.filter((property) => property.userEmail === email) || [];
  
  // Filter properties based on email
  const publishedCount = filteredData.length;
  const unpublishedCount = 0; // Replace with the actual unpublished count logic if available
  
  useEffect(() => {
    if (filteredData) {
      console.log('Filtered Properties:', filteredData);
    }
    if (error) {
      console.error('Error fetching properties:', error);
    }
  }, [error,filteredData]);

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('form1'));
    if (savedFormData) {
      setLocalFormData(savedFormData);
    }
  }, []);
  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

  useEffect(() => {
    localStorage.setItem('form1', JSON.stringify(localFormData));
  }, []);

  const handlePublish = () => {
    if (!localFormData.address) {
      alert('Please provide an address!');
      return;
    }

    console.log(localFormData);
    setStep(2, localFormData); // Pass localFormData to the next step
  };

  const handleEditButtonClick = (card) => {
    setEditingId(card.id);
    setEditFormData(card);
    setEditModalOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      // Sending the updated data to the backend
      await axios.put(`${API_BASE_URL}/update/${editingId}`, editFormData);

      alert("Property updated successfully!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 shadow">
        <h1 className="text-lg font-semibold">My Ads</h1>
        <div className="flex gap-4 mt-4 text-sm">
          <p>Published: {publishedCount}</p>
          <p>Unpublished: {unpublishedCount}</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="p-4 space-y-6">
        {/* Address Field */}
        <div>
          <label
            htmlFor="Fulladdress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by address
          </label>
          <div className="relative">
            <div className="flex gap-2">
              <input
                id="Fulladdress"
                type="text"
                value={localFormData.address}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, address: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
              <button
                onClick={() => setDropdownVisible((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
              >
                ⇅
              </button>
            </div>
          </div>
        </div>

        {/* Property Details (Cards) */}
        <div className="h-screen overflow-y-auto space-y-4 p-4">
          {filteredData.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="flex flex-row p-4 border border-gray-300 rounded-lg shadow-lg bg-white Card"
            >
              {/* Left Side: Carousel Images */}
              <div className="w-1/2 flex items-center justify-center">
                {card.images && card.images.length > 0 ? (
                  <div className="relative w-full">
                    <div className="flex overflow-x-auto space-x-2 rounded-md">
                      {card.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                          }}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md border">
                    <span className="text-gray-500">No Images Available</span>
                  </div>
                )}
              </div>

              {/* Right Side: Title, Price, and Edit Button */}
              <div className="w-1/2 flex flex-col justify-between pl-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {card.title || 'Untitled Property'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-bold">Price:</span> {card.price || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Type:</span> {card.type || 'N/A'}
                  </p>
                </div>
                <div className="mt-4 flex justify-start">
                  <button
                    onClick={() => handleEditButtonClick(card)}
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Publish Button */}
        <div className="fixed bottom-0 w-full p-1 -ml-4 -z-30  bg-white shadow-md flex justify-center">
          <button
            onClick={handlePublish}
            className="w-full max-w-[300px] py-3 bg-blue-600 text-white font-semibold text-sm rounded-md shadow hover:bg-blue-700"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Edit Property</h2>
            <input
              type="text"
              value={editFormData.title || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              placeholder="Title"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              value={editFormData.price || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, price: e.target.value })
              }
              placeholder="Price"
              className="w-full p-2 border rounded-md"
            />
            <textarea
              value={editFormData.description || ''}
              onChange={(e) =>
                setEditFormData({ ...editFormData, description: e.target.value })
              }
              placeholder="Description"
              className="w-full p-2 border rounded-md"
            />
            <div className="flex justify-between">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

FirstComponent.propTypes = {
  setStep: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
};

export default FirstComponent; 
