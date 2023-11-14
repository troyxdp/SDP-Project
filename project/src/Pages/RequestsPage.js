import {NavigationBar} from "../components/NavigationBar";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, and  } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { db } from '../firebase-config/firebase';
import { RequestDisplay } from "../components/RequestDisplay";

const PageContainer = styled.div`
    position: fixed;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    overflow-y: auto;
    background: #fff;
    border-radius: 10px;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  flex-direction: column;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const RequestsPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");

    const [requests, setRequests] = useState([]);
    const [requestIDs, setRequestIDs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [requestDisplays, setRequestDisplays] = useState([]);
    const createRequestDisplays = (requests, requestIDs) => {
        const currDisplays = [];
        for (let i = 0; i < requests.length; i++)
        {
            currDisplays.push(
                <RequestDisplay 
                    request={requests[i]}
                    requestID={requestIDs[i]}
                    requestIndex={i}
                    callback={removeRequestDisplay}
                />
            );
        }
        setRequestDisplays(currDisplays);
    }

    useEffect(() => {
        const getRequests = async () => {
            if (!isLoaded)
            {
                const requestsRef = collection(db, "users", userEmail, "requests");
                const requestsSnapshot = await getDocs(requestsRef);
                const currRequests = [];
                const currRequestIDs = [];
                requestsSnapshot.forEach((doc) => {
                    currRequests.push(doc.data());
                    currRequestIDs.push(doc.id);
                });
                setRequests(currRequests);
                setRequestIDs(currRequestIDs);
                setIsLoaded(true);
                createRequestDisplays(currRequests, currRequestIDs);
            }
        };  
        getRequests();
    }, [requests, userEmail, createRequestDisplays]);

    
    const removeRequestDisplay = (index) => {
        const currRequests = requests;
        currRequests.splice(index, 1);
        setRequests(currRequests);
        
        const currRequestIDs = requestIDs;
        currRequestIDs.splice(index, 1);
        setRequestIDs(currRequestIDs);

        createRequestDisplays(currRequests, currRequestIDs);
    }
    
    return(
        <PageContainer>
            <NavigationBar/>
            <Container>
                <StyledHeader>Requests</StyledHeader>
                {requests.length > 0 &&
                    requestDisplays
                }
                {requests.length === 0 &&
                    <p>No requests.</p>
                }
            </Container>
        </PageContainer>
    );
}
export default RequestsPage;