import styled from "styled-components";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, updateDoc, and  } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config/firebase';

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
  font-size: 1.2rem;
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
const InviteButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 5px;
    background: #a13333;
    padding: 7.5px 20px;
    color: white;
    margin-top: 10px;
    margin-right: 10px;
    width: 80px;
    max-width: 80px;
`;
const LinkBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-bottom: 8px;
`;
const StyledLink = styled.a`
  font-size: 0.8rem;
  color: #0000ff;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-bottom: 10px;
`;

/*
    TO-DO:
    - Implement toHavePerform request display and acceptance
*/
export function RequestDisplay({request, requestID, requestIndex, callback}) {
    //request types: friend, host, toPerform, toHavePerform, slot
    const requestType = request.requestType;
    const requestingEmail = request.requestingUserEmail;
    const userEmail = sessionStorage.getItem("userEmail");

    const upcomingEventInitializer = {
        creatingUserEmail: requestingEmail, 
        eventName: "", 
        eventType: "",
        performerDetails: [],
        eventPlannerEmails: [requestingEmail], 
        startDate: "",
        endDate: "", 
        venue: "", 
        eventDescription: "", 
        genres: [],
        slots: []
    };

    const performerDetailsInitializer = {
        userEmail : requestingEmail,
        name : "",
        type : "",
        genres : [],
        equipment : [],
        hourlyRate : 0,
        links : [],
        media : []
    }; 

    //useStates for storing profile data
    const [userDisplayName, setUserDisplayName] = useState("");
    const [requestorDisplayName, setRequestorDisplayName] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    //useEffect for fetching profile data of the requestor
    useEffect(() => {
        const getRequestorData = async () => {
            if (!isLoaded)
            {
                //get profile details of requestor
                const requestorDocRef = doc(db, "users", requestingEmail);
                const requestorSnapshot = await getDoc(requestorDocRef);
                const currRequestorDisplayName = requestorSnapshot.data().displayName;
                setRequestorDisplayName(currRequestorDisplayName);

                //get profile details of user
                const personalDocRef = doc(db, "users", userEmail);
                const personalDocSnapshot = await getDoc(personalDocRef);
                const currUserDisplayName = personalDocSnapshot.data().displayName;
                setUserDisplayName(currUserDisplayName);

                setIsLoaded(true);
            }
        };
        getRequestorData();
    }, [requestingEmail])

    
    const generateTimeString = (date) => {
        let timeString = "" + date.getHours();
        if (date.getHours() < 10)
        {
            timeString = "0" + timeString;
        }
        timeString += ":";
        if (date.getMinutes() < 10)
        {
            timeString += "0";
        }
        timeString += date.getMinutes();
        return timeString;
    }
    const generateDateString = (date) => {
        let dateString = "" + date.getDate();
        if (date.getDate() < 10)
        {
            dateString = "0" + dateString;
        }
        dateString += "/";
        if (date.getMonth() < 10)
        {
            dateString += "0";
        }
        dateString += date.getMonth() + "/" + date.getFullYear();
        dateString += " " + generateTimeString(date);
        return dateString;
    }
    
    //useEffect for rejecting a request
    const rejectRequest = async () => {
        await deleteDoc(db, "users", userEmail, "requests", requestID);
    }

    //method to navigate to profile page of requestor
    let navigate = useNavigate();
    const goToRequestorProfilePage = async () => {
        navigate("/profilePage", {state : requestingEmail});
    }

    if (requestType === "friend") //sent from profile page
    {
        //methods for accepting and rejecting friend requests
        const acceptFriendRequest = async () => {
            //add user to friend list
            const friendsRef = doc(db, "users", userEmail, "friends", requestingEmail);
            await setDoc(friendsRef, {email : requestingEmail});
            const newFriendRef = doc(db, "users", requestingEmail, "friends", userEmail);
            await setDoc(newFriendRef, {email : userEmail});
            await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

            //send notification to user that their friend request has been accepted
            const notification = {
                text : ("Your friend request to " + userDisplayName + " has been accepted."),
                time : new Date()
            }
            const notificationsRef = collection(db, "users", requestingEmail, "notifications");
            await addDoc(notificationsRef, notification);

            //do callback
            callback(requestIndex);
        }

        return(
            <DetailsContainer>
                <StyledHeader>Friend Request:</StyledHeader>
                <DetailsBox>
                    <Detail onClick={goToRequestorProfilePage}><b>From:</b> {requestorDisplayName}</Detail>
                    <Detail><b>Email:</b> {requestingEmail}</Detail>
                </DetailsBox>
                <Tabs>
                    <InviteButton onClick={acceptFriendRequest}>Accept</InviteButton>
                    <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                </Tabs>
            </DetailsContainer>
        );
    }
    else if (requestType === "host") //sent from CreateEvent page
    {
        //get basic event data
        const event = request.event;
        const eventName = event.eventName;
        const eventType = event.eventType;
        const startDate =  event.startDate.toDate();
        const endDate = event.endDate.toDate(); 
        const venue = event.venue; 
        const eventDescription = event.eventDescription; 
        const genres = event.genres;

        //create string for start date
        let startDateString = generateDateString(startDate);
        //create string for end date
        let endDateString = generateDateString(endDate);
        //create string for genres
        let genresString = "" + genres[0];
        for (let i = 1; i < genres.length; i++)
        {
            genresString += ", " + genres[i];
        }

        const acceptHostRequest = async () => {
            const currOtherHostEmails = event.eventPlannerEmails;
            currOtherHostEmails.push(userEmail);

            //get doc ID of event
            const upcomingEventsRef = collection(db, "upcomingEvents");
            const q = query(upcomingEventsRef, and(where("eventName", "==", eventName),
                                                   where("creatingUserEmail", "==", requestingEmail)
                                                   ));
            const upcomingEventsQuerySnapshot = await getDocs(q);
            let eventID;
            upcomingEventsQuerySnapshot.forEach((doc) => {
                eventID = doc.id;
            });

            //update the event
            const upcomingEventDocRef = doc(db, "upcomingEvents", eventID);
            await updateDoc(upcomingEventDocRef, {
                eventPlannerEmails : currOtherHostEmails
            });

            //delete request
            await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

            //send notification
            const notification = {
                text : ("Your request to " + userDisplayName + " to co-host their event named " + eventName + " has been accepted."),
                time : new Date()
            };
            const notificationsRef = collection(db, "users", requestingEmail, "notifications");
            await addDoc(notificationsRef, notification);

            //do callback
            callback(requestIndex);
        }

        return(
            <DetailsContainer>
                <StyledHeader>Host Request:</StyledHeader>
                <DetailsBox>
                    <Detail onClick={goToRequestorProfilePage}><b>From:</b> {requestorDisplayName}</Detail>
                    <Detail><b>Email:</b> {requestingEmail}<br/></Detail>
                    <Detail><b>Event Name:</b> {eventName}</Detail>
                    <Detail><b>Type:</b> {eventType}</Detail>
                    <Detail><b>Genres:</b> {genresString}</Detail>
                    <Detail><b>Start Date:</b> {startDateString}</Detail>
                    <Detail><b>End Date:</b> {endDateString}</Detail>
                    <Detail><b>Venue:</b> {venue}</Detail>
                    <Detail>{eventDescription}</Detail>
                </DetailsBox>
                <Tabs>
                    <InviteButton onClick={acceptHostRequest}>Accept</InviteButton>
                    <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                </Tabs>
            </DetailsContainer>
        );
    }
    else if (requestType === "toPerform") //sent from EventConnectionsDisplay component
    {
        const performer = request.performer;
        const name = performer.name;
        const type = performer.type;
        const genres = performer.genres;
        const equipment = performer.equipment;
        const hourlyRate = performer.hourlyRate;
        const links = performer.links;

        const event = request.event;

        //generate strings for display of genres and equipment
        let genresString = "" + genres[0];
        for (let i = 1; i < genres.length; i++)
        {
            genresString += ", " + genres[i];
        }
        let equipmentString = "" + equipment[0];
        for (let i = 1; i < equipment.length; i++)
        {
            equipmentString += ", " + equipment[i];
        }
        //generate link displays
        const linkDisplays = [];
        for (let i = 0; i < links.length; i++)
        {
            linkDisplays.push(
                <StyledLink href={links[i]}>{links[i]}</StyledLink>
            );
        }

        const acceptToPerformRequest = async () => {
            //update array of performer details in event
            const currEventPerformerDetails = event.performerDetails;
            const userPerformerDetails = {
                email : requestingEmail,
                type : type
            };
            currEventPerformerDetails.push(userPerformerDetails);

            //get id of event
            const upcomingEventsRef = collection(db, "upcomingEvents");
            const q = query(upcomingEventsRef, and(where("eventName", "==", event.eventName),
                                                   where("creatingUserEmail", "==", userEmail)
                                                   ));
            const upcomingEventsSnapshot = await getDocs(q);
            let eventID;
            upcomingEventsSnapshot.forEach((doc) => {
                eventID = doc.id;
            });

            //delete request
            await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

            const upcomingEventDocRef = doc(db, "upcomingEvents", eventID);
            await updateDoc(upcomingEventDocRef, {
                performerDetails : currEventPerformerDetails
            });

            //send notification
            const notification = {
                text : ("Your request to " + userDisplayName + " to play at their event named " + event.eventName + " has been accepted."),
                time : new Date()
            };
            const notificationsRef = collection(db, "users", requestingEmail, "notifications");
            await addDoc(notificationsRef, notification);

            //do callback
            callback(requestIndex);
        }

        return(
            <DetailsContainer>
                <StyledHeader>Request to Perform At Your Event:</StyledHeader>
                <DetailsBox>
                    <Detail onClick={goToRequestorProfilePage}><b>Full Name:</b> {requestorDisplayName}, a.k.a. <b>"{name}"</b></Detail>
                    <Detail><b>Email:</b> {requestingEmail}</Detail>
                    <Detail><b>Type:</b> {type}</Detail>
                    <Detail><b>Genres:</b> {genresString}</Detail>
                    <Detail><b>Hourly Rate:</b> {hourlyRate}</Detail>
                    <Detail><b>Equipment:</b> {equipmentString}</Detail>
                    <Detail><b>Links:</b></Detail>
                    <LinkBox>
                        {linkDisplays}
                    </LinkBox>
                </DetailsBox>
                <Tabs>
                    <InviteButton onClick={acceptToPerformRequest}>Accept</InviteButton>
                    <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                </Tabs>
            </DetailsContainer>
        );
    }
    else if (requestType === "slot") //sent from EventConnectionsDisplay component
    {
        const performer = request.performer;
        const name = performer.name;
        const type = performer.type;
        const genres = performer.genres;
        const equipment = performer.equipment;
        const hourlyRate = performer.hourlyRate;
        const links = performer.links;

        const event = request.event;
        const slotIndex = request.slotIndex;
        const slot = event.slots[slotIndex]; 
        const stage = slot.stage;
        const startDate = slot.startDate.toDate();
        const endDate = slot.endDate.toDate();

        //generate string for start time
        let startDateString = generateDateString(startDate);
        //generate string for end time
        let endDateString = generateTimeString(endDate);
        //generate strings for display of genres and equipment
        let genresString = "" + genres[0];
        for (let i = 1; i < genres.length; i++)
        {
            genresString += ", " + genres[i];
        }
        let equipmentString = "" + equipment[0];
        for (let i = 1; i <  equipment.length; i++)
        {
            equipmentString += ", " + equipment[i];
        }

        //generate link displays
        const linkDisplays = [];
        for (let i = 0; i < links.length; i++)
        {
            linkDisplays.push(
                <StyledLink href={links[i]}>{links[i]}</StyledLink>
            );
        }

        const acceptSlotRequest = async () => {
            //update array of performer details in event
            const currEventPerformerDetails = event.performerDetails;
            const userPerformerDetails = {
                email : requestingEmail,
                type : type
            };
            currEventPerformerDetails.push(userPerformerDetails);

            //update slot details
            const currSlotPerformerDetails = slot.performerDetails;
            currSlotPerformerDetails.push(userPerformerDetails);
            slot.performerDetails = currSlotPerformerDetails;
            event.slots[slotIndex] = slot;

            //get id of event
            const upcomingEventsRef = collection(db, "upcomingEvents");
            const q = query(upcomingEventsRef, and(where("eventName", "==", event.eventName),
                                                   where("creatingUserEmail", "==", userEmail)
                                                   ));
            const upcomingEventsSnapshot = await getDocs(q);
            let eventID;
            upcomingEventsSnapshot.forEach((doc) => {
                eventID = doc.id;
            });

            const upcomingEventDocRef = doc(db, "upcomingEvents", eventID);
            await updateDoc(upcomingEventDocRef, {
                performerDetails : currEventPerformerDetails,
                slots : event.slots
            });

            
            //delete request
            await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

            //send notification
            const notification = {
                text : ("Your request to " + userDisplayName + " to play at their event named " + event.eventName + " has been accepted."),
                time : new Date()
            };
            const notificationsRef = collection(db, "users", requestingEmail, "notifications");
            await addDoc(notificationsRef, notification);

            //do callback
            callback(requestIndex);
        }

        return(
            <DetailsContainer>
                <StyledHeader>Request To Perform At Your Event:</StyledHeader>
                <DetailsBox>
                    <Detail onClick={goToRequestorProfilePage}><b>Full Name:</b> {requestorDisplayName}, a.k.a. <b>"{name}"</b></Detail>
                    <Detail><b>Email:</b> {requestingEmail}</Detail>
                    <Detail><b>Type:</b> {type}</Detail>
                    <Detail><b>Genres:</b> {genresString}</Detail>
                    <Detail><b>Hourly Rate:</b> {hourlyRate}</Detail>
                    <Detail><b>Equipment:</b> {equipmentString}</Detail>
                    <Detail><b>Slot:</b> {stage} {startDateString} - {endDateString}</Detail>
                    <LinkBox>
                        {linkDisplays}
                    </LinkBox>
                </DetailsBox>
                <Tabs>
                    <InviteButton onClick={acceptSlotRequest}>Accept</InviteButton>
                    <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                </Tabs>
            </DetailsContainer>
        );
    }
    else if (requestType === "toHavePerform") //sent from PerformerConnectionsDisplay
    {
        //get basic event data
        const event = request.event;
        const eventName = event.eventName;
        const eventType = event.eventType;
        const startDate =  event.startDate.toDate();
        const endDate = event.endDate.toDate(); 
        const venue = event.venue; 
        const eventDescription = event.eventDescription; 
        const genres = event.genres;
        const slots = event.slots;
        const slotIndex = request.slotIndex;

        const type = request.performer.type;

        //create string for start date
        let startDateString = generateDateString(startDate);
        //create string for end date
        let endDateString = generateDateString(endDate);
        //create string for genres
        let genresString = "" + genres[0];
        for (let i = 1; i < genres.length; i++)
        {
            genresString += ", " + genres[i];
        }
        if (slots.length === 0)
        {
            //method to accept request
            const acceptRequestToPerform = async () => {
                //update array of performer details in event
                const currEventPerformerDetails = event.performerDetails;
                const userPerformerDetails = {
                    email : userEmail,
                    type : type
                };
                currEventPerformerDetails.push(userPerformerDetails);

                //get id of event
                const upcomingEventsRef = collection(db, "upcomingEvents");
                const q = query(upcomingEventsRef, and(where("eventName", "==", event.eventName),
                                                    where("creatingUserEmail", "==", requestingEmail)
                                                    ));
                const upcomingEventsSnapshot = await getDocs(q);
                let eventID;
                upcomingEventsSnapshot.forEach((doc) => {
                    eventID = doc.id;
                });

                const upcomingEventDocRef = doc(db, "upcomingEvents", eventID);
                await updateDoc(upcomingEventDocRef, {
                    performerDetails : currEventPerformerDetails,
                });

                
                //delete request
                await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

                //send notification
                const notification = {
                    text : ("Your request to " + userDisplayName + " for them to play at your event named " + event.eventName + " has been accepted."),
                    time : new Date()
                };
                const notificationsRef = collection(db, "users", requestingEmail, "notifications");
                await addDoc(notificationsRef, notification);

                //do callback
                callback(requestIndex);
            }

            return(
                <DetailsContainer>
                    <StyledHeader>Request For You To Perform:</StyledHeader>
                    <DetailsBox>
                        <Detail onClick={goToRequestorProfilePage}><b>From:</b> {requestorDisplayName}</Detail>
                        <Detail><b>Email:</b> {requestingEmail}<br/></Detail>
                        <Detail><b>Event Name:</b> {eventName}</Detail>
                        <Detail><b>Type:</b> {eventType}</Detail>
                        <Detail><b>Genres:</b> {genresString}</Detail>
                        <Detail><b>Start Date:</b> {startDateString}</Detail>
                        <Detail><b>End Date:</b> {endDateString}</Detail>
                        <Detail><b>Venue:</b> {venue}</Detail>
                        <Detail>{eventDescription}</Detail>
                    </DetailsBox>
                    <Tabs>
                        <InviteButton onClick={acceptRequestToPerform}>Accept</InviteButton>
                        <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                    </Tabs>
                </DetailsContainer>
            );
        }
        else
        {
            const slot = slots[slotIndex];
            const slotStartDate = slots[slotIndex].startDate.toDate();
            const slotEndDate = slots[slotIndex].endDate.toDate();

            //generate slot start date string
            const slotStartDateString = generateDateString(slotStartDate);
            //generate end time string
            const slotEndDateString = generateTimeString(endDate);

            //method to accept request
            const acceptRequestToPerformInSlot = async () => {
                //update array of performer details in event
                const currEventPerformerDetails = event.performerDetails;
                const userPerformerDetails = {
                    email : userEmail,
                    type : type
                };
                currEventPerformerDetails.push(userPerformerDetails);

                //update slot details
                const currSlotPerformerDetails = slot.performerDetails;
                currSlotPerformerDetails.push(userPerformerDetails);
                slot.performerDetails = currSlotPerformerDetails;
                event.slots[slotIndex] = slot;

                //get id of event
                const upcomingEventsRef = collection(db, "upcomingEvents");
                const q = query(upcomingEventsRef, and(where("eventName", "==", event.eventName),
                                                    where("creatingUserEmail", "==", requestingEmail)
                                                    ));
                const upcomingEventsSnapshot = await getDocs(q);
                let eventID;
                upcomingEventsSnapshot.forEach((doc) => {
                    eventID = doc.id;
                });

                const upcomingEventDocRef = doc(db, "upcomingEvents", eventID);
                await updateDoc(upcomingEventDocRef, {
                    performerDetails : currEventPerformerDetails,
                    slots : event.slots
                });

                
                //delete request
                await deleteDoc(doc(db, "users", userEmail, "requests", requestID));

                //send notification
                const notification = {
                    text : ("Your request to " + userDisplayName + " for them to play at your event named " + event.eventName + " has been accepted."),
                    time : new Date()
                };
                const notificationsRef = collection(db, "users", requestingEmail, "notifications");
                await addDoc(notificationsRef, notification);

                //do callback
                callback(requestIndex);
            }

            return(
                <DetailsContainer>
                    <StyledHeader>Request For You To Perform:</StyledHeader>
                    <DetailsBox>
                        <Detail onClick={goToRequestorProfilePage}><b>From:</b> {requestorDisplayName}</Detail>
                        <Detail><b>Email:</b> {requestingEmail}<br/></Detail>
                        <Detail><b>Event Name:</b> {eventName}</Detail>
                        <Detail><b>Type:</b> {eventType}</Detail>
                        <Detail><b>Genres:</b> {genresString}</Detail>
                        <Detail><b>Start Date:</b> {startDateString}</Detail>
                        <Detail><b>End Date:</b> {endDateString}</Detail>
                        <Detail><b>Venue:</b> {venue}</Detail>
                        <Detail><b>Slot:</b> {slots[slotIndex].stage} {startDateString} - {endDateString}</Detail>
                        <Detail>{eventDescription}</Detail>
                    </DetailsBox>
                    <Tabs>
                        <InviteButton onClick={acceptRequestToPerformInSlot}>Accept</InviteButton>
                        <InviteButton onClick={rejectRequest}>Reject</InviteButton>
                    </Tabs>
                </DetailsContainer>
            );
        }
    }
}