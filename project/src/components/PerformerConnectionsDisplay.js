import styled from "styled-components";
import { db } from '../firebase-config/firebase';
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, and  } from "firebase/firestore";
import { useEffect, useState } from "react";

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
const InviteButton = styled.button`
    display: inline-block;
    border: 0px solid #fff;
    border-radius: 5px;
    background: #a13333;
    padding: 7.5px 20px;
    color: white;
    margin-top: 10px;
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

/*
    TO-DO:
    - Fix error where it doesn't accurately detect existing documents in the database +- line 139 and 174
*/

export function PerformerConnectionsDisplay({performer, event, slotIndex, errorCallback}) {
    const email = performer.userEmail;
    const name = performer.name;
    const type = performer.type;
    const genres = performer.genres;
    const equipment = performer.equipment;
    const hourlyRate = performer.hourlyRate;
    const links = performer.links;

    const [isInviteSent, setIsInviteSent] = useState(false);

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

    const linkDisplays = [];
    for (let i = 0; i < links.length; i++)
    {
        linkDisplays.push(
            <StyledLink href={links[i]}>{links[i]}</StyledLink>
        );
    }

    const invitePerformer = async () => {
        const userEmail = sessionStorage.getItem("userEmail");
        const requestsRef = collection(db, "users", email, "requests");
        let isRequestSent = false;
        let isPerformerAdded = false;

        //check if performer has been added
        const upcomingEventsRef = collection(db, "upcomingEvents");
        const performerAddedQuery = query(upcomingEventsRef, and(where("eventName", "==", event.eventName),
                                                                 where("creatingUserEmail", "==", userEmail)));
        const performerAddedQuerySnapshot = await getDocs(performerAddedQuery);
        performerAddedQuerySnapshot.forEach((doc) => {
            const event = doc.data();
            for (let i = 0; i < event.performerDetails.length; i++)
            {
                if (event.performerDetails[i].email === email)
                {
                    isPerformerAdded = true;
                }
            }
        });

        if (event.slots.length === 0) //searching for a performer for an entire event, not just a slot
        {
            //create request object
            const request = {
                requestType : "toHavePerform",
                performer : performer,
                requestingUserEmail : userEmail,
                receivingUserEmail : email,
                event : event,
                slotIndex : -1
            };

            //run query to see if there is already a request from this user to the performer for this event
            const requestSentQuery = query(requestsRef, and(where("requestType", "==", "toHavePerform"),
                                         where("requestingUserEmail", "==", userEmail),
                                         where("receivingUserEmail", "==", email),
                                         where("event", "==", event)
                                        ));
            const requestsQuerySnapshot = await getDocs(requestSentQuery);
            requestsQuerySnapshot.forEach((doc) => {
                isRequestSent = true;
            });

            //send a request if one hasn't been sent already
            if (!isRequestSent && !isPerformerAdded)
            {
                await addDoc(requestsRef, request);
                errorCallback(false);
                setIsInviteSent(true);
            }
            else
            {
                errorCallback(true);
            }
        }
        else //searching for a performer to fill a slot
        {
            //create request object
            const request = {
                requestType : "toHavePerform",
                performer : performer,
                requestingUserEmail : userEmail,
                receivingUserEmail : email,
                event : event,
                slotIndex : slotIndex
            };

            //run query to see if there is already a request from this user to the performer for this event
            const q = query(requestsRef, and(where("requestType", "==", "toHavePerform"),
                                         where("requestingUserEmail", "==", userEmail),
                                         where("receivingUserEmail", "==", email),
                                         where("event", "==", event) 
                                        ));
            const requestsQuerySnapshot = await getDocs(q);
            requestsQuerySnapshot.forEach((doc) => {
                isRequestSent = true;
            });

            //send a request if one hasn't been sent already
            if (!isRequestSent && !isPerformerAdded)
            {
                await addDoc(requestsRef, request);
                errorCallback(false);
                setIsInviteSent(true);
            }
            else
            {
                errorCallback(true);
            }
        }
    }

    return(
        <>
            <DetailsContainer>
                <StyledHeader>{name}</StyledHeader>
                <DetailsBox>
                    <Detail><b>Email:</b> {email}</Detail>
                    <Detail><b>Type:</b> {type}</Detail>
                    <Detail><b>Genres:</b> {genresString}</Detail>
                    <Detail><b>Hourly Rate:</b> {hourlyRate}</Detail>
                    <Detail><b>Equipment:</b> {equipmentString}</Detail>
                    <Detail><b>Links:</b></Detail>
                    <LinkBox>
                        {linkDisplays}
                    </LinkBox>
                </DetailsBox>
                <InviteButton onClick={invitePerformer}>
                    Invite
                </InviteButton>
                <p id="uidnote" style={isInviteSent ? {} : {display: "none"}}>
                    Invite has been sent.
                </p>
            </DetailsContainer>
        </>
    );
}