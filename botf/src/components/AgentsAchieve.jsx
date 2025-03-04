import { useEffect, useState } from "react";
import { getAll } from "../utils/api";
import { useNavigate } from "react-router-dom";



export default function AgentsAchieve() {
  const [data, setData] = useState([]); // Initialize state as an empty array
  
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAll(); // Fetch the data
        console.log("Full Response from getAll():", response); // Debugging
        if (response) {
          const filteredData = response.filter((item) => item.status === "archieve"); // Filter data by status
          setData(filteredData); // Update state with the filtered array
        } else {
          console.warn("No data found in response:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []); // Run only once on mount

  // Function to calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (price && discount && discount > 0) {
      return (price - discount).toFixed();
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Agents Archive
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden "
            >
              {/* Image Section */}
              <div className="relative">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-[200px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                    No images available
                  </div>
                )}

                {/* Discount Tag */}
                {item.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    -{item.discount} OFF
                  </span>
                )}
              </div>

              {/* Details Section */}
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1 text-gray-800">
                  {item.title || "Untitled"}
                </h2>
                <p className="text-gray-600 mb-1 text-sm">
                  Agent: <span className="font-semibold">{item.email.split("rentintbilisi")[0]}</span>
                </p>
                <p className="text-gray-600 mb-1 text-sm">
                  Agent Mail: <span className="font-semibold">{item.email}</span>
                </p>
                <p className="text-gray-600 mb-1 text-sm">
                  Agent Contact: <span className="font-semibold">{item.teleNumber || "@David_Tibelashvili"}</span>
                </p>
                <p className="text-sm text-gray-800 font-bold mt-1">
                  {item.discount ? (
                    <>
                      <span className="line-through text-gray-500">
                        {item.price} {item.currency}
                      </span>{" "}
                      <span className="text-red-600">
                        {getDiscountedPrice(item.price, item.discount)} {item.currency}
                      </span>
                    </>
                  ) : (
                    `${item.price || "N/A"} ${item.currency}`
                  )}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                  <button className="bg-blue-500 text-white text-xs font-bold py-1 px-4 rounded-lg hover:bg-blue-600 transition">
                    Contact Agent
                  </button>
                  <button className="bg-green-500 text-white text-xs font-bold py-1 px-4 rounded-lg hover:bg-green-600 transition"     onClick={() => navigate(`/single/${item.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
}
