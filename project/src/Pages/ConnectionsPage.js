import {NavigationBar} from "../components/NavigationBar";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, getCountFromServer  } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EventPlannerDetailsProfileOverview } from "../components/EventPlannerDetailsProfileOverview";
import { PerformerDetailsProfileOverview } from "../components/PerformerDetailsProfileOverview";
import { db } from '../firebase-config/firebase';

const Container = styled.div`
  display: flex;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
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
const Text = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 1.0rem;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-bottom: 10px;
`;
const TabsButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 0px solid #fff;
  border-radius: 10px;
  background: #a13333;
  padding: 10px 20px;
  color: white;
  margin-left: 12px;
  width: 130px;
  max-width: 130px;
`;

const ConnectionsPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");

    const [isViewAsPerformer, setIsViewAsPerformer] = new useState(true);
    
    return(
        <>
            <NavigationBar/>
            <Container>
                <StyledHeader>Connections Page</StyledHeader>
                <Text>View as...</Text>
                <Tabs>
                  <TabsButton onClick={() => setIsViewAsPerformer(true)}>Performer</TabsButton>
                  <TabsButton onClick={() => setIsViewAsPerformer(false)}>Event Planner</TabsButton>
                </Tabs>
            </Container>
        </>
    );
}

export default ConnectionsPage;