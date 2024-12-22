import { useEffect, useState } from "react";
import { getAll } from "../utils/api";

export default function AgentsAchieve() {
  const [data, setData] = useState([]); // Initialize state as an empty array

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Agents Archieve</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow flex items-center"
            >
              {/* Left Division: Image */}
              <div className="w-1/4">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-[100px]  object-cover rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500">No images available</p>
                )}
              </div>

              {/* Right Division: Details */}
              <div className="w-3/4 pl-4">
                <h2 className="font-bold text-lg mb-2">{item.title || "Untitled"}</h2>
                <p className="text-gray-600 mb-2">Price: ${item.price || "N/A"}</p>
                <p className="text-gray-600 mb-2">Agent: {item.email.split("geomap")[0]}</p>
  
                {/* Action Buttons */}
                
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">Loading...</p>
        )}
      </div>
    </div>
  );
}
