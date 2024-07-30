// app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const filePath = data.files[0].path.replace("public/", ""); // Chỉnh sửa đường dẫn
        setImageUrl(`/${filePath}`);
      } else {
        console.error("Upload thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div>
      <h1>Upload Hình Ảnh</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {imageUrl && (
        <div>
          <h2>Hình Ảnh Đã Upload:</h2>
          <Image src={imageUrl} alt="Uploaded Image" width={500} height={500} />
        </div>
      )}
    </div>
  );
}
