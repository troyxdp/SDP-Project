import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "../firebase-config/firebase/storage";
import { v4 } from "uuid";

const ImageUpload = ({ userEmail }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState(new Set()); // Use a Set to store unique URLs

  const storageRef = ref(storage, `users/${userEmail}/images`); // Adjust the path according to your storage structure

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storageRef, `${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => new Set([...prev, url])); // Add URL to the Set
      });
    });
  };
  
    useEffect(() => {
      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls(prev => new Set([...prev, url])); // Add URL to the Set
          });
        });
      });
    }, []);
  
    return (
      <div className="ImageUpload">
        <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        />
        <button onClick={uploadFile}> Upload Image</button>
        {[...imageUrls].map((url, index) => (
          <img key={index} src={url} alt={`image-${index}`} />
        ))}
      </div>
    );
  };
  export default ImageUpload;