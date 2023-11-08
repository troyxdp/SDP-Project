import {NavigationBar} from "../components/NavigationBar";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, getCountFromServer  } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { db } from '../firebase-config/firebase';

const Container = styled.div`
  display: flex;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  align-items: center;
  padding: 16px;
  flex-direction: column;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;
const Text = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 1.0rem;
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
  width: 130px;
  max-width: 130px;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
    margin-bottom: 2px;
`;

/*
  TO-DO:
  -Add display of limited number of items +- 15/20 items
  -Add conditional display of events based on genre - started on this
*/

const ConnectionsPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    const userInitializer = {
      email : userEmail,
      fullName : "",
      location : "",
      bio : "",
      profilePic : null,
      isPerformer : false,
      isEventPlanner : false,
      isInGroup : false
    };

    //useStates for conditional rendering
    const [isViewAsPerformer, setIsViewAsPerformer] = new useState(false);
    const [isViewAsEventPlanner, setIsViewAsEventPlanner] = new useState(false);

    //useStates for storing profile data
    const [user, setUser] = useState(userInitializer);
    const [performerDetails, setPerformerDetails] = useState([]);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);
    const [isPerformer, setIsPerformer] = useState(false);
    const [isEventPlanner, setIsEventPlanner] = useState(false);
    const [eventPlannerUpcomingEvents, setEventPlannerUpcomingEvents] = useState([]);
    const [performerTypes, setPerformerTypes] = useState([]);
    const [performerTypeSelected, setPerformerTypeSelected] = useState("");
    const [genres, setGenres] = useState([]);
    const [performer, setPerformer] = useState(null);

    //useStates for storing search data
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [performers, setPerformers] = useState([]);

    //useEffect for fetching database data
    useEffect(() => {
      const getUserData = async () => {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);

        let userData = {
          email : userEmail,
          fullName : docSnap.data().fullName,
          location : docSnap.data().location,
          bio : docSnap.data().bio,
          profilePic : docSnap.data().profilePic,
          isPerformer : docSnap.data().isPerformer,
          isEventPlanner : docSnap.data().isEventPlanner,
          isInGroup : docSnap.data().isInGroup
        }
        setUser(userData);

        //if user is event planner
        if (userData.isEventPlanner)
        {
          //get event planner details
          let currEventPlannerDetails = null;
          const eventPlannerSnapshot = await getDocs(collection(db, "users", userEmail, "eventPlannerInfo"));
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
          const upcomingEventsQuery = query(upcomingEventsRef, where("creatingUserEmail", "==", userEmail));
          const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
          const currUpcomingEvents = [];
          upcomingEventsQuerySnapshot.forEach((doc) => {
            currUpcomingEvents.push(doc.data());
          });
          setEventPlannerUpcomingEvents(currUpcomingEvents);
        }
        //if user is a performer
        if (userData.isPerformer)
        {
          const currPerformerDetails = [];
          const currPerformerTypes = [];
          const querySnapshot = await getDocs(collection(db, "users", userEmail, "performerInfo"));
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            currPerformerDetails.push(doc.data());
            currPerformerTypes.push(doc.data().type);
          });
          setPerformerDetails(currPerformerDetails);
          setPerformerTypes(currPerformerTypes);
          setPerformerTypeSelected(currPerformerTypes[0]);
          setGenres(currPerformerDetails[0].genres);
        }
      };
      getUserData();
    }, [userEmail]);

    //useEffect for fetching upcoming events data from the database
    useEffect(() => {
      const getUpcomingEvents = async () => {
        if (isViewAsPerformer)
        {
          const today = new Date();
          const currUpcomingEvents = [];

          const upcomingEventsRef = collection(db, "upcomingEvents");
          const q = query(upcomingEventsRef, where("startDate", ">", today));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            currUpcomingEvents.push(doc.data());
          });

          setUpcomingEvents(currUpcomingEvents);
        }
      };
      getUpcomingEvents();
    }, [isViewAsPerformer, genres]);

    const changeSearchTypeToPerformer = () => {
      setIsViewAsPerformer(true);
      setIsViewAsEventPlanner(false);
    }
    const changeSearchTypeToEventPlanner = () => {
      setIsViewAsEventPlanner(true);
      setIsViewAsPerformer(false);
    }

    //method for handling selection of performer type to edit
    const handleSelectionOfPerformerType = async (e) => {
      e.preventDefault();

      //set type selected
      const selectedPerformerType = e.target.value;
      console.log(selectedPerformerType);
      setPerformerTypeSelected(selectedPerformerType);

      //get data of that selected type
      let performerDetailsOfType = {};
      for (let i = 0; i < performerDetails.length; i++)
      {
        if (selectedPerformerType === performerDetails[i].type)
        {
            performerDetailsOfType = performerDetails[i];
            break;
        }
      }
      console.log(performerDetailsOfType);
      setPerformer(performerDetailsOfType);
    }
    
    return(
        <>
            <NavigationBar/>
            <Container>
                <StyledHeader>Connections Page</StyledHeader>

                {user.isPerformer && user.isEventPlanner &&
                  <>
                    <Text>View as...</Text>
                    <Tabs>
                      <TabsButton onClick={() => changeSearchTypeToPerformer()}>Performer</TabsButton>
                      <TabsButton onClick={() => changeSearchTypeToEventPlanner()}>Event Planner</TabsButton>
                    </Tabs>
                    {isViewAsPerformer &&
                      <>
                        <StyledLabel htmlFor="type">
                          Performer Type:
                        </StyledLabel>
                        <select value={performerTypeSelected} onChange={(e) => handleSelectionOfPerformerType(e)}>
                            {performerTypes.map((type) => (
                                <option value={type}>{type}</option>
                            ))}
                        </select>
                      </>
                    }
                  </>
                } 

            </Container>
        </>
    );
}

export default ConnectionsPage;