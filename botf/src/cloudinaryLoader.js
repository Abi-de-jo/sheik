 export const loadCloudinaryScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("cloudinary-script")) {
        // Cloudinary script already loaded
        resolve(window.cloudinary);
        return;
      }
  
      const script = document.createElement("script");
      script.id = "cloudinary-script";
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.onload = () => resolve(window.cloudinary);
      script.onerror = () => reject("Failed to load Cloudinary script");
      document.body.appendChild(script);
    });
  };
  
