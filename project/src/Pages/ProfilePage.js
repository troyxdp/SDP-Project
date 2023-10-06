import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config/firebase';
import dummy_profile_pic from "../profile-pics/dummy-profile-pic.jpg";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";

//components of the page's css
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
`;
const HorizontalPanel = styled.div``;
const TopPanel = styled.div`
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
const BottomPanel = styled.div`
  border-top: 1px solid #333;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
`;
const TabsButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 0px solid #fff;
  border-radius: 10px;
  background: #a13333;
  padding: 15px 30px;
  color: white;
  margin-left: 12px;
`;
const VerticalPanel = styled.div`
  background-color: #32a6a6;
  padding: 20px;
`;

const ProfilePage = () => {
    //fetch email from session storage
    let email = sessionStorage.getItem("userEmail");

    let navigate = useNavigate();

    //initializing object for user field
    const userInitializer = {
      email : email,
      fullName : "",
      location : "",
      bio : "",
      profilePic : null,
      eventPlannerInfo : null,
      isPerformer : false,
      isEventPlanner : false,
      isInGroup : false
    };

    //useStates for storing information
    const [user, setUser] = useState(userInitializer);
    const [performerDetails, setPerformerDetails] = useState([]);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);
    const [groupDetails, setGroupDetails] = useState([]); //for later - add details of groups that user is member of
    const [isProfilePic, setIsProfilePic] = useState(false);

    //useEffect to fetch user data from database
    useEffect(() => {
      const getUserData = async () => {
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);

        let userData = {
          email : email,
          fullName : docSnap.data().fullName,
          location : docSnap.data().location,
          bio : docSnap.data().bio,
          profilePic : docSnap.data().profilePic,
          eventPlannerInfo : docSnap.data().eventPlannerInfo,
          isPerformer : docSnap.data().isPerformer,
          isEventPlanner : docSnap.data().isEventPlanner,
          isInGroup : docSnap.data().isInGroup
        }
        setUser(userData);

        //if user is an event planner
        if (userData.isEventPlanner)
        {
          setEventPlannerDetails(userData.eventPlannerInfo);
        }

        //if user is a performer
        if (userData.isPerformer)
        {
          const currPerformerDetails = [];
          const querySnapshot = await getDocs(collection(db, "users", email, "performerInfo"));
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            currPerformerDetails.push(doc.data());
          });
          setPerformerDetails(currPerformerDetails);
        }

        //add importing of group details
      };
      getUserData();
    }, [])

    //array of buttons displayed in the tab section - will be added conditionally to array once basics have been implemented
    const tabButtons = [];
    if (user.isPerformer)
    {
      tabButtons.push(<TabsButton>Performer Details</TabsButton>);
    }
    if (user.isEventPlanner)
    {
      tabButtons.push(<TabsButton>Event Planner Details</TabsButton>);
    }
    if (user.isInGroup)
    {
      tabButtons.push(<TabsButton>Group Details</TabsButton>);
    }

    //empty profile pic and dummy profile pic - to be replaced by 
    let profilePic = [<img style={{ width : 135, height: 135, borderRadius: 135 }} src={no_profile_pic} alt="Profile" />];
    if (isProfilePic)
    {
      profilePic = [<img style={{ width : 135, height: 135, borderRadius: 135 }} src={dummy_profile_pic} alt="dummy profile pic" />];
    }

    return (
      <Container>
        <HorizontalPanel>
          <TopPanel background-color = "#f2f2f2">
            <StyledHeader>Profile Page</StyledHeader>
            {profilePic}
            <Name>{user.fullName}</Name>
            {user.isPerformer && 
              <Name>"{performerDetails[0].name}"</Name>
            }
            <DetailsBox>
              <Detail><b>Email:</b> {user.email}</Detail>
              <Detail><b>Location:</b> {user.location}</Detail>
              <Detail>{user.bio}</Detail>
            </DetailsBox>
          </TopPanel>
          <BottomPanel>
            <Tabs>
              {tabButtons}
            </Tabs>
          </BottomPanel>
        </HorizontalPanel>
        <VerticalPanel>
          <StyledHeader>Reviews:</StyledHeader>
        </VerticalPanel>
      </Container>
    );
}

export default ProfilePage;