import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { loadCloudinaryScript } from "../cloudinaryLoader";

const UploadVideo = ({ onVideoUpdate }) => {
  const [videoURLs, setVideoURLs] = useState([]);
  const widgetRef = useRef(null);

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        const cloudinary = await loadCloudinaryScript();

        if (!widgetRef.current) {
          widgetRef.current = cloudinary.createUploadWidget(
            {
              cloudName: "dypxhjdeu",
              uploadPreset: "abisheik",
              resourceType: "video", // Videos only
              multiple: false,
              maxFileSize: 700000000,
              allowedFormats: ["mp4", "mov", "avi"],
            },
            (err, result) => {
              if (result.event === "success") {
                setVideoURLs((prev) => {
                  const updatedVideos = [...prev, result.info.secure_url];
                  onVideoUpdate(updatedVideos);
                  return updatedVideos;
                });
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

  const deleteVideo = (index) => {
    const updatedVideos = videoURLs.filter((_, i) => i !== index);
    setVideoURLs(updatedVideos);
    onVideoUpdate(updatedVideos);
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={openWidget} className="p-4 border-2 border-dashed border-blue-500 rounded-lg">
        <AiOutlineCloudUpload size={40} className="text-blue-600" />
        <span className="text-sm text-gray-600">Click to upload videos</span>
      </button>

      {videoURLs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {videoURLs.map((url, index) => (
            <div key={index} className="relative">
              <video
                src={url}
                controls
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => deleteVideo(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
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
