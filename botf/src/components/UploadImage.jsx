import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { loadCloudinaryScript } from "../cloudinaryLoader";

const UploadImage = ({ onImageUpdate }) => {
  const [imageURLs, setImageURLs] = useState([]); // Store uploaded image URLs
  const widgetRef = useRef(null); // Cloudinary widget reference

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        const cloudinary = await loadCloudinaryScript();

        if (!widgetRef.current) {
          widgetRef.current = cloudinary.createUploadWidget(
            {
              cloudName: "dbandd0k7",
              uploadPreset: "zf9wfsfi", // Image upload preset
              resourceType: "image", // Explicitly allow only images
              multiple: true, // Allow multiple image uploads
              maxFileSize: 10000000, // 10MB per file
              allowedFormats: ["jpg", "png", "jpeg"], // Allowed image formats
            },
            (err, result) => {
              if (result.event === "success") {
                console.log("Uploaded image:", result.info);
                setImageURLs((prev) => {
                  const updatedImages = [...prev, result.info.secure_url];
                  onImageUpdate(updatedImages); // Notify parent
                  return updatedImages;
                });
              }
            }
          );
        }
      } catch (error) {
        console.error("Cloudinary widget failed to load for images:", error);
      }
    };

    initializeWidget();
  }, [onImageUpdate]);

  const openWidget = () => widgetRef.current && widgetRef.current.open();

  const deleteImage = (index) => {
    const updatedImages = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updatedImages);
    onImageUpdate(updatedImages); // Notify parent
  };

  return (
    <div className="flex flex-col items-center">
      {/* Upload Button */}
      <button
        onClick={openWidget}
        className="p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
      >
        <AiOutlineCloudUpload size={40} className="text-blue-600" />
        <span className="text-sm text-gray-600">Click to upload images</span>
      </button>

      {/* Display Uploaded Images */}
      {imageURLs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {imageURLs.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => deleteImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
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

UploadImage.propTypes = {
  onImageUpdate: PropTypes.func.isRequired,
};

export default UploadImage;
