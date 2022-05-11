/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hook/useAppRedux";
import styles from "../../styles/Chat.module.css";
import useWebSocket from "react-use-websocket";
import Cookies from "js-cookie";

const { Search } = Input;
const chat = () => {
  const { userData } = useAppSelector((state) => state.account.value);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState("");
  const [comment, setComment] = useState<any>([]);
  const [isLogin, setIsLogin] = useState<any>();
  const socketUrl = "wss://robby-websocket.herokuapp.com";
  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    onMessage: (msg) => {
      setComment([
        ...comment,
        {
          isUser: userData
            ? msg.data.split(",")[0] === userData.id.toString()
            : false,
          msg: msg.data.split(",")[1],
        },
      ]);
    },
  });

  const messages = comment.map(
    (el: { isUser: boolean; msg: string }, index: number) =>
      el.isUser ? (
        <p className={styles.userMessage} key={index}>
          {el.msg}
        </p>
      ) : (
        <p className={styles.unUserMessage} key={index}>
          {el.msg}
        </p>
      )
  );

  useEffect(() => {
    setIsLogin(Cookies.get("login"));
  }, []);
  return (
    <>
      <br />
      <div className={styles.contents}>{messages}</div>
      <div className={styles.messageInpit}>
        <Search
          placeholder="input message text"
          enterButton="send"
          size="large"
          value={messageData}
          onChange={(val) => {
            if (userData) {
              setMessage(`${userData.id},${val.target.value}`);
            }

            setMessageData(val.target.value);
          }}
          onSearch={() => {
            setMessageData("");
            userData ? sendMessage(message) : alert("請先登入");
          }}
        />
      </div>
    </>
  );
};

export default chat;
