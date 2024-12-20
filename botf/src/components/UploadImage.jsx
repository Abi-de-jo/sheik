import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { loadCloudinaryScript } from "../cloudinaryLoader";

const UploadImage = ({ onImageUpdate }) => {
  const [imageURLs, setImageURLs] = useState([]);
  const widgetRef = useRef(null);

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        const cloudinary = await loadCloudinaryScript();

        if (!widgetRef.current) {
          widgetRef.current = cloudinary.createUploadWidget(
            {
              cloudName: "dbandd0k7",
              uploadPreset: "zf9wfsfi",
              resourceType: "image",
              multiple: true,
              maxFileSize: 10000000,
              allowedFormats: ["jpg", "png", "jpeg"],
            },
            (err, result) => { 
              if (result.event === "success") {
                setImageURLs((prev) => {
                  const updatedImages = [...prev, result.info.secure_url];
                  onImageUpdate(updatedImages);
                  return updatedImages;
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
  }, [onImageUpdate]);

  const openWidget = () => widgetRef.current && widgetRef.current.open();

  const deleteImage = (index) => {
    const updatedImages = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updatedImages);
    onImageUpdate(updatedImages);
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={openWidget} className="p-4 border border-dashed rounded-lg">
        <AiOutlineCloudUpload size={40} />
        Upload Images
      </button>

      {imageURLs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {imageURLs.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt="Uploaded" className="w-full h-32 object-cover" />
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
