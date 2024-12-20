

import { useLocation, useNavigate } from "react-router-dom";

const AgentDraft = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { draft } = location.state || {}; // Destructure draft from state

  if (!draft) {
    return <p className="text-center mt-10">Draft details not available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)} // Go back
        className="mb-4 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{draft.title || "Untitled Draft"}</h1>

        {/* Images */}
        {draft.images && draft.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {draft.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {/* Full Details */}
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Price:</strong> ${draft.price || "N/A"}</p>
          <p><strong>City:</strong> {draft.city || "N/A"}</p>
          <p><strong>Status:</strong> {draft.status || "N/A"}</p>
          <p><strong>Address:</strong> {draft.address || "N/A"}</p>
          <p><strong>Type:</strong> {draft.type || "N/A"}</p>
          <p><strong>Bathrooms:</strong> {draft.bathrooms || "N/A"}</p>
          <p><strong>Floor:</strong> {draft.floor || "N/A"}</p>
          <p><strong>Updated At:</strong> {new Date(draft.updatedAt).toLocaleString()}</p>
        </div>

        {/* Description */}
        {draft.description && (
          <div>
            <h2 className="font-bold mt-4">Description:</h2>
            <p>{draft.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDraft;
