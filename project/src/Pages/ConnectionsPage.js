import {NavigationBar} from "../components/NavigationBar";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, and  } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { db } from '../firebase-config/firebase';
import { EventConnectionsDisplay } from "../components/EventConnectionsDisplay";

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
  display: flex;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  align-items: center;
  padding: 16px;
  flex-direction: column;
`;
const RadioBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2px;
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
const SelectedSlotLabel = styled.label`
  margin-top: 10px;
  margin-bottom: 0px;
`;
const RadioBoxLabel = styled.label`
  margin-top: 5px;
  margin-bottom: 2px;
  font-size: 0.8rem;
`;
const RadioBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

    //useState for checking if data is loaded
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    //useStates for conditional rendering
    const [isViewAsPerformer, setIsViewAsPerformer] = new useState(false);
    const [isViewAsEventPlanner, setIsViewAsEventPlanner] = new useState(false);
    const [isPerformerErrorMsg, setIsPerformerErrorMsg] = useState(false);

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

    const [eventNames, setEventNames] = useState([]);
    const [eventSelectedName, setEventSelectedName] = useState("");
    const [eventSelected, setEventSelected] = useState(null);
    const [isEventHasSlots, setIsEventHasSlots] = useState(false);

    const [slots, setSlots] = useState([]);
    const [slotIsSelectedArray, setSlotIsSelectedArray] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);

    //useStates for storing search data
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [performers, setPerformers] = useState([]);

    //useState for variable length rendering
    const [upcomingEventsDisplays, setUpcomingEventsDisplays] = useState([]);
    const createUpcomingEventsDisplays = (events) => {
      const currDisplay = [];
      for (let i = 0; i < events.length; i++)
      {
        currDisplay.push(
          <EventConnectionsDisplay 
            event={events[i]}
            errorCallback={toPerformerRequestErrorCallback}
          />
        );
      }
      setUpcomingEventsDisplays(currDisplay);
    }

    //useEffect for fetching database data
    useEffect(() => {
      const getUserData = async () => {
        if (!isDataLoaded)
        {
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
            console.log("Getting event planner-related data")
            //get event planner details
            let currEventPlannerDetails = null;
            const eventPlannerSnapshot = await getDocs(collection(db, "users", userEmail, "eventPlannerInfo"));
            eventPlannerSnapshot.forEach((doc) => {
              currEventPlannerDetails = doc.data();
            });
            setEventPlannerDetails(currEventPlannerDetails);
            
            //GET UPCOMING 
            //collection references
            const upcomingEventsRef = collection(db, "upcomingEvents");

            //get upcoming events
            const upcomingEventsQuery = query(upcomingEventsRef, where("creatingUserEmail", "==", userEmail));
            const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
            const currUpcomingEvents = [];
            upcomingEventsQuerySnapshot.forEach((doc) => {
              currUpcomingEvents.push(doc.data());
            });

            if (currUpcomingEvents.length > 0)
            {
              setEventPlannerUpcomingEvents(currUpcomingEvents);

              const currUpcomingEventsNames = [];
              for (let i = 0; i < currUpcomingEvents.length; i++)
              {
                currUpcomingEventsNames.push(currUpcomingEvents[i].eventName);
              }

              const currSelectedBoxes = slotIsSelectedArray;
              for (let i = 0; i < currSelectedBoxes.length; i++)
              {
                currSelectedBoxes[i] = false;
              }
              currSelectedBoxes[0] = true;

              setEventNames(currUpcomingEventsNames);
              setSlots(currUpcomingEvents[0].slots);
              setEventSelected(currUpcomingEvents[0]);
              setEventSelectedName(currUpcomingEventsNames[0]);
            }
            else
            {
              setEventPlannerUpcomingEvents([]);
              setEventNames([]);
              setEventSelected(null);
              setEventSelectedName("");
            }
          }

          //if user is a performer
          if (userData.isPerformer)
          {
            console.log("Getting performer-related data");
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

            //GET UPCOMING AND PAST EVENTS
            //collection references
            const upcomingEventsRef = collection(db, "upcomingEvents");

            //get upcoming events
            const upcomingEventsQuery = query(upcomingEventsRef, where("creatingUserEmail", "!=", userEmail));
            const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
            const currUpcomingEvents = [];
            upcomingEventsQuerySnapshot.forEach((doc) => {
              //check if user is an event planner for the event
              let isPlanningEvent = false;
              for (let i = 0; i < doc.data().eventPlannerEmails.length; i++)
              {
                if (doc.data().eventPlannerEmails[i] === userEmail)
                {
                  isPlanningEvent = true;
                }
              }
              //if they are not an event planner for the event, add the event to currUpcomingEvents
              if (!isPlanningEvent)
              {
                currUpcomingEvents.push(doc.data());
              }
            });

            //set useStates with values that have been fetched
            setUpcomingEvents(currUpcomingEvents);
            createUpcomingEventsDisplays(currUpcomingEvents);
          }
          setIsDataLoaded(true);
        }
      };
      getUserData();
    }, []);

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

    //method for handling selection of performer type to make applications for
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
    //method for handling selection of upcoming event to find performers for
    const handleSelectionOfEvent = async (e) => {
      e.preventDefault();

      //set name of event selected
      const currEventSelectedName = e.target.value;
      setEventSelectedName(currEventSelectedName);

      let currEventSelected = {};
      for (let i = 0; i < eventPlannerUpcomingEvents.length; i++)
      {
        if (eventPlannerUpcomingEvents[i].eventName === currEventSelectedName)
        {
          currEventSelected = eventPlannerUpcomingEvents[i];
          break;
        }
      }

      setEventSelected(currEventSelected);

      if (currEventSelected.slots && currEventSelected.slots.length !== 0)
      {
        setIsEventHasSlots(true);
        setSlots(currEventSelected.slots);
        const selectedBoxes = [true];
        for (let i = 1; i < currEventSelected.slots; i++)
        {
          selectedBoxes.push(false);
        }
        setSlotIsSelectedArray(selectedBoxes);
      }
      else
      {
        setIsEventHasSlots(false);
      }
    }
    //method for handling selection of slot
    const handleSelectionOfSlot = async (e) => {
      e.preventDefault();

      const currSlotIndex = Number(e.target.value);
      setSlotIndex(currSlotIndex);
    }

    const slotOptions = [];
    if (isDataLoaded && isViewAsEventPlanner && eventSelected && eventSelected.slots)
    {
      for (let i = 0; i < eventSelected.slots.length; i++)
      {
        const slot = eventSelected.slots[i];
        const stage = slot.stage;
        const startDate = slot.startDate.toDate();
        const endDate = slot.endDate.toDate();
        let slotDisplayString = "" + stage + " ";
        if (startDate.getDate() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += startDate.getDate() + "/";
        if (startDate.getMonth() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += startDate.getMonth() + "/" + startDate.getFullYear() + " ";
        if (startDate.getHours() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += startDate.getHours() + ":";
        if (startDate.getMinutes() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += startDate.getMinutes() + " - ";

        if (endDate.getHours() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += endDate.getHours() + ":";
        if (endDate.getMinutes() < 10)
        {
          slotDisplayString += "0";
        }
        slotDisplayString += endDate.getMinutes();

        slotOptions.push(
          <option value={i}>{slotDisplayString}</option>
        );
      }
    }
    
    //callback method for displaying error message
    const toPerformerRequestErrorCallback = (isError) => {
      setIsPerformerErrorMsg(isError);
      alert("Error: you have already sent a request for this event/slot.");
    }
    
    return(
      <PageContainer>
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
                </>
              } 
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
                  <p id="uidnote" style={isPerformerErrorMsg ? {} : {display: "none"}}>
                    Error: You have already sent a request for this event/slot.
                  </p>
                  {upcomingEventsDisplays}
                </>
              }
              {isViewAsEventPlanner &&
                <>
                  <StyledLabel htmlFor="event">
                    Event:
                  </StyledLabel>
                  <select value={eventSelectedName} onChange={(e) => handleSelectionOfEvent(e)}>
                    {eventNames.map((name) => (
                        <option value={name}>{name}</option>
                    ))}
                  </select>
                  {eventSelected && eventSelected.slots && eventSelected.slots.length > 0 && 
                    <>
                      <SelectedSlotLabel>
                        Select Slot:
                      </SelectedSlotLabel>
                      <select value={slotIndex} onChange={(e) => handleSelectionOfSlot(e)}>
                        {slotOptions}
                      </select>
                    </>
                  }
                </>
              }

          </Container>
      </PageContainer>
    );
}

export default ConnectionsPage;