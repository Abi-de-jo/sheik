import { useLocation, useNavigate } from "react-router-dom";

const PropertyMap = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigating back
  const property = location.state?.property; // Get the property details from state

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="p-4">
      
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Back
      </button>

      {/* Property Details */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Price:</span> ${property.price}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Address:</span> {property.address}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Description:</span> {property.description || "No description available."}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Contact:</span> {property.contact || "No contact information available."}
        </p>
        <div className="mt-4">
          <img
            src={property.images?.[0] || "https://via.placeholder.com/300"}
            alt={property.title}
            className="w-full h-auto rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
