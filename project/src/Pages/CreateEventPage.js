import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styled from "styled-components";
import { PerformerDetailsForm } from "../components/PerformerDetailsForm";
import { EventPlannerDetailsForm } from "../components/EventPlannerDetailsForm";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config/firebase';

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
    margin-top: 10px;
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
    margin-bottom: 10px;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
    margin-bottom: 2px;
`;
const DescriptionInput = styled.input`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 500px;
    height: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    word-break: break-word;
`;

/*
    TO-DO:
    - Potentially add feature that sets minimum end date in component to the start date
*/

const CreateEventPage = () => {
    //fetch user email from session storage
    let email = sessionStorage.getItem("userEmail");

    //list of genres
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
        {value : "eventParty", label : "Event Party"},
        {value : "festival", label : "Festival"},
        {value : "rave", label : "Rave"},
        {value : "clubSlot", label : "Club Slot"},
        {value : "barSlot", label : "Bar Slot"},
        {value : "residency", label : "Residency Opportunity"},
        {value : "houseParty", label : "House Party"},
        {value : "birthdayParty", label : "Birthday Party"},
        {value : "wedding", label : "Wedding"},
        {value : "ball", label : "Ball"},
        {value : "other", label : "Other"}
    ];

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
    //initializing genres selected
    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }
    //initialize start date and end date
    let startDateInitializer = new Date(); //set start date to today
    let endDateInitializer = new Date(startDateInitializer);
    endDateInitializer.setDate(startDateInitializer.getDate() + 1); //set end date to tomorrow

    //useStates for storing user data
    const [user, setUser] = useState(userInitializer);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);

    //useStates for storing input data
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("Event Party");
    const [eventStartDate, setEventStartDate] = useState(startDateInitializer);
    const [eventEndDate, setEventEndDate] = useState(endDateInitializer);
    const [venue, setVenue] = useState("");
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [description, setDescription] = useState("");

    //useStates for conditional display of components
    const [displaySlotForm, setDisplaySlotForm] = useState(false);

    //useStates for component focuses
    const [isStartDateFocus, setIsStartDateFocus] = useState(false);
    const [isEndDateFocus, setIsEndDateFocus] = useState(false);

    //useStates for validation of data
    const [isValidStartDate, setIsValidStartDate] = useState(false);
    const [isValidEndDate, setIsValidEndDate] = useState(false);

    //useState for validating data
    //validate the start date enterred
    useEffect(() => {
        let currDate = new Date();
        if (eventStartDate <= currDate)
        {
            setIsValidStartDate(false);
        }
        else
        {
            setIsValidStartDate(true);
        }
    }, [eventStartDate])
    useEffect(() => {
        let currDate = new Date();
        if (eventStartDate > eventEndDate)
        {
            setIsValidEndDate(false);
        }
        else
        {
            setIsValidEndDate(true);
        }
    }, [eventStartDate, eventEndDate])

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
    
            setEventPlannerDetails(userData.eventPlannerInfo);
        };
        getUserData();
    }, [])

    //useEffect to validate end date

    //methods to handle changing of inputted data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
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
        <Container>
            <EventDetailsDiv>
                <StyledHeader>Create Event:</StyledHeader>

                <StyledLabel htmlFor="eventName">
                    Event Name: 
                </StyledLabel>
                <StyledInput 
                    type="text"
                    id="eventName"
                    autoComplete="off"
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />

                <StyledLabel htmlFor="type">
                    Type of Performer:
                </StyledLabel>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{width: "250px", marginBottom: "10px"}}>
                    {eventTypeOptions.map((option) => (
                        <option value={option.value} style={{width: "250px"}}>{option.label}</option>
                    ))}
                </select>

                <StyledLabel htmlFor="startDate">
                    Start Date:
                </StyledLabel>
                <StyledInput
                    type="date"
                    id="eventStartDate"
                    autoComplete="off"
                    onChange={(e) => setEventStartDate(e.target.value)}
                    min={new Date()}
                    onFocus={(e) => setIsStartDateFocus(true)}
                    onBlur={(e) => setIsStartDateFocus(false)}
                    required
                />
                <p id="uidnote" style={isStartDateFocus && eventStartDate && !isValidStartDate ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid start date entered. <br/>
                    Please enter a start date from today onwards.
                </p>

                <StyledLabel htmlFor="endDate">
                    End Date:
                </StyledLabel>
                <StyledInput
                    type="date"
                    id="eventEndDate"
                    autoComplete="off"
                    onChange={(e) => setEventEndDate(e.target.value)}
                    onFocus={(e) => setIsEndDateFocus(true)}
                    onBlur={(e) => setIsEndDateFocus(false)}
                    required
                />
                <p id="uidnote" style={isEndDateFocus && eventEndDate && !isValidEndDate ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid end date entered. <br/>
                    Please enter an end date from your start date onwards.
                </p>

                <StyledLabel htmlFor="venue">
                    Venue: 
                </StyledLabel>
                <StyledInput 
                    type="text"
                    id="venue"
                    autoComplete="off"
                    onChange={(e) => setVenue(e.target.value)}
                    required
                />

                <StyledLabel htmlFor="genres">
                    Genres Played:
                </StyledLabel>
                <StyledCheckboxContainer>
                        {genreCheckboxes}
                </StyledCheckboxContainer>

                <StyledLabel htmlFor="description">
                    Description of Event:
                </StyledLabel>
                <DescriptionInput
                    type="text"
                    id="eventDescription"
                    autoComplete="off"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <DisplayOptionContainer onClick={() => setDisplaySlotForm(true)}>
                    <DisplayFormButton>+</DisplayFormButton>
                    <label>
                        Add Slot
                    </label>
                </DisplayOptionContainer>

                <StyledButton>
                    Create Event
                </StyledButton>
            </EventDetailsDiv>
        </Container>
    );
}

export default CreateEventPage;