import React, { useEffect, useRef, useState } from 'react';
import { Message } from './Message';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const userAvatars = {
  user1: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  user2: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

function Chat({ socket, username, room }) {
  const inputRef = useRef();
  const [messageList, setMessageList] = useState([]);
  const messageBottomRef = useRef(null);

  const sendMessage = async () => {
    const currentMsg = inputRef.current.value;
    if (currentMsg !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
        avatar: userAvatars[username]
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  // 상대방의 이름을 가져오기 위해 모든 메시지를 순회하며 username과 다른 작성자를 찾아 상대방 이름을 설정합니다.
  const otherUser = messageList.find(msg => msg.author !== username && msg.author !== '알림')?.author || '상대방';

  return (
    <PageContainer>
      <RoomContainer>
        <RoomHeader>
          <RoomTitle>{otherUser}</RoomTitle>
        </RoomHeader>
        <RoomBody>
          <MessageBox>
            {messageList.map((messageContent) => (
              <Message
                messageContent={messageContent}
                username={username}
                key={uuidv4()}
              />
            ))}
            <div ref={messageBottomRef} />
          </MessageBox>
        </RoomBody>
        <ChatInputBox>
          <ChatInput
            ref={inputRef}
            type="text"
            placeholder="메세지를 입력해주세요"
            onKeyPress={(event) => {
              event.key === 'Enter' && sendMessage();
            }}
          />
          <ChatButton onClick={sendMessage}>▹</ChatButton>
        </ChatInputBox>
      </RoomContainer>
    </PageContainer>
  );
}

export default Chat;

const PageContainer = styled.div`
  background-color: #eeefee; /* 웹페이지 전체 배경색 */
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoomContainer = styled.div`
  width: 50%;
  max-width: 600px;
  @media screen and (max-width: 550px) {
    width: 90%;
  }
  height: 440px;
  background-color: #ffffff; /* 채팅방 내 배경색 */
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const RoomHeader = styled.div`
  height: 40px;
  border-radius: 6px 6px 0 0;
  background: #ffffff;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 사방으로 그림자 효과 추가 */
  border-bottom: 1px solid #eeefee;
`;

const RoomTitle = styled.p`
  margin: 0;
  display: block;
  padding: 0 1em 0 2em;
  color: #000000;
  font-weight: 700;
  line-height: 45px;
`;

const RoomBody = styled.div`
  flex: 1;
  border: 1px solid #ffffff;
  background: #ffffff;
  position: relative;
  overflow-y: auto;
`;

const MessageBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 5px;
`;

const ChatInputBox = styled.div`
  height: 40px;
  border-top: 1px solid #eeefee;
  display: flex;
  border-radius: 0 0 6px 6px;
  background-color: #ffffff; 
`;

const ChatInput = styled.input`
  height: 100%;
  flex: 85%;
  border: 0;
  padding: 0 0.7em;
  font-size: 1em;
  border-right: 1px solid #eeefee;
  outline: none;
  background: transparent;
`;

const ChatButton = styled.button`
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex: 15%;
  height: 100%;
  background: transparent;
  outline: none;
  font-size: 25px;
  transition: all 0.5s;
  color: lightgray;
  opacity: 0.5;
  &:hover {
    background: #3d4a79;
    transition: all 0.5s;
  }
  &:active {
    background: darkblue;

    /* transition: all 0.5s; */
    font-size: 0.5rem;
  }
`;
