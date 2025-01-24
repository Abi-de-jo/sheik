import PropTypes from "prop-types";
 import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const AdminEmail = () => {
  const {t} = useTranslation("home");

   const email = localStorage.getItem("email");
  // const email = "david@gmail.com"
  const name = localStorage.getItem("firstName");
   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();  
    navigate("/");
    window.location.reload();
  };

  if (!email) {
 

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
          <p className="mt-4 text-xl font-bold text-gray-700">Please log in</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      {/* Admin Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center relative">
        <div className="relative flex justify-center items-center">
          <FaUserCircle className="text-blue-500 w-24 h-24" />
        </div>
        <p className="mt-4 text-xl font-bold text-gray-700">{name}</p>
        <p className="text-sm text-gray-500">
{t("welcome")}          
          </p>
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
{t("logout")}     

   </button>
      </div>

      {/* Buttons Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
{t("action")}        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Owner Draft */}
          <button
            onClick={() => navigate("/owner-draft")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
{t("ownerdraft")}    

      </button>
          {/* Agent Draft */}
          <button
            onClick={() => navigate("/agent-draft")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
{t("agentdraft")}    
          </button>
          {/* Analytics */}
          <button
            onClick={() => navigate("/analytics")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
          >
            {t("anal")}
          </button>
          {/* All Agents List */}
          <button
            onClick={() => navigate("/agents-list")}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
          >
{t("allagents")}          </button>

          <button
            onClick={() => navigate("/owners-list")}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
          >
{t("allowners")}        
  </button>

         
            <button
      onClick={() => navigate("/dashboard-view")}
      className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition"
    >
      {t("dash")}
    </button>
           <button
      onClick={() => navigate("/admin-pub")}
      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition"
    >
      {t("pub")}
    </button>
           <button
      onClick={() => navigate("/agent-ahieve")}
      className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition"
    >
{t("agentachieve")}  
  </button>
        </div>
      
      </div>
    </div>
  );
};

AdminEmail.propTypes = {
  email: PropTypes.string,
};

export default AdminEmail;
