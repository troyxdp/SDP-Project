import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styled from "styled-components";
import { PerformerDetailsForm } from "../components/PerformerDetailsForm";
import { EventPlannerDetailsForm } from "../components/EventPlannerDetailsForm";
import { doc, updateDoc, addDoc, collection, getDoc, getDocs} from "firebase/firestore";
import { db } from '../firebase-config/firebase';
import { SlotDetailsForm } from "../components/SlotDetailsForm";
import {NavigationBar} from "../components/NavigationBar";
import x_solid from "../profile-pics/x-solid.svg";

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
    margin-bottom: 10px;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
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
const AdderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: left;
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
    width: 475px;
    max-width: 475px;
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

/*
    TO-DO:
    - Add validation of slot form data
        ~ Check a slot hasn't been listed twice
        ~ Implement date and time checking (if it hasn't already been done - it may have already been done)
    - Fix the error message flashing when valid other host is entered
    - Make it so that slot details form only displays once (valid) start and end dates have been entered
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
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);
    const [docId, setDocId] = useState("");

    //useStates for storing input data
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("Event Party");
    const [eventStartDate, setEventStartDate] = useState(startDateInitializer);
    const [eventEndDate, setEventEndDate] = useState(endDateInitializer);
    const [venue, setVenue] = useState("");
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [stages, setStages] = useState(["Main Stage"]);
    const [description, setDescription] = useState("");
    const [slots, setSlots] = useState([]);
    const [otherHostEmails, setOtherHostsEmails] = useState([]);

    //useStates for adders
    const [eventPlannerToAdd, setEventPlannerToAdd] = useState("");
    const [stageToAdd, setStageToAdd] = useState("");

    //useStates for conditional display of components
    const [displaySlotForm, setDisplaySlotForm] = useState(false);

    //useStates for component focuses
    const [isStartDateFocus, setIsStartDateFocus] = useState(false);
    const [isEndDateFocus, setIsEndDateFocus] = useState(false);

    //useStates for validation of data
    const [isValidEventName, setIsValidEventName] = useState(false);
    const [isValidStartDate, setIsValidStartDate] = useState(false);
    const [isValidStartTime, setIsValidStartTime] = useState(false);
    const [isValidEndDate, setIsValidEndDate] = useState(false);
    const [isValidEndTime, setIsValidEndTime] = useState(false);
    const [isStageAdded, setIsStageAdded] = useState(false);
    const [isValidEventPlannerToAdd, setIsValidEventPlannerToAdd] = useState(false);
    const [isEventPlannerAdded, setIsEventPlannerAdded] = useState(false);

    //useStates for seeing if values an attempt has been made to set a value
    const [isStartTimeSet, setIsStartTimeSet] = useState(false);
    const [isEndTimeSet, setIsEndTimeSet] = useState(false);
    const [isStageToAddSet, setIsStageToAddSet] = useState(false);

    //useStates for error message display
    const [isSubmitError, setIsSubmitError] = useState(false);
    const [submitErrMsg, setSubmitErrMsg] = useState("");

    //useState for storing stage name list box displays
    const [stageListBoxDisplays, setStageListBoxDisplays] = useState([]);
    const createStageListDisplay = async (stages) => {
        const stageDisplays = [];
        for (let i = 0; i < stages.length; i++)
        {
            stageDisplays.push(
                <ListBoxElement>
                    <p>{stages[i]}</p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveStage(i)}/>
                </ListBoxElement>
            );
        }
        setStageListBoxDisplays(stageDisplays);
    }

    //useState for storing host emails list box displays
    const [otherHostEmailsListBoxDisplays, setOtherHostsEmailsListBoxDisplays] = useState([]);
    const createOtherHostEmailsListDisplay = async (otherHostEmails) => {
        const otherHostEmailDisplays = [];
        for (let i = 0; i < otherHostEmails.length; i++)
        {
            otherHostEmailDisplays.push(
                <ListBoxElement>
                    <p>
                        {otherHostEmails[i]}
                    </p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveHost(i)}/>
                </ListBoxElement>
            )
        }
        setOtherHostsEmailsListBoxDisplays(otherHostEmailDisplays);
    }

    //useState for storing slot details list box displays
    const [slotDetailsListBoxDisplays, setSlotDetailsListBoxDisplays] = useState([]);
    const createSlotDetailsListDisplay = async (slots) => {
        const slotDisplays = [];
        for (let i = 0; i < slots.length; i++)
        {
            //get time of slot
            let startTimeHrs = slots[i].startDate.getHours();
            let startTimeMins = slots[i].startDate.getMinutes();
            let endTimeHrs = slots[i].endDate.getHours();
            let endTimeMins = slots[i].endDate.getMinutes();

            //write start time as a string
            let startTime = "";
            if (startTimeHrs < 10)
            {
                startTime += "0" + startTimeHrs + ":";
            }
            else
            {
                startTime += startTimeHrs + ":";
            }
            if (startTimeMins < 10)
            {
                startTime += "0" + startTimeMins;
            }
            else
            {
                startTime += startTimeMins;
            }

            //write end time as a string
            let endTime = "";
            if (endTimeHrs < 10)
            {
                endTime += "0" + endTimeHrs + ":";
            }
            else
            {
                endTime += endTimeHrs + ":";
            }
            if (endTimeMins < 10)
            {
                endTime += "0" + endTimeMins;
            }
            else
            {
                endTime += endTimeMins;
            }

            //add display
            slotDisplays.push(
                <TwoLineListBoxElement>
                    <p>
                        {slots[i].stage} <br/>
                        {startTime} - {endTime}
                    </p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleDeleteSlot(i)}/>
                </TwoLineListBoxElement>
            );
        }
        setSlotDetailsListBoxDisplays(slotDisplays);
    }

    //useEffects for validating data
    //validate the start date enterred
    useEffect(() => {
        let currDate = new Date();
        if (eventStartDate < currDate)
        {
            setIsValidStartDate(false);
        }
        else
        {
            setIsValidStartDate(true);
        }
    }, [eventStartDate])
    //validate the end date enterred
    useEffect(() => {
        if (eventStartDate > eventEndDate)
        {
            setIsValidEndDate(false);
        }
        else
        {
            setIsValidEndDate(true);
        }
    }, [eventStartDate, eventEndDate])
    //validate the event name
    useEffect(() => {
        const isEventNameUsed = async () => {
            //check if event name is used
            let isEventNameUsed = false;
            for (let i = 0; i < upcomingEvents.length; i++)
            {
                if (upcomingEvents[i].eventName === eventName)
                {
                    isEventNameUsed = true;
                }
            }

            //set validity of event name entered
            if (isEventNameUsed)
            {
                setIsValidEventName(false);
            }
            else
            {
                setIsValidEventName(true);
            }
        };
        isEventNameUsed();
    }, [eventName, upcomingEvents, email]);

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
                isPerformer : docSnap.data().isPerformer,
                isEventPlanner : docSnap.data().isEventPlanner,
                isInGroup : docSnap.data().isInGroup
            }
            setUser(userData);

            const querySnapshot = await getDocs(collection(db, "users", email, "eventPlannerInfo"));
            querySnapshot.forEach((doc) => {
                setEventPlannerDetails(doc.data());
                setDocId(doc.id);
                setUpcomingEvents(doc.data().upcomingEvents);
            });
        };
        getUserData();
    }, [])

    //methods for handling start date/time and end date/time entry
    const handleStartDateInput = async (e) => {
        let newStartDate = new Date(e.target.value);
        if (!isStartTimeSet || !isValidStartTime)
        {
            newStartDate.setHours(0, 0, 0);
        }
        else
        {
            let startHours = eventStartDate.getHours();
            let startMins = eventStartDate.getMinutes();
            newStartDate.setHours(startHours, startMins);
        }
        if (newStartDate < new Date())
        {
            setIsValidStartDate(false);
        }
        else
        {
            setIsValidStartDate(true);
            setEventStartDate(newStartDate);
        }
    }
    const handleStartTimeInput = async (e) => {
        setIsStartTimeSet(true);
        let date = new Date(eventStartDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        date.setHours(hours, minutes);
        if (date >= new Date())
        {
            setEventStartDate(date);
            setIsValidStartTime(true);
            setIsValidStartDate(true);
        }
        else
        {
            setIsValidStartTime(false);
            setIsValidStartDate(false);
        }
    }
    const handleEndDateInput = async (e) => {
        let newEndDate = new Date(e.target.value);
        if (!isEndTimeSet || !isValidEndTime)
        {
            newEndDate.setHours(0, 0, 0);
        }
        else
        {
            let endHrs = eventEndDate.getHours();
            let endMins = eventEndDate.getMinutes();
            newEndDate.setHours(endHrs, endMins, 0);
        }
        if (newEndDate <= eventStartDate)
        {
            setIsValidEndDate(false);
        }
        else
        {
            setIsValidEndDate(true);
            setEventEndDate(newEndDate);
        }
    }
    const handleEndTimeInput = async (e) => {
        setIsEndTimeSet(true);
        let date = new Date(eventEndDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        date.setHours(hours, minutes, 0);
        if (date > eventStartDate)
        {   
            setEventEndDate(date);
            setIsValidEndTime(true);
            setIsValidEndDate(true);
        }
        else
        {
            setIsValidEndTime(false);
            setIsValidEndDate(false);
        }
    }

    //methods for handling the input/deletion of other data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
    }
    const handleEventNameInput = async (e) => {
        let newName = e.target.value;
        let newSlots = slots;
        for (let i = 0; i < newSlots.length; i++)
        {
            newSlots[i].eventName = newName;
        }
        setEventName(newName);
        setSlots(newSlots);
    }
    const handleAddHost = async () => {
        //check if user has not already been added
        let hostEmails = otherHostEmails;
        let isAlreadyAdded = false;
        for (let i = 0; i < hostEmails.length; i++)
        {
            if (eventPlannerToAdd === hostEmails[i])
            {
                isAlreadyAdded = true;
                break;
            }
        }
        if (!isAlreadyAdded)
        {
            const user = eventPlannerToAdd;
            const userDocRef = doc(db, "users", user);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists() && docSnap.data().isEventPlanner) //if user is found in the database
            {
                setIsValidEventPlannerToAdd(true);
                hostEmails.push(user);
                setOtherHostsEmails(hostEmails);
                createOtherHostEmailsListDisplay(hostEmails);
            }
            else //user not found in database
            {
                setIsValidEventPlannerToAdd(false);
            }
        }
        else //is already added
        {
            setIsValidEventPlannerToAdd(false);
            console.log("Already added user " + eventPlannerToAdd);
        }
        setIsEventPlannerAdded(true);
        setEventPlannerToAdd("");
    }
    const handleRemoveHost = async (index) => {
        const currHosts = otherHostEmails;
        currHosts.splice(index, 1);
        setOtherHostsEmails(currHosts);
        createOtherHostEmailsListDisplay(currHosts);
    }
    const handleAddStage = async () => {
        //check if stage is already added
        const currStages = stages;
        let isAlreadyAdded = false;
        for (let i = 0; i < stages.length; i++)
        {
            if (stages[i] === stageToAdd)
            {
                isAlreadyAdded = true;
            }
        }

        if (!isAlreadyAdded)
        {
            currStages.push(stageToAdd);
            setIsStageAdded(false);
            setIsStageToAddSet(false);
            createStageListDisplay(currStages);
            setStageToAdd("");
        }
        else
        {
            setIsStageAdded(true);
            setIsStageAdded(true);
        }
    }
    const handleRemoveStage = async (index) => {
        const currStages = stages;
        currStages.splice(index, 1);
        setStages(currStages);
        createStageListDisplay(currStages);
    }
    const handleDeleteSlot = async (index) => {
        const currSlots = slots;
        currSlots.splice(index, 1);
        setSlots(currSlots);
        createSlotDetailsListDisplay(currSlots);
    }

    //callback method for SlotDetailsForm
    const onSubmitOfSlotDetailsForm = (startDate, endDate, stageDetails, genres, description) => {
        if (startDate >= eventStartDate && (endDate.getDate() <= eventEndDate.getDate() || endDate.getMonth() < eventEndDate.getMonth()))
        {
            const currSlots = slots;
            const slot = {
                creatingUserEmail: email,
                eventName: eventName,
                startDate: startDate,
                endDate: endDate,
                stage: stageDetails, 
                genres: genres,
                description: description,
                performerEmails: []
            };
            currSlots.push(slot);
            setSlots(currSlots);
            setDisplaySlotForm(false);
            createSlotDetailsListDisplay(currSlots);
        }
        else
        {
            //display error message
        }
    }
    const sendHostRequest = async (user) => {
        const request = {
            requestingUserEmail : email,
            receivingUserEmail : user,
            requestType : "host",
            eventName : eventName,
            eventStartDate : eventStartDate
        }
        const userDocRef = doc(db, "users", user);
        const userRequestsCollection = collection(db, "users", userDocRef.id, "requests");
        await addDoc(userRequestsCollection, request);
    }

    //method for handling submission of event data
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitError(false);
        setSubmitErrMsg("");

        const checkIsGenreSelected = () => {
            for (let i = 0; i < genresSelected.length; i++)
            {
                if (genresSelected[i] === true)
                {
                    return true;
                }
            }
            return false;
        }
        let isGenreSelected = checkIsGenreSelected();

        if (isValidStartDate && isValidEndDate && eventName.length > 0 && venue.length > 0 && description.length > 0 && isGenreSelected)
        {
            const genres = [];
            for (let i = 0; i < genresSelected.length; i++)
            {
                if (genresSelected[i] === true)
                {
                    genres.push(genreOptions[i].label);
                }
            }

            const upcomingEvent = {
                creatingUserEmail: email, 
                eventName: eventName, 
                eventType: eventType,
                performerEmails: [],
                eventPlannerEmails: [email], 
                startDate: eventStartDate,
                endDate: eventEndDate, 
                venue: venue, 
                eventDescription: description, 
                genres: genres,
                slots: slots
            };

            const currUpcomingEvents = eventPlannerDetails.upcomingEvents;
            currUpcomingEvents.push(upcomingEvent);
            const eventPlannerDetailsRef = doc(db, "users", email, "eventPlannerInfo", docId);
            await updateDoc(eventPlannerDetailsRef, {
                upcomingEvents: currUpcomingEvents
            });

            for (let i = 0; i < otherHostEmails.length; i++)
            {
                sendHostRequest(otherHostEmails[i]);
            }

            navigate("/profilePage", {state : email});
        }
        else
        {
            setIsSubmitError(true);
            if (!isValidStartDate)
            {
                setSubmitErrMsg("Error: invalid start date enterred.\nPlease enter a date from today onwards.")
            }
            else if (!isValidEndDate)
            {
                setSubmitErrMsg("Error: invalid end date enterred.\nPlease enter an end date that is later than your start date.");
            }
            else if (eventName.length === 0)
            {
                setSubmitErrMsg("Error: no event name enterred.\nPlease enter an event name.");
            }
            else if (venue.length === 0)
            {
                setSubmitErrMsg("Error: no venue enterred.\nPlease enter a venue.");
            }
            else if (description.length === 0)
            {
                setSubmitErrMsg("Error: no description enterred.\nPlease enter a description.");
            }
            else if (!isGenreSelected)
            {
                setSubmitErrMsg("Error: no genre selected. Please select at least one genre from the list.");
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
        <>
            <NavigationBar/>
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
                        onChange={handleEventNameInput}
                        required
                    />
                    <p id="uidnote" style={!isValidEventName ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Invalid event name entered. <br/>
                        Please enter an event name that isn't already in use in your upcoming events.
                    </p>

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
                        onChange={(e) => handleStartDateInput(e)}
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

                    <StyledLabel htmlFor="startTime">
                        Start Time:
                    </StyledLabel>
                    <StyledInput
                        type="time"
                        id="startTime"
                        autoComplete="off"
                        defaultValue="12:00"
                        onChange={handleStartTimeInput}
                    />
                    <p id="uidnote" style={isStartTimeSet && !isValidStartTime ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Invalid start time entered. <br/>
                        Please enter a start date and time later than the present moment.
                    </p>

                    <StyledLabel htmlFor="endDate">
                        End Date:
                    </StyledLabel>
                    <StyledInput
                        type="date"
                        id="eventEndDate"
                        autoComplete="off"
                        onChange={(e) => handleEndDateInput(e)}
                        onFocus={(e) => setIsEndDateFocus(true)}
                        onBlur={(e) => setIsEndDateFocus(false)}
                        required
                    />
                    <p id="uidnote" style={isEndDateFocus && eventEndDate && !isValidEndDate ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Invalid end date entered. <br/>
                        Please enter an end date from your start date onwards.
                    </p>

                    <StyledLabel htmlFor="endTime">
                        End Time:
                    </StyledLabel>
                    <StyledInput
                        type="time"
                        id="endTime"
                        autoComplete="off"
                        defaultValue="13:00"
                        onChange={handleEndTimeInput}
                    />
                    <p id="uidnote" style={isEndTimeSet && !isValidEndTime ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Invalid end time entered. <br/>
                        Please enter an end date and time after your start date and time.
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

                    <StyledLabel htmlFor="stages">
                        Stages:
                    </StyledLabel>
                    <AdderContainer>
                        <AdderInput 
                            type="text"
                            id="stageAdder"
                            autoComplete="off"
                            onChange={(e) => setStageToAdd(e.target.value)}
                            value={stageToAdd}
                        />
                        <AdderButton onClick={() => handleAddStage()}>
                            Add
                        </AdderButton>
                    </AdderContainer>
                    <p id="uidnote" style={isStageToAddSet && isStageAdded ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Please enter a stage that hasn't already been added.
                    </p>

                    <ListBox>
                        {stageListBoxDisplays}
                    </ListBox>

                    <StyledLabel htmlFor="eventPlanners">
                        Other Event Planners:
                    </StyledLabel>
                    <AdderContainer>
                        <AdderInput
                            type="text"
                            id="eventPlannerAdder"
                            autoComplete="off"
                            onChange={(e) => setEventPlannerToAdd(e.target.value)}
                            value={eventPlannerToAdd}
                        />
                        <AdderButton onClick={handleAddHost}>
                            Send Request
                        </AdderButton>
                    </AdderContainer>
                    <p id="uidnote" style={isEventPlannerAdded && !isValidEventPlannerToAdd ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Please enter a user that is on this site that is an event planner.
                    </p>
                    <p id="uidnote" style={eventPlannerToAdd && isEventPlannerAdded ? {} : {display: "none"}}>
                        Error: You have already added this user to send a request to.
                    </p>

                    <ListBox>
                        {otherHostEmailsListBoxDisplays}
                    </ListBox>

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

                    {!displaySlotForm &&
                        <DisplayOptionContainer onClick={() => setDisplaySlotForm(true)}>
                            <DisplayFormButton>+</DisplayFormButton>
                            <label>
                                Add Slot
                            </label>
                        </DisplayOptionContainer>
                    }
                    {displaySlotForm &&
                        <DisplayOptionContainer onClick={() => setDisplaySlotForm(false)}>
                            <DisplayFormButton>-</DisplayFormButton>
                            <label>
                                Hide Form
                            </label>
                        </DisplayOptionContainer>
                    }

                    {displaySlotForm &&
                        <SlotDetailsForm
                            onSubmitParentCallback={onSubmitOfSlotDetailsForm}
                            stages={stages}
                            slots={slots}
                        />
                    }

                    <ListBox>
                        {slotDetailsListBoxDisplays}
                    </ListBox>

                    <StyledButton onClick={handleSubmit}>
                        Create Event
                    </StyledButton>
                    <p id="uidnote" style={isSubmitError ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        {submitErrMsg}
                    </p>
                </EventDetailsDiv>
            </Container>
        </>
    );
}

export default CreateEventPage;