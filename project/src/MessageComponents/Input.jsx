import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import styled  from "styled-components";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from '../firebase-config/firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Sendbutton = styled.button`
  padding: 10px 30px;
  font-size: 12px;
  vertical-align: middle;
`;

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.email,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.email,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.email), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".userInfo.date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.email), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".userInfo.date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  return (
    <div>
      {/* <div className="messages">
        {messages.map((message, index) => (
          <div key={message.id} className={message.senderId === 'user1' ? 'left' : 'right'}>
            <div className="sender-name">{message.senderName}</div>
            <Message message={message} />
            <div className="timestamp">{formatTimestamp(message.date)}</div>
          </div>
        ))}
      </div> */}
      <div className="input">
        <input
          type="text"
          placeholder="Messages..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          style={{
            width: '400px',
            height: '40px',
            fontSize: '18px',
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSend();
            }
          }}
        />
        <div className="send">
          <input
            type="file"
            style={{ display: 'none' }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <div className="send-container">
            <label htmlFor="file">
              <img
                src={Img}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  justifyContent: 'space-between',
                  verticalAlign: 'middle',
                }}
              />
            </label>
            <Sendbutton onClick={handleSend}>Send</Sendbutton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;