import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Chat.css';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Client } from '@twilio/conversations';
import { TwilioService } from '../Messages/twilioService';
import moment from 'moment';

const Chat = () => {
  const location = useLocation();
  const [conversationId] = useState(location.state.fullData.sid);
  const chatClientChannel = useRef();
  const chatMessagesPaginator = useRef();
  const [messagesList, setMessageList] = useState([]);
  const [conversation, setConversation] = useState();
  const [token] = useState(localStorage.getItem('twillio_token'));
  const [paginator, setPaginator] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);

  useEffect(() => {
    conversationStart();
  }, [location.state.fullData]);

  const setConversationEvents = useCallback((channel) => {
    chatClientChannel.current = channel;
    chatClientChannel.current.on('messageAdded', (message) => {
      const newMessage = TwilioService.getInstance().parseMessage(message);
      loadMessages();
    });
    return chatClientChannel.current;
  }, []);

  const bottomOfPage = () => {
    var objDiv = document.getElementById('thisDiv');
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  const loadMessages = async () => {
    TwilioService.getInstance()
      .getChatClient(token)
      .then((client) => client.getConversationBySid(conversationId))
      .then((conversation) => setConversationEvents(conversation))
      .then((currentChannel) => currentChannel.getMessages())
      .then((paginator) => {
        setPaginator(paginator);
        chatMessagesPaginator.current = paginator;
        const newMessages = TwilioService.getInstance().parseMessages(
          paginator.items
        );

        setMessageList(newMessages.reverse());
        bottomOfPage();
      })
      .catch((err) => {});
  };

  useEffect(async () => {
    bottomOfPage();
    loadMessages();
  }, [conversationId, setConversationEvents]);

  const conversationStart = async () => {
    const conversationsClient = await Client.create(token);
    const convo = await conversationsClient.getConversationBySid(
      conversationId
    );
    setConversation(convo);
  };

  const mediaShow = (message) => {
    message.media.getContentTemporaryUrl().then(function (url) {
      window.open(url);
    });
  };
  //
  return (
    <>
      <div className="card d-flex align-self-stretch notificationCard mbottom">
        <h6 className="card-title notificationBar">Messages</h6>
        <div className="card-body text-center">
          <div>
            Conversation between {location.state.fullData.clientOrEstimator}:{' '}
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {location.state.fullData.clientName}
            </span>
            &nbsp; and Company:{' '}
            <span style={{ fontWeight: 'bold' }}>
              {location.state.fullData.companyName}
            </span>
          </div>
          <div
            id="thisDiv"
            className="notificationBody messageNotificationBody">
            {messagesList.length ? (
              messagesList.map((item, index) => (
                <>
                  <div className="row divLeft">
                    <span className="userNameChat">{item.user.name}</span>
                    <span
                      style={{ wordBreak: 'break-all' }}
                      className="left row shareRightLeft mt-2">
                      {paginator.items[index].type !== 'text' ? (
                        <>
                          {item?.text ? item.text : null}
                          <p
                            className="pointer"
                            onClick={() => mediaShow(paginator.items[index])}>
                            Click To View Media
                          </p>
                        </>
                      ) : (
                        item.text
                      )}
                    </span>
                    <span className="leftTime shareRightLeftTime">
                      {moment(item.createdAt).format('hh:mm A')}
                    </span>
                  </div>
                  {/* )} */}
                </>
              ))
            ) : (
              <h5 className="d-flex justify-content-center">
                Conversation not started yet
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Chat;
