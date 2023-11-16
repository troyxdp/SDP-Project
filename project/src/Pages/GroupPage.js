import{ collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, getCountFromServer} from "firebase/firestore";
import {useEffect, useState} from "react";
import{useLocation, useNavigate} from "react-router-dom" ;
import styled from "styled-components";
import {NavigationBar} from "../components/NavigationBar";
import { db } from '../firebase-config/firebase';
import dummy_profile_pic from "../profile-pics/dummy-profile-pic.jpg";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";


const Container = styled.div`
    display:grid;
    grid-template-columns:1fr 0.5fr;
    height:100vh;
`; 

const GroupDetailsContainer= styled.div`
    padding: 0px 12px 0px 12px;
    display: flex;
    flex-direction:column;
    align-items:left;
`;

const HorizontalPanel = styled.div``;
const TopPanel = styled.div`
  position: relative;
  padding: 16px;
  height: auto;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;
const Name = styled.h2`
  font-size: 1.2rem;
  color: #a13333;
  margin-top: 8px;
  margin-bottom: 0px;
`;
const Detail = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 0.8rem;
`;
const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const GroupPage=()=>{
    let userEmail=sessionStorage.getItem("userEmail");
    let profileEmail=useLocation().state;
    let isUserProfile=(userEmail===profileEmail);


        //initializing object for user field
        const userInitializer = {
            email : profileEmail,
            fullName : "",
            location : "",
            bio : "",
            profilePic : null,
            isPerformer : false,
            isEventPlanner : false,
            isInGroup : false
          };
          const [user, setUser] = useState(userInitializer);
          const [groupDetails, setGroupDetails] = useState([]); //for later - add details of groups that user is member of
          const [isProfilePic, setIsProfilePic] = useState(false);

          const [displayGroupDetails, setDisplayGroupDetails] = useState(false);

}

