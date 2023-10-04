import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styled from "styled-components";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";
import {PerformerDetailsForm} from "../components/PerformerDetailsForm";
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


/*
    TO-DO:
    - Add error messages for invalid details enterred
    - Add the functionality of being able to have multiple forms and multiple submissions
    - See if there is a way to add multiple documents at the same time instead of adding each performer type details one at a time
*/

export default function DetailsPage() {
    let email = sessionStorage.getItem("userEmail");

    //useState to store user data fetched from database that has already been added
    const [user, setUser] = useState(null);

    //useState for performer details
    const [isPerformer, setIsPerformer] = useState(false);
    const [performerDetails, setPerformerDetails] = useState([]);
    const [displayPerformerForm, setDisplayPerformerForm] = useState(false);

    //useState for event planner details
    const [displayEventPlannerForm, setDisplayEventPlannerForm] = useState(false);

    //useState to check that all of the details enterred are valid
    const [isAllValidDetails, setIsAllValidDetails] = useState(true);

    //useEffect used to fetch user data
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
        };
        getUserData();
    }, []);

    const onSubmitPerformerDetails = (name, type, genres, equipment, hourlyRate, links, media) => {
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
            pastEvents : [],
            upcomingEvents : [],
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

        console.log("New Performer Details:");
        console.log(performerDetails);
    }

    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isAllValidDetails)
        {
            //try add the details to the firebase
            try
            {
                const userDocRef = doc(db, "users", email);
    
                const performerInfoCollection = collection(db, "users", userDocRef.id, "performerInfo");
                for (let i = 0; i < performerDetails.length; i++)
                {
                    await addDoc(performerInfoCollection, performerDetails[i]);
                }
                
                //commenting out the reviewCollection because when they first create their page there will be no reviews
                //const reviewCollection = collection(db, "users", userDocRef.id, "reviews");
                //await addDoc(reviewCollection, dummyReview);
            }
            catch (err)
            {
                console.log(err);
                return;
            } 
            
            navigate("/profilePage", {state : email});
            window.location.reload(false);
        }

        setDisplayPerformerForm(false);
    }

    return(
        <Container>
            <StyledHeader>
                User Details
            </StyledHeader>
            <StyledCheckboxContainer>
                <label>
                    <input 
                        type="checkbox"
                        value={displayPerformerForm}
                        onChange={(e) => setDisplayPerformerForm(!displayPerformerForm)}
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
            {displayPerformerForm &&
                    <PerformerDetailsForm parentCallback={onSubmitPerformerDetails}/>
            }
            <StyledButton onClick={handleSubmit}>
                Submit All Details
            </StyledButton>
    </Container>
    )
}