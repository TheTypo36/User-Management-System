import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config";
import { useAuth } from "../contexts/AuthContext";
import { showError, showSuccess } from "../utils/toastifyUtil";

const AvatarUpload = ({ userId }: { userId: number }) => {
  const { token } = useAuth();
  const numericId = userId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(file);

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));

    const formData = new FormData();
    formData.append("file", selected);
    formData.append("upload_preset", "avatar_upload");

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqzjia8yg/image/upload",
        formData
      );
      setUploadedUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!uploadedUrl) return;

    (async () => {
      try {
        await axios.put(
          API_URLS.UPDATE_USER(numericId),
          { id: numericId, avatar: uploadedUrl },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPreview(uploadedUrl);
        showSuccess("successfull uploaded avatar");
      } catch (error) {
        showError("failed to upload avatar");

        console.error("Error updating user avatar:", error);
      }
    })();
  }, [uploadedUrl]);

  return (
    <div className="relative w-28 h-28">
      {preview ? (
        <img
          src={preview}
          alt="avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full flex items-center justify-center text-3xl text-gray-400 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:text-gray-600 transition"
        >
          +
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition"
          title="Change Avatar"
        >
          +
        </div>
      )}

      {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
};

export default AvatarUpload;
