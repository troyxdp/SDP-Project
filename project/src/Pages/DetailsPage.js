import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsForm } from "../components/EventPlannerDetailsForm";
import { PerformerDetailsForm } from "../components/PerformerDetailsForm";
import { db } from '../firebase-config/firebase';

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
    padding: 15px 0;
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
const StyledHeader = styled.h1`
    font-size: 2.1rem;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 5px;
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



/*
    TO-DO:
*/

export default function DetailsPage() {
    //fetch email from session storage
    const email = sessionStorage.getItem("userEmail");
    const usrData = useLocation().state.usrData;
    const profilePic = useLocation().state.usrData.profilePic;
    const isProfilePic = profilePic !== null;

    let userData = {
        email: email,
        displayName: usrData.displayName,
        searchName: usrData.displayName.toLowerCase(),
        location: usrData.location,
        bio: usrData.bio,
        profilePic: usrData.profilePic,
        isPerformer: false,
        isEventPlanner: false,
        isInGroup: false
    };

    //useState to store user data fetched from database that has already been added
    const [user, setUser] = useState(userData);
    const [pwd, setPwd] = useState(usrData.password);

    //useState for performer details
    const [isPerformer, setIsPerformer] = useState(false);
    const [performerDetails, setPerformerDetails] = useState([]);
    const [displayPerformerForm, setDisplayPerformerForm] = useState(false);
    const [displayAddPerformerButton, setDisplayAddPerformerButton] = useState(false);

    //useState for event planner details
    const [isEventPlanner, setIsEventPlanner] = useState(false);
    const [displayEventPlannerForm, setDisplayEventPlannerForm] = useState(false);
    const [eventPlannerDetails, setEventPlannerDetails] = useState(null);

    //useState to check that all of the details enterred are valid
    const [isAllValidDetails, setIsAllValidDetails] = useState(true);
    const [isTypeSelected, setIsTypeSelected] = useState(true);

    //callback functions called by the PerformerDetails and EventPlannerDetails forms to get their data
    const onSubmitPerformerDetails = async (name, type, genres, equipment, hourlyRate, links, media) => {
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
            userEmail : email,
            name : name,
            type : type,
            genres : genres,
            equipment : equipment,
            hourlyRate : hourlyRate,
            links : links,
            media : media
        };

        console.log(newPerformerDetails);

        //check if details are already present for the specific type of performer - if so, write over them
        if (typePosition !== -1)
        {
            currPerformerDetails[typePosition] = newPerformerDetails;
        }   
        else
        {
            currPerformerDetails.push(newPerformerDetails);
        } 
        setPerformerDetails(currPerformerDetails);
        setIsPerformer(true);
        setDisplayPerformerForm(false);
        setIsTypeSelected(true);

        console.log("New Performer Details:");
        console.log(performerDetails);

        return true;
    }
    const onSubmitEventPlannerDetails = (types, links) => {
        let newEventPlannerDetails = {
            userEmail : email,
            types : types,
            links : links,
            media : []
        }
        console.log(newEventPlannerDetails);
        setEventPlannerDetails(newEventPlannerDetails);
        setIsEventPlanner(true);
        setDisplayEventPlannerForm(false);
    }

    //function used to control the render of the AddPerformer button and the PerformerDetails form
    const handleDisplayPerformerDetailsChange = () => {
        setDisplayAddPerformerButton(!displayAddPerformerButton);
        setDisplayPerformerForm(false);
    }

    //function used to handle submission of all the forms and navigate to the profile page
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isAllValidDetails && (isEventPlanner || isPerformer))
        {
            try
            {
                await createUserWithEmailAndPassword(getAuth(), email, pwd)
               
            }
            catch (err)
            {
                console.log(err);
                return;
            }
            
            setIsTypeSelected(true);

            //update the user object with the eventPlanner data
            let currUser = user;
            if (isEventPlanner)
            {
                currUser.isEventPlanner = true;
            }
            if (isPerformer)
            {
                currUser.isPerformer = true;
            }

            //try add the details to the firebase
            try
            {
                //reference to document in database
                const userDocRef = doc(db, "users", email);
                await setDoc(userDocRef, currUser);
                console.log("ID: " + userDocRef.id);


                await setDoc(doc(db, "userChats", email), currUser);


                if (isEventPlanner)
                {
                    const eventPlannerInfoCollection = collection(db, "users", userDocRef.id, "eventPlannerInfo");
                    await addDoc(eventPlannerInfoCollection, eventPlannerDetails);
                }
    
                //add all of the different performance information to the database
                if (isPerformer && displayAddPerformerButton === true)
                {
                    const performerInfoCollection = collection(db, "users", userDocRef.id, "performerInfo");
                    for (let i = 0; i < performerDetails.length; i++)
                    {
                        await addDoc(performerInfoCollection, performerDetails[i]);
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                return;
            } 
            
            navigate("/profilePage", {state : email});
            window.location.reload(false);
        }
        else if (!isEventPlanner && !isPerformer)
        {
            setIsTypeSelected(false);
        }
    }

    return(
        <PageContainer>
            <Container>
                <StyledHeader>
                    User Details
                </StyledHeader>
                <p>
                    What type/s of user are you?
                </p>
                <StyledCheckboxContainer>
                    <label>
                        <input 
                            type="checkbox"
                            value={displayAddPerformerButton}
                            onChange={handleDisplayPerformerDetailsChange}
                        />
                        I am a performer
                    </label>
                    <label>
                        <input 
                            type="checkbox"
                            value={displayEventPlannerForm}
                            onChange={(e) => setDisplayEventPlannerForm(!displayEventPlannerForm)}
                        />
                        I am an event planner
                    </label>
                </StyledCheckboxContainer>

                {displayAddPerformerButton && !displayPerformerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayPerformerForm(true)}>
                        <DisplayFormButton>+</DisplayFormButton>
                        <label>
                            Add Performer Details
                        </label>
                    </DisplayOptionContainer>
                }
                {displayAddPerformerButton && displayPerformerForm &&
                    <DisplayOptionContainer onClick={() => setDisplayPerformerForm(false)}>
                        <DisplayFormButton>-</DisplayFormButton>
                        <label>
                            Hide Form
                        </label>
                    </DisplayOptionContainer>
                }

                {/* Form for inputting performer details */}
                {displayPerformerForm &&
                    <PerformerDetailsForm parentCallback={onSubmitPerformerDetails}/>
                }

                {/* Form for inputting event planner details */}
                {displayEventPlannerForm &&
                    <EventPlannerDetailsForm parentCallback={onSubmitEventPlannerDetails}/>
                }

                <StyledButton onClick={handleSubmit}>
                    Submit All Details
                </StyledButton>

                <p id="uidnote" style={!isTypeSelected ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Please select a type and input details for it.<br/>
                </p>
            </Container>
        </PageContainer>
    )
}