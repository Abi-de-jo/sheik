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
              uploadPreset: "xmmcvp1e", // Video upload preset
              resourceType: "video", // Explicitly allow only videos
              multiple: false, // Allow a single video upload
              maxFileSize: 30000000, // 30MB per file
              allowedFormats: ["mp4", "mov", "avi"], // Allowed video formats
            },
            (err, result) => {
              if (result.event === "success") {
                console.log("Uploaded video:", result.info);
                setVideoURLs([result.info.secure_url]); // Replace the video URL
                onVideoUpdate([result.info.secure_url]); // Notify parent
              }
            }
          );
        }
      } catch (error) {
        console.error("Cloudinary widget failed to load for videos:", error);
      }
    };

    initializeWidget();
  }, [onVideoUpdate]);

  const openWidget = () => widgetRef.current && widgetRef.current.open();

  const deleteVideo = () => {
    setVideoURLs([]);
    onVideoUpdate([]); // Clear video in parent component
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
        <div className="mt-4">
          <video
            src={videoURLs[0]}
            controls
            className="w-full h-32 object-cover rounded-lg"
          />
          <button
            onClick={deleteVideo}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Remove Video
          </button>
        </div>
      )}
    </div>
  );
};

UploadVideo.propTypes = {
  onVideoUpdate: PropTypes.func.isRequired,
};

export default UploadVideo;
