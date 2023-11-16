import "./App.css";
import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";


function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]); // Use an array instead of Set
  const [userEmail, setUserEmail] = useState("");

  const imagesListRef = ref(storage);
  const storageRef = ref(storage, `users/${userEmail}/images/`);

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const uploadFile = () => {
    if (imageUpload == null || userEmail === "") return;

    const imageRef = ref(storageRef, `profile_photo_${v4()}_${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]); // Add URL to the array
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
        console.log(filteredUrls.length)

      });
    });
  }, [userEmail, storageRef]);
  return (
    <div className="App">
      <label>
        Enter your email:
        <input
          type="text"
          value={userEmail}
          onChange={handleEmailChange}
        />
      </label>
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`image-${index}`} />
      ))}
    </div>
  );
}

export default App;

