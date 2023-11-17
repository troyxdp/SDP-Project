import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase-config/firebase";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";
import styled from "styled-components";

const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const Propic = ({ userEmail }) => {
  const [profilePic, setProfilePic] = useState(null);
  const storageRef = ref(storage, `users/${userEmail}/images/`);
  const loadProfilePic = async (term) => {
    try {
      const response = await listAll(storageRef);
      const promises = response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const hasTerm = url.toLowerCase().includes(term);

        if (hasTerm) {
          return url;
        }
      });

      const filteredUrls = await Promise.all(promises);
      const filteredUrlsArray = filteredUrls.filter((url) => url !== undefined);

      // Set the image source directly based on the filtered URL
      const newProfilePic = filteredUrlsArray.length > 0
        ? <img style={{ width: 135, height: 135, borderRadius: 135 }} src={filteredUrlsArray[0]} alt="Profile" />
        : <img style={{ width: 135, height: 135, borderRadius: 135 }} src={no_profile_pic} alt="Profile" />;

      // Update the state to trigger a re-render
      setProfilePic(newProfilePic);
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  useEffect(() => {
    // Trigger the loadProfilePic function when the component mounts
    loadProfilePic("profile_picture");
  }, []); // The empty dependency array ensures it only runs once when the component mounts

  return (
    <div>
      <StyledHeader>Profile Page</StyledHeader>
      {profilePic}
    </div>
  );
};

export default Propic;
