import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
 import FirstComponent from "./components/FirstComponent";
import SecondComponent from "./components/SecondComponent";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Home from "./components/Home";
import Favourite from "./components/Favourite";
import CardDetails from "./components/Carddetails";
import Draft from "./components/Draft";
import Dashboard from "./components/Dashboard";
import AdminEmail from "./components/adminEmail";
import AllAgents from "./components/AllAgents";
import AgentDraft from "./components/AgentDraft";
import AgentCard from "./components/AgentCard";
import DraftDetails from "./components/DraftDetails";
import AgentDraftDetails from "./components/AgentDraft";
import PropertyDetails from "./components/PropertyDetails";
import DashboardView from "./components/DashboardView";
import AdminPub from "./components/AdminPub";

import "./cloudinaryLoader.js"
import { LoadScript } from "@react-google-maps/api";
const App = () => {
   const GOOGLE_MAPS_API_KEY = "AIzaSyBgM-qPtgGcDc1VqDzDCDAcjQzuieT7Afo";

  const queryClient = new QueryClient();
  const role = localStorage.getItem("role");

  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
                 <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ads" element={<SecondComponent />} />

            {/* Conditional Profile Page */}
            <Route
              path="/profile"
              element={role === "admin" ? <AdminEmail /> : <Profile />}
            />
<Route path="/property/:id" element={<PropertyDetails />} />

            {/* Unrestricted Pages */}
            <Route path="/favorites" element={<Favourite />} />
            <Route path="/card/:cardId" element={<CardDetails />} />
            <Route path="/agentPub/:id" element={<AgentCard />} />
            <Route path="/draft-details/:id" element={<DraftDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/draft" element={<Draft />} />

            {/* Admin-Specific Routes (Now Accessible to Everyone) */}
            <Route path="/owner-draft" element={<Draft />} />
            <Route path="/agent-draft" element={<AgentDraft />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/agents-list" element={<AllAgents />} />
            <Route path="/draft-details/:id" element={<AgentDraftDetails />} />
                        <Route path="/dashboard-view" element={<DashboardView  />} />
                        <Route path="/admin-pub" element={<AdminPub />} />

            {/* Steps Conditional Rendering */}
            <Route path="/main" element={<FirstComponent />} />
            <Route path="/main-2" element={<SecondComponent />} />

            {/* Catch-All Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Navbar is always displayed */}
          <Navbar />
                          </LoadScript>

        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
