import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { loadCloudinaryScript } from "../cloudinaryLoader";


const UploadVideo = ({ onVideoUpdate }) => {
  const [videoURLs, setVideoURLs] = useState([]); // Store uploaded video URLs
  const widgetRef = useRef(null); // Cloudinary widget reference

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        const cloudinary = await loadCloudinaryScript();

        if (!widgetRef.current) {
          widgetRef.current = cloudinary.createUploadWidget(
            {
              cloudName: "dbandd0k7",
              uploadPreset: "xmmcvp1e",  
              resourceType: "video", // Allow videos only
              multiple: false, // Allow multiple video uploads
              maxFileSize: 30000000, // 30MB per file
              allowedFormats: ["mp4", "mov", "avi"], // Allowed video formats
            },
            (err, result) => {
              if (result.event === "success") {
                setVideoURLs((prev) => {
                  const updatedVideos = [...prev, result.info.secure_url];
                  onVideoUpdate(updatedVideos); // Notify parent
                  return updatedVideos;
                });
              }
            }
          );
        }
      } catch (error) {
        console.error("Cloudinary widget failed to load:", error);
      }
    };

    initializeWidget();
  }, [onVideoUpdate]);

  // Open the upload widget
  const openWidget = () => widgetRef.current && widgetRef.current.open();

  // Delete a video
  const deleteVideo = (index) => {
    const updatedVideos = videoURLs.filter((_, i) => i !== index);
    setVideoURLs(updatedVideos);
    onVideoUpdate(updatedVideos); // Notify parent
  };

  return (
    <div className="flex flex-col items-center">
      {/* Upload Button */}
      <button
        onClick={openWidget}
        className="p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
      >
        <AiOutlineCloudUpload size={40} className="text-blue-600" />
        <span className="text-sm text-gray-600">Click to upload videos</span>
      </button>

      {/* Display Uploaded Videos */}
      {videoURLs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {videoURLs.map((url, index) => (
            <div key={index} className="relative group">
              <video
                src={url}
                controls
                className="w-full h-32 object-cover rounded-lg"
              />
              {/* Delete Button */}
              <button
                onClick={() => deleteVideo(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

UploadVideo.propTypes = {
  onVideoUpdate: PropTypes.func.isRequired,
};

export default UploadVideo;
