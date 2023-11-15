import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, getCountFromServer  } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import {NavigationBar} from "../components/NavigationBar";
import { db, storage } from '../firebase-config/firebase';
import LoadProfilepic from "../Pages/loadImages"
import ImageUploader  from "../components/Imageupload";


const PageContainer = styled.div`
    position: fixed;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    overflow-y: auto;
    background: #fff;
    border-radius: 10px;
`;
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
  background-color: #a9a9a9;
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
  - Add the ability to add reviews. Display of input is conditional based on if it is the user's profile page or not
  - Potentially add loading animation
*/
const ProfilePage = () => {
    //fetch email from session storage
    let userEmail = sessionStorage.getItem("userEmail");
    let profileEmail = useLocation().state;
    let isUserProfile = (userEmail === profileEmail);

    //initializing object for user field
    const userInitializer = {
      email : profileEmail,
      displayName : "",
      searchName : "",
      location : "",
      bio : "",
      profilePic : null,
      isPerformer : false,
      isEventPlanner : false,
      isInGroup : false
    };

    //useStates for storing information
    const [user, setUser] = useState(userInitializer);
    const [performerDetails, setPerformerDetails] = useState([]);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);
    const [groupDetails, setGroupDetails] = useState([]); //for later - add details of groups that user is member of
    const [isProfilePic, setIsProfilePic] = useState(true); // may need to change this 
    const [eventPlannerUpcomingEvents, setEventPlannerUpcomingEvents] = useState([]);
    const [eventPlannerPastEvents, setEventPlannerPastEvents] = useState([]);

    //useStates for dictating the conditional rendering of details
    const [displayPerformerDetails, setDisplayPerformerDetails] = useState(false);
    const [displayEventPlannerDetails, setDisplayEventPlannerDetails] = useState(false);
    const [displayGroupDetails, setDisplayGroupDetails] = useState(false);
    const [isDataLoadedFromDatabase, setIsDataLoadedFromDatabase] = useState(false);

    //useEffect to fetch user data from database
    useEffect(() => {
      const getUserData = async () => {
        const docRef = doc(db, "users", profileEmail);
        const docSnap = await getDoc(docRef);

        let userData = {
          email : profileEmail,
          displayName : docSnap.data().displayName,
          searchName : docSnap.data().searchName,
          location : docSnap.data().location,
          bio : docSnap.data().bio,
          profilePic : docSnap.data().profilePic,
          isPerformer : docSnap.data().isPerformer,
          isEventPlanner : docSnap.data().isEventPlanner,
          isInGroup : docSnap.data().isInGroup
        }
        setUser(userData);

        //if user is an event planner
        if (userData.isEventPlanner)
        {
          //get event planner details
          let currEventPlannerDetails = null;
          const eventPlannerSnapshot = await getDocs(collection(db, "users", profileEmail, "eventPlannerInfo"));
          let eventPlannerID;
          eventPlannerSnapshot.forEach((doc) => {
            currEventPlannerDetails = doc.data();
            eventPlannerID = doc.id;
          });
          setEventPlannerDetails(currEventPlannerDetails);
          
          //GET UPCOMING AND PAST EVENTS
          //collection references
          const upcomingEventsRef = collection(db, "upcomingEvents");
          const pastEventsRef = collection(db, "pastEvents");

          //get upcoming events
          const upcomingEventsQuery = query(upcomingEventsRef, where("creatingUserEmail", "==", profileEmail));
          const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
          const currUpcomingEvents = [];
          const currUpcomingEventsIDs = [];
          upcomingEventsQuerySnapshot.forEach((doc) => {
            currUpcomingEvents.push(doc.data());
            currUpcomingEventsIDs.push(doc.id);
          });

          //get past events
          const pastEventsQuery = query(pastEventsRef, where("creatingUserEmail", "==", profileEmail));
          const pastEventsQuerySnapshot = await getDocs(pastEventsQuery);
          const currPastEvents = [];
          pastEventsQuerySnapshot.forEach((doc) => {
            currPastEvents.push(doc.data());
          });

          //move upcoming events that have already happened to past events
          const today = new Date();
          const newPastEvents = [];
          const eventIDsToRemove = [];
          for (let i = 0; i < currUpcomingEvents.length; i++)
          {
            const currEventEndDate = new Date(currUpcomingEvents[i].endDate.toDate());
            if (currEventEndDate < today)
            {
              newPastEvents.push(currUpcomingEvents[i]);
              currPastEvents.push(currUpcomingEvents[i]);
              eventIDsToRemove.push(currUpcomingEventsIDs[i]);
              currUpcomingEvents.splice(i, 1);
              currUpcomingEventsIDs.splice(i, 1);
              i--;
            }
          }

          //set useStates to values of currPastEvents and currUpcomingEvents arrays
          setEventPlannerPastEvents(currPastEvents);
          setEventPlannerUpcomingEvents(currUpcomingEvents);

          //make move of events reflect on database
          for (let i = 0; i < newPastEvents.length; i++)
          {
            await addDoc(pastEventsRef, newPastEvents[i]); //add event to pastEvents collection
            await deleteDoc(doc(db, "upcomingEvents", eventIDsToRemove[i])); //remove event from upcomingEvents collection
          }
        }

        //if user is a performer
        if (userData.isPerformer)
        {
          const currPerformerDetails = [];
          const querySnapshot = await getDocs(collection(db, "users", profileEmail, "performerInfo"));
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            currPerformerDetails.push(doc.data());
          });
          setPerformerDetails(currPerformerDetails);
        }

        //add importing of group details

        setIsDataLoadedFromDatabase(true);
      };
      getUserData();
    }, [profileEmail])

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
            email={profileEmail}
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
    const goToEditPersonalDetailsPage = async (e) => {
      e.preventDefault();
      const userInfo = [];
      userInfo.push(user);
      userInfo.push(eventPlannerDetails);
      userInfo.push(performerDetails);
      //navigate('/editPersonalDetailsPage', {state : userInfo});
      navigate('/editPersonalDetailsPage');
      window.location.reload(false);
    }
    const goToEditUpcomingEventsDetailsPage = async (e) => {
      e.preventDefault();
      navigate('/editUpcomingEventDetailsPage');
      window.location.reload(false);
    }
    const goToEditGroupsDetailsPage = async (e) => {
      e.preventDefault();
      navigate('/editGroupsDetailsPage');
      window.location.reload(false);
    }

    //THESE TWO METHODS ARE FOR TESTING NAVIGATING TO OTHER PROFILES AND DOING STUFF WHILE THERE
    const testGoToOtherUserProfile8 = async (e) => {
      e.preventDefault();
      let email = "troydp8@gmail.com";
      navigate("/profilePage", {state : email});
      window.location.reload(false);
    }
    const testGoToOtherUserProfile7 = async (e) => {
      e.preventDefault();
      let email = "troydp7@gmail.com";
      navigate("/profilePage", {state : email});
      window.location.reload(false);
    }


    //method to send friend request if it is not user's profile
    const sendFriendRequest = async () => {
      if (userEmail !== profileEmail) //double-check profile is not user's profile
      {
      //check if user has received a friend request from profile user
        const userRequestsDocRef = doc(db, "users", userEmail, "requests", profileEmail);
        const userRequestsSnapshot = await getDoc(userRequestsDocRef);
        let isFriendRequestFromProfileUser = userRequestsSnapshot.exists();

        if (isFriendRequestFromProfileUser) //if there is already a friend request from profile user
        {
          //add each other as friends - using setDoc so that we can use email as doc ID
          const userFriendsDocRef = doc(db, "users", userEmail, "friends", profileEmail);
          await setDoc(userFriendsDocRef, {email : profileEmail});
          const friendsDocRef = doc(db, "users", profileEmail, "friends", userEmail);
          await setDoc(friendsDocRef, {email : userEmail});

          //delete request sent from profile user - no need to delete for user because they haven't sent a request yet
          await deleteDoc(userRequestsDocRef);
          return;
        }

        //check if profile user already has a friend request from user
        const requestsDocRef = doc(db, "users", profileEmail, "requests", userEmail);
        const requestsSnapshot = await getDoc(requestsDocRef);
        let isAlreadyRequest = requestsSnapshot.exists();

        //check if profile user already has user as their friend
        const friendsDocRef = doc(db, "users", profileEmail, "friends", userEmail);
        const friendsSnapshot = await getDoc(friendsDocRef);
        let isAlreadyFriend = friendsSnapshot.exists();
        if (!isAlreadyRequest && !isAlreadyFriend) //if user hasn't sent a request and is not already friends with profile user
        {
          //send friend request
          const request = {
            requestingUserEmail : userEmail,
            receivingUserEmail : profileEmail,
            requestType : "friend"
          }
          //await addDoc(requestsRef, request);
          await setDoc(requestsDocRef, request);
        }
        else if (isAlreadyRequest)
        {
          alert("Error: you have already sent a friend request to this user!");
        }
        else
        {
          alert("Error: you are already friends with this user!");
        }
      }
    }

    return (
      <PageContainer>
        <NavigationBar/>
        {isDataLoadedFromDatabase &&
          <Container>
            <HorizontalPanel>
              <TopPanel background-color = "#f2f2f2">
                {isUserProfile &&
                  <CreationButtonsBox>
                    {user.isEventPlanner &&
                      <CreateButton onClick={goToCreateEventPage}>Create Event</CreateButton>
                    }
                    {user.isPerformer &&
                      <CreateButton onClick={goToCreateGroupPage}>Create Group</CreateButton>
                    }
                    <CreateButton onClick={goToEditPersonalDetailsPage}>Edit Profile</CreateButton>
                    {user.isEventPlanner &&
                      <CreateButton onClick={goToEditUpcomingEventsDetailsPage}>Edit Events</CreateButton>
                    }
                    {user.isInGroup &&
                      <CreateButton onClick={goToEditGroupsDetailsPage}>Edit Groups</CreateButton>
                    }
                  </CreationButtonsBox>
                }
                {!isUserProfile &&
                  <CreationButtonsBox>
                    <CreateButton onClick={sendFriendRequest}>
                      Add Friend
                    </CreateButton>
                  </CreationButtonsBox>
                }
                <StyledHeader>Profile Page</StyledHeader>
                <LoadProfilepic isProfilePic={isProfilePic} userEmail={userEmail}/>
                <Name>{user.displayName}</Name>
                <DetailsBox>
                  <Detail><b>Email:</b> {user.email}</Detail>
                  <Detail><b>Location:</b> {user.location}</Detail>
                  <Detail>{user.bio}</Detail>
                </DetailsBox>
                <ImageUploader userEmail={userEmail}/>

                {/* These components were added just for testing navigation to other profiles as well as some other features like adding friends */}
                {/* <TabsButton onClick={testGoToOtherUserProfile8}>
                  Test 8
                </TabsButton>
                <TabsButton onClick={testGoToOtherUserProfile7}>
                  Test 7
                </TabsButton> */}

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
                      types={eventPlannerDetails.types}
                      pastEvents={eventPlannerPastEvents}
                      upcomingEvents={eventPlannerUpcomingEvents}
                      links={eventPlannerDetails.links}
                      media={eventPlannerDetails.media}
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
        }
      </PageContainer>
    );
}

export default ProfilePage;