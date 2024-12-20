import { useLocation, useNavigate } from "react-router-dom";

const PropertyMap = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigating back
  const property = location.state?.property; // Get the property details from state

  if (!property) {
    return <div className="text-center text-gray-500 mt-10">Property not found</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-9">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-200"
        >
          Back
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
              <span className="font-semibold text-gray-900">Deal Type:</span>{" "}
              {property.type || "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Price:</span> $
              {property.price || "N/A"} {property.currency || ""}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Room:</span>{" "}
              {property.rooms || "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Bathroom:</span>{" "}
              {property.bathrooms || "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Size:</span>{" "}
              {property.area || "N/A"} sq. ft.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Floor:</span>{" "}
              {property.floor || "N/A"} / {property.totalFloors || "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">City:</span>{" "}
              {property.city || "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Address:</span>{" "}
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
              <span className="font-semibold text-gray-900">Term:</span>{" "}
              {property.term || "N/A"} ({property.termDuration || "N/A"})
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Payment Method:</span>{" "}
              {property.paymentMethod || "FirstDeposit"}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Heating */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Heating</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {property.heating?.length > 0 ? (
                  property.heating.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No heating information</li>
                )}
              </ul>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {property.amenities?.length > 0 ? (
                  property.amenities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No amenities information</li>
                )}
              </ul>
            </div>

            {/* Additional Features */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Additional Features
              </h4>
              <ul className="list-disc ml-5 text-gray-700">
                {property.additional?.length > 0 ? (
                  property.additional.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No additional features</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
