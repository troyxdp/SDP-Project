import { useEffect, useState } from "react";
import styled from "styled-components";

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
const SlotDetailsFormDiv = styled.div`
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
const StyledCheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;
const StyledLabel = styled.label`
    margin-top: 5px;
    margin-bottom: 2px;
`;
const DescriptionInput = styled.input`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 500px;
    height: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    word-break: break-word;
`;


/*
    TO-DO:
    - Add error checking for start date entry
        ~ Check if start date enterred is before event start date
*/

export function SlotDetailsForm({onSubmitParentCallback, startDateInputCallback}) {
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
        {value: "Classical", label: "Classical"},
        {value: "Jazz", label: "Jazz"},
        {value: "Other", label: "Other"}
    ];

    let callback = onSubmitParentCallback;

    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }

    //useStates for inputted data
    const [startDate, setStartDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [stageDetails, setStageDetails] = useState("");
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [description, setDescription] = useState("");

    //useStates for focus tracking
    const [isStartDateFocus, setIsStartDateFocus] = useState(false);
    const [isEndDateFocus, setIsEndDateFocus] = useState(false);

    //useStates for validation
    const [isValidStartDate, setIsValidStartDate] = useState(false);
    const [isValidEndDate, setIsValidEndDate] = useState(false);

    //validate the start date enterred
    useEffect(() => {
        let currDate = new Date();
        if (startDate <= currDate)
        {
            setIsValidStartDate(false);
        }
        else
        {
            setIsValidStartDate(true);
        }
    }, [startDate])
    useEffect(() => {
        if (startDate > endTime)
        {
            setIsValidEndDate(false);
        }
        else
        {
            setIsValidEndDate(true);
        }
    }, [startDate, endTime])

    //methods to handle changing of inputted data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
    }
    const handleStartDateChange = async (e) => {
        let hours = parseInt(startDate.getHours());
        let minutes = parseInt(startDate.getMinutes());
        let date = new Date(e.target.value);
        if (startDateInputCallback(date) === true)
        {
            date.setHours(hours, minutes);
            setIsValidStartDate(true)
            setStartDate(date); 
        }
        else
        {
            setIsValidStartDate(false);
        }     
    }
    const handleStartTimeEntry = async (e) => {
        let date = new Date(startDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        date.setHours(hours, minutes);
        setStartDate(date);
    }
    const handleEndTimeEntry = async (e) => {
        //get start time
        let startHours = startDate.getHours();
        let startMinutes = startDate.getMinutes();
        
        //check if end time is on the next day
        let endDate = new Date(startDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        if (hours < startHours || (hours === startHours && minutes < startMinutes))
        {
            endDate.setDate(startDate.getDate() + 1);
        }
        endDate.setHours(hours, minutes);
        setEndTime(endDate);
    }

    //method to handle submission of form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isValidStartDate)
        {
            const genres = [];
            for (let i = 0; i < genresSelected.length; i++)
            {
                if (genresSelected[i] === true)
                {
                    genres.push(genreOptions[i].label);
                }
            }

            callback(startDate, endTime, stageDetails, genres, description);

            setStartDate(new Date());
            setEndTime(new Date());
            setStageDetails("");
            setGenresSelected(genresSelectedInitializer);
            setDescription("");
        }
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
            <SlotDetailsFormDiv>
            <StyledLabel htmlFor="startDate">
                    Start Date:
                </StyledLabel>
                <StyledInput
                    type="date"
                    id="slotStartDate"
                    autoComplete="off"
                    onChange={handleStartDateChange}
                    min={new Date()}
                    onFocus={(e) => setIsStartDateFocus(true)}
                    onBlur={(e) => setIsStartDateFocus(false)}
                    required
                />
                <p id="uidnote" style={isStartDateFocus && startDate && !isValidStartDate ? {} : {display: "none"}}>
                    {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                    Error: Invalid start date entered. <br/>
                    Please enter a start date from today onwards.
                </p>

                <StyledLabel htmlFor="startTime">
                    Start Time:
                </StyledLabel>
                <StyledInput
                    type="time"
                    id="startTime"
                    autoComplete="off"
                    defaultValue="12:00"
                    onChange={handleStartTimeEntry}
                />

                <StyledLabel htmlFor="endTime">
                    End Time:
                </StyledLabel>
                <StyledInput
                    type="time"
                    id="endTime"
                    autoComplete="off"
                    defaultValue="13:00"
                    onChange={handleEndTimeEntry}
                />

                <StyledLabel htmlFor="stage">
                    Stage Details: 
                </StyledLabel>
                <StyledInput 
                    type="text"
                    id="stageDetails"
                    autoComplete="off"
                    onChange={(e) => setStageDetails(e.target.value)}
                    required
                />

                <StyledLabel htmlFor="genres">
                    Genres To Play:
                </StyledLabel>
                <StyledCheckboxContainer>
                    {genreCheckboxes}
                </StyledCheckboxContainer>

                <StyledLabel htmlFor="description">
                    Description:
                </StyledLabel>
                <DescriptionInput
                    type="text"
                    id="slotDescription"
                    autoComplete="off"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <StyledButton onClick={handleSubmit}>
                    Add Slot
                </StyledButton>
            </SlotDetailsFormDiv>
        </Container>
    )
}