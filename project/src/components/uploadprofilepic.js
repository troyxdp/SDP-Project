import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";
import { v4 } from "uuid";

const ProfilePicture = ({ userEmail }) => {
    const [imageUrls, setImageUrls] = useState([]);
  const storageRef = ref(storage, `users/${userEmail}/images/`);

  const getImageType = (url) => {
    const lowercasedUrl = url.toLowerCase();

    if (
      lowercasedUrl.includes(".jpg") ||
      lowercasedUrl.includes(".jpeg") ||
      lowercasedUrl.includes(".png") ||
      lowercasedUrl.includes(".gif") ||
      lowercasedUrl.includes(".bmp")
    ) {
      return "image";
    } else {
      return "unknown";
    }
  };

  const uploadFile = (file) => {
    const fileRef = ref(storageRef, `profile_picture_${v4()}_${file.name}`);
    
    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          if (file) {
            uploadFile(file);
          }
        }}
      />
    </div>
  );
};

export default ProfilePicture;