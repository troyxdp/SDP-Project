import { collection, doc, getDoc, getDocs, updateDoc, addDoc } from "firebase/firestore";
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
    padding-bottom: 15px;
    display: flex;
    align-items: center;
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
const StyledBioInput = styled.textarea`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 500px;
    max-width: 500px;
    height: 250px;
    max-height: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    margin-bottom: 2px;
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

//REGEX EXPRESSIONS FOR CHECKING DETAILS
//Check that the text is one or more Regex words.
const TEXT_REGEX = /^\w+([ -]+\w+)*$/;
//Check that the bio contains words, numbers and only the special characters ',', '.' and '-' and that it is between 1 and 64 characters.
const BIO_REGEX = /^[a-zA-Z0-9,.-\s!]{1,280}$/;
//Check that link entered is valid
const LINK_REGEX = /^(https?|ftp):\/\/([^\s/$.?#]+\.)+[^\s/$.?#]+(\/[^\s]*)?$/;
//Check that performer name entered is valid
const PERFORMER_NAME_REGEX = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9$&,+\-_ ]+$/;


/*
    TO-DO:
    - Add verification of links entered using the link regex on the edit event planner details form
    - Add ability to add new performer details
    - Add ability to add new event planner details
    - Consider using useCallback() hook for list box display creation methods
    - Make code display previously chosen genres for performer details editting
    - Fix weird bug that occurs after adding new details
*/


export default function EditPersonalDetailsPage() {
    //get user email from session storage
    const userEmail = sessionStorage.getItem("userEmail");

    //EVERYTHING FOR EDITTING USER DETAILS
    //initializing object for user field
    const userInitializer = {
        email : userEmail,
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
    const [displayName,setDisplayName] = useState('');
    const [location,setLocation] = useState('');
    const [bio,setBio] = useState('');

    //useStates for validation of data
    const [isValidDisplayName, setIsValidDisplayName] = useState(false);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [isValidBio, setIsValidBio] = useState(false);

    //useStates for checking component focus
    const [isDiplayNameFocus, setIsDisplayNameFocus] = useState(false);
    const [isLocationFocus, setIsLocationFocus] = useState(false);
    const [isBioFocus, setIsBioFocus] = useState(false);

    //useStates for conditional rendering
    const [displayEditUserDetails, setDisplayEditUserDetails] = useState(false); //controls display of form to edit basic user details
    const [displayEditEventPlannerDetails, setDisplayEditEventPlannerDetails] = useState(false); //controls display of form to edit event planner details
    const [displayEditPerformerDetails, setDisplayEditPerformerDetails] = useState(false); //controls display of form to edit performer details
    const [displayEventPlannerForm, setDisplayEventPlannerForm] = useState(false); //controls display of form to create event planner details
    const [displayPerformerForm, setDisplayPerformerForm] = useState(false); //controls display of form to create performer details

    //useEffect to validate full name via TEXT_REGEX.
    useEffect(() => {
        const result =TEXT_REGEX.test(displayName);
        setIsValidDisplayName(result);
    }, [displayName]);
    //useEffect to validate location
    useEffect(() => {
        const result =TEXT_REGEX.test(location);
        setIsValidLocation(result);
    }, [location]);
    //useEffect to validate bio via BIO_REGEX.
    useEffect(() => {
        const result =BIO_REGEX.test(bio);
        setIsValidBio(result);
    }, [bio]);

    const handleUserDetailsFormSubmission = async () => {
        if (isValidDisplayName && isValidLocation && isValidBio)
        {
            const userDocRef = doc(db, "users", userEmail);
            await updateDoc(userDocRef, {
                displayName : displayName,
                searchName : displayName.toLowerCase(),
                location : location,
                bio : bio
            });
            setDisplayName("");
            setLocation("");
            setBio("");
            setDisplayEditUserDetails(false);

            isDataLoaded(false);
        }
    }



    //EVERYTHING FOR EDITTING EVENT PLANNER DETAILS
    const eventTypeOptions = [
        {value : "eventParty", label : "Event Party"},
        {value : "festival", label : "Festival"},
        {value : "rave", label : "Rave"},
        {value : "clubSlot", label : "Club Slot"},
        {value : "barSlot", label : "Bar Slot"},
        {value : "houseParty", label : "House Party"},
        {value : "birthdayParty", label : "Birthday Party"},
        {value : "wedding", label : "Wedding"},
        {value : "ball", label : "Ball"},
        {value : "other", label : "Other"}
    ];
    const eventTypesSelectedInitializer = [];
    for (let i = 0; i < eventTypeOptions.length; i++)
    {
        eventTypesSelectedInitializer.push(false);
    }

    //useStates for storing data
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);
    const [eventTypesSelected, setEventTypesSelected] = useState(eventTypesSelectedInitializer);
    const [eventPlannerLinks, setEventPlannerLinks] = useState([]);
    const [eventPlannerLinkToAdd, setEventPlannerLinkToAdd] = useState("");
    const [eventPlannerID, setEventPlannerID] = useState("");

    //useState for storing list box displays of links
    const [eventPlannerLinkListBoxDisplays, setEventPlannerLinkListBoxDisplays] = useState([]);
    const createEventPlannerLinkListDisplay = async (links) => {
        const linkDisplays = [];
        for (let i = 0; i < links.length; i++)
        {
            linkDisplays.push(
                <ListBoxElement>
                    <a href={links[i]}>{links[i]}</a>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveEventPlannerLink(i)}/>
                </ListBoxElement>
            );
        }
        setEventPlannerLinkListBoxDisplays(linkDisplays);
    }

    //handle changes in inputted data
    const handleTypeSelectedChange = (index) => {
        const currTypesSelected = eventTypesSelected;
        currTypesSelected[index] = !currTypesSelected[index];
        setEventTypesSelected(currTypesSelected);
    }
    const handleAddEventPlannerLink = async () => {
        console.log(eventPlannerLinkToAdd);
        let currLinks = eventPlannerLinks;
        for (let i = 0; i < eventPlannerLinks.length; i++)
        {
            if (eventPlannerLinkToAdd === eventPlannerLinks[i])
            {
                setEventPlannerLinkToAdd("");
                //display some sort of error message
                return;
            }
        }
        currLinks.push(eventPlannerLinkToAdd);
        setEventPlannerLinks(currLinks);
        setEventPlannerLinkToAdd("");
        createEventPlannerLinkListDisplay(currLinks);
        console.log(eventPlannerLinks);
    }
    const handleRemoveEventPlannerLink = async (index) => {
        const linkList = eventPlannerLinks;
        linkList.splice(index, 1);
        setEventPlannerLinks(linkList);
        createEventPlannerLinkListDisplay(linkList);
    }
    const handleDisplayEditEventPlannerDetailsForm = async () => {
        setDisplayEditEventPlannerDetails(true);
        createEventPlannerLinkListDisplay(eventPlannerLinks);
    }

    //create checkboxes
    const plannerTypeCheckboxes = [];
    for (let i = 0; i < eventTypeOptions.length; i++)
    {
        plannerTypeCheckboxes.push(
            <StyledLabel>
                <input
                    type="checkbox"
                    checked={eventTypesSelected[i]}
                    onChange={() => handleTypeSelectedChange(i)}
                />
                {eventTypeOptions[i].label}
            </StyledLabel>
        );
    }

    const handleSubmitNewEventPlannerDetails = async (e) => {
        e.preventDefault();

        let eventTypes = [];
        for (let i = 0; i < eventTypeOptions.length; i++)
        {
            if (eventTypesSelected[i] === true)
            {
                eventTypes.push(eventTypeOptions[i].label);
            }
        }

        const eventPlanner = {
            links : eventPlannerLinks,
            media : [],
            types : eventTypes,
            userEmail : userEmail
        };
        console.log(eventPlannerID);

        //update database
        const userDocRef = doc(db, "users", userEmail, "eventPlannerInfo", eventPlannerID);
        await updateDoc(userDocRef, {
            eventTypes : eventTypes,
            links : eventPlannerLinks
        });

        setEventTypesSelected(eventTypesSelectedInitializer);
        setEventPlannerLinks([]);
        setEventPlannerLinkToAdd("");
        setDisplayEditEventPlannerDetails(false);

        setIsDataLoaded(false);
    }



    //EVERYTHING FOR EDITTING PERFORMER DETAILS
    const performerTypeOptions = [
        {value: "DJ", label: "DJ"},
        {value: "Vocalist", label: "Vocalist"},
        {value: "Guitarist", label: "Guitarist"},
        {value: "BassGuitarist", label: "Bass Guitarist"},
        {value: "Drummer", label: "Drummer"},
        {value: "Pianist", label: "Pianist/Keyboardist"},
        {value: "Saxophonist", label: "Saxophonist"},
        {value: "Trumpeter", label: "Trumpeter"},
        {value: "Violinist", label: "Violinist"},
        {value: "Cellist", label: "Cellist"},
        {value: "Other", label: "Other"}
    ];
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
    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }

    //useStates for storing details
    const [performerDetails, setPerformerDetails] = useState([]);
    const [performerName, setPerformerName] = useState("");
    const [equipment, setEquipment] = useState([]);
    const [hourlyRate, setHourlyRate] = useState(0.0);
    const [performerLinks, setPerformerLinks] = useState([]);
    const [media, setMedia] = useState([]);

    //useStates for taking input
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [equipmentItem, setEquipmentItem] = useState("");
    const [linkToAdd, setLinkToAdd] = useState("");

    //useStates for stating if a component has focus
    const [performerNameFocus, setPerformerNameFocus] = useState(false);
    const [linkToAddFocus, setLinkToAddFocus] = useState(false);
    const [equipmentItemFocus, setEquipmentItemFocus] = useState(false);

    //useState for choosing which performer details to edit
    const [performerTypesOfUser, setPerformerTypesOfUser] = useState([]);
    const [performerTypeSelected, setPerformerTypeSelected] = useState([]);

    //useStates for checking if values entered in fields are valid
    const [isValidPerformerName, setIsValidPerformerName] = useState(false);
    const [isValidLinkToAdd, setIsValidLinkToAdd] = useState(false);

    //useState to store ids of performer details docs
    const [performerDocsIDs, setPerformerDocsIDs] = useState([]);

    console.log(genresSelected);

    //useEffects to check if an enterred fields are valid
    //checks performer name
    useEffect(() => {
        const result = PERFORMER_NAME_REGEX.test(performerName);
        setIsValidPerformerName(result);
    }, [performerName])
    //checks link to add
    useEffect(() => {
        const result = LINK_REGEX.test(linkToAdd);
        setIsValidLinkToAdd(result);
    }, [linkToAdd])

    //useEffect for storing list box displays of equipment items and a method for updating the useState
    const [equipmentListBoxDisplays, setEquipmentListDisplays] = useState([]);
    const createEquipmentListDisplay = async (equipment) => {
        const equipDisplays = [];
        for (let i = 0; i < equipment.length; i++)
        {
            equipDisplays.push(
                <ListBoxElement>
                    <p>{equipment[i]}</p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveEquipmentItem(i)}/>
                </ListBoxElement>
            );
        }
        setEquipmentListDisplays(equipDisplays);
    };

    //useState for storing list box displays of links and a method for updating the useState
    const [performerLinkListBoxDisplays, setPerformerLinkListBoxDisplays] = useState([]);
    const createPerformerLinkListDisplay = async (links) => {
        const linkDisplays = [];
        for (let i = 0; i < links.length; i++)
        {
            linkDisplays.push(
                <ListBoxElement>
                    <a href={links[i]}>{links[i]}</a>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemovePerformerLink(i)}/>
                </ListBoxElement>
            );
        }
        setPerformerLinkListBoxDisplays(linkDisplays);
    }

    const genreCheckboxes = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        if (genresSelected[i])
        {
            console.log(i);
        }
        genreCheckboxes.push(
            <StyledLabel>
                <input
                    type="checkbox"
                    checked={genresSelected[i]}
                    onChange={() => handleGenreSelectedChange(i)}
                />
                {genreOptions[i].label}
            </StyledLabel>
        );
    }


    //methods for handling input and modification of data
    const handleGenreSelectedChange = (index) => {
        setGenresSelected((prevGenresSelected) => {
          const updatedGenresSelected = [...prevGenresSelected];
          updatedGenresSelected[index] = !updatedGenresSelected[index];
          return updatedGenresSelected;
        });
      }
    const handleAddEquipmentItem = async () => {
        console.log(equipmentItem);
        let currEquipment = equipment;
        for (let i = 0; i < equipment.length; i++)
        {
            if (equipmentItem === currEquipment[i])
            {
                setEquipmentItem("");
                //display some sort of error here
                return;
            }
        }
        currEquipment.push(equipmentItem);
        setEquipment(currEquipment);
        setEquipmentItem("");
        createEquipmentListDisplay(currEquipment);
        console.log(equipment);
    }
    const handleAddPerformerLink = async () => {
        console.log(linkToAdd);
        if (isValidLinkToAdd)
        {
            if (LINK_REGEX.test(linkToAdd) === true)
            {
                let currLinks = performerLinks;
                for (let i = 0; i < performerLinks.length; i++)
                {
                    if (linkToAdd === performerLinks[i])
                    {
                        setLinkToAdd("");
                        //display some sort of error message
                        return;
                    }
                }
                currLinks.push(linkToAdd);
                setPerformerLinks(currLinks);
                setLinkToAdd("");
                createPerformerLinkListDisplay(currLinks);
                console.log(performerLinks);
            }
        }
    }
    const handleRemoveEquipmentItem = async (index) => {
        const equipmentList = equipment;
        equipmentList.splice(index, 1);
        setEquipment(equipmentList);
        createEquipmentListDisplay(equipmentList);
    }
    const handleRemovePerformerLink = async (index) => {
        const linkList = performerLinks;
        linkList.splice(index, 1);
        setPerformerLinks(linkList);
        createPerformerLinkListDisplay(linkList);
    }

    //method for handling display of edit performer details for
    const handleDisplayEditPerformerDetailsForm = async (e) => {
        createEquipmentListDisplay(equipment);
        createPerformerLinkListDisplay(performerLinks);
        setDisplayEditPerformerDetails(true);
    }

    //method for handling selection of performer type to edit
    const handleSelectionOfPerformerType = async (e) => {
        e.preventDefault();

        //set type selected
        const selectedPerformerType = e.target.value;
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

        //set the rest of the data on the form
        setPerformerName(performerDetailsOfType.name);
        setEquipment(performerDetailsOfType.equipment);
        setHourlyRate(performerDetailsOfType.hourlyRate);
        setPerformerLinks(performerDetailsOfType.links);
        setMedia(performerDetailsOfType.media);

        //update list boxes and genre checkboxes
        createEquipmentListDisplay(performerDetailsOfType.equipment);
        createPerformerLinkListDisplay(performerDetailsOfType.links);
    }

    //method for handling submission of form data
    const handleSubmitOfPerformerDetails = async (e) => {
        e.preventDefault();

        let currPerformerDetails = performerDetails;

        let genres = [];
        for (let i = 0; i < genresSelected.length; i++)
        {
            if (genresSelected[i] === true)
            {
                genres.push(genreOptions[i].label);
            }
        }

        let performerDetailsIndex = 0;
        for (let i = 0; i < currPerformerDetails.length; i++)
        {
            if (currPerformerDetails[i].type === performerTypeSelected)
            {
                performerDetailsIndex = i;
                break;
            }
        }

        const userDocRef = doc(db, "users", userEmail, "performerInfo", performerDocsIDs[performerDetailsIndex]);
        await updateDoc(userDocRef, {
            name : performerName,
            genres : genres,
            equipment : equipment,
            hourlyRate : hourlyRate,
            links : performerLinks,
            media : media
        });

        setPerformerName(currPerformerDetails[0].name);
        setEquipment(currPerformerDetails[0].equipment);
        setHourlyRate(currPerformerDetails[0].hourlyRate);
        setPerformerLinks(currPerformerDetails[0].links);
        setMedia(currPerformerDetails[0].media);
        setPerformerTypeSelected(performerTypesOfUser[0]);
        setDisplayEditPerformerDetails(false);
    }



    //METHODS FOR THE CREATION OF EVENT PLANNER USER DETAILS
    const eventPlannerCreationCallback = async (eventTypes, links) => {
        //update useStates
        let newEventPlannerDetails = {
            userEmail : userEmail,
            types : eventTypes,
            pastEvents : [],
            upcomingEvents : [],
            links : links,
            media : []
        }
        console.log(newEventPlannerDetails);
        setEventPlannerDetails(newEventPlannerDetails);
        setDisplayEventPlannerForm(false);

        //update database
        //update isEventPlanner field in main doc
        const userDocRef = doc(db, "users", userEmail);
        await updateDoc(userDocRef, {
            isEventPlanner : true
        });

        //add event planner details
        const eventPlannerInfoCollection = collection(db, "users", userDocRef.id, "eventPlannerInfo");
        await addDoc(eventPlannerInfoCollection, newEventPlannerDetails);

        const currUser = user;
        currUser.isEventPlanner = true;
        setUser(currUser);
    }



    //METHODS FOR CREATION OF PERFORMER DETAILS
    const performerCreationCallback = async (name, type, genres, equipment, hourlyRate, links, media) => {
        let currPerformerDetails = performerDetails;

        //checks if the user has already listed performance details of a certain type of performer - can't have two sets of details for one type
        let typePosition = -1;
        for (let i = 0; i < currPerformerDetails.length; i++) 
        {
            if (type === currPerformerDetails[i].type)
            {
                typePosition = i;
            }
        }

        // add details or edit existing details
        let newPerformerDetails = {
            userEmail : userEmail,
            name : name,
            type : type,
            genres : genres,
            equipment : equipment,
            hourlyRate : hourlyRate,
            pastEvents : [],
            upcomingEvents : [],
            links : links,
            media : media
        };

        console.log(newPerformerDetails);

        //check if details are already present for the specific type of performer - if so, write over them
        if (typePosition !== -1)
        {
            return false;
        }   
        else
        {
            currPerformerDetails.push(newPerformerDetails);
        } 
        setPerformerDetails(currPerformerDetails);
        setDisplayPerformerForm(false);

        console.log("New Performer Details:");
        console.log(performerDetails);

        const currUser = user;
        currUser.isPerformer = true;
        setUser(true);

        //MAKE CHANGES IN DATABASE
        //update isPerformer field in main doc
        const userDocRef = doc(db, "users", userEmail);
        await updateDoc(userDocRef, {
            isPerformer : true
        });

        //add performer details
        const eventPlannerInfoCollection = collection(db, "users", userDocRef.id, "performerInfo");
        await addDoc(eventPlannerInfoCollection, newPerformerDetails);

        return true;
    }


    //GENERAL THINGS USED BY ALL TYPES OF EDITS
    //useState for checking if data has been loaded
    const [isDataLoaded, setIsDataLoaded] = new useState(false);

    //useEffect to fetch user data from the database
    useEffect(() => {
        const getUserData = async () => {
            if (!isDataLoaded)
            {
                const docRef = doc(db, "users", userEmail);
                const docSnap = await getDoc(docRef);
        
                let userData = {
                    email : userEmail,
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
                setDisplayName(userData.displayName);
                setLocation(userData.location);
                setBio(userData.bio);
        
                //if user is an event planner
                if (userData.isEventPlanner)
                {
                    //get event planner details
                    let eventPlannerDetails = null;
                    const querySnapshot = await getDocs(collection(db, "users", userEmail, "eventPlannerInfo"));
                    querySnapshot.forEach((doc) => {
                        eventPlannerDetails = doc.data();
                        setEventPlannerID(doc.id);
                    });
                    setEventPlannerDetails(eventPlannerDetails);

                    setEventPlannerLinks(eventPlannerDetails.links);
                    const eventTypes = eventPlannerDetails.types;
                    const selectedEventTypes = eventTypesSelected;
                    for (let i = 0; i < eventTypes.length; i++)
                    {
                        for (let j = 0; j < eventTypeOptions.length; j++)
                        {
                            if (eventTypes[i] === eventTypeOptions[j].label)
                            {
                                selectedEventTypes[i] = true;
                            }
                        }
                    }
                    setEventTypesSelected(selectedEventTypes);
                }

                //if user is a performer
                if (userData.isPerformer)
                {
                    //get the performer details
                    const currPerformerDetails = [];
                    const performerIDs = [];
                    const querySnapshot = await getDocs(collection(db, "users", userEmail, "performerInfo"));
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        currPerformerDetails.push(doc.data());
                        performerIDs.push(doc.id);
                    });
                    setPerformerDetails(currPerformerDetails);
                    setPerformerDocsIDs(performerIDs);

                    //set performer details to 
                    setPerformerName(currPerformerDetails[0].name);
                    setEquipment(currPerformerDetails[0].equipment);
                    setHourlyRate(currPerformerDetails[0].hourlyRate);
                    setPerformerLinks(currPerformerDetails[0].links);
                    setMedia(currPerformerDetails[0].media);
                    
                    //check which types of performer this user is and update useStates accordingly
                    const types = [];
                    for (let i = 0; i < currPerformerDetails.length; i++)
                    {
                        types.push(currPerformerDetails[i].type);
                    }
                    setPerformerTypesOfUser(types);
                    setPerformerTypeSelected(types[0]);

                    //create list box displays for equipment items and links
                    createEquipmentListDisplay(currPerformerDetails[0].equipment);
                    createPerformerLinkListDisplay(currPerformerDetails[0].links);
                }

                setIsDataLoaded(true);
            }
        };
        getUserData();
    }, [userEmail, eventTypeOptions, eventTypesSelected, isDataLoaded, setIsDataLoaded, createEquipmentListDisplay, 
        createPerformerLinkListDisplay, genreOptions, genresSelectedInitializer, performerDetails]);
    
    let navigate = useNavigate();
    const returnToProfilePage = async (e) => {
        navigate("/profilePage", {state : userEmail});
        window.location.reload(false);
    }
    return(
        <PageContainer>
            <NavigationBar />
            <Container>
                <StyledHeader>Edit Personal Details:</StyledHeader>
                {!displayEditUserDetails &&
                    <DisplayOptionContainer onClick={() => setDisplayEditUserDetails(true)}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Edit User Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditUserDetails &&
                    <DisplayOptionContainer onClick={() => setDisplayEditUserDetails(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditUserDetails &&
                    <DetailsFormDiv>
                        <StyledSubheader>Edit User Details:</StyledSubheader>
                        <StyledLabel>
                            Full Name:
                        </StyledLabel>
                        <StyledInput 
                            type="text"
                            id="displayName"
                            //ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            aria-invalid={isValidDisplayName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setIsDisplayNameFocus(true)}
                            onBlur={() => setIsDisplayNameFocus(false)}
                            // ref={fullNameRef}
                            value={displayName}
                        />
                        <p id="uidnote" style={isDiplayNameFocus && displayName && !isValidDisplayName ? {} : {display: "none"}}>
                            Please enter your full name. <br />
                        </p>

                        <StyledLabel htmlFor="location">
                            Location: 
                        </StyledLabel>
                        <StyledInput 
                            type="text"
                            id="location"
                            autoComplete="off"
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            aria-invalid={isValidLocation ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setIsLocationFocus(true)}
                            onBlur={() => setIsLocationFocus(false)}
                            // ref={locationRef}
                            value={location}
                        />
                        <p id="uidnote" style={isLocationFocus && location && !isValidLocation ? {} : {display: "none"}}>
                            Please enter what area you operate from. <br />
                        </p>

                        <StyledLabel>
                            Bio:
                        </StyledLabel>
                        <StyledBioInput 
                            type="text"
                            id="bio"
                            autoComplete="off"
                            onChange={(e) => setBio(e.target.value)}
                            required
                            aria-invalid={isValidBio ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setIsBioFocus(true)}
                            onBlur={() => setIsBioFocus(false)}
                            // ref={bioRef}
                            value={bio}
                        />
                        <p id="uidnote" style={isBioFocus && bio && !isValidBio ? {} : {display: "none"}}>
                            Please enter your bio. <br />
                            Must be 1-280 characters. <br />
                            Special characters allowed: .,-!
                        </p>

                        <StyledButton onClick={handleUserDetailsFormSubmission}>
                            Submit
                        </StyledButton>
                    </DetailsFormDiv>
                }

                {!displayEditEventPlannerDetails && user.isEventPlanner &&
                    <DisplayOptionContainer onClick={() => handleDisplayEditEventPlannerDetailsForm()}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Edit Event Planner Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditEventPlannerDetails && user.isEventPlanner &&
                    <DisplayOptionContainer onClick={() => setDisplayEditEventPlannerDetails(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditEventPlannerDetails && user.isEventPlanner &&
                    <DetailsFormDiv>
                        <StyledSubheader>Edit Event Planner Details:</StyledSubheader>
                        <StyledLabel htmlFor="eventTypes">
                            What types of events do you do?
                        </StyledLabel>
                        <StyledCheckboxContainer>
                                {plannerTypeCheckboxes}
                        </StyledCheckboxContainer>

                        <StyledLabel htmlFor="links">
                            Links:
                        </StyledLabel>
                        <AdderContainer>
                            <AdderInput
                                type="text"
                                id="links"
                                autoComplete="off"
                                onChange={(e) => setEventPlannerLinkToAdd(e.target.value)}
                                value={eventPlannerLinkToAdd}
                            />
                            <AdderButton onClick={handleAddEventPlannerLink}>
                                Add Link
                            </AdderButton>
                        </AdderContainer>
                        <ListBox>
                            {eventPlannerLinkListBoxDisplays}
                        </ListBox>

                        <StyledButton onClick={handleSubmitNewEventPlannerDetails}>
                            Update Details
                        </StyledButton>
                    </DetailsFormDiv>
                }
                {!user.isEventPlanner && !displayEventPlannerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayEventPlannerForm(true)}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Create Event Planner Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEventPlannerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayEventPlannerForm(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEventPlannerForm &&
                    <EventPlannerDetailsForm 
                        parentCallback={eventPlannerCreationCallback}
                    />
                }

                {!displayEditPerformerDetails && user.isPerformer &&
                    <DisplayOptionContainer onClick={() => handleDisplayEditPerformerDetailsForm()}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Edit Performer Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditPerformerDetails && user.isPerformer &&
                    <DisplayOptionContainer onClick={() => setDisplayEditPerformerDetails(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }
                {displayEditPerformerDetails && user.isPerformer &&
                    <DetailsFormDiv>
                        <StyledSubheader>Edit Performer Details:</StyledSubheader>
                        <StyledLabel htmlFor="type">
                            Performer Type to Edit:
                        </StyledLabel>
                        <select value={performerTypeSelected} onChange={(e) => handleSelectionOfPerformerType(e)}>
                            {performerTypesOfUser.map((type) => (
                                <option value={type}>{type}</option>
                            ))}
                        </select>

                        <StyledLabel htmlFor="performerName">
                                Performer Name:
                        </StyledLabel>
                        <StyledInput 
                            type="text"
                            id="performerName"
                            autoComplete="off"
                            onChange={(e) => setPerformerName(e.target.value)}
                            onFocus={() => setPerformerNameFocus(true)}
                            onBlur={() => setPerformerNameFocus(false)}
                            value={performerName}
                            required
                        />
                        <p id="uidnote" style={performerNameFocus && performerName && !isValidPerformerName ? {} : {display: "none"}}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            Error: Invalid name entered. <br/>
                            Please enter a performer name containing at least one alphanumeric character <br/>
                            consisting of only alphanumeric characters and special characters $&,+\-_
                        </p>

                        <StyledLabel htmlFor="genres">
                            Genres Played:
                        </StyledLabel>
                        <StyledCheckboxContainer>
                            {genreCheckboxes}
                        </StyledCheckboxContainer>

                        <StyledLabel htmlFor="equipment">
                            Equipment: 
                        </StyledLabel>
                        <AdderContainer>
                            <AdderInput 
                                type="text"
                                id="equipment"
                                autoComplete="off"
                                onChange={(e) => setEquipmentItem(e.target.value)}
                                value={equipmentItem}
                                onFocus={() => setEquipmentItemFocus(true)}
                                onBlur={() => setEquipmentItemFocus(false)}
                            />
                            <AdderButton onClick={handleAddEquipmentItem}>
                                Add Item
                            </AdderButton>
                        </AdderContainer>
                        <p id="uidnote" style={equipmentItemFocus && equipmentItem==="" ? {} : {display: "none"}}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            Error: Invalid item entered. <br/>
                            Please enter a non-empty value.
                        </p>

                        <ListBox>
                            {equipmentListBoxDisplays}
                        </ListBox>

                        <StyledLabel htmlFor="hourlyRate">
                            Hourly Rate:
                        </StyledLabel>
                        <StyledInput 
                            type="number"
                            id="hourlyRate"
                            autoComplete="off"
                            min="0"
                            step=".01"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            required
                        />

                        <StyledLabel htmlFor="links">
                            Links:
                        </StyledLabel>
                        <AdderContainer>
                            <AdderInput
                                type="text"
                                id="links"
                                autoComplete="off"
                                onChange={(e) => setLinkToAdd(e.target.value)}
                                onFocus={() => setLinkToAddFocus(true)}
                                onBlur={() => setLinkToAddFocus(false)}
                                value={linkToAdd}
                            />
                            <AdderButton onClick={handleAddPerformerLink}>
                                Add Link
                            </AdderButton>
                        </AdderContainer>
                        <p id="uidnote" style={linkToAddFocus && linkToAdd && !isValidLinkToAdd ? {} : {display: "none"}}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            Error: Invalid link entered. <br/>
                            Please enter a valid link.
                        </p>
                        <ListBox>
                            {performerLinkListBoxDisplays}
                        </ListBox>

                        <StyledButton onClick={handleSubmitOfPerformerDetails}>
                            Save Details
                        </StyledButton>
                        <StyledButton>
                            Delete Profile Details
                        </StyledButton>
                    </DetailsFormDiv>
                }
                {!displayPerformerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayPerformerForm(true)}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Create Performer Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayPerformerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayPerformerForm(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }
                {displayPerformerForm && 
                    <PerformerDetailsForm
                        parentCallback={performerCreationCallback}
                    />
                }

                <StyledButton onClick={(e) => returnToProfilePage(e)}>
                    Return to Profile Page
                </StyledButton>
            </Container>
        </PageContainer>
    );
}