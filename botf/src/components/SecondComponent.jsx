import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import UploadImage from "./UploadImage";
import { useTranslation } from "react-i18next";

import UploadVideo from "./UploadVideo";
import Confetti from "react-confetti"; // Ensure you have this installed
const SecondComponent = ({ onSave }) => {
  const { t } = useTranslation("home")
  const [message, setMessage] = useState("");
  const GOOGLE_API_KEY = "AIzaSyBgM-qPtgGcDc1VqDzDCDAcjQzuieT7Afo";
  const [isConfettiActive, setIsConfettiActive] = useState(false); // State to toggle confetti

  const [secondFormData, setSecondFormData] = useState({
    ...JSON.parse(localStorage.getItem("form1")), // Spread data from form1 directly
    dealType: "Rental",
    rooms: "",
    size: "",
    floor: "",
    totalFloors: "",
    termDuration: [],
    address: JSON.parse(localStorage.getItem("form1"))?.address || "",
    addressURL: "",
    googleaddressurl: "",
    city: "Tbilisi",
    term: "Long-term",
    price: null,
    currency: "USD",
    commission: null || "0",
    deposit: "",
    paymentMethod: "FirstDeposit",
    metro: [],
    district: [],
    title: "",
    video: "",
    propertyType: "",
    business: [],

    taxOption: "",
    residencyType: "",
    position: "",
    discount: null,
    area: "",
    type: "",
    design: [],
    parking: "",
    bathrooms: "",
    phone: "",
    name: "",
    amenities: [],
    heating: [],
    description: "",
    images: [],
    additional: [
      "PetsNotAllowed",
      "PetsAllowed",
      "ByAgreement"
    ],
  });

  const role = localStorage.getItem("role")








  const handlePublish = async () => {

    const requiredFields = [
      "address", 
      "addressURL", 
      "googleaddressurl", 
      "city", 
      "price",
      "district",
      "metro",
      "propertyType", 
      "residencyType", 
      "title", 
      "area", 
      "floor", 

      "totalFloors", 
      "rooms", 
      "bathrooms", 
      "parking", 
      "images"
    ];

      // Check for empty required fields
  const emptyFields = requiredFields.filter(field => {
    if (Array.isArray(secondFormData[field])) {
      return secondFormData[field].length === 0;
    }
    return !secondFormData[field];
  });

  if (emptyFields.length > 0) {
    alert(`Please fill in all required fields before submitting: ${emptyFields.join(", ")}`);
    return;
  }
    console.log(secondFormData.addressURL, "Address URL before saving");


    const email = localStorage.getItem("email")
    const teleNumber = localStorage.getItem("teleNumber");
    if (!secondFormData.addressURL) {
      alert("Address URL cannot be empty.");
      return;
    }
    if (Array.isArray(secondFormData.video)) {
      secondFormData.video = secondFormData.video[0] || ""; // Take the first video URL or set as empty string
    }
    try {
      console.log(secondFormData.video, "3333333333333333333333333333333333333333")
      if (email) {
        const res = await axios.post(
          "https://sheik-back.vercel.app/api/residency/create",
          {
            teleNumber,
            secondFormData,
            email,
          }
        );
        console.log("Backend Response:", res);

      }
      else {
        const res = await axios.post(
          "https://sheik-back.vercel.app/api/residency/create",
          {
            teleNumber,
            secondFormData,
          }
        );
        console.log("Backend Response:", res);

      }

      setIsConfettiActive(true);
      setMessage("Successfully created! Waiting for Agent Response...");

      // Scroll to the top
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling
      });

      // Automatically stop confetti after 5 seconds
      setTimeout(() => setIsConfettiActive(false), 5000);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          secondFormData.addressURL
        )}&key=${GOOGLE_API_KEY}`
      );
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;

        const newMarker = {
          addressURL: secondFormData.addressURL,
          lat: location.lat,
          lng: location.lng,
        };



        // Save to localStorage (simulating a database)
        const savedMarkers =
          JSON.parse(localStorage.getItem("markers")) || [];
        const updatedMarkers = [...savedMarkers, newMarker];
        localStorage.setItem("markers", JSON.stringify(updatedMarkers));

        setMessage("Address saved successfully!");
        onSave(updatedMarkers); // Pass updated data to parent component
      } else {
        alert("Invalid address! Please try again.");
      }







    } catch (error) {
      console.error("Error sending data to backend:", error);
      throw error;
    }
  }


  const handleImageUpdate = (imageURLs) => {
    setSecondFormData((prev) => ({
      ...prev,
      images: imageURLs, // Add image URLs to the state
    }));
  };

  const handleVideoUpload = (uploadedVideos) => {
    setSecondFormData((prev) => ({
      ...prev,
      video: uploadedVideos.length > 0 ? uploadedVideos[0] : "", // Handle single video URL
    }));
  };



  useEffect(() => {
    if (secondFormData.address) {
      const googleMapsURL = secondFormData.address;
      setSecondFormData((prev) => ({
        ...prev,
        addressURL: googleMapsURL,
      }));
    }
  }, [secondFormData.address]);



  return (
    <div className="min-h-screen bg-gray-100 p-4 mb-5">
      {isConfettiActive && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      {message && <p className="text-green-600 text-center mt-4">{message}</p>}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 mb-6">

        <div>
          <select
            value={secondFormData.type} // Bind to the 'type' field in state
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, type: e.target.value })
            } // Update 'type' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              {t("selectType")}
            </option>
            <option value="Rent">{t("rent")}</option>
            <option value="Sale">{t("sale")}</option>
            <option value="Lease">{t("lease")}</option>
            <option value="DailyRent">{t("dailyRent")}</option>
          </select>
        </div>

        <div>
          <select
            value={secondFormData.city} // Bind to the 'city' field in state
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, city: e.target.value })
            } // Update 'city' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              {t("selectCity")}
            </option>
            <option value="Tbilisi">{t("tbilisi")}</option>
            <option value="Batumi">{t("batumi")}</option>
            <option value="Kutaisi">{t("kutaisi")}</option>
            <option value="Rustavi">{t("rustavi")}</option>
          </select>
        </div>


        <div>
          <select
            value={secondFormData.propertyType} // Bind to the 'propertyType' field in state
            onChange={(e) =>
              setSecondFormData({
                ...secondFormData,
                propertyType: e.target.value,
              })
            } // Update 'propertyType' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              {t("selectProperty")}
            </option>
            <option value="Office">{t("office")}</option>
            <option value="Cottage">{t("cottage")}</option>
            <option value="Commercial">{t("commercial")}</option>
            <option value="Apartment">{t("apartment")}</option>
            <option value="Land">{t("land")}</option>
            <option value="House">{t("house")}</option>
            <option value="Hotel">{t("hotel")}</option>
          </select>
        </div>


        {secondFormData.propertyType === "Commercial" && (
          <div className="w-full   ml-2 border-gray-300 rounded-md">
            <label className="block text-sm font-medium"></label>
            <select
              value={secondFormData.taxOption}
              onChange={(e) =>
                setSecondFormData({ ...secondFormData, taxOption: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>{t("select")}</option>
              <option value="Including Tax">{t("includingTax")}</option>
              <option value="Excluding Tax">{t("excludingTax")}</option>
            </select>
          </div>
        )}

        <div>
          <select
            value={secondFormData.residencyType} // Bind to the 'residencyType' field in state
            onChange={(e) =>
              setSecondFormData({
                ...secondFormData,
                residencyType: e.target.value,
              })
            } // Update 'residencyType' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              {t("selectResidency")}
            </option>
            <option value="New">{t("new")}</option>
            <option value="Old">{t("old")}</option>
            <option value="Mixed">{t("mixed")}</option>
            <option value="historical">{t("historical")}</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium">{t("address")}</label>
          <input
            type="text"
            value={secondFormData.address}
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, address: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={t("enter")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">{t("addressUrl")}</label>
          <input
            type="url"
            value={secondFormData.googleaddressurl}
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, googleaddressurl: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={t("paste")}
          />
        </div>



        <div>
          <label className="block text-sm font-medium">{t("mapAddress")}</label>
          <input
            type="text"
            value={secondFormData.addressURL}
            placeholder="ex: 13 Rustaveli Avenue, Tbilisi, Georgia"
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, addressURL: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>






        <div>
          <label className="block text-sm font-medium">{t("title")}</label>
          <input
            type="text"
            value={secondFormData.title}
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Number of Rooms, Size, Floors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">{t("numberOfRooms")}</label>
            <select
              value={secondFormData.rooms}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  rooms: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md "
            >
              <option value="" disabled>
                {t("select")}
              </option>
              <option value="1">1 {t("room")}</option>
              <option value="2">2 {t("room")}</option>
              <option value="3">3 {t("room")}</option>
              <option value="4">4+ {t("room")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">{t("size")} ({t("sq.m")})</label>
            <input
              type="number"
              step="50"
              value={secondFormData.area}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  area: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={t("size")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("floor")}</label>
            <input

              type="number"
              value={secondFormData.floor ?? ""} // Display an empty string if floor is null
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value); // Convert to number or set to null
                setSecondFormData({ ...secondFormData, floor: value });
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={t("floor")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("totalFloor")}</label>
            <input
              type="number"
              value={secondFormData.totalFloors}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  totalFloors: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={t("totalFloor")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              {t("numberOfParking")}
            </label>
            <select
              value={secondFormData.parking}
              defaultValue={secondFormData.parking}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  parking: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                {t("select")}
              </option>
              <option value="0">No {t("numberOfParking")}</option>
              <option value="1">1 {t("numberOfParking")}</option>
              <option value="2">2 {t("numberOfParking")}</option>
              <option value="3">3 {t("numberOfParking")}</option>
              <option value="4+">4+ {t("numberOfParking")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("numberOfBathroom")}            </label>
            <select
              value={secondFormData.bathroooms}
              defaultValue={secondFormData.bathrooms}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  bathrooms: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                {t("select")}

              </option>
              <option value="0">No {t("bath")}</option>
              <option value="1">1 {t("bath")}</option>
              <option value="2">2 {t("bath")}</option>
              <option value="3">3 {t("bath")}</option>
              <option value="4+">4+ {t("bath")}</option>
            </select>
          </div>
        </div>

        {/* metro */}

        <div>
          <label className="block text-sm font-medium mb-2">{t("metroOptions")}</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "300Aragveli",
              "AkhmeteliTheatre",
              "Avlabari",
              "Delisi",
              "Didube",
              "Gotsiridze",
              "Grmagele",
              "Guramishvili",
              "Isani",
              "LibertySquare",
              "Marjanishvili",
              "Medical University",
              "Nadzaladevi",
              "Rustaveli",
              "Samgori",
              "Sarajishvili",
              "StateUniversity",
              "StationSquare",
              "TechnicalUniversity",
              "Tsereteli",
              "Varketili",
              "VazhaPshavela",
            ].map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    option === "Others"
                      ? secondFormData.metro.includes("Others")
                      : secondFormData.metro.includes(option)
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    if (option === "Others") {
                      // Handle "Others" checkbox
                      if (!isChecked) {
                        setSecondFormData({
                          ...secondFormData,
                          metro: secondFormData.metro.filter((m) => m !== "Others"),
                          otherMetro: "", // Clear otherMetro value when unchecked
                        });
                      } else {
                        setSecondFormData({
                          ...secondFormData,
                          metro: [...secondFormData.metro, "Others"],
                        });
                      }
                    } else {
                      // Handle standard options
                      const updatedMetro = isChecked
                        ? [...secondFormData.metro, option]
                        : secondFormData.metro.filter((m) => m !== option);

                      setSecondFormData({
                        ...secondFormData,
                        metro: updatedMetro,
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label className="text-sm">{t(option.toLowerCase().replace(/\s+/g, ""))}</label>
              </div>
            ))}
          </div>


          {/* Show text input if "Others" is selected */}
          {secondFormData.metro.includes("Others") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Specify Other Metro</label>
              <input
                type="text"
                value={secondFormData.otherMetro || ""}
                onChange={(e) =>
                  setSecondFormData({
                    ...secondFormData,
                    otherMetro: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter custom metro"
              />
            </div>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">{t("districtOptions")}</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Abanotubani",
              "Afrika",
              "AirportVillage",
              "Avchala",
              "Avlabari",
              "Bagebi",
              "Chugureti",
              "Dampalo Village",
              "DidiDigomi",
              "Didgori",
              "Didube",
              "Didube-Chughureti",

              "Digomi 1-9",
              "Digomi Village",
              "Dighmi 1-9",
              "Dighmis Chala",
              "Dighmis Massive",
              "Elia",
              "Gldani",
              "Gldani Village",
              "Gldani-Nadzaladevi",
              "Gldanula",
              "Iveri Settlement",
              "Ivertubani",
              "Isani",
              "Koniaki Village",
              "Koshigora",
              "Krtsanisi",
              "Kukia",
              "KusTba",
              "Lilo",
              "Lisi",
              "Lisi Adjacent Area",
              "Lisi Lake",
              "Lotkini",
              "Marjanishvili",
              "Mesame Masivi",
              "Mtatsminda",
              "Mukhiani",
              "Mukhatgverdi",
              "Mukhattskaro",
              "Nadzaladevi",
              "Navtlugi",
              "Nutsubidze Plateau",
              "Nutsubidze Plato",
              "Okrokana",
              "Old Tbilisi",
              "Orkhevi",
              "Ortachala",
              "Ponichala",
              "Saburtalo",
              "Samgori",
              "Sanzona",
              "Sof. Digomi",
              "Sololaki",
              "State University",
              "Svaneti Quarter",
              "Tbilisi Sea",
              "Temqa",
              "Tkhinvali",
              "Tskhneti",
              "Turtle Lake",
              "Vake",
              "Vake-Saburtalo",
              "Vashlijvari",
              "Vasizubani",
              "Varketili",
              "Vazha-Pshavela Districts",
              "Vazisubani",
              "Vera",
              "Vedzisi",
              "Vezisi",
              "Zahesi"
            ]
              .sort() // Sort the options alphabetically
              .map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={
                      option === "Others"
                        ? secondFormData.district.includes("Others")
                        : secondFormData.district.includes(option)
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;





                      if (option === "Others") {
                        // Handle "Others" checkbox
                        if (!isChecked) {
                          setSecondFormData({
                            ...secondFormData,
                            district: secondFormData.district.filter((m) => m !== "Others"),
                            otherdistrict: "", // Clear otherdistrict value when unchecked
                          });
                        } else {
                          setSecondFormData({
                            ...secondFormData,
                            district: [...secondFormData.district, "Others"],
                          });
                        }
                      } else {
                        // Handle standard options
                        const updateddistrict = isChecked
                          ? [...secondFormData.district, option]
                          : secondFormData.district.filter((m) => m !== option);

                        setSecondFormData({
                          ...secondFormData,
                          district: updateddistrict,
                        });
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">{t(option.toLowerCase().replace(/\s+/g, ""))}</label>
                </div>
              ))}
          </div>

          {/* Show text input if "Others" is selected */}
          {secondFormData.district.includes("Others") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Specify Other District</label>
              <input
                type="text"
                value={secondFormData.otherdistrict || ""}
                onChange={(e) =>
                  setSecondFormData({
                    ...secondFormData,
                    otherdistrict: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter custom district"
              />
            </div>
          )}
        </div>


        {/* images */}

        <div>
          <h3 className="text-lg font-semibold mb-2">{t("img")}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {t("imgdes")}
          </p>
          <UploadImage onImageUpdate={handleImageUpdate} />
        </div>

        {/* //now changed */}

        {role !== "user" &&
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("vdo")}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {t("vdodec")}
            </p>
            <UploadVideo onVideoUpdate={handleVideoUpload} />
          </div>

        }













        <div>
          <label className="block text-sm font-medium mb-2">{t("designStyle")}</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "New",
              "Old",
              "Mixed",
              "Retro",
              "Current Renovation",
              "Under Repair",
              "White",
              "Black",
              "Green",
              "Grey",
              "Yellow",
            ].map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    option === "Others"
                      ? secondFormData.design.includes("Others")
                      : secondFormData.design.includes(option)
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    if (option === "Others") {
                      // Handle "Others" checkbox
                      if (!isChecked) {
                        setSecondFormData({
                          ...secondFormData,
                          design: secondFormData.design.filter((m) => m !== "Others"),
                          otherdesign: "",
                        });
                      } else {
                        setSecondFormData({
                          ...secondFormData,
                          design: [...secondFormData.design, "Others"],
                        });
                      }
                    } else {
                      // Handle standard options
                      const updateddesign = isChecked
                        ? [...secondFormData.design, option]
                        : secondFormData.design.filter((m) => m !== option);

                      setSecondFormData({
                        ...secondFormData,
                        design: updateddesign,
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label className="text-sm">{t(option.toLowerCase().replace(/\s+/g, ""))}</label>
              </div>
            ))}
          </div>

          {/* Show text input if "Others" is selected */}
          {secondFormData.design.includes("Others") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">{t("specifyOtherDesign")}</label>
              <input
                type="text"
                value={secondFormData.otherdesign || ""}
                onChange={(e) =>
                  setSecondFormData({
                    ...secondFormData,
                    otherdesign: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={t("enterCustomDesign")}
              />
            </div>
          )}
        </div>





        {/* Term */}

        {secondFormData.type !== "Sale" && (
          <>
            <h3 className="text-lg font-semibold">{t("term")}</h3>
            <div className="flex gap-4 mt-2">
              {["Long-term", "Daily"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSecondFormData({ ...secondFormData, term })}
                  className={`px-4 py-2 rounded-md ${secondFormData.term === term
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {t(term.toLowerCase().replace(/-/g, ""))}
                </button>
              ))}
            </div>
          </>

        )}

        <div>






          {/* Conditional UI based on selected term */}
          {secondFormData.term === "Long-term" ? (

            <div className="space-y-5 mt-4">
              {/* Long-term specific fields */}

              {secondFormData.type !== "Sale" && (

                <div className="flex flex-wrap gap-4">
                  {[
                    "1 day",
                    "1 week",
                    "1 month",
                    "2 months",
                    "3 months",
                    "4 months",
                    "5 months",
                    "6 months",
                    "12 months",
                  ].map((duration) => (
                    <button
                      key={duration}
                      className={`px-4 py-2 rounded-md ${secondFormData.termDuration.includes(duration)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                      onClick={() =>
                        setSecondFormData({
                          ...secondFormData,
                          termDuration: secondFormData.termDuration.includes(duration)
                            ? secondFormData.termDuration.filter(
                              (item) => item !== duration
                            ) // Remove if already selected
                            : [...secondFormData.termDuration, duration], // Add if not selected
                        })
                      }
                    >
                      {t(duration.replace(/\s+/g, ""))}
                    </button>
                  ))}
                </div>

              )}





              {/* Commission */}
              {role !== "user"
                ? (
                  <div>
                    <label className="block text-sm font-medium">{t("commission")}</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={secondFormData.commission}
                        onChange={(e) =>
                          setSecondFormData({
                            ...secondFormData,
                            commission: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ) : (

                  <div>
                    <label className="block text-sm font-medium">{t("role")}</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="position"
                          value="agent"
                          checked={secondFormData.position === "agent"}
                          onChange={(e) =>
                            setSecondFormData({
                              ...secondFormData,
                              position: e.target.value,
                            })
                          }
                          className="mr-2"
                        />
                        {t("agent")}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="position"
                          value="owner"
                          checked={secondFormData.position === "owner"}
                          onChange={(e) =>
                            setSecondFormData({
                              ...secondFormData,
                              position: e.target.value,
                            })
                          }
                          className="mr-2"
                        />
                        {t("owner")}
                      </label>
                    </div>
                  </div>



                )}





              <div className="mt-4">
                <label className="block text-sm font-medium">{t("price")}</label>
                <div className="flex gap-2">
                  <input
                    step="50"
                    type="number"
                    value={secondFormData.price}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={secondFormData.currency}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        currency: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="GEL">GEL</option>
                  </select>
                </div>
              </div>

              {/* Deposit */}
              {secondFormData.type !== "Sale" && (

                <div>
                  <label className="block text-sm font-medium">{t("deposit")}</label>
                  <input
                    type="number"
                    value={secondFormData.deposit}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        deposit: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}



              {/* Payment Method */}
              {secondFormData.type !== "Sale" && (

              <div>
                <label className="block text-sm font-medium">
                  {t("payment")}
                </label>
                <select
                  value={secondFormData.paymentMethod}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="FirstDeposit">{t("firstDeposit")}</option>
                  <option value="Monthly">{t("monthly")}</option>
                </select>
              </div>
              )}

            </div>
          ) : (
            // Daily-specific UI
            <div className="mt-4">
              <label className="block text-sm font-medium">{t("price")}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={secondFormData.price}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={secondFormData.currency}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      currency: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="GEL">GEL</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {role !== "user" && <div className="mt-4">
          <label className="block text-sm font-medium">{t("discounted")}</label>
          <div className="flex gap-2">
            <input
              step="50"
              type="number"
              value={secondFormData.discount}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  discount: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <select
              value={secondFormData.currency}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  currency: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="GEL">GEL</option>
            </select>
          </div>
        </div>}

        {/* amenities */}
        <div className="">
          <h3 className="text-lg font-semibold">{t("heating")}</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              "Central",
              "Karma",
              "Electric",
              "AC Heating",
            ].map((option) => (
              <button
                key={option}
                onClick={() =>
                  setSecondFormData((prev) => ({
                    ...prev,
                    heating: prev.heating.includes(option)
                      ? prev.heating.filter((h) => h !== option)
                      : [...prev.heating, option],
                  }))
                }
                className={`px-4 py-2 rounded-md ${secondFormData.heating.includes(option)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
                  }`}
              >
                {t(option.toLowerCase().replace(/\s+/g, ""))}
              </button>
            ))}
          </div>
        </div>

        <div className="">






          {/* Amenities Section */}
          <h3 className="text-lg font-semibold">{t("amenities")}</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              "Oven",
              "Microwave",
              "VacuumCleaner",
              "AirConditioner",
              "Balcony",
              "Stove",
              "Dishwasher",
              "SmartTV",
              "WiFi",
              "ParkingPlace",
              "PlayStation",
              "Projector",
              "Elevator",
            ].map((option) => (
              <div
                key={option}
                className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
              >
                <div className="text-gray-800 font-medium text-sm">{t(option.toLowerCase())}</div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={secondFormData.amenities.includes(option)}
                    onChange={() =>
                      setSecondFormData((prev) => ({
                        ...prev,
                        amenities: prev.amenities.includes(option)
                          ? prev.amenities.filter((item) => item !== option)
                          : [...prev.amenities, option],
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 peer-checked:before:translate-x-4 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-4 before:w-4 before:transition-all peer-checked:before:border-white"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Business Type Section (Only for Commercial) */}
          {secondFormData.propertyType === "Commercial" && (
            <>
              <h3 className="text-lg font-semibold mt-6">{t("businessType")}</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "Showroom",
                  "Office",
                  "Retail",
                  "Restaurant",
                  "Hotel",
                  "CreativeSpace",
                  "Cafe",
                  "Coworking",
                  "BeautySalon",
                ].map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
                  >
                    <div className="text-gray-800 font-medium text-sm">{t(option.toLowerCase())}</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={secondFormData.business?.includes(option)}
                        onChange={() =>
                          setSecondFormData((prev) => ({
                            ...prev,
                            business: prev.business?.includes(option)
                              ? prev.business.filter((item) => item !== option)
                              : [...(prev.business || []), option],
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 peer-checked:before:translate-x-4 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-4 before:w-4 before:transition-all peer-checked:before:border-white"></div>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}









        </div>




        <div>
          <div className="grid grid-cols-1 gap-4">
            {secondFormData.type !== "Sale" && (
              secondFormData.additional.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-800">
                      {t(item.toLowerCase())}
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        secondFormData.selectedAdditional?.includes(item) || false
                      }
                      onChange={() => {
                        setSecondFormData((prev) => {
                          const isSelected = prev.selectedAdditional?.includes(item);
                          const updatedSelected = isSelected
                            ? prev.selectedAdditional.filter(
                              (feature) => feature !== item
                            )
                            : [...(prev.selectedAdditional || []), item];
                          return {
                            ...prev,
                            selectedAdditional: updatedSelected,
                          };
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 peer-checked:before:translate-x-4 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-4 before:w-4 before:transition-all peer-checked:before:border-white"></div>
                  </label>
                </div>
              ))
            )}

          </div>

          {role === "user" && (
            <div className="mt-4">
              <label className="block text-sm font-medium">{t("ownerName")}</label>
              <input
                type="text"
                value={secondFormData.name}
                onChange={(e) =>
                  setSecondFormData({ ...secondFormData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={t("enterName")}
              />
            </div>
          )}

          {role === "user" && (
            <div className="mt-3">
              <label className="block text-sm font-medium">{t("phoneNo")}</label>
              <input
                type="text"
                value={secondFormData.phone}
                onChange={(e) =>
                  setSecondFormData({ ...secondFormData, phone: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={t("enterPhone")}
              />
            </div>
          )}
        </div>
 </div>

      {/* Publish Button */}
      <div className="text-center">
        <button
          onClick={handlePublish}
          className="px-6 py-2 mb-7 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          {t("pub")}
        </button>
      </div>
    </div>
  );
}

SecondComponent.propTypes = {
  localFormData: PropTypes.object.isRequired,
  setStep: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired, // onSave should be a required function

  handlePublishToFirstComponent: PropTypes.func.isRequired,
};

export default SecondComponent;
