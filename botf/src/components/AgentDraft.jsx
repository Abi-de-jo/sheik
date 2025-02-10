import { useEffect, useState } from "react";
import { getAllDraftAgent } from "../utils/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AgentDraftDetails() {
  const { t } = useTranslation("home");

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null); // Track processing ID
  const [filteredDrafts, setFilteredDrafts] = useState([]); // Filtered drafts
  const [filterDate, setFilterDate] = useState(""); // Filter date
  const [filterEmail, setFilterEmail] = useState(""); // Filter email

  const applyFilters = () => {
    let updatedDrafts = [...drafts];

    if (filterDate) {
      updatedDrafts = updatedDrafts.filter((draft) =>
        new Date(draft.updatedAt).toISOString().split("T")[0] === filterDate
      );
    }

    if (filterEmail) {
      updatedDrafts = updatedDrafts.filter((draft) =>
        draft.email?.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }

    setFilteredDrafts(updatedDrafts);
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterEmail("");
    setFilteredDrafts(drafts);
  };
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getAllDraftAgent();
        console.log(data, "Abisheikkkkkkkkkkkkkkkkkkkkkkkkk");
        setDrafts(data);
        setFilteredDrafts(data); // Initialize `filteredDrafts` with all drafts
      } catch (err) {
        setError("Failed to fetch drafts. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const navigate = useNavigate();

  console.log("bbbbbbbbbbbbbbbbb")



  const handleAccept = async (id) => {
    setLoadingActionId(id); // Set loading for this draft

    const selectedDraft = drafts.find((draft) => draft.id === id);
    console.log(selectedDraft, "?mmmmmmmmmmmmmm")
    console.log("bbbbbbbbbbbbbbbbb")




    try {
      console.log("Accepted Draft Details:", selectedDraft);
      // Ensure `video` is a single string
      if (Array.isArray(selectedDraft.video)) {
        selectedDraft.video = selectedDraft.video[0] || ""; // Take the first video URL or default to an empty string
      }

      // Update status in the backend
      await axios.post(`https://sheik-back.vercel.app/api/residency/publish/${id}`);

      // Google Sheets Integration







      // Telegram Integration
      const TELEGRAM_BOT_TOKEN = "7712916176:AAF15UqOplv1hTdJVxILWoUOEefEKjGJOso";
      const TELEGRAM_CHAT_ID = "-4545005015";
      const SALE_CHAT_ID = "-4664195143";
      const COMMERCIAL_CHAT_ID = "-4773672468";  // Chat ID for commercial properties

      const ADMIN_NOTIFICATION_CHAT_ID = selectedDraft.userTeleNumber;




      const uploadMediaToTelegram = async (media, chatId, botToken, message) => {
        try {
          const uploadedMedia = [];
          const messageIdsToDelete = []; // Keep track of individual message IDs for deletion

          // Step 1: Upload images and videos individually
          for (const item of media) {
            const formData = new FormData();
            formData.append("chat_id", chatId);
            formData.append(
              item.type === "photo" ? "photo" : "video",
              await fetch(item.url).then((res) => res.blob())
            );

            const response = await axios.post(
              `https://api.telegram.org/bot${botToken}/send${item.type === "photo" ? "Photo" : "Video"
              }`,
              formData
            );

            const messageId = response.data?.result?.message_id; // Get message ID for deletion
            const fileId =
              item.type === "photo"
                ? response.data?.result?.photo?.pop()?.file_id
                : response.data?.result?.video?.file_id;

            if (fileId && messageId) {
              uploadedMedia.push({
                type: item.type,
                media: fileId,
              });
              messageIdsToDelete.push(messageId); // Track the message ID for deletion later
            }
          }

          // Step 2: Send all media as a group with the first captioned
          if (uploadedMedia.length > 0) {
            const mediaWithCaption = [
              {
                ...uploadedMedia[0],
                caption: message,
                parse_mode: "Markdown",
              },
              ...uploadedMedia.slice(1),
            ];

            await axios.post(
              `https://api.telegram.org/bot${botToken}/sendMediaGroup`,
              {
                chat_id: chatId,
                media: mediaWithCaption,
              }
            );

            console.log("Media and message sent to Telegram successfully!");
          }

          // Step 3: Delete the individual media messages
          for (const messageId of messageIdsToDelete) {
            await axios.post(
              `https://api.telegram.org/bot${botToken}/deleteMessage`,
              {
                chat_id: chatId,
                message_id: messageId, // Delete individual media messages
              }
            );
          }

          console.log("Individual media messages deleted successfully!");
        } catch (error) {
          console.error("Error uploading or sending media and message to Telegram:", error);
        }
      };


      const media = [
        ...(selectedDraft.images || []).map((url) => ({ type: "photo", url })),
        ...(selectedDraft.video ? [{ type: "video", url: selectedDraft.video }] : []),
      ];

      const allAmenities = [
        "Oven",
        "Microwave",
        "VacuumCleaner",
        "Balcony",
        "Stove",
        "Dishwasher",
        "SmartTV",
        "WiFi",
        "ParkingPlace",
        "PlayStation",
        "Projector",
        "Elevator",
        "Heating",
      ];

      const importantAmenities = ["Dishwasher", "Elevator", "Balcony"];

      const formatAmenitiesInTwoColumns = (selectedAmenities) => {
        // Map all amenities to their respective status
        const formattedAmenities = allAmenities.map((amenity) => {
          if (selectedAmenities.includes(amenity)) {
            return `✅ #${amenity.replace(/\s+/g, "")}`; // Mark selected amenities as ✅
          } else if (importantAmenities.includes(amenity)) {
            return `✖️ ${amenity.replace(/\s+/g, "")}`; // Mark unselected important amenities as ✖️
          } else {
            return null; // Ignore other unselected amenities
          }
        }).filter(Boolean); // Remove null entries

        // Ensure order: ✅ first, then ✖️
        const orderedAmenities = [
          ...formattedAmenities.filter((item) => item.startsWith("✅")),
          ...formattedAmenities.filter((item) => item.startsWith("✖️")),
        ];

        // Chunk into rows of 2 for better formatting
        const chunkedAmenities = [];
        for (let i = 0; i < orderedAmenities.length; i += 2) {
          chunkedAmenities.push(orderedAmenities.slice(i, i + 2));
        }

        // Join rows into final output
        return chunkedAmenities.map((row) => row.join("  ")).join("\n");
      };

      const amenitiesFormatted = formatAmenitiesInTwoColumns(
        selectedDraft?.amenities || []
      );

     const allBusinessTypes = [
  "Showroom",
  "Office",
  "Retail",
  "Restaurant",
  "Hotel",
  "CreativeSpace",
  "Cafe",
  "Coworking",
  "BeautySalon"
];

const formatBusinessInTwoColumns = (selectedBusiness) => {
  // Map all business options to their respective status
  const formattedBusiness = allBusinessTypes.map((business) => {
    return selectedBusiness.includes(business)
      ? `✅ #${business.replace(/\s+/g, "")}`
      : `✖️ #${business.replace(/\s+/g, "")}`;
  });

  // Prioritize ✅ first and then ❌
  const orderedBusiness = [
    ...formattedBusiness.filter((item) => item.startsWith("✅")),
    ...formattedBusiness.filter((item) => item.startsWith("✖️")),
  ];

  // Chunk into rows of 2 for better formatting
  const chunkedBusiness = [];
  for (let i = 0; i < orderedBusiness.length; i += 2) {
    chunkedBusiness.push(orderedBusiness.slice(i, i + 2));
  }

  // Join rows into final output
  return chunkedBusiness.map((row) => row.join("  ")).join("\n");
};

const businessFormatted = formatBusinessInTwoColumns(selectedDraft?.business || []);

      

      const rentMessage = `
      #${selectedDraft?.city} #${selectedDraft?.district} 🏢#${selectedDraft?.metro}
📍[${selectedDraft.address}](${selectedDraft.googleaddressurl})
        
#${selectedDraft?.title} 
Apartment for #${selectedDraft?.type}✨ #${selectedDraft?.residencyType}
        
🏠 ${selectedDraft.area} Sq.m | #${selectedDraft?.floor}floor | #${selectedDraft?.bathrooms}Bath

${amenitiesFormatted}
${selectedDraft?.parking > 0 ? "✅ Parking" : "✖️ Parking"}

🐕 Pets: ${selectedDraft.selectedAdditional?.includes("PetsAllowed")
          ? "#Allowed"
          : selectedDraft.selectedAdditional?.includes("ByAgreement")
            ? "#ByAgreement"
            : "#NotAllowed"
        }
⏰ ${selectedDraft?.term} ${selectedDraft?.termDuration
          ?.map((duration) => `#${duration.replace(" ", "")}`)
          .join(" ")}
💳 #${selectedDraft?.paymentMethod}   
💰 ${selectedDraft.price}${selectedDraft.currency == "USD" ? "$" : "₾"} | Deposit ${selectedDraft.deposit}${selectedDraft.currency == "USD" ? "$" : "₾"}
  0% Commission
${selectedDraft.price >= 0 && selectedDraft.price <= 300
          ? "#Price0to300"
          : selectedDraft.price > 300 && selectedDraft.price <= 500
            ? "#Price300to500"
            : selectedDraft.price > 500 && selectedDraft.price <= 700
              ? "#Price500to700"
              : selectedDraft.price > 700 && selectedDraft.price <= 900
                ? "#Price700to900"
                : selectedDraft.price > 900 && selectedDraft.price <= 1200
                  ? "#Price900to1200"
                  : selectedDraft.price > 1200 && selectedDraft.price <= 1500
                    ? "#Price1200to1500"
                    : selectedDraft.price > 1500 && selectedDraft.price <= 1700
                      ? "#Price1500to1700"
                      : selectedDraft.price > 1700 && selectedDraft.price <= 1900
                        ? "#Price1700to1900"
                        : selectedDraft.price > 1900 && selectedDraft.price <= 2100
                          ? "#Price1900to2100"
                          : selectedDraft.price > 2100 && selectedDraft.price <= 2500
                            ? "#Price2100to2500"
                            : selectedDraft.price > 2500 && selectedDraft.price <= 3000
                              ? "#Price2500to3000"
                              : selectedDraft.price > 3000 && selectedDraft.price <= 4000
                                ? "#Price3000to4000"
                                : selectedDraft.price > 4000 && selectedDraft.price <= 5000
                                  ? "#Price4000to5000"
                                  : selectedDraft.price > 5000
                                    ? "#PriceAbove5000"
                                    : ""}
  
      
👤 Contact: [@David_Tibelashvili]
📞 +995 599 20 67 16 | ${selectedDraft?.email?.includes('geomap')
          ? `#${selectedDraft?.email?.split('geomap')[0] || "user"}`
          : `#${selectedDraft?.email?.split('@')[0] || "user"}`
        }
       
⭐ [Check all listings](https://t.me/rent_tbilisi_ge/9859) | [Reviews](https://t.me/reviews_rent_tbilisi)
        
📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)
        `;




      const saleMessage = `
      #${selectedDraft?.city} 🏢#${selectedDraft?.metro} [${selectedDraft.address}](${selectedDraft.googleaddressurl})
        
#${selectedDraft?.title} Apartment for #${selectedDraft?.type}
✨#${selectedDraft?.residencyType}
🏠 ${selectedDraft.area} Sq.m | ${selectedDraft?.floor}floor | #${selectedDraft?.heating}

${amenitiesFormatted}
${selectedDraft?.parking > 0 ? "✅ Parking" : "✖️ Parking"}

💰 ${selectedDraft.price}${selectedDraft.currency == "USD" ? "$" : "₾"} | Deposit ${selectedDraft.deposit}${selectedDraft.currency == "USD" ? "$" : "₾"}
  0% Commission
${selectedDraft.price >= 0 && selectedDraft.price <= 300
          ? "#Price0to300"
          : selectedDraft.price > 300 && selectedDraft.price <= 500
            ? "#Price300to500"
            : selectedDraft.price > 500 && selectedDraft.price <= 700
              ? "#Price500to700"
              : selectedDraft.price > 700 && selectedDraft.price <= 900
                ? "#Price700to900"
                : selectedDraft.price > 900 && selectedDraft.price <= 1200
                  ? "#Price900to1200"
                  : selectedDraft.price > 1200 && selectedDraft.price <= 1500
                    ? "#Price1200to1500"
                    : selectedDraft.price > 1500 && selectedDraft.price <= 1700
                      ? "#Price1500to1700"
                      : selectedDraft.price > 1700 && selectedDraft.price <= 1900
                        ? "#Price1700to1900"
                        : selectedDraft.price > 1900 && selectedDraft.price <= 2100
                          ? "#Price1900to2100"
                          : selectedDraft.price > 2100 && selectedDraft.price <= 2500
                            ? "#Price2100to2500"
                            : selectedDraft.price > 2500 && selectedDraft.price <= 3000
                              ? "#Price2500to3000"
                              : selectedDraft.price > 3000 && selectedDraft.price <= 4000
                                ? "#Price3000to4000"
                                : selectedDraft.price > 4000 && selectedDraft.price <= 5000
                                  ? "#Price4000to5000"
                                  : selectedDraft.price > 5000
                                    ? "#PriceAbove5000"
                                    : ""}
  
      
👤 Contact: [@David_Tibelashvili]
📞 +995 599 20 67 16 | ${selectedDraft?.email?.includes('geomap')
          ? `#${selectedDraft?.email?.split('geomap')[0] || "user"}`
          : `#${selectedDraft?.email?.split('@')[0] || "user"}`
        }
       
⭐ [Check all listings](https://t.me/rent_tbilisi_ge/9859) | [Reviews](https://t.me/reviews_rent_tbilisi)
        
📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)
        `;



        const comMessage = `
        #${selectedDraft?.city} #${selectedDraft?.district} 🏢#${selectedDraft?.metro}
📍[${selectedDraft.address}](${selectedDraft.googleaddressurl})
          
  #${selectedDraft?.propertyType} for #${selectedDraft?.type}
  ✨ ${selectedDraft?.design}       
  🏠 ${selectedDraft.area} Sq.m | #${selectedDraft?.floor}floors | #${selectedDraft?.rooms}Rooms
  
${amenitiesFormatted}
${selectedDraft?.parking > 0 ? "✅ Parking" : "✖️ Parking"}
  
  For Business:
${businessFormatted}

  ⏰${selectedDraft?.term} ${selectedDraft?.termDuration
            ?.map((duration) => `#${duration.replace(" ", "")}`)
            .join(" ")}
  💰 ${selectedDraft.price}${selectedDraft.currency === "USD" ? "$" : "₾"} ${
  selectedDraft.taxOption === "Including Tax"
    ? "(Including Tax)"
    : selectedDraft.taxOption === "Excluding Tax"
    ? "(Not including Tax)"
    : ""
} + Deposit ${selectedDraft.deposit}${selectedDraft.currency === "USD" ? "$" : "₾"} 
        
  👤 Contact: [@David_Tibelashvili]
  📞 +995 599 20 67 16 | ${selectedDraft?.email?.includes('geomap')
            ? `#${selectedDraft?.email?.split('geomap')[0] || "user"}`
            : `#${selectedDraft?.email?.split('@')[0] || "user"}`
          }
         
  ⭐ [Check all listings](https://t.me/rent_tbilisi_ge/9859) | [Reviews](https://t.me/reviews_rent_tbilisi)
          
  📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)
          `;
  








      const propertyDetails = `
       *YOUR PROPERTY ACCEPTED BY ADMIN* 

       
        🏡 *Property Details* 🏡
        
        📍 *Location:* ${selectedDraft.address || "N/A"}  
        💰 *Price:* $${selectedDraft.price || "N/A"} ${selectedDraft.currency || "N/A"}
        
        🛏️ *Rooms:* ${selectedDraft.rooms || "N/A"}  
        🚿 *Bathrooms:* ${selectedDraft.bathrooms || "N/A"}  
        📐 *Area:* ${selectedDraft.area || "N/A"} sq. ft.
        
        🏢 *Building Type:* ${selectedDraft.propertyType || "N/A"}  
        🏢 *Residency Type:* ${selectedDraft.residencyType || "N/A"}  
        🔢 *Floor:* ${selectedDraft.floor || "N/A"} / ${selectedDraft.totalFloors || "N/A"}
        
        📅 *Term Duration:* ${selectedDraft.termDuration?.length > 0 ? selectedDraft.termDuration.join(', ') : "N/A"}  
        📜 *Term:* ${selectedDraft.term || "N/A"}  
        🚗 *Parking:* ${selectedDraft.parking || "N/A"}  
        
        🌆 *City:* ${selectedDraft.city || "N/A"}  
        🏙️ *District:* ${selectedDraft.district?.length > 0 ? selectedDraft.district.join(', ') : "N/A"}  
        🏠 *Position:* ${selectedDraft.position || "N/A"}  
        
        💳 *Payment Method:* ${selectedDraft.paymentMethod || "FirstDeposit"}  
        
        ✨ *Design Features:* ${selectedDraft.design?.length > 0 ? selectedDraft.design.join(', ') : "N/A"}
        
        🔗 *More Info:* [Click Here](https://sheik-front.vercel.app/card/${selectedDraft.id})
        
        ✨ *Contact for more details or to schedule a visit!*
        `.trim();

      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: ADMIN_NOTIFICATION_CHAT_ID,
          text: propertyDetails,
          parse_mode: "Markdown", // Enables formatting for bold, italic, etc.

        }
      );



     const chatId =
  selectedDraft.propertyType === "Commercial"
    ? COMMERCIAL_CHAT_ID // If Commercial, always go to COMMERCIAL_CHAT_ID
    : selectedDraft.type === "Rent"
    ? TELEGRAM_CHAT_ID // If not Commercial but Rent, go to TELEGRAM_CHAT_ID
    : SALE_CHAT_ID; // If neither, it's a Sale, so go to SALE_CHAT_ID

const message =
  selectedDraft.propertyType === "Commercial"
    ? comMessage // If Commercial, send commercial message
    : selectedDraft.type === "Rent"
    ? rentMessage // If Rent, send rent message
    : saleMessage; // Otherwise, send sale message

      await uploadMediaToTelegram(media, chatId, TELEGRAM_BOT_TOKEN, message);

      alert("Details published to Telegram successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error handling accept action:", error);
      alert("An error occurred. Please try again.");
    }
  };


  if (loading) {
    return <p className="text-center mt-10">Loading drafts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  const handleReject = (id) => {
    setLoadingActionId(id); // Set loading for this draft

    console.log(`Draft with ID ${id} rejected.`);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading drafts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }
  const handleImageClick = (draft) => {
    navigate(`/draft-details/${draft.id}`, { state: { draft } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t("agentdraft")}</h1>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{t("filterdraft")}</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("filterbydate")}</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("filterbyemail")}</label>
            <input
              type="email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              placeholder={t("enter_email")}
              className="mt-1 block w-full px-4 py-2 border rounded focus:ring-2 overflow-ellipsis focus:ring-blue-500"
            />
          </div>
          <button
            onClick={applyFilters}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            {t('apply')}
          </button>
          <button
            onClick={clearFilters}
            className="mt-6 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            {t("clear")}
          </button>
        </div>
      </div>





      {filteredDrafts.length > 0 ? (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center bg-white border border-gray-300 rounded-xl shadow-md p-4"
            >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  onClick={() => handleImageClick(draft)} // Navigate with draft details
                  src={draft?.images?.[0] || "https://via.placeholder.com/100x100?text=No+Image"}
                  alt={draft.title || "Draft"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 pl-4">
                <h2 className="text-lg font-semibold text-gray-800 break-words">
                  {draft.title || "Untitled Draft"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("price")}:</span> ${draft.price || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("status")}:</span> {draft.status}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">{t("updatedat")}:</span>{" "}
                  {new Date(draft.updatedAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                {/* Accept Icon */}
                {loadingActionId === draft.id ? (
                  <div className="text-blue-500 text-2xl animate-spin">⏳</div>
                ) : (
                  <FaCheckCircle
                    className={`text-green-500 text-2xl cursor-pointer hover:text-green-600 transition-transform transform hover:scale-110 ${loadingActionId ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={() => !loadingActionId && handleAccept(draft.id)}
                  />
                )}

                {/* Reject Icon */}
                {loadingActionId === draft.id ? (
                  <div className="text-blue-500 text-2xl animate-spin">⏳</div>
                ) : (
                  <FaTimesCircle
                    className={`text-red-500 text-2xl cursor-pointer hover:text-red-600 transition-transform transform hover:scale-110 ${loadingActionId ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={() => !loadingActionId && handleReject(draft.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

      ) : (
        <p className="text-gray-500 text-center">No drafts available.</p>
      )}
    </div>
  );
}

export default AgentDraftDetails;
