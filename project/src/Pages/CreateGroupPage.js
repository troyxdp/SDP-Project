import {NavigationBar} from "../components/NavigationBar";
import styled from "styled-components";
import { doc, updateDoc, addDoc, collection, getDoc, getDocs,setDoc} from "firebase/firestore";
import { db } from '../firebase-config/firebase';
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";


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
const CreateGroupPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    const email=userEmail;
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
      //useStates for storing user data
    const [user, setUser] = useState(userInitializer);
    const [docId, setDocId] = useState("");
    //useStates for storing input data
    const [groupName, setGroupName] = useState("");
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [description, setDescription] = useState("");
    const [otherMemberEmails, setOtherMemberEmails] = useState([]);
    const [memberToAdd, setMemberToAdd] = useState("");
    const [isMemberAdded, setIsMemberAdded] = useState(false);
    const [isValidMemberToAdd, setIsValidMemberToAdd] = useState(false);
    const [groupDetails, setGroupDetails] = useState(null);
        //useEffect to fetch user data from database
        useEffect(() => {
          const getUserData = async () => {
              const docRef = doc(db, "users", email);
              const docSnap = await getDoc(docRef);
      
              let userData = {
                  email : email,
                  displayName : docSnap.data().fullName,
                  location : docSnap.data().location,
                  bio : docSnap.data().bio,
                  profilePic : docSnap.data().profilePic,
                  isPerformer : docSnap.data().isPerformer,
                  isEventPlanner : docSnap.data().isEventPlanner,
                  isInGroup : docSnap.data().isInGroup
              }
              
              setUser(userData);
  
              const querySnapshot = await getDocs(collection(db, "users",email,"groupInfo"));
              querySnapshot.forEach((doc) => {
                  setGroupDetails(doc.data());
                  setDocId(doc.id);
              });
          };
          getUserData();
          
      }, [])


          //methods to handle changing of inputted data
    const handleGenreSelectedChange = async (index) => {
      let currGenresSelected = genresSelected;
      currGenresSelected[index] = !currGenresSelected[index];
      setGenresSelected(currGenresSelected);
  }


  const groupInitializer={
      email: email,
      groupName: "",
      location: "",
      bio: "",
      profilePic: null,
      genre: null,
      groupMembers:[]
    
  }

  const handleGroupNameInput = async (e) => {
    let newName = e.target.value;
    setGroupName(newName);
}

const handleGroupDescInput = async (e) => {
    let newGroupDesc = e.target.value;
    setDescription(newGroupDesc);
}
const handleAddMember = async () => {
    //check if user has not already been added
    let memberEmails = otherMemberEmails;
    let isAlreadyAdded = false;
    for (let i = 0; i < memberEmails.length; i++)
    {
        if (memberToAdd === memberEmails[i])
        {
            isAlreadyAdded = true;
            break;
        }
    }
    if (!isAlreadyAdded)
    {
        setIsMemberAdded(false);
        const user = memberToAdd;
        const userDocRef = doc(db, "users", user);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) //if user is found in the database
        {
            setIsValidMemberToAdd(true);
            memberEmails.push(user);
            setOtherMemberEmails(memberEmails);
        }
        else //user not found in database
        {
            setIsValidMemberToAdd(false);
        }
    }
    else //is already added
    {
        setIsMemberAdded(true);
        console.log("Already added user " + memberToAdd);
    }
    setMemberToAdd("");
}
const sendMemberRequest = async (user) => {
    const request = {
        requestingUserEmail : email,
        receivingUserEmail : user,
        requestType : "group",
        groupName : groupName,
        
    }
    const userDocRef = doc(db, "users", user);
    const userRequestsCollection = collection(db, "users", userDocRef.id, "requests");
    await addDoc(userRequestsCollection, request);
}


    //method for handling submission of event data
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const genres = [];
        for (let i = 0; i < genresSelected.length; i++)
        {
            if (genresSelected[i] === true)
            {
                genres.push(genreOptions[i].label);
            }
        }

        const newGroup = {
            creatingUserEmail: email, 
            groupName: groupName, 
           // location:location,
            profilePic:null,
            groupMembers: [email], 
            groupDescription: description, 
            genres: genres
            
        };

        let currUser=user;
        const userDocRef = doc(db, "users", email);
        await setDoc(userDocRef, currUser);
       
       
        
        const groupDetailsRef = collection(db, "users", userDocRef.id, "groupInfo");
        setGroupDetails(newGroup)
        await addDoc(groupDetailsRef,newGroup);
        
        user.isInGroup=true;
        await updateDoc(userDocRef,user);
        for (let i = 0; i < otherMemberEmails.length; i++)
        {
            sendMemberRequest(otherMemberEmails[i]);
        }

        navigate("/profilePage", {state : email});
    }
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
                    <StyledHeader>Create Group:</StyledHeader>

                    <StyledLabel htmlFor="groupName">
                        Group Name: 
                    </StyledLabel>
                    <StyledInput 
                        type="text"
                        id="groupName"
                        autoComplete="off"
                        onChange={handleGroupNameInput}
                        required
                    />

                    

                   

          
                    <StyledLabel htmlFor="genres">
                        Genres Played:
                    </StyledLabel>
                    <StyledCheckboxContainer>
                            {genreCheckboxes}
                    </StyledCheckboxContainer>

                    <StyledLabel htmlFor="groupMembers">
                            Other Group Members:
                    </StyledLabel>
                    <AdderContainer>
                        <AdderInput
                            type="text"
                            id="groupMemberAdder"
                            autoComplete="off"
                            onChange={(e) => setMemberToAdd(e.target.value)}
                            value={memberToAdd}
                            // onFocus={() => setIsEventPlannerToAddFocus(true)}
                            // onBlur={() => setIsEventPlannerToAddFocus(false)}
                        />
                        <AdderButton onClick={handleAddMember}>
                            Send Request
                        </AdderButton>
                    </AdderContainer>
                    <p id="uidnote" style={memberToAdd && !isValidMemberToAdd ? {} : {display: "none"}}>
                        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                        Error: Please enter a user that is on this site.
                    </p>
                    <p id="uidnote" style={memberToAdd && isMemberAdded ? {} : {display: "none"}}>
                        Error: You have already added this user to send a request to.
                    </p>

                    <StyledLabel htmlFor="description">
                        Description of Group:
                    </StyledLabel>
                    <DescriptionInput
                        type="text"
                        id="groupDescription"
                        autoComplete="off"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                  
                 

                   

                    <StyledButton onClick={handleSubmit}>
                        Create Group
                    </StyledButton>
                </EventDetailsDiv>
            </Container>
        </>
    );
}
export default CreateGroupPage;