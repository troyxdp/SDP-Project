import React, { useEffect, useState } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";

// Assuming isProfilePic and userEmail are defined elsewhere in your component

function LoadProfilepic({isProfilePic,userEmail}) {
  const [imageUrls, setImageUrls] = useState([]);
  const no_profile_pic = "../profile-pics/no-profile-pic-image.jpg"; // Replace with your default profile pic path

  useEffect(() => {
    console.log(isProfilePic)
    if (isProfilePic) {
      const storageRef = ref(storage, `users/${userEmail}/images/`);
      listAll(storageRef)
        .then((response) => {
          const promises = response.items.map((item) => {
            return getDownloadURL(item).then((url) => {
              if (url.includes("profile_photo")) {
                return url;
              }
            });
          });

          return Promise.all(promises);
        })
        .then((filteredUrls) => {
          // Remove undefined values
          const filteredUrlsArray = filteredUrls.filter((url) => url !== undefined);
          setImageUrls(filteredUrlsArray);
          console.log(filteredUrlsArray.length);
        })
        .catch((error) => {
          console.error("Error loading profile pictures:", error);
        });
    }
  }, [isProfilePic, userEmail]);

  const profilePic = isProfilePic && (
    <div>
      {imageUrls.map((url, index) => (
        <img key={index} style={{ width: 135, height: 135, borderRadius: 135 }} src={url} alt={`image-${index}`} />
      ))}
      </div>
  );

  return <div>{profilePic || <img style={{ width: 135, height: 135, borderRadius: 135 }} src={no_profile_pic} alt="Profile" />}</div>;

    }

export default LoadProfilepic;
