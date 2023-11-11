import { useState } from "react";
import x_solid from "../profile-pics/x-solid.svg";
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
const StyledSubheader = styled.h2`
  font-size: 1.5rem;
  margin-top: 8px;
  margin-bottom: 0px;
  font-weight: bold; 
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
const ListBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    margin-bottom: 8px;
`;
const ListBoxElement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #444; 
    padding: 10px; 
    width: 375px;
    max-width: 375px;
    height: 12px;
    max-height: 12px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;

/*
    TO-DO:
    - Add verification of links entered using the link regex from performer details form
*/

export function EventPlannerDetailsForm({parentCallback}) {
    const eventTypeOptions = [
        {value : "Event Party", label : "Event Party"},
        {value : "Festival", label : "Festival"},
        {value : "Rave", label : "Rave"},
        {value : "Club Slot", label : "Club Slot"},
        {value : "Bar Slot", label : "Bar Slot"},
        {value : "Residency Opportunity", label : "Residency Opportunity"},
        {value : "House Party", label : "House Party"},
        {value : "Birthday Party", label : "Birthday Party"},
        {value : "Wedding", label : "Wedding"},
        {value : "Ball", label : "Ball"},
        {value : "Other", label : "Other"}
    ];

    let callback = parentCallback;

    const eventTypesSelectedInitializer = [];
    for (let i = 0; i < eventTypeOptions.length; i++)
    {
        eventTypesSelectedInitializer.push(false);
    }

    //useStates for storing data
    const [eventTypesSelected, setEventTypesSelected] = useState(eventTypesSelectedInitializer);
    const [links, setLinks] = useState([]);
    const [linkToAdd, setLinkToAdd] = useState("");

    //useState for storing list box displays of links
    const [linkListBoxDisplays, setLinkListBoxDisplays] = useState([]);
    const createLinkListDisplay = async (links) => {
        const linkDisplays = [];
        for (let i = 0; i < links.length; i++)
        {
            linkDisplays.push(
                <ListBoxElement>
                    <a href={links[i]}>{links[i]}</a>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveLink(i)}/>
                </ListBoxElement>
            );
        }
        setLinkListBoxDisplays(linkDisplays);
    }

    //handle changes in inputted data
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
        createLinkListDisplay(currLinks);
        console.log(links);
    }
    const handleRemoveLink = async (index) => {
        const linkList = links;
        linkList.splice(index, 1);
        setLinks(linkList);
        createLinkListDisplay(linkList);
    }

    //method for handling submission of form data
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
            <StyledSubheader>Create Event Planner Details:</StyledSubheader>
                <StyledLabel htmlFor="eventTypes">
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
                <ListBox>
                    {linkListBoxDisplays}
                </ListBox>

                <StyledButton onClick={handleSubmit}>
                    Save Details
                </StyledButton>
            </DetailsFormDiv>
        </Container>
    );
}