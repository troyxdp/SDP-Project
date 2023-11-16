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
const DetailsContainer = styled.div`
  padding: 0px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 0px;
`;
const StyledLabel = styled.label`
    font-size: 0.9rem;
    margin-bottom: 1px;
    font-weight: bold;
`;
const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Detail = styled.text`
  padding: 0px;
  margin-bottom: 0px;
  font-size: 0.8rem;
  justify-content: center;
`;
const StyledLink = styled.a`
  font-size: 0.8rem;
  color: #0000ff;
`;

/*
    TO-DO:
    - Add display of links to pastEvents and upcomingEvents details pages
    - Add display of media of the event planner
*/
export function EventPlannerDetailsProfileOverview({types, pastEvents, upcomingEvents, links, media}){
    //write the types of events hosted by the user out as a string for display using types array passed as a prop
    let eventTypes = [];
    for (let i = 0; i < types.length; i++)
    {
        eventTypes.push(
            <Detail>{types[i]}</Detail>
        )
    }

    let pastEventNames = [];
    for (let i = 0; i < pastEvents.length; i++)
    {
      let pastEventName = pastEvents[i].eventName;
      let isAlreadyListed = false;
      for (let j = 0; j < pastEventNames.length; j++)
      {
        if (pastEventName === pastEventNames[j])
        {
          isAlreadyListed = true;
          break;
        }
      }
      if (!isAlreadyListed & pastEventNames.length < 5)
      {
        pastEventNames.push(
          <Detail>{pastEventName}</Detail>
        );
      }
    }

    let upcomingEventNames = [];
    for (let i = 0; i < upcomingEvents.length; i++)
    {
      let upcomingEventName = upcomingEvents[i].eventName;
      let isAlreadyListed = false;
      for (let j = 0; j < upcomingEventNames.length; j++)
      {
        if (upcomingEventName === upcomingEventNames[j])
        {
          isAlreadyListed = true;
          break;
        }
      }
      if (!isAlreadyListed & upcomingEventNames.length < 5)
      {
        upcomingEventNames.push(
          <Detail>{upcomingEventName}</Detail>
        );
      }
    }
    
    //create Link components using the links array passed as a prop
    const LinkDisplays = [];
    for (let i = 0; i < links.length; i++)
    {
      LinkDisplays.push(
        <StyledLink href={links[i]}>{links[i]}</StyledLink>
      );
    }

    return(
        <EventPlannerDetailsContainer>
            <DetailsBox>
                <StyledLabel>Types of Events Planned:</StyledLabel>
                <DetailsContainer>
                    {eventTypes}
                </DetailsContainer>
                <StyledLabel>Past Events:</StyledLabel>
                <DetailsContainer>
                  {pastEventNames}
                </DetailsContainer>
                <StyledLabel>Upcoming Events:</StyledLabel>
                <DetailsContainer>
                  {upcomingEventNames}
                </DetailsContainer>
                <StyledLabel>Links:</StyledLabel>
                <DetailsContainer>
                    {LinkDisplays}
                </DetailsContainer>
            </DetailsBox>
        </EventPlannerDetailsContainer>
    );
}