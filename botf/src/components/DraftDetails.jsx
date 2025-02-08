import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://sheik-back.vercel.app/api"; // Replace with your backend base URL

const DraftDetails = () => {
  const { t } = useTranslation("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { draft } = location.state || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState({ ...draft });
  const [visibleSections, setVisibleSections] = useState({
    amenities: false,
    selectedAdditional: false,
    heating: false,
  });

  if (!draft) {
    return <p className="text-center mt-10">{t("draft_not_available")}</p>;
  }

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDraft((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Section Visibility
  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Save Updated Draft
  const handleSave = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/residency/update/${editedDraft.id}`,
        editedDraft
      );
      alert(t("draft_updated_successfully"));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(t("draft_update_failed"));
    }
  };

  // Reject Draft
  const handleReject = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/residency/delete/${draft.id}`);
      alert(t("draft_rejected_successfully"));
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting draft:", error);
      alert(t("draft_reject_failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mb-7">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <button className="bg-gray-300 px-4 py-1 rounded-lg" onClick={() => navigate(-1)}>
          🔙 {t("back")}
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800">
          {isEditing ? t("edit_draft") : editedDraft.title || t("untitled_draft")}
        </h1>

        {/* Images Section */}
        {editedDraft.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {editedDraft.images.map((img, index) => (
              <img key={index} src={img} alt={`${t("image")} ${index + 1}`} className="w-full h-40 object-cover rounded-md border" />
            ))}
          </div>
        )}

        {/* Editable Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "title", value: editedDraft.title },
            { key: "price", value: editedDraft.price },
            { key: "discount", value: editedDraft.discount },
            { key: "deposit", value: editedDraft.deposit },
            { key: "type", value: editedDraft.type ? t(editedDraft.type.toLowerCase()) : t("") },
            { key: "residency_type", value: editedDraft.residencyType ? t(editedDraft.residencyType.toLowerCase()) : t("") },
            { key: "property_type", value: editedDraft.propertyType ? t(editedDraft.propertyType.toLowerCase()) : t("")  },
            { key: "city", value: editedDraft.city ? t(editedDraft.city.toLowerCase()) : t("") },
            { key: "metro", value: editedDraft.metro?.length 
              ? editedDraft.metro.map((item) => t(item.toLowerCase())).join(", ") 
              : t("not_available") 
          },
          
          { key: "district", value: editedDraft.district?.length 
              ? editedDraft.district.map((item) => t(item.toLowerCase())).join(", ") 
              : t("not_available") 
          },
          
          { key: "design", value: editedDraft.design?.length 
              ? editedDraft.design.map((item) => t(item.toLowerCase())).join(", ") 
              : t("not_available") 
          },
          
            { key: "rooms", value: editedDraft.rooms },
            { key: "bathroom", value: editedDraft.bathrooms },
            { key: "floor", value: editedDraft.floor },
            { key: "total_floors", value: editedDraft.totalFloors },
            { key: "sq.m", value: editedDraft.area },
          ].map(({ key, value }) => (
            <div key={key}>
              <label className="block text-gray-600 font-semibold capitalize">{t(key)}</label>
              {isEditing ? (
                <input
                  type={["price", "discount"].includes(key) ? "number" : "text"}
                  name={key}
                  value={value || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              ) : (
                <p className="text-gray-700 break-all">{value || t("not_available")}</p>
              )}
            </div>
          ))}

          {/* Toggle Sections */}
          {[
  { key: "amenities", value: editedDraft.amenities },
  { key: "additional_information", value: editedDraft.selectedAdditional },
  { key: "heating", value: editedDraft.heating },
].map(({ key, value }) => (
  <div key={key}>
    <label className="block text-gray-600 font-semibold capitalize">{t(key)}</label>
    <button
      className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      onClick={() => toggleSection(key)}
    >
      {visibleSections[key] ? t("hide_details") : t("show_details")}
    </button>
    {visibleSections[key] && (
      <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
        {Array.isArray(value) && value.length > 0
          ? value.map((item, i) => <li key={i}>{t(item.toLowerCase())}</li>)
          : <li className="text-gray-500">{t("no_details_available")}</li>}
      </ul>
    )}
  </div>
))}

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                {t("save")}
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                {t("cancel")}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                {t("edit")}
              </button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                {t("reject")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftDetails;
