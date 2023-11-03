import { useRef, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import styled from "styled-components";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {getAuth,createUserWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config/firebase';

import User from '../classes/User';
import Performer from '../classes/Performer'; 
import Event from '../classes/Event'; 
import Review from '../classes/Review'; 
import EventPlanner from '../classes/EventPlanner';

import {PerformerDetailsForm} from "../components/PerformerDetailsForm";

// Check for one instance before @; Check for @; Check for "wits.ac.za" or "students.wits.ac.za".
const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z0-9.-]+){0,3}$/;
// Check for 1 lowercase, 1 uppercase, 1 number and 1 special character; Must be between 8 and 24 characters.
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// Check that the text is one or more Regex words.
const TEXT_REGEX = /^\w+([ -]+\w+)*$/;
// Check that the bio contains words, numbers and only the special characters ',', '.' and '-' and that it is between 1 and 64 characters.
const BIO_REGEX = /^[a-zA-Z0-9,.-\s!]{1,280}$/;

//CSS Component: Container for Registration Form
const Container = styled.div`
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
//CSS Component: Input Field
const StyledInput = styled.input`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    margin-bottom: 20px;
`;
//CSS Component: Header
const StyledHeader = styled.h1`
    padding: 20px;
    font-size: 1.5rem;
    font-weight: bold;
`;
//CSS Component: Form Containing Inputs
const StyledForm = styled.form`
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
//CSS Component: Link to Other Page
const StyledLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #a13333;
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
const StyledParagraph = styled.p`
    display: block;
    margin-top: 10px;
`;

/*
    TO-DO:
    - Add error messages for when email address is already in use
    - Make it so that authentication profile is only added on details page
*/

const RegistrationPage = () => {
    const userRef = useRef();
    const errRef = useRef();
    
    let date = new Date();

    const dummyReview = {
        userEmail : "troydp7@gmail.com",
        rating : 10,
        comment : "Great DJ! Played very well and played some BANGING tunes!"
    };

    //Consts for Email
    const [user,setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    //Consts for Password
    const [pwd,setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    //Consts for Confirm Password
    const [matchPwd,setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    //Consts for Full Name
    const [fullName,setFullName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [fullNameFocus, setFullNameFocus] = useState(false);

    //Consts for Pronouns
    const [location,setLocation] = useState('');
    const [validLocation, setValidLocation] = useState(false);
    const [locationFocus, setLocationFocus] = useState(false);

    //Consts for Bio
    const [bio,setBio] = useState('');
    const [validBio, setValidBio] = useState(false);
    const [bioFocus, setBioFocus] = useState(false);

    //Const for Error Message
    const [errMsg,setErrMsg] = useState('');

    // useEffect Hook: Used to set focus to username input.
    useEffect(() => {
        userRef.current.focus();
    }, [])
    // useEffect Hook: Validate username via USER_REGEX.     -- DON'T NEED
    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user])
    // useEffect Hook: Validate password against PWD_REGEX.
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        // Compare the password to the matchPassword. IE: See if the password confirmation is correct.
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])
    // useEffect Hook: Validate full name via TEXT_REGEX.
    useEffect(() => {
        const result =TEXT_REGEX.test(fullName);
        setValidFullName(result);
    }, [fullName])
    // useEffect Hook: Validate bio via BIO_REGEX.
    useEffect(() => {
        const result =BIO_REGEX.test(bio);
        setValidBio(result);
    }, [bio])
    // Clear error message every time user, pwd, matchPwd, fullName, pronouns, qualifications or bio is changed (to account for the user fixing the error).
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd, fullName, location, bio])

    const navigate = useNavigate();
    const HandleSubmit = async (e) => {
        e.preventDefault();

        // Checks in case user enables the submit button via JS hack:
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = TEXT_REGEX.test(fullName);
        const v6 = BIO_REGEX.test(bio);
        
        //Display error if any validation criteria not met
        if (!v1 || !v2 || !v3 || !v6) {
            setErrMsg("Invalid Entry");
            return;
        } // End of precaution.

        const usrData = {
            email : user,
            password : pwd,
            fullName : fullName,
            location : location,
            bio : bio,
            profilePic : null,
            eventPlannerInfo : null,
            isPerformer : false,
            isEventPlanner : false,
            isInGroup : false
        };

        //check firestore database to see if document exists for user, which it would if someone signed up with that email address
        const userDocRef = doc(db, "users", user);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists())
        {
            //Declare the current user's email in the session storage
            sessionStorage.setItem('userEmail', usrData.email);

            //Navigate to the questions page
            navigate("/detailsPage", {state : {usrData}});
            window.location.reload(false); 
        }
        else
        {
            setErrMsg("Error: email address already in use.");
        }
    }
    
    return (
        <Container>
            <p ref={errRef} style={errMsg ? {} : {display: "none"}} aria-live="assertive">{errMsg}</p>
            <StyledHeader>Register</StyledHeader>
            <StyledForm onSubmit={HandleSubmit}>
            {/* <StyledForm> */}
                {/* Input for the Email field */}
                <label htmlFor="username">
                    Email: 
                    {/* Display tick if name meets validation criteria */}
                    <span style={validName ? {} : {display: "none"}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                </label>
                <StyledInput 
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" style={userFocus && user && !validName ? {} : {display: "none"}}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Only wits emails allowed. <br />
                    Must begin with a letter or number. <br />
                    Letter, numbers, special characters and dots allowed.
                </p>

                {/* Input for the Full Name field */}
                <label htmlFor="fullname">
                    Full Name: 
                    {/* Display tick based on validation criteria */}
                    <span style={validFullName ? {} : {display: "none"}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                </label>
                <StyledInput 
                    type="text"
                    id="fullname"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    aria-invalid={validFullName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setFullNameFocus(true)}
                    onBlur={() => setFullNameFocus(false)}
                />
                <p id="uidnote" style={fullNameFocus && fullName && !validFullName ? {} : {display: "none"}}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter your full name. <br />
                </p>
                

                {/* Input for the Pronouns field */}
                <label htmlFor="location">
                    Location: 
                    {/* Display tick based on validation criteria */}
                    <span style={validLocation ? {} : {display: "none"}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                </label>
                <StyledInput 
                    type="text"
                    id="location"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    aria-invalid={validLocation ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setLocationFocus(true)}
                    onBlur={() => setLocationFocus(false)}
                />
                <p id="uidnote" style={locationFocus && location && !validLocation ? {} : {display: "none"}}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter what area you operate from. <br />
                </p>

                {/* Input for the Bio field */}
                <label htmlFor="bio">
                    Bio: 
                    {/* Display tick based on validation criteria */}
                    <span style={validBio ? {} : {display: "none"}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                </label>
                <StyledInput 
                    type="text"
                    id="bio"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setBio(e.target.value)}
                    required
                    aria-invalid={validBio ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setBioFocus(true)}
                    onBlur={() => setBioFocus(false)}
                />
                <p id="uidnote" style={bioFocus && bio && !validBio ? {} : {display: "none"}}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter your bio. <br />
                    Must be 1-280 characters. <br />
                    Special characters allowed: .,-!
                </p>

                {/* Input for the Password field */}
                <label htmlFor="password">
                    Password: 
                    {/* Display Tick or Cross based on validation criteria */}
                    <span style={validPwd ? {} : {display: "none"}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                </label>
                <StyledInput 
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" style={pwdFocus && !validPwd ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    8 to 24 characters. <br />
                    Must include uppercase and lowercase letters, a number and a special character. <br />
                    Special characters allowed: 
                    <span aria-label="exclamation mark"> !</span>
                    <span aria-label="at symbol">@</span>
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>
                    <span aria-label="percent">%</span>
                </p>

                {/* Input for the Confirm Password field */}
                <label htmlFor="confirm_pwd">
                    Confirm Password: 
                </label>
                <StyledInput 
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" style={matchFocus && !validMatch ? {} : {display: "none"}}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input.
                </p>

                <StyledButton onClick={HandleSubmit}>
                    Sign Up
                </StyledButton>
            </StyledForm>

            <StyledParagraph>
                Already registered?<br />
                <span className="line">
                    {/* Link to the Sign In page if user has an account */}
                    <StyledLink href="/loginPage"><b>Sign In</b></StyledLink>
                </span>
            </StyledParagraph>
        </Container>
    )
}

export default RegistrationPage; 