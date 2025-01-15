import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiChevronDown } from "react-icons/bi";
import { FaGlobe } from "react-icons/fa";

const LanguageSwitcher = () => {
  const {  i18n } = useTranslation(); // Ensure 'i18n' is available here
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lng);
      localStorage.setItem("language", lng);
      setIsOpen(false);
    } else {
      console.error("i18n.changeLanguage is not a function");
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center px-3 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        <FaGlobe className="text-lg mr-1 text-blue-500" />
        <BiChevronDown className="text-lg" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => changeLanguage("en")}
              className="block w-full px-4 py-2 text-gray-700 text-sm font-normal text-left rounded-md bg-white hover:bg-blue-50 hover:text-blue-600 transition duration-150"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ka")}
              className="block w-full px-4 py-2 text-gray-700 text-sm font-normal text-left rounded-md bg-white hover:bg-blue-50 hover:text-blue-600 transition duration-150"
            >
              ქართული
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
