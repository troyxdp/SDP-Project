import styled from "styled-components";

const EventPlannerDetailsContainer = styled.div`
    padding: 5px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #333;
    border-radius: 5px;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 0px;
`;
const StyledLabel = styled.label`
    font-size: 0.9rem;
    margin-bottom: 8px;
    font-weight: bold;
`;
const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Detail = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 0.8rem;
  justify-content: center;
`;
const LinkBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-bottom: 8px;
`;
const StyledLink = styled.text`
  font-size: 0.8rem;
  color: #0000ff;
`;

/*
    TO-DO:
    - Add display of links to pastEvents and upcomingEvents details pages
    - Add display of media of the event planner
*/
export function EventPlannerDetailsProfileOverview({email, types, pastEvents, upcomingEvents, links, media}){
    //write the types of events hosted by the user out as a string for display using types array passed as a prop
    let eventTypes = [];
    for (let i = 0; i < types.length; i++)
    {
        eventTypes.push(
            <Detail>{types[i]}</Detail>
        )
    }
    
    //create Link components using the links array passed as a prop
    const LinkDisplays = [];
    for (let i = 0; i < links.length; i++)
    {
      LinkDisplays.push(
        <StyledLink>{links[i]}</StyledLink>
      );
    }

    return(
        <EventPlannerDetailsContainer>
            <DetailsBox>
                <StyledLabel><b>Types of Events Planned:</b></StyledLabel>
                {eventTypes}
                <StyledLabel></StyledLabel>
                {/* Add pastEvents display links here */}
                {/* Add upcomingEvents display links here */}
                <StyledLabel><b>Links:</b></StyledLabel>
                <LinkBox>
                    {LinkDisplays}
                </LinkBox>
            </DetailsBox>
        </EventPlannerDetailsContainer>
    );
}