 import { useNavigate } from "react-router-dom";
import useProperties from "../hooks/useProperties";

export default function AdminPub() {
  const navigate = useNavigate();
  const { data = [] } = useProperties(); // Fallback to an empty array if data is undefined

  // Retrieve the email from localStorage
  const storedEmail = localStorage.getItem("email");
 
  // Filter properties by matching email
  const publishedProperties = data.filter(
    (property) => property.email === storedEmail
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 mb-12">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* Published Properties */}
      <div className="grid grid-cols-1 gap-4">
        {publishedProperties.length > 0 ? (
          publishedProperties.map((property) => (
            <div
              onClick={() =>
                navigate(`/property/${property.id}`, { state: { property } })
              }
              key={property.id}
              className="flex p-4 bg-gray-50 border border-gray-200 rounded-md shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
            >
              {/* Left: Image */}
              <div className="w-1/3 flex items-center justify-center">
                <img
                  src={
                    property.images?.[0] ||
                    "https://via.placeholder.com/100x100?text=No+Image"
                  }
                  alt="Property"
                  className="w-24 h-24 object-cover rounded-md border border-gray-300"
                />
              </div>

              {/* Right: Details */}
              <div className="w-2/3 pl-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {property.title || "Untitled Property"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Price:</span> {property.price || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Type:</span> {property.type || "N/A"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Published:</span>{" "}
                  {new Date(property.updatedAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No published properties available.
          </p>
        )}
      </div>
    </div>
  );
}
