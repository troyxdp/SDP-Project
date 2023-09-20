import { useState, useRef, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import styled from "styled-components";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";

const Container = styled.div`
    padding: 200px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
    margin-top: 10px;
`;

const StyledHeader = styled.h1`
    padding: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 0px;
`;

const StyledLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #a13333;
`;

const StyledErrorMessage = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-left: 7px;
    margin-right: 7px;
    color: #FF3333;
`;

const StyledForm = styled.form`

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

// const StyledRegistrationMessage = styled.a`
//     display: flex;
//     align-items: center;
//     justify-content: center;
// `;

const LoginPage = () => {
    const emailRef = useRef();
    const errRef = useRef();
    
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errMsg, setErrMsg] = useState(''); 
    
    const [isIncorrectDetails, setIsIncorrectDetails] = useState(false);

    //writes submitted email and password to console, redirects to questions page on successful login
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, pass);
        try {
            await signInWithEmailAndPassword(getAuth(),email,pass);
            setIsIncorrectDetails(false);
        } catch(err) {
            //alert("ERROR: Incorrect Password Enterred!");
            setIsIncorrectDetails(true);
        }
        //add comparison between submitted email and password and stored password;

        // if(getAuth().currentUser!=null && !isIncorrectDetails){
        if (true) { //SET TO TRUE FOR NOW SO THAT I CAN TEST NAVIGATION BETWEEN PAGES
            sessionStorage.setItem('userEmail', email);
            setIsIncorrectDetails(false);
            navigate("/profilePage", {state : email});
            window.location.reload(false);
        }
        setEmail('');
        setPass('');
    }

    //for setting error message
    useEffect(() => {
        setErrMsg('');
    }, [email, pass])

        return <Container>
            <p ref={errRef} style={errMsg ? {} : {display: "none"}} aria-live="assertive">{errMsg}</p> 

            {/* <img style = {{ width : 90, height: 90 }}src = {logo} alt = "logo" />     <--- THIS IS WHERE WE PUT OUR LOGO */}

            <StyledHeader>Login</StyledHeader>

            <StyledForm onSubmit={handleSubmit}>
                <StyledInput
                    value = { email }
                    placeholder="email"
                    type='email'
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    textAlign = 'center'
                    />
                <StyledInput
                    value = { pass }
                    placeholder="password"
                    type='password'
                    id="pass"
                    onChange={(e) => setPass(e.target.value)}
                    required
                    />
                <StyledErrorMessage id="uidnote" style={isIncorrectDetails ? {} : {display: "none"}}>
                    Incorrect email or password. <br />
                    Please enter your correct credentials.
                </StyledErrorMessage>
                <StyledButton type = 'submit'>Log In</StyledButton>
            </StyledForm>

            <StyledParagraph>
                Don't have an account?<br/>
                <span className="line">
                    <StyledLink href="/registrationPage"><b>Sign Up</b></StyledLink>
                </span>
            </StyledParagraph>

        </Container>;
}

export default LoginPage;