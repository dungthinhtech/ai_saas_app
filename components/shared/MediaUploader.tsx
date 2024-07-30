"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
  setIsImageUploaded: React.Dispatch<React.SetStateAction<boolean>>; // Thêm prop này
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
  setIsImageUploaded, // Nhận prop này
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.files) {
        const uploadedFile = data.files[0]; // Adjust based on your file input name
        onValueChange(uploadedFile.filename); // Assuming formidable's newFilename
        setImage(`/uploads/${uploadedFile.filename}`); // Assuming uploads folder

        console.log(data.files[0]);

        toast({
          title: "Image uploaded successfully",
          description: "1 credit was deducted from your account",
          duration: 5000,
          className: "success-toast",
        });

        // Cập nhật trạng thái hình ảnh đã được tải lên
        setIsImageUploaded(true); // Đánh dấu hình ảnh đã được tải lên thành công
      } else {
        setIsImageUploaded(false); // Nếu có lỗi, đảm bảo trạng thái đúng
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="h3-bold text-dark-600">Original</h3>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      {filePreview ? (
        <div className="cursor-pointer overflow-hidden rounded-[10px]">
          <Image
            width={500} // Adjust as needed
            height={300} // Adjust as needed
            src={filePreview}
            alt="Selected image"
            className="media-uploader_cldImage"
          />
        </div>
      ) : (
        <div className="media-uploader_cta" onClick={handleClick}>
          <div className="media-uploader_cta-image">
            <Image
              src="/assets/icons/add.svg"
              alt="Add Image"
              width={24}
              height={24}
            />
          </div>
          <p className="p-14-medium">Click here to upload image</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
