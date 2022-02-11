import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdOutlineCancel } from "react-icons/md";
import { AiOutlineMinus, AiOutlineLink } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="">
      <div className="container">
        <div className="nav">
          <button>
            <MdKeyboardArrowLeft className="navIcon" />
          </button>
          <div className="navCap">
            <h2>Start your conversation</h2>
            <p>Penny is set</p>
          </div>
          <div className="navBnt">
            <button style={{ marginRight: "1em" }}>
              <AiOutlineMinus className="navIcon" />
            </button>

            <button>
              <MdOutlineCancel className="navIcon" />
            </button>
          </div>
        </div>
        <div className=" chat">
          <h3>Start a conversation</h3>
          <div className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div className="chatCap">
                    <p id="author">{messageContent.author}</p>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="messageInput">
            <div className="icon">
              <AiOutlineLink
                className="mesIcon"
                style={{ marginRight: ".4em" }}
              />
              <BsEmojiSmile className="mesIcon" />
            </div>

            <input
              type="text"
              value={currentMessage}
              placeholder="Hey..."
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
