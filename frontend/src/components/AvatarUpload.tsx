import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URLS } from "../config";
import { useAuth } from "../contexts/AuthContext";

const AvatarUpload = ({ userId }: any) => {
  const { user, token } = useAuth();
  //   const params = useParams<{ id: string }>();

  const numericId = parseInt(userId as string);
  console.log("numericId", numericId);
  const [file, setFile] = useState<File | null>(null); // ✅ typed correctly
  const [preview, setPreview] = useState<string>("");

  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = files[0]; // ✅ valid File
    setFile(selected); // ✅ now valid
    setPreview(URL.createObjectURL(selected));
    const formData = new FormData();
    formData.append("file", selected);
    formData.append("upload_preset", "avatar_upload");

    try {
      const url = await axios.post(
        "https://api.cloudinary.com/v1_1/dqzjia8yg/image/upload",
        formData
      );
      console.log(url);
      setUploadedUrl(url.data.secure_url);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!uploadedUrl) {
      return;
    }
    (async () => {
      await axios.put(
        API_URLS.UPDATE_USER(numericId),
        { id: numericId, avatar: uploadedUrl },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      window.location.reload();
    })();
  }, [uploadedUrl]);
  return (
    <div>
      +<input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="avatar" width={100} />}
    </div>
  );
};

export default AvatarUpload;
