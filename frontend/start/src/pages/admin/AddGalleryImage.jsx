import React, { useState } from "react";
import { getGoogleDriveConnectUrl, uploadGalleryImages } from "../../api/gallaryApi";
import toast from "react-hot-toast";

const AddGalleryImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectDrive = async () => {
    setConnecting(true);
    try {
      const authorizationUrl = await getGoogleDriveConnectUrl();
      window.location.assign(authorizationUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to connect Google Drive");
      setConnecting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages(images);
  };

  // Remove single image from preview
  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (selectedImages.length === 0) return;

    setLoading(true);
    try {
      await uploadGalleryImages(selectedImages);
     toast.success(`${selectedImages.length} image(s) uploaded successfully!`);
      setSelectedImages([]);
      setIsModalOpen(false);
      // Optional: refresh gallery list after upload
      window.location.reload(); 
    } catch (err) {
      console.error("Upload failed:", err);
        toast.error("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 md:p-6">
      <button
        className="bg-white text-blue-600 border-2 border-blue-500 md:px-4 md:py-2 p-2 text-sm rounded hover:bg-blue-50 transition-all"
        onClick={handleConnectDrive}
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect Google Drive"}
      </button>
      {/* Add Image Button */}
      <button
        className="bg-blue-500 text-white md:px-4 md:py-2 p-2 text-sm border-2 border-white   rounded hover:bg-blue-600 transition-all "
        onClick={() => setIsModalOpen(true)}
      >
        + Image
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-30">
          <div className="bg-white w-11/12 max-w-lg rounded-lg p-6 relative shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mb-4"
            />

            {/* Preview */}
            {selectedImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.preview}
                      alt={`preview-${index}`}
                      className="w-full h-32 object-contain border rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={selectedImages.length === 0 || loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGalleryImage;
