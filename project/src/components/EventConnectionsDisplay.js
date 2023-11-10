import styled from "styled-components";

const DetailsContainer = styled.div`
    padding: 10px;
    margin-top: 8px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #444;
    border-radius: 10px;
    width: 600px;
    max-width: 600px;
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
  font-size: 1rem;
  justify-content: center;
`;
const ListBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    margin-top: 8px;
`;
const TwoLineListBoxElement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #444;
    padding: 10px;
    width: 575px;
    max-width: 575px;
    height: 70px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;
const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
`;
const StyledButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 5px;
    background: #a13333;
    padding: 7.5px 20px;
    color: white;
    margin-top: 10px;
`;

export function EventConnectionsDisplay({event}) {
    const isSlots = event.slots.length > 0;
    const email = event.creatingUserEmail;
    const eventName = event.eventName;
    const eventType = event.eventType;
    const performerDetails = event.performerDetails;
    const eventPlannerEmails = event.eventPlannerEmails;
    let startDate =  event.startDate.toDate();
    let endDate = event.endDate.toDate(); 
    const venue = event.venue; 
    const eventDescription = event.eventDescription; 
    const genres = event.genres;
    const slots = event.slots;

    let startDateString = "" + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear() + " " + startDate.getHours() + ":";
    if (startDate.getDate() < 10)
    {
        startDateString = "0" + startDateString;
    }
    if (startDate.getMinutes() < 10)
    {
        startDateString += "0" + startDate.getMinutes();
    }
    else
    {
        startDateString += startDate.getMinutes();
    }

    let endDateString = "" + endDate.getDate() + "/" + endDate.getMonth() + "/" + endDate.getFullYear() + " " + endDate.getHours() + ":";
    if (endDate.getDate() < 10)
    {
        endDateString = "0" + endDateString ;
    }
    if (startDate.getMinutes() < 10)
    {
        endDateString += "0" + endDate.getMinutes();
    }
    else
    {
        endDateString += endDate.getMinutes();
    }

    let genresString = "" + genres[0];
    for (let i = 1; i < genres.length; i++)
    {
        genresString += ", " + genres[i];
    }

    
    const slotDisplays = [];
    for (let i = 0; i < slots.length; i++)
    {
        let slotGenresString = slots[i].genres[0];
        for (let j = 1; j < slots[i].genres.length; j++)
        {
            slotGenresString += ", " + slots[i].genres[j];
        }

        const stage = slots[i].stage;

        const slotStartDate = slots[i].startDate.toDate();
        const slotEndDate = slots[i].endDate.toDate();

        let slotStartTimeString = "" + slotStartDate.getDate() + "/" + slotStartDate.getMonth() + "/" + slotStartDate.getFullYear() + " " + slotStartDate.getHours() + ":";
        if (slotStartDate.getDate() < 10)
        {
            slotStartTimeString = "0" + slotStartTimeString;
        }
        if (slotStartDate.getMinutes() < 10)
        {
            slotStartTimeString += "0" + slotStartDate.getMinutes();
        }
        else
        {
            slotStartTimeString += startDate.getMinutes();
        }

        let slotEndTimeString = "" + slotEndDate.getHours() + ":";
        if (slotEndDate.getHours() < 10)
        {
            slotEndTimeString = "0" + slotEndTimeString;
        }
        if (slotEndDate.getMinutes() < 10)
        {
            slotEndTimeString += "0";
        }
        slotEndTimeString += slotEndDate.getMinutes();

        const slotDescription = slots[i].description;

        slotDisplays.push(
            <ListBox>
                <TwoLineListBoxElement>
                    <LeftContent>
                        <p><b>{stage}</b> <br/>
                        {genresString}<br/>
                        {slotStartTimeString} - {slotEndTimeString} <br/>
                        {slotDescription}</p>
                    </LeftContent>
                    <StyledButton onClick={() => applyForSlot(i)}>Apply</StyledButton>
                </TwoLineListBoxElement>
            </ListBox>
        );
    }

    const applyForSlot = async (index) => {
        //add sending of request
    }

    const applyForEvent = async () => {
        //add sending of request
    }

    return(
        <>
            <DetailsContainer>
                <StyledHeader>{eventName}</StyledHeader>
                <DetailsBox>
                    <Detail><b>Type:</b> {eventType}</Detail>
                    <Detail><b>Genres:</b> {genresString}</Detail>
                    <Detail><b>Start Date:</b> {startDateString}</Detail>
                    <Detail><b>End Date:</b> {endDateString}</Detail>
                    <Detail><b>Venue:</b> {venue}</Detail>
                    <Detail>{eventDescription}</Detail>
                </DetailsBox>
                {!isSlots &&
                    <StyledButton onClick={() => applyForEvent()}>
                        Apply
                    </StyledButton>
                }
                {isSlots &&
                    <>
                        {slotDisplays}
                    </>
                }
            </DetailsContainer>
        </>
    );
}