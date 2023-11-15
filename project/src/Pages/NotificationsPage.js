import {NavigationBar} from "../components/NavigationBar";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, and  } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from '../firebase-config/firebase';
import x_solid from "../profile-pics/x-solid.svg";


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
    padding: 5px; 
    width: 475px;
    max-width: 475px;
    border: 2px solid #808080;
    border-radius: 8px;
    margin-top: 2px;
`;

const NotificationsPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");

    const [notifications, setNotifications] = useState([]);
    const [notificationsIDs, setNotificationsIDs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [notificationsDisplay, setNotificationsDisplay] = useState([]);
    const createNotificationsDisplayComponents = (notifications) => {
        const currDisplay = [];
        for (let i = 0; i < notifications.length; i++)
        {
            const time = notifications[i].time.toDate();
            let timeString = "";
            if (time.getDate() < 10)
            {
                timeString += "0";
            }
            timeString += time.getDate() + "/";
            if (time.getMonth() < 10)
            {
                timeString += "0";
            }
            timeString += time.getMonth() + "/" + time.getFullYear() + " ";
            if (time.getHours() < 10)
            {
                timeString += "0";
            }
            timeString += time.getHours() + ":";
            if (time.getMinutes() < 10)
            {
                timeString += "0";
            }
            timeString += time.getMinutes();

            currDisplay.push(
                <ListBoxElement>
                    <p style={{ fontSize: 'small' }}>{notifications[i].text} <br/>
                       {timeString}</p>
                    <img style={{ width : 12, height: 12, borderRadius: 0 }} src={x_solid} alt="x_solid" onClick={() => handleRemoveNotification(i)}/>
                </ListBoxElement>
            );
        }
        setNotificationsDisplay(currDisplay);
    }
    const handleRemoveNotification = async (index) => {
        //delete notification from useStates
        const currNotifications = notifications;
        currNotifications.splice(index, 1);
        setNotifications(currNotifications);

        //update notifications display
        createNotificationsDisplayComponents(currNotifications);

        //delete notification from the database
        await deleteDoc(doc(db, "users", userEmail, "notifications", notificationsIDs[index]));
        const currNotificationsIDs = notificationsIDs;
        currNotificationsIDs.splice(index, 1);
        setNotificationsIDs(currNotificationsIDs);
    }

    useEffect(() => {
        const getNotifications = async () => {
            if (!isLoaded)
            {
                const notificationsRef = collection(db, "users", userEmail, "notifications");
                const notificationsSnapshot = await getDocs(notificationsRef);
                const currNotifications = [];
                const currNotificationsIDs = [];
                notificationsSnapshot.forEach((doc) => {
                    currNotifications.push(doc.data());
                    currNotificationsIDs.push(doc.id);
                });
                setNotifications(currNotifications);
                setNotificationsIDs(currNotificationsIDs)
                createNotificationsDisplayComponents(currNotifications);
                setIsLoaded(true);
            }
        };
        getNotifications();
    }, [createNotificationsDisplayComponents, userEmail])

    return(
        <PageContainer>
            <NavigationBar/>
            <Container>
                <StyledHeader>Notifications:</StyledHeader>
                {notificationsDisplay}
                {notifications.length === 0 &&
                    <p>No notifications</p>
                }
            </Container> 
        </PageContainer>
    );
}

export default NotificationsPage;