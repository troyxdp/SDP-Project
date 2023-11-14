import { collection, doc, getDoc, getDocs, updateDoc, addDoc, query, where, and } from "firebase/firestore";
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { NavigationBar } from "../components/NavigationBar";
import { db } from '../firebase-config/firebase';
import x_solid from "../profile-pics/x-solid.svg";
import { EventPlannerDetailsForm } from "../components/EventPlannerDetailsForm";
import { PerformerDetailsForm } from "../components/PerformerDetailsForm";

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
const StyledHeader = styled.h1`
    font-size: 2.1rem;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 5px;
`;
const Container = styled.div`
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
const EventDetailsDiv = styled.div`
    padding-top: 5px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
`;
const StyledCheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;
const StyledButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 45px;
    color: white;
    margin-top: 10px;
`;
const DisplayOptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 5px;
    margin-bottom: 10px;
`;
const DisplayFormButton = styled.button`
    display: flex;
    background: #fff;
    border: 0px solid #fff;
    color: black;
    height: 20px;
    width: 20px;
    font-size: 20px;
    margin-right: 2px;
`;
const StyledInput = styled.input`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    margin-bottom: 2px;
`;
const DescriptionInput = styled.textarea`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 500px;
    max-width: 500px;
    height: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    word-break: break-word;
    font-family: "Roboto", Roboto, sans-serif;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
    margin-bottom: 2px;
`;
const StyledSubheader = styled.h2`
  font-size: 1.5rem;
  margin-top: 8px;
  margin-bottom: 0px;
  font-weight: bold; 
`;
const DetailsFormDiv = styled.div`
    padding-top: 5px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #444;
    border-radius: 10px;
`;
const ListBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    margin-bottom: 8px;
`;
const ListBoxElement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #444; 
    padding: 10px; 
    width: 375px;
    max-width: 375px;
    height: 12px;
    max-height: 12px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;
const TwoLineListBoxElement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #444; 
    padding: 10px; 
    width: 475px;
    max-width: 475px;
    height: 28px;
    max-height: 28px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;
const AdderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
`;
const AdderInput = styled.input`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    margin-right: 8px;
`;
const AdderButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 45px;
    color: white;
`;

export default function EditUpcomingEventsDetailsPage() {
    const userEmail = sessionStorage.getItem("userEmail");

    const genreOptions = [
        {value: "House", label: "House"},
        {value: "Techno", label: "Techno"},
        {value: "Trance", label: "Trance"},
        {value: "DrumNBass", label: "Drum 'n Bass"},
        {value: "Amapiano", label: "Amapiano"},
        {value: "AfroTech", label: "Afro Tech"},
        {value: "AfroHouse", label: "Afro House"},
        {value: "Hip Hop", label: "Hip Hop"},
        {value: "Pop", label: "Pop"},
        {value: "Rock", label: "Rock"},
        {value: "Metal", label: "Metal"},
        {value: "RnB", label: "RnB"},
        {value: "Country", label: "Country"},
        {value: "Classical", label: "Classical"},
        {value: "Jazz", label: "Jazz"},
        {value: "Other", label: "Other"}
    ];
    //list of event types
    const eventTypeOptions = [
        {value : "Event Party", label : "Event Party"},
        {value : "Festival", label : "Festival"},
        {value : "Rave", label : "Rave"},
        {value : "Club Slot", label : "Club Slot"},
        {value : "Bar Slot", label : "Bar Slot"},
        {value : "Residency Opportunity", label : "Residency Opportunity"},
        {value : "House Party", label : "House Party"},
        {value : "Birthday Party", label : "Birthday Party"},
        {value : "Wedding", label : "Wedding"},
        {value : "Ball", label : "Ball"},
        {value : "Other", label : "Other"}
    ];
    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }

    const upcomingEventsInitializer = {
        creatingUserEmail: userEmail, 
        eventName: "", 
        eventType: "",
        performerDetails: [],
        eventPlannerEmails: [userEmail], 
        startDate: new Date(),
        endDate: new Date(), 
        venue: "", 
        eventDescription: "", 
        genres: [],
        slots: []
    };

    //useState for storing upcoming event data
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [upcomingEventNames, setUpcomingEventNames] = useState([]);
    const [upcomingEventIDs, setUpcomingEventIDs] = useState([]);
    const [selectedEventName, setSelectedEventName] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(upcomingEventsInitializer);
    const [selectedEventID, setSelectedEventID] = useState("");

    //useState for error display
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const getUpcomingEvents = async () => {
            const upcomingEventsRef = collection(db, "upcomingEvents");
            const upcomingEventsQuery = query(upcomingEventsRef, where("creatingUserEmail", "==", userEmail));
            const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
            const currUpcomingEvents = [];
            const currUpcomingEventNames = [];
            const currUpcomingEventIDs = [];
            upcomingEventsQuerySnapshot.forEach((doc) => {
                currUpcomingEvents.push(doc.data());
                currUpcomingEventNames.push(doc.data().eventName);
                currUpcomingEventIDs.push(doc.id);
            });

            setUpcomingEvents(currUpcomingEvents);
            setUpcomingEventNames(currUpcomingEventNames);
            setUpcomingEventIDs(currUpcomingEventIDs);

            if (currUpcomingEvents.length > 0)
            {
                setSelectedEventName(currUpcomingEvents[0].eventName);
                setSelectedEvent(currUpcomingEvents[0]);
                setEventNameEdit(currUpcomingEvents[0].eventName);
                setDescriptionEdit(currUpcomingEvents[0].eventDescription);
                setVenueEdit(currUpcomingEvents[0].venue);
                setSelectedEventID(currUpcomingEventIDs[0]);
            }
        };
        getUpcomingEvents();
    }, [userEmail])

    //useStates that allow the changing of data
    const [eventNameEdit, setEventNameEdit] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState("");
    const [venueEdit, setVenueEdit] = useState("");
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);

    //method for handling the input of 
    const handleSelectionOfEvent = async (e) => {
        e.preventDefault();

        const currSelectedEventName = e.target.value;
        let currSelectedEventID = selectedEventID;
        let currSelectedEvent = selectedEvent;
        for (let i = 0; i < upcomingEvents.length; i++)
        {
            if (currSelectedEventName === upcomingEvents[i].eventName)
            {
                currSelectedEvent = upcomingEvents[i];
                currSelectedEventID = upcomingEventIDs[i];
                break;
            }
        }

        setSelectedEvent(currSelectedEvent);
        setSelectedEventName(currSelectedEventName);
        setSelectedEventID(currSelectedEventID);
        setEventNameEdit(currSelectedEventName);
        setDescriptionEdit(currSelectedEvent.eventDescription);
        setVenueEdit(currSelectedEvent.venue);
        setGenresSelected(genresSelectedInitializer);
    }
    //methods for handling the input/deletion of other data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);

        //get genres selected
        const genres = [];
        for (let i = 0; i < genresSelected.length; i++)
        {
            if (genresSelected[i] === true)
            {
                genres.push(genreOptions[i].label);
            }
        }

        //check if event name is already in use if a new event name is enterred
        let isEventNameUsed = false;
        if (eventNameEdit !== selectedEventName)
        {
            const upcomingEventsRef = collection(db,  "upcomingEvents");
            const upcomingEventsQuery = query(upcomingEventsRef, and(where("creatingUserEmail", "==", userEmail),
                                                                    where("eventName", "==", selectedEventName)
                                                                    ));
            const upcomingEventsQuerySnapshot = await getDocs(upcomingEventsQuery);
            upcomingEventsQuerySnapshot.forEach((doc) => {
                isEventNameUsed = true;
            });
        }
        if (!isEventNameUsed && venueEdit.length > 0 && eventNameEdit.length > 0 && descriptionEdit.length > 0 && genres.length > 0)
        {
            const upcomingEventDocRef = doc(db, "upcomingEvents", selectedEventID);
            await updateDoc(upcomingEventDocRef, {
                eventName : eventNameEdit,
                eventDescription : descriptionEdit,
                venue : venueEdit,
                genres : genres
            });
            alert("Event details updated.")
        }
        else
        {
            setIsError(true);
            if (isEventNameUsed)
            {
                setErrorMsg("Error: you already have an upcoming event with this name.")
            }
            else if (venueEdit.length === 0)
            {
                setErrorMsg("Error: you haven't enterred in a venue.");
            }
            else if (eventNameEdit.length === 0)
            {
                setErrorMsg("Error: you haven't entered an event name.");
            }
            else if (descriptionEdit.length === 0)
            {
                setErrorMsg("Error: you haven't entered a description.");
            }
            else if (genres.length === 0)
            {
                setErrorMsg("Error: you haven't selected any genres.");
            }
        }
    }

    //create genre checkbox components array for rendering
    const genreCheckboxes = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genreCheckboxes.push(
            <StyledLabel>
                <input
                    type="checkbox"
                    value={genreOptions[i]}
                    onChange={() => handleGenreSelectedChange(i)}
                />
                {genreOptions[i].label}
            </StyledLabel>
        );
    }

    return(
        <PageContainer>
            <NavigationBar />
            <Container>
                <StyledHeader>Edit Upcoming Event:</StyledHeader>
                {upcomingEvents.length > 0 && 
                <EventDetailsDiv>
                    {isError && 
                        <p>{errorMsg}</p>
                    }
                    <StyledLabel htmlFor="event">
                        Event to Edit:
                    </StyledLabel>
                    <select value={selectedEventName} onChange={(e) => handleSelectionOfEvent(e)}>
                        {upcomingEventNames.map((type) => (
                            <option value={type}>{type}</option>
                        ))}
                    </select>

                    <StyledLabel>Event Name:</StyledLabel>
                    <StyledInput 
                        type="text"
                        id="performerName"
                        autoComplete="off"
                        onChange={(e) => setEventNameEdit(e.target.value)}
                        // onFocus={() => setPerformerNameFocus(true)}
                        // onBlur={() => setPerformerNameFocus(false)}
                        value={eventNameEdit}
                        required
                    />

                    <StyledLabel>Event Description:</StyledLabel>
                    <DescriptionInput
                        type="text"
                        id="eventDescription"
                        autoComplete="off"
                        value={descriptionEdit}
                        onChange={(e) => setDescriptionEdit(e.target.value)}
                        required
                    />

<                   StyledLabel htmlFor="venue">Venue:</StyledLabel>
                    <StyledInput 
                        type="text"
                        id="venue"
                        autoComplete="off"
                        value={venueEdit}
                        onChange={(e) => setVenueEdit(e.target.value)}
                        required
                    />

                    <StyledLabel htmlFor="genres">
                        Genres Played:
                    </StyledLabel>
                    <StyledCheckboxContainer>
                            {genreCheckboxes}
                    </StyledCheckboxContainer>

                    <StyledButton onClick={handleSubmit}>
                        Submit
                    </StyledButton>
                </EventDetailsDiv>
                }
            </Container>
        </PageContainer>
    );
}