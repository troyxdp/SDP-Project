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
const DescriptionInput = styled.textarea`
    display: flex;
    background: #e4e4e4;
    border-radius: 10px;
    border: 0;
    width: 500px;
    height: 250px;
    box-sizing: border-box;
    padding: 15px 0 15px 10px;
    word-break: break-word;
    font-family: "Roboto", Roboto, sans-serif;
`;


/*
    TO-DO:
    - Add listing of event planners to send invites to where you can remove by clicking an X icon
    - Add error checking to ensure description IS entered and genre is selected
*/

export function SlotDetailsForm({onSubmitParentCallback, stages, slots}) {
    //set all of the options for type of event, genres played, and stages
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
    const stageOptions = [];
    for (let i = 0; i < stages.length; i++)
    {
        stageOptions.push(
            {value : stages[i], label : stages[i]}
        );
    }
    if (stageOptions.length === 0)
    {
        stageOptions.push(
            {value : "Main Stage", label : "Main Stage"}
        );
    }

    let callback = onSubmitParentCallback;

    const genresSelectedInitializer = [];
    for (let i = 0; i < genreOptions.length; i++)
    {
        genresSelectedInitializer.push(false);
    }

    //useStates for inputted data
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [stage, setStage] = useState(stages[0]);
    const [genresSelected, setGenresSelected] = useState(genresSelectedInitializer);
    const [description, setDescription] = useState("");

    //useStates for focus tracking
    const [isStartDateFocus, setIsStartDateFocus] = useState(false);
    const [isEndDateFocus, setIsEndDateFocus] = useState(false);

    //useStates for validation
    const [isValidStartDate, setIsValidStartDate] = useState(false);
    const [isValidEndDate, setIsValidEndDate] = useState(false);
    const [isConflictingTimes, setIsConflictingTimes] = useState(false);

    //useStates for error messages
    const [errMsg, setErrMsg] = useState("");

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
        if (startDate > endDate)
        {
            setIsValidEndDate(false);
        }
        else
        {
            setIsValidEndDate(true);
        }
    }, [startDate, endDate])

    //methods to handle changing of inputted data
    const handleGenreSelectedChange = async (index) => {
        let currGenresSelected = genresSelected;
        currGenresSelected[index] = !currGenresSelected[index];
        setGenresSelected(currGenresSelected);
    }
    const handleStartDateChange = async (e) => {
        let hours = parseInt(startDate.getHours());
        let minutes = parseInt(startDate.getMinutes());
        const date = new Date(e.target.valueAsDate);
        date.setHours(hours, minutes, 0);
        setIsValidStartDate(true)
        setStartDate(date); 
    }
    const handleStartTimeEntry = async (e) => {
        const date = new Date();
        date.setTime(startDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        date.setHours(hours, minutes, 0);
        setStartDate(date);
        setIsValidStartDate(true);
    }
    const handleEndTimeEntry = async (e) => {
        //get start time
        let startHours = startDate.getHours();
        let startMinutes = startDate.getMinutes();
        
        //check if end time is on the next day
        let date = new Date();
        date.setTime(startDate);
        let time = e.target.value;
        let hours = parseInt(time.substring(0, 2));
        let minutes = parseInt(time.substring(3, 5));
        //this if statement ensures endDate is always after start date
        if (hours < startHours || (hours === startHours && minutes <= startMinutes))
        {
            date.setDate(startDate.getDate() + 1);
        }
        date.setHours(hours, minutes, 0);
        setEndDate(date);
    }

    //method to handle submission of form
    const handleSubmit = async (e) => {
        e.preventDefault();

        //check for conflicting times between slots
        for (let i = 0; i < slots.length; i++)
        {
            if (slots[i].stage === stage)
            {
                if (slots[i].startDate < startDate && slots[i].endDate > startDate)
                {
                    setIsConflictingTimes(true);
                    setErrMsg("Error: this slot starts during another slot.")
                    return;
                }
                if (slots[i].startDate > startDate && slots[i].startDate < endDate)
                {
                    setIsConflictingTimes(true);
                    setErrMsg("Error: another slot starts during this slot's time.")
                    return;
                }
            }
        }

        setIsConflictingTimes(false);
        setErrMsg("");

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

            callback(startDate, endDate, stage, genres, description);

            setStartDate(new Date());
            setEndDate(new Date());
            setStage("");
            setGenresSelected(genresSelectedInitializer);
            setDescription("");
        }
        else
        {
            setErrMsg("Error: invalid start date entered.")
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
                <StyledLabel htmlFor="stage">
                    Stage:
                </StyledLabel>
                <select value={stage} onChange={(e) => setStage(e.target.value)} style={{width: "250px", marginBottom: "10px"}}>
                    {stageOptions.map((option) => (
                        <option value={option.value} style={{width: "250px"}}>{option.label}</option>
                    ))}
                </select>

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
                <p id="uidnote" style={isConflictingTimes || !isValidStartDate ? {} : {display: "none"}}>
                    {errMsg}
                </p>
            </SlotDetailsFormDiv>
        </Container>
    )
}