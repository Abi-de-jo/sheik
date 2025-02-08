import { useEffect, useState } from "react";
import { getAllDraft } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Draft() {
  const { t } = useTranslation("home"); // Georgian translation
  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]); 
  const [filterDate, setFilterDate] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getAllDraft();
        setDrafts(data);
        setFilteredDrafts(data);
      } catch (err) {
        setError(t("fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const applyFilters = () => {
    let updatedDrafts = [...drafts];

    if (filterDate) {
      updatedDrafts = updatedDrafts.filter(
        (draft) => new Date(draft.updatedAt).toISOString().split("T")[0] === filterDate
      );
    }

    setFilteredDrafts(updatedDrafts);
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilteredDrafts(drafts);
  };

  if (loading) {
    return <p className="text-center mt-10">{t("loading")}</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  const handleImageClick = (draft) => {
    navigate(`/draft-details/${draft.id}`, { state: { draft } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 mb-11">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t("owners_draft")}
      </h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {t("filter_drafts")}
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("filter_by_date")}
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={applyFilters}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            {t("apply_filters")}
          </button>
          <button
            onClick={clearFilters}
            className="mt-6 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            {t("clear_filters")}
          </button>
        </div>
      </div>

      {filteredDrafts.length > 0 ? (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => (
            <div
              key={draft.id}
              className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-md p-4"
              onClick={() => handleImageClick(draft)}
            >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={draft?.images?.[0] || "https://via.placeholder.com/100x100?text=No+Image"}
                  alt={draft.title || "Draft"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 pl-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {draft.title || t("untitled_draft")}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("price")}:</span> ${draft.price || t("not_available")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("status")}:</span> {t(draft.status)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("name")}:</span> {t(draft.name)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{t("phone")}:</span> {t(draft.phone)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">{t("updated_at")}:</span>{" "}
                  {new Date(draft.updatedAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* Position Bubble */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-lg">
                {draft.position ? t(draft.position) : t("unknown")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">{t("no_drafts_available")}</p>
      )}
    </div>
  );
}

export default Draft;
