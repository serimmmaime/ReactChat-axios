import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export const Message = (props) => {
  const messageContent = props.messageContent;
  const username = props.username;
  const [who, setWho] = useState('me');

  useEffect(() => {
    username === messageContent.author ? setWho('me') : setWho('other');
  }, [props, username, messageContent.author]);

  return (
    <MessageContainer who={who}>
      {who === 'other' && <Avatar src={messageContent.avatar} />}
      <MessageWrapper who={who}>
        {who === 'other' && <Author who={who}>{messageContent.author}</Author>}
        <MessageBody who={who}>
          <MessageText>{messageContent.message}</MessageText>
        </MessageBody>
        <Time who={who}>{messageContent.time}</Time>
      </MessageWrapper>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
  padding: 5px 10px;
  box-sizing: border-box;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
`;

const MessageBody = styled.div`
  max-width: 550px;
  background-color: ${({ who }) => (who === 'me' ? '#3d4a79' : '#f2f7fb')};
  color: ${({ who }) => (who === 'me' ? '#ffffff' : '#000000')};
  padding: 10px;
  border-radius: ${({ who }) =>
    who === 'me' ? '10px 10px 0 10px' : '10px 10px 10px 0'};
  margin-bottom: 5px;
  position: relative;
`;

const MessageText = styled.p`
  margin: 0;
`;

const Time = styled.span`
  font-size: 12px;
  color: #888888;
  margin-top: 5px;
  align-self: ${({ who }) => (who === 'me' ? 'flex-end' : 'flex-start')};
`;

const Author = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #3d4a79;
  text-align: left;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;
