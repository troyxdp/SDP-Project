import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import x_solid from "../profile-pics/x-solid.svg";

const Container = styled.div`
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #fff;
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
const StyledButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 10px;
    background: #a13333;
    padding: 15px 45px;
    color: white;
    margin-top: 10px;
`;
const AdderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
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
const TwoLineListBoxElement = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #444; 
    padding: 10px; 
    width: 475px;
    max-width: 475px;
    height: 28px;
    max-height: 28px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;

//REGEX expressions
const PERFORMER_NAME_REGEX = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9$&,+\-_ ]+$/;

const LINK_REGEX = /^(https?|ftp):\/\/([^\s/$.?#]+\.)+[^\s/$.?#]+(\/[^\s]*)?$/;

/*
    TO-DO:
    - Add error checking to see if any genres were selected
    - Add error message for repeated equipment items
    - Add functionality that allows for specification when type "Other" is selected
    - Add error message for invalid performer name being enterred
*/

export function PerformerDetailsForm({parentCallback}) {
    const typeOptions = [
        {value: "DJ", label: "DJ"},
        {value: "Vocalist", label: "Vocalist"},
        {value: "Guitarist", label: "Guitarist"},
        {value: "Bass Guitarist", label: "Bass Guitarist"},
        {value: "Drummer", label: "Drummer"},
        {value: "Pianist/Keyboardist", label: "Pianist/Keyboardist"},
        {value: "Saxophonist", label: "Saxophonist"},
        {value: "Trumpeter", label: "Trumpeter"},
        {value: "Violinist", label: "Violinist"},
        {value: "Cellist", label: "Cellist"},
        {value: "Other", label: "Other"}
    ];
    const genreOptions = [
        {value: "House", label: "House"},
        {value: "Techno", label: "Techno"},
        {value: "Trance", label: "Trance"},
        {value: "Drum 'n Bass", label: "Drum 'n Bass"},
        {value: "Amapiano", label: "Amapiano"},
        {value: "Afro Tech", label: "Afro Tech"},
        {value: "Afro House", label: "Afro House"},
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

    let callback = parentCallback;

    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }

    //useStates storing data for performer details
    const [performerName, setPerformerName] = useState("");
    const [type, setType] = useState("DJ");
    const [equipment, setEquipment] = useState([]);
    const [hourlyRate, setHourlyRate] = useState(0.0);
    const [links, setLinks] = useState([]);
    const [media, setMedia] = useState([]);

    //useStates for taking input
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [equipmentItem, setEquipmentItem] = useState("");
    const [linkToAdd, setLinkToAdd] = useState("");
    
    //useStates for stating if a component has focus
    const [performerNameFocus, setPerformerNameFocus] = useState(false);
    const [linkToAddFocus, setLinkToAddFocus] = useState(false);
    const [equipmentItemFocus, setEquipmentItemFocus] = useState(false);

    //useStates for checking if values entered in fields are valid
    const [isValidPerformerName, setIsValidPerformerName] = useState(false);
    const [isValidLinkToAdd, setIsValidLinkToAdd] = useState(false);

    //useStates for error message display
    const [isDisplayErrorMsg, setIsDisplayErrorMsg] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //useEffects to check if an enterred fields are valid
    //checks performer name
    useEffect(() => {
        const result = PERFORMER_NAME_REGEX.test(performerName);
        //console.log(result);
        //console.log(performerName);
        setIsValidPerformerName(result);
    }, [performerName])
    //checks link to add
    useEffect(() => {
        const result = LINK_REGEX.test(linkToAdd);
        //console.log(result);
        //console.log(linkToAdd);
        setIsValidLinkToAdd(result);
    }, [linkToAdd])

    //useEffect for storing list box displays of equipment items and a method for updating the useState
    const [equipmentListBoxDisplays, setEquipmentListDisplays] = useState([]);
    const createEquipmentListDisplay = async (equipment) => {
        const equipDisplays = [];
        for (let i = 0; i < equipment.length; i++)
        {
            equipDisplays.push(
                <ListBoxElement>
                    <p>{equipment[i]}</p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveEquipmentItem(i)}/>
                </ListBoxElement>
            );
        }
        setEquipmentListDisplays(equipDisplays);
    };

    //useState for storing list box displays of links and a method for updating the useState
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
    //method that is executed when form is submitted
    const handleSubmit = async (e) => {
        let genres = [];
        for (let i = 0; i < genreOptions.length; i++)
        {
            if (genresSelected[i] === true)
            {
                genres.push(genreOptions[i].label);
            }
        }

        let isSuccessfulCallback = false;
        //check to see that performer name is valid and if it is execute callback function, otherwise display error
        if (isValidPerformerName)
        {
            isSuccessfulCallback = await callback(performerName, type, genres, equipment, hourlyRate, links, media);
            e.preventDefault();
        }
        else
        {
            //DISPLAY ERROR MESSAGE

            console.log("Invalid performer name enterred!");
            console.log(performerName);
        }

        if (isSuccessfulCallback)
        {
            //reset all the fields back to empty
            setPerformerName("");
            setType("");
            setEquipment([]);
            setEquipmentItem("");
            setLinks([]);
            setLinkToAdd("");
            setGenresSelected(genresSelectedInitializer);
            setIsDisplayErrorMsg(false);
        }
        else
        {
            setIsDisplayErrorMsg(true);
            setErrMsg("Error: please add details for a type you haven't already added details for.")
        }
    }

    //methods for handling input and modification of data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
    }
    const handleAddEquipmentItem = async () => {
        console.log(equipmentItem);
        let currEquipment = equipment;
        for (let i = 0; i < equipment.length; i++)
        {
            if (equipmentItem === currEquipment[i])
            {
                setEquipmentItem("");
                //display some sort of error here
                return;
            }
        }
        currEquipment.push(equipmentItem);
        setEquipment(currEquipment);
        setEquipmentItem("");
        createEquipmentListDisplay(currEquipment);
        console.log(equipment);
    }
    const handleAddLink = async () => {
        console.log(linkToAdd);
        if (isValidLinkToAdd)
        {
            if (LINK_REGEX.test(linkToAdd) === true)
            {
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
        }
    }
    const handleRemoveEquipmentItem = async (index) => {
        const equipmentList = equipment;
        equipmentList.splice(index, 1);
        setEquipment(equipmentList);
        createEquipmentListDisplay(equipmentList);
    }
    const handleRemoveLink = async (index) => {
        const linkList = links;
        linkList.splice(index, 1);
        setLinks(linkList);
        createLinkListDisplay(linkList);
    }

    //create genre checkbox components array for rendering
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
        <Container>
            <DetailsFormDiv>
                <StyledSubheader>Create Performer Details:</StyledSubheader>
                <StyledLabel htmlFor="performerName">
                        Performer Name:
                </StyledLabel>
                <StyledInput 
                    type="text"
                    id="performerName"
                    autoComplete="off"
                    onChange={(e) => setPerformerName(e.target.value)}
                    onFocus={() => setPerformerNameFocus(true)}
                    onBlur={() => setPerformerNameFocus(false)}
                    required
                />
                <p id="uidnote" style={performerNameFocus && performerName && !isValidPerformerName ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid name entered. <br/>
                    Please enter a performer name containing at least one alphanumeric character <br/>
                    consisting of only alphanumeric characters and special characters $&,+\-_
                </p>

                <StyledLabel htmlFor="type">
                    Type of Performer:
                </StyledLabel>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {typeOptions.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>

                <StyledLabel htmlFor="genres">
                    Genres Played:
                </StyledLabel>
                <StyledCheckboxContainer>
                        {genreCheckboxes}
                </StyledCheckboxContainer>

                <StyledLabel htmlFor="equipment">
                    Equipment: 
                </StyledLabel>
                <AdderContainer>
                    <AdderInput 
                        type="text"
                        id="equipment"
                        autoComplete="off"
                        onChange={(e) => setEquipmentItem(e.target.value)}
                        value={equipmentItem}
                        onFocus={() => setEquipmentItemFocus(true)}
                        onBlur={() => setEquipmentItemFocus(false)}
                    />
                    <AdderButton onClick={handleAddEquipmentItem}>
                        Add Item
                    </AdderButton>
                </AdderContainer>
                <p id="uidnote" style={equipmentItemFocus && equipmentItem==="" ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid item entered. <br/>
                    Please enter a non-empty value.
                </p>

                <ListBox>
                    {equipmentListBoxDisplays}
                </ListBox>

                <StyledLabel htmlFor="hourlyRate">
                    Hourly Rate:
                </StyledLabel>
                <StyledInput 
                    type="number"
                    id="hourlyRate"
                    autoComplete="off"
                    min="0"
                    step=".01"
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                />

                <StyledLabel htmlFor="links">
                    Links:
                </StyledLabel>
                <AdderContainer>
                    <AdderInput
                        type="text"
                        id="links"
                        autoComplete="off"
                        onChange={(e) => setLinkToAdd(e.target.value)}
                        onFocus={() => setLinkToAddFocus(true)}
                        onBlur={() => setLinkToAddFocus(false)}
                        value={linkToAdd}
                    />
                    <AdderButton onClick={handleAddLink}>
                        Add Link
                    </AdderButton>
                </AdderContainer>
                <p id="uidnote" style={linkToAddFocus && linkToAdd && !isValidLinkToAdd ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid link entered. <br/>
                    Please enter a valid link.
                </p>
                <ListBox>
                    {linkListBoxDisplays}
                </ListBox>

                <StyledButton onClick={handleSubmit}>
                    Save Details
                </StyledButton>

                {isDisplayErrorMsg && 
                    <p>{errMsg}</p>
                }
            </DetailsFormDiv>
        </Container>
    );
}