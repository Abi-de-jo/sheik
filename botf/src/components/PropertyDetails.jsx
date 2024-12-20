import { useLocation, useNavigate } from "react-router-dom";

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-base mb-4">No property details available.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 text-sm rounded shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        ← Back
      </button>

      {/* Property Details Card */}
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Property Image */}
        <div className="relative">
          <img
            src={
              property.images?.[0] ||
              "https://via.placeholder.com/600x300?text=No+Image+Available"
            }
            alt="Property"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 bg-black bg-opacity-50 w-full p-2 text-white">
            <h2 className="text-xl font-bold truncate">{property.title || "Untitled Property"}</h2>
          </div>
        </div>

        {/* Property Info */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <p className="text-gray-700">
              <span className="font-bold">Price:</span>{" "}
              <span className="text-blue-600">
                {property.price ? `$${property.price}` : "N/A"}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Type:</span> {property.type || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Updated At:</span>{" "}
              {new Date(property.updatedAt).toLocaleDateString("en-GB")}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Description:</span>{" "}
              {property.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4 w-full max-w-lg">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded shadow hover:bg-gray-400 transition-transform transform hover:scale-105"
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
