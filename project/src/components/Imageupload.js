import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";
import { v4 } from "uuid";

const ImageUploader = ({ userEmail }) => {
  const [imageUrls, setImageUrls] = useState([]);

  const storageRef = ref(storage, `users/${userEmail}/images/`);

  const getImageType = (url) => {
    const lowercasedUrl = url.toLowerCase();

    if (lowercasedUrl.includes(".mp4")) {
      return "video";
    } else if (
      lowercasedUrl.includes(".jpg") ||
      lowercasedUrl.includes(".jpeg") ||
      lowercasedUrl.includes(".png") ||
      lowercasedUrl.includes(".gif") ||
      lowercasedUrl.includes(".bmp")
    ) {
      return "image";
    } else if (
      lowercasedUrl.includes(".mp3") ||
      lowercasedUrl.includes(".wav") ||
      lowercasedUrl.includes(".ogg")
    ) {
      return "audio";
    } else {
      return "unknown";
    }
  };

  const uploadFile = (file) => {
    const fileRef = ref(storageRef, `social_media_${v4()}_${file.name}`);
    
    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    if (userEmail === "") return;

    listAll(storageRef)
      .then((response) => {
        const promises = response.items.map((item) => {
          return getDownloadURL(item).then((url) => {
            if (getImageType(url) === "image" || getImageType(url) === "audio") {
              return url;
            }
          });
        });

        return Promise.all(promises);
      })
      .then((filteredUrls) => {
        const filteredUrlsArray = filteredUrls.filter((url) => url !== undefined);
        setImageUrls(filteredUrlsArray);
      })
      .catch((error) => {
        console.error("Error loading files:", error);
      });
  }, [userEmail, storageRef]);

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
      {imageUrls.map((url, index) => (
        <div key={index}>
          {getImageType(url) === "image" && (
            <img style={{ width: 135, height: 135, borderRadius: 135 }} src={url} alt={`image-${index}`} />
          )}
          {getImageType(url) === "audio" && (
            <audio controls src={url} type="audio/mp3" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;