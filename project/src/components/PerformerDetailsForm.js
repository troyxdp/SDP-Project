import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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

//REGEX expressions
const PERFORMER_NAME_REGEX = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9$&,+\-_]+$/;

/*
    TO-DO:
    - Add error checking to see if any genres were selected
    - Add error message for repeated equipment items
    - 
*/

export function PerformerDetailsForm({parentCallback}) {
    const typeOptions = [
        {value: "DJ", label: "DJ"},
        {value: "Vocalist", label: "Vocalist"},
        {value: "Guitarist", label: "Guitarist"},
        {value: "BassGuitarist", label: "Bass Guitarist"},
        {value: "Drummer", label: "Drummer"},
        {value: "Pianist", label: "Pianist/Keyboardist"},
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
        {value: "Other", label: "Other"}
    ];

    let callback = parentCallback;

    const genreSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genreSelectedInitializer.push(false);
    }

    const [performerName, setPerformerName] = useState("");
    const [isValidPerformerName, setIsValidPerformerName] = useState(true);
    const [genresSelected, setGenresSelected] = useState(genreSelectedInitializer);

    const [type, setType] = useState("");
    const [genres, setGenres] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [equipmentItem, setEquipmentItem] = useState("");
    const [hourlyRate, setHourlyRate] = useState(0.0);
    const [links, setLinks] = useState([]);
    const [linkToAdd, setLinkToAdd] = useState("");
    const [media, setMedia] = useState([]);

    //use effect to check if an enterred performer name is valid
    useEffect(() => {
        const result = PERFORMER_NAME_REGEX.test(performerName);
        console.log(result);
        console.log(performerName);
        setIsValidPerformerName(result);
    }, [performerName])

    //method that is executed when form is submitted
    const handleSubmit = async (e) => {
        let currGenres = [];
        for (let i = 0; i < genreOptions.length; i++)
        {
            if (genresSelected[i] === true)
            {
                currGenres.push(genreOptions[i]);
            }
        }
        setGenres(currGenres);
        
        callback(performerName, type, genres, equipment, hourlyRate, links, media);
        e.preventDefault();
    }

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
        console.log(equipment);
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
                <StyledLabel htmlFor="performerName">
                        Performer Name:
                </StyledLabel>
                <StyledInput 
                    type="text"
                    id="performerName"
                    autoComplete="off"
                    onChange={(e) => setPerformerName(e.target.value)}
                    required
                />

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
                    />
                    <AdderButton onClick={handleAddEquipmentItem}>
                        Add Item
                    </AdderButton>
                </AdderContainer>

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