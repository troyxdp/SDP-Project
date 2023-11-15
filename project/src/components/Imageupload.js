import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";
import { v4 } from "uuid";

function ImageUploader({ userEmail, imageUpload, onUploadSuccess}) {
  const [imageUrls, setImageUrls] = useState([]); // Use an array instead of Set

  const storageRef = ref(storage, `users/${userEmail}/images/`);

  const handleEmailChange = (event) => {
    // If needed, you can update the parent component state with the user's email here
  };

  const uploadFile = () => {
    if (imageUpload == null || userEmail === "") return;

    const imageRef = ref(storageRef, `profile_photo_${v4()}_${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]); // Add URL to the array
        onUploadSuccess(url); // Call the callback function with the uploaded URL
      });
    });
  };

  useEffect(() => {
    if (userEmail === "") return;

    listAll(storageRef).then((response) => {
      const promises = [];

      response.items.forEach((item) => {
        promises.push(
          getDownloadURL(item).then((url) => {
            if (url.includes("profile_photo")) {
              return url;
            }
          })
        );
      });

      Promise.all(promises).then((filteredUrls) => {
        // Remove undefined values
        const filteredUrlsArray = filteredUrls.filter((url) => url !== undefined);

        setImageUrls(filteredUrlsArray);
        console.log(filteredUrlsArray.length);
      });
    });
  }, [userEmail, storageRef]);

  // No return statement here

}

export default ImageUploader;
