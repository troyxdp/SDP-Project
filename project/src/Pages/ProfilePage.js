import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { db } from '../firebase-config/firebase';
import dummy_profile_pic from "../profile-pics/dummy-profile-pic.jpg";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";

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
  padding: 10px 20px;
  color: white;
  margin-left: 12px;
`;
const VerticalPanel = styled.div`
  background-color: #32a6a6;
  padding: 20px;
`;
const CreationButtonsBox = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
`;
const CreateButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 15px;
    color: white;
    margin-top: 10px;
`;

/*
  TO-DO:
  - Add profile picture functionality
  - Add display of media
  - Add different rendering of profile page depending on if it is the user's profile page vs someone else's
  - Add "Edit Profile" button that takes the user to a page that allows them to edit all of their details.
    ~ This button only renders when the user is on their own profile page
  - Add "Add Friend"/"Remove Friend" button
    ~ This button only renders when the user is on someone else's profile page
    ~ The button displays "Add Friend" when they aren't friends and "Remove Friend" when they are friends
    ~ When button is pressed when it is displaying "Add Friend",  a pending friend request is sent to the profile page's user
    ~ When button is pressed when it is display "Remove Friend", the profile page's user is removed from the user's friend list and vice versa
  - Add header bar that redirects to different pages
  - Add moving of events from upcoming to past for EventPlanner users
*/
const ProfilePage = () => {
    //fetch email from session storage
    let email = sessionStorage.getItem("userEmail");

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

        //add moving of events from upcoming to past based on current date and time
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

    //handle navigation to other pages
    let navigate = useNavigate();
    const goToCreateEventPage = async (e) => {
      e.preventDefault();
      navigate("/createEventPage");
      window.location.reload(false);
    }
    const goToCreateGroupPage = async (e) => {
      e.preventDefault();
      navigate("/createGroupPage");
      window.location.reload(false);
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
            <CreationButtonsBox>
              {user.isEventPlanner &&
                <CreateButton onClick={goToCreateEventPage}>Create Event</CreateButton>
              }
              {user.isPerformer &&
                <CreateButton onClick={goToCreateGroupPage}>Create Group</CreateButton>
              }
            </CreationButtonsBox>
            <StyledHeader>Profile Page</StyledHeader>
            {profilePic}
            <Name>{user.fullName}</Name>
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