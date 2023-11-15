import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";
import { v4 } from "uuid";
import styled from "styled-components";



const UploadButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 10px 10px;
    color: white;
    margin-top: 10px;
`;
const StyledInput = styled.input`
  padding: 5px;
  background: #a13333;
  font-color: white
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  outline: none; /* Remove default focus border */
`;


function ImageUploader({ userEmail }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);

  const storageRef = ref(storage, `users/${userEmail}/media/`);

  const handleEmailChange = (event) => {
    // If needed, you can update the parent component state with the user's email here
  };

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  const uploadFile = () => {
    if (imageUpload == null || userEmail === "") return;

    const mediaRef = ref(storageRef, `social_media_${v4()}_${imageUpload.name}`);
    uploadBytes(mediaRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setMediaItems((prev) => [...prev, { url, type: getImageType(url) }]);
      });
    });
  };

  const getImageType = (url) => {
    if (url.toLowerCase().includes(".mp4")) {
      return "video";
    } else if (
      url.toLowerCase().includes(".jpg") ||
      url.toLowerCase().includes(".jpeg") ||
      url.toLowerCase().includes(".png") ||
      url.toLowerCase().includes(".gif") ||
      url.toLowerCase().includes(".bmp")
    ) {
      return "image";
    } else {
      return "unknown";
    }
  };
  
  
  
  

  useEffect(() => {
    if (userEmail === "") return;

    listAll(storageRef)
      .then((response) => {
        const promises = response.items.map((item) => {
          return getDownloadURL(item).then((url) => {
            //console.log(url.type)
            return { url, type: getImageType(url) };
          });
        });

        return Promise.all(promises);
      })
      .then((mediaItems) => {
        setMediaItems(mediaItems);
      });
  }, [userEmail, storageRef]);

  // Render the media items
  const mediaElements = mediaItems.map((item, index) => {
    //console.log(item.type)
    if (item.type === "image") {
      return <img key={index} src={item.url} alt={`image-${index}`} style={{ width: "200px", height: "140px", margin: "5px" }} />;
    } else if (item.type === "video") {
      return <video autoPlay loop key={index} src={item.url} controls style={{ width: "200px", height: "150px", margin: "5px" }} />;
    }
    return null; // Handle other types or invalid URLs as needed
  });

  return (
    <div>
      <StyledInput type="file" onChange={handleFileChange} />
      <UploadButton onClick={uploadFile}>Upload Media</UploadButton>
      <div>{mediaElements}</div>
    </div>
  );
}

export default ImageUploader;
