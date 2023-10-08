import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config/firebase';
import dummy_profile_pic from "../profile-pics/dummy-profile-pic.jpg";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { GroupDetailsProfileOverview } from "../components/GroupDetailsProfileOverview";

//components of the page's css
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
`;
const UserDetailsContainer = styled.div`
  padding: 0px 12px 0px 12px;
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const PerformerDetailsContainer = styled.div`
  padding: 0px;
  margin-bottom: 3px;
  display: flex;
  flex-direction: column;
  align-items: left;
  overflow-x: hidden;
  overflow-y: auto;
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
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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

    //useStates for dictating the conditional rendering of details
    const [displayPerformerDetails, setDisplayPerformerDetails] = useState(false);
    const [displayEventPlannerDetails, setDisplayEventPlannerDetails] = useState(false);
    const [displayGroupDetails, setDisplayGroupDetails] = useState(false);

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

    //methods executed on the click of tab buttons in bottom panel
    const onClickPerformerDetailsButton = () => {
      setDisplayPerformerDetails(true);
      setDisplayEventPlannerDetails(false);
      setDisplayGroupDetails(false);
    }
    const onClickEventPlannerDetailsButton = () => {
      setDisplayPerformerDetails(false);
      setDisplayEventPlannerDetails(true);
      setDisplayGroupDetails(false);
    }
    const onClickGroupDetailsButton = () => {
      setDisplayPerformerDetails(false);
      setDisplayEventPlannerDetails(false);
      setDisplayGroupDetails(true);
    }

    //array of buttons displayed in the tab section - will be added conditionally to array once basics have been implemented
    const tabButtons = [];
    if (user.isPerformer)
    {
      tabButtons.push(<TabsButton onClick={onClickPerformerDetailsButton}>Performer Details</TabsButton>);
    }
    if (user.isEventPlanner)
    {
      tabButtons.push(<TabsButton onClick={onClickEventPlannerDetailsButton}>Event Planner Details</TabsButton>);
    }
    if (user.isInGroup)
    {
      tabButtons.push(<TabsButton onClick={onClickGroupDetailsButton}>Group Details</TabsButton>);
    }

    //get PerformerDetailsProfileOverview components ready if user is a performer
    const performerDetailsOverviewComponents = [];
    if (user.isPerformer)
    {
      for (let i = 0; i < performerDetails.length; i++)
      {
        performerDetailsOverviewComponents.push(
          <PerformerDetailsProfileOverview
            email={email}
            name={performerDetails[i].name}
            type={performerDetails[i].type}
            genres={performerDetails[i].genres}
            links={performerDetails[i].links}
          />
        );
      }
    }

    //empty profile pic and dummy profile pic - to be replaced by profile pic imported from database
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
            {/* {user.isPerformer && 
              <Name>"{performerDetails[0].name}"</Name>
            } */}
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
            {displayPerformerDetails &&
              <UserDetailsContainer>
                <StyledHeader>Performer Details:</StyledHeader>
                <PerformerDetailsContainer>
                  {performerDetailsOverviewComponents}
                </PerformerDetailsContainer>
              </UserDetailsContainer>
            }
            {displayEventPlannerDetails &&
              <UserDetailsContainer>
                <StyledHeader>Event Planner Details:</StyledHeader>
                <EventPlannerDetailsProfileOverview
                  email={email}
                  types={user.eventPlannerInfo.types}
                  pastEvents={user.eventPlannerInfo.pastEvents}
                  upcomingEvents={user.eventPlannerInfo.upcomingEvents}
                  links={user.eventPlannerInfo.links}
                  media={user.eventPlannerInfo.media}
                />
              </UserDetailsContainer>
            }
            {displayGroupDetails &&
              <p>DISPLAY HERE: GroupDetailsProfileOverview components</p>
            }
          </BottomPanel>
        </HorizontalPanel>
        <VerticalPanel>
          <StyledHeader>Reviews:</StyledHeader>
        </VerticalPanel>
      </Container>
    );
}

export default ProfilePage;