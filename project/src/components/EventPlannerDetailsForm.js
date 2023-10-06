import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #fff;
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
const StyledButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 45px;
    color: white;
    margin-top: 10px;
`;
const AdderButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 45px;
    color: white;
`;
const StyledCheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;
const AdderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
    margin-bottom: 2px;
`;

export function EventPlannerDetailsForm({parentCallback}) {
    const eventTypeOptions = [
        {value : "eventParty", label : "Event Party"},
        {value : "festival", label : "Festival"},
        {value : "rave", label : "Rave"},
        {value : "clubSlot", label : "Club Slot"},
        {value : "barSlot", label : "Bar Slot"},
        {value : "residency", label : "Residency Opportunity"},
        {value : "houseParty", label : "House Party"},
        {value : "birthdayParty", label : "Birthday Party"},
        {value : "wedding", label : "Wedding"},
        {value : "ball", label : "Ball"},
        {value : "other", label : "Other"}
    ];

    let callback = parentCallback;

    const eventTypesSelectedInitializer = [];
    for (let i = 0; i < eventTypeOptions.length; i++)
    {
        eventTypesSelectedInitializer.push(false);
    }

    const [eventTypesSelected, setEventTypesSelected] = useState(eventTypesSelectedInitializer);
    const [links, setLinks] = useState([]);
    const [linkToAdd, setLinkToAdd] = useState("");

    const handleTypeSelectedChange = (index) => {
        const currTypesSelected = eventTypesSelected;
        currTypesSelected[index] = !currTypesSelected[index];
        setEventTypesSelected(currTypesSelected);
    }
    const handleAddLink = async () => {
        console.log(linkToAdd);
        let currLinks = links;
        for (let i = 0; i < links.length; i++)
        {
            if (linkToAdd === links[i])
            {
                setLinkToAdd("");
                //display some sort of error message
                return;
            }
        }
        currLinks.push(linkToAdd);
        setLinks(currLinks);
        setLinkToAdd("");
        console.log(links);
    }

    const handleSubmit = async (e) => {
        let eventTypes = [];
        for (let i = 0; i < eventTypeOptions.length; i++)
        {
            if (eventTypesSelected[i] === true)
            {
                eventTypes.push(eventTypeOptions[i].label);
            }
        }

        callback(eventTypes, links);

        setEventTypesSelected(eventTypesSelectedInitializer);
        setLinks([]);
        setLinkToAdd("");

        e.preventDefault();
    }

    const plannerTypeCheckboxes = [];
    for (let i = 0; i < eventTypeOptions.length; i++)
    {
        plannerTypeCheckboxes.push(
            <StyledLabel>
                <input
                    type="checkbox"
                    value={eventTypeOptions[i]}
                    onChange={() => handleTypeSelectedChange(i)}
                />
                {eventTypeOptions[i].label}
            </StyledLabel>
        );
    }

    return(
        <Container>
            <DetailsFormDiv>
                <StyledLabel htmlFor="genres">
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
                        onChange={(e) => setLinkToAdd(e.target.value)}
                        value={linkToAdd}
                    />
                    <AdderButton onClick={handleAddLink}>
                        Add Link
                    </AdderButton>
                </AdderContainer>
                <StyledButton onClick={handleSubmit}>
                    Save Details
                </StyledButton>
            </DetailsFormDiv>
        </Container>
    );
}