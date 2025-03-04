import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAll } from "../utils/api"; // Import function

export default function SingleAgent() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(location.state?.agent || null);

  useEffect(() => {
    if (!agent) {
      async function fetchAgent() {
        try {
          const response = await getAll(); // Fetch all agents
          console.log("Full Response from getAll():", response); // Debugging

          if (Array.isArray(response)) {
            const foundAgent = response.find((item) => item.id === id);
            if (foundAgent) {
              setAgent(foundAgent);
            } else {
              console.warn("Agent not found for ID:", id);
            }
          } else {
            console.error("Unexpected data format:", response);
          }
        } catch (error) {
          console.error("Error fetching agent details:", error);
        }
      }
      fetchAgent();
    }
  }, [id, agent]);

  if (!agent) return <p className="text-center text-gray-600">Loading details...</p>;

  // Function to send all details to Telegram
  const sendToTelegram = () => {
    const propertyDetails = `
🏡 *Property Details* 🏡

📌 *Title:* ${agent.title || "N/A"}
💰 *Price:* ${agent.discount ? `~${agent.price} ${agent.currency}~ ➡ ${(agent.price - agent.discount).toFixed()} ${agent.currency}` : `${agent.price || "N/A"} ${agent.currency}`}
🎯 *Discount:* ${agent.discount > 0 ? `${agent.discount} ${agent.currency}` : "No Discount"}
🏠 *Residency Type:* ${agent.residencyType || "N/A"}
🏢 *Property Type:* ${agent.propertyType || "N/A"}
🚪 *Rooms:* ${agent.rooms || "N/A"}
🛁 *Bathrooms:* ${agent.bathrooms || "N/A"}
📏 *Area:* ${agent.area || "N/A"} sq. ft.
🏗 *Floor:* ${agent.floor || "N/A"} / ${agent.totalFloors || "N/A"}

🌍 *Location:* ${agent.address || "N/A"}
🏙️ *City:* ${agent.city || "N/A"}
🗺️ *District:* ${agent.district || "N/A"}

📝 *Term Duration:* ${agent.termDuration?.length > 0 ? agent.termDuration.join(', ') : "N/A"}
📜 *Term:* ${agent.term || "N/A"}
🚗 *Parking:* ${agent.parking || "N/A"}

🔗 *More Info:* [Click Here](https://your-website.com/properties/${agent.id})

✨ *Contact Agent:*
📧 *Email:* ${agent.email}
📞 *Phone:* ${agent.teleNumber || "@David_Tibelashvili"}

✨ Contact for more details or to schedule a visit!
`.trim();

    const encodedMessage = encodeURIComponent(propertyDetails);
    window.open(`https://t.me/David_Tibelashvili?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-800 text-center">{agent.title || "Property Details"}</h1>

      {/* Image */}
      <div className="flex justify-center my-4">
        <img
          src={agent.images?.[0] || "https://via.placeholder.com/400"}
          alt={agent.title}
          className="w-full max-w-lg rounded-lg shadow-md"
        />
      </div>

      {/* Details */}
      <div className="max-w-2xl mx-auto text-gray-800 text-lg leading-7">
        <p><span className="font-semibold">Price:</span> {agent.discount ? (
          <>
            <span className="line-through text-gray-500">{agent.price} {agent.currency}</span>{" "}
            <span className="text-red-600">{(agent.price - agent.discount).toFixed()} {agent.currency}</span>
          </>
        ) : (
          `${agent.price || "N/A"} ${agent.currency}`
        )}
        </p>
        <p><span className="font-semibold">Discount:</span> {agent.discount > 0 ? `${agent.discount} ${agent.currency}` : "No Discount"}</p>
        <p><span className="font-semibold">Residency Type:</span> {agent.residencyType || "N/A"}</p>
        <p><span className="font-semibold">Property Type:</span> {agent.propertyType || "N/A"}</p>
        <p><span className="font-semibold">Rooms:</span> {agent.rooms || "N/A"}</p>
        <p><span className="font-semibold">Bathrooms:</span> {agent.bathrooms || "N/A"}</p>
        <p><span className="font-semibold">Area:</span> {agent.area || "N/A"} sq. ft.</p>
        <p><span className="font-semibold">Floor:</span> {agent.floor || "N/A"} / {agent.totalFloors || "N/A"}</p>
        <p><span className="font-semibold">Location:</span> {agent.address || "N/A"}</p>
        <p><span className="font-semibold">City:</span> {agent.city || "N/A"}</p>
        <p><span className="font-semibold">District:</span> {agent.district || "N/A"}</p>
        <p><span className="font-semibold">Parking:</span> {agent.parking || "N/A"}</p>
        <p><span className="font-semibold">Term Duration:</span> {agent.termDuration?.length > 0 ? agent.termDuration.join(', ') : "N/A"}</p>
        <p><span className="font-semibold">Term:</span> {agent.term || "N/A"}</p>
        <p><span className="font-semibold">Email:</span> {agent.email}</p>
        <p><span className="font-semibold">Contact:</span> {agent.teleNumber || "@David_Tibelashvili"}</p>
      </div>

      {/* Contact Agent Button */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          onClick={sendToTelegram}
        >
          Contact Agent on Telegram
        </button>
      </div>
    </div>
  );
}
