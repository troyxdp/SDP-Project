import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dummy_profile_pic from "../profile-pics/dummy-profile-pic.jpg";
import no_profile_pic from "../profile-pics/no-profile-pic-image.jpg";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
`;

const HorizontalPanel = styled.div`

`;

const TopPanel = styled.div`
  padding: 16px;
  height: auto;
`;

const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const Name = styled.h2`
  font-size: 1.2rem;
  color: #a13333;
  margin-top: 8px;
  margin-bottom: 0px;
`;

const Detail = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 0.8rem;
`;

const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const BottomPanel = styled.div`
  border-top: 1px solid #333;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const TabsButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 0px solid #fff;
  border-radius: 10px;
  background: #a13333;
  padding: 15px 30px;
  color: white;
  margin-left: 12px;
`;

const VerticalPanel = styled.div`
  background-color: #32a6a6;
  padding: 20px;
`;

const ProfilePage = () => {
    let navigate = useNavigate();

    //variable to be used to determine what to display for profile picture
    let isProfilePic = false;
    //let isProfilePic = true; //used to allow display of dummy profile pic during early stages of project

    //dummy data - to be replaced by actual data from the firestore database
    let artistName = "Algorhythmic";
    let fullName = "Troy du Plooy";
    let bio = "Aspiring DJ from Johannesburg, South Africa.";
    let email = "troydp7@gmail.com";
    let location = "Randburg";

    //array of buttons displayed in the tab section - will be added conditionally to array once basics have been implemented
    const tabButtons = [<TabsButton>Performer Details</TabsButton>, <TabsButton>Group Details</TabsButton>, <TabsButton>Event Planner Details</TabsButton>];

    //empty profile pic and dummy profile pic - to be replaced by 
    let profilePic = [<img style={{ width : 135, height: 135, borderRadius: 135 }} src={no_profile_pic} alt="Profile" />];
    if (isProfilePic)
    {
      profilePic = [<img style={{ width : 135, height: 135, borderRadius: 135 }} src={dummy_profile_pic} alt="dummy profile pic" />];
    }

    return (
      <Container>
        <HorizontalPanel>
          <TopPanel background-color = "#f2f2f2">
            <StyledHeader>Profile Page</StyledHeader>
            {profilePic}
            <Name>{fullName}</Name>
            <Name>"{artistName}"</Name>
            <DetailsBox>
              <Detail><b>Email:</b> {email}</Detail>
              <Detail><b>Location:</b> {location}</Detail>
              <Detail>{bio}</Detail>
            </DetailsBox>
          </TopPanel>
          <BottomPanel>
            <Tabs>
              {tabButtons}
            </Tabs>
          </BottomPanel>
        </HorizontalPanel>
        <VerticalPanel>
          <StyledHeader>Reviews:</StyledHeader>
        </VerticalPanel>
      </Container>
    );
}

export default ProfilePage;