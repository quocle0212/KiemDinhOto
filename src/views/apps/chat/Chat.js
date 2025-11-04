// ** React Imports
import { useState, useEffect, useRef, useMemo, memo } from "react";
import ReactDOM from 'react-dom'
import { injectIntl } from "react-intl";
// ** Custom Components
import Avatar from '@components/avatar'
import {
  deleteChatLogById,
  selectChat,
  sendMsg,
  getChatContacts
} from "./store/actions";
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
// ** Third Party Components
import classnames from 'classnames'
import { toast } from "react-toastify";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MessageSquare, Menu, PhoneCall, Video, Search, MoreVertical, Mic, Image, Send, Trash2, Archive, X } from 'react-feather'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button
} from 'reactstrap'
import Service from "../../../services/request";
import appUserConversation from "../../../services/appUserConversation";
import { getUserData } from "@utils";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import mqttClient from '../../../utility/hooks/MqttClient';
import ModalDeleteSupportChat from '../../components/modal/ModalDeleteSupportChat'
const ChatLog = ({ handleSidebar, store, userSidebarLeft, intl }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const history = useHistory();
  // **  & Store
  const { userProfile, selectedUser } = store;
  const [uploadUrl, setUploadUrl] = useState(null);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [selectedChatLogId, setSelectedChatLogId] = useState(null);
  const userData = getUserData();
  const client = mqttClient();
  // ** Refs & Dispatch
  const chatArea = useRef(null);
  const dispatch = useDispatch();
  // ** State
  const [msg, setMsg] = useState("");
  const CONVERSATION_ID = "APP_USER_CONVERSATION_ID";
  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current);
    if (chatContainer) {
      chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  };

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      console.log("mqttSub", "topic", topic)
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
        }
      });
    }
  };
  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic } = subscription;
      console.log("mqttUnSub", "topic", topic)
      client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        }

      });
    }
  };
  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length;
    if (selectedUserLen) {
      scrollToBottom();
    }
  }, [selectedUser]);

  // const userId = selectedUser?.conversation?.appUserId;
  useEffect(() => {
    let timer;
    if (selectedUser?.conversation?.appUserConversationId) {
      timer = setInterval(() => {
        dispatch(selectChat(selectedUser?.conversation));
      }, 10000);
      client?.on('connect', () => {
        console.log('connect', 3242)
      });
      client?.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client?.on('reconnect', () => {
        console.log('Reconnecting')
      });
      client?.on('message', (topic, message) => {
        console.log("topic", topic, "newData", newData);
        const payload = { topic, message: message.toString() };
        const newData = JSON.parse(`${payload.message}`)
        if (`${CONVERSATION_ID}_${selectedUser.conversation.appUserConversationId}` === topic) {
        handleSendMsg()
        }
      })
       selectedUser?.chat?.forEach((item) => {
         mqttSub({
           topic: `${CONVERSATION_ID}_${item?.appUserConversationId} `, qos: 2
         })
       }
       )
       return () => {
         selectedUser.chat.forEach((item) => {
           mqttUnSub({
         topic: `${CONVERSATION_ID}_${item.appUserConversationId}`
          })
         })
       }
    }

    return () => {
      clearInterval(timer);
    };
  }, [selectedUser?.conversation?.appUserConversationId]);

  const handleDeleteChatItem = (id) => {
    setSelectedChatLogId(id)
    setIsOpenModalDelete(true)
  }

  // ** Renders user chat
  const renderChats = useMemo(() => {
    const reverseList = selectedUser?.chat?.slice?.()?.reverse?.() || [];
    return reverseList.map((item, index) => {
      const isUser = item?.senderToReceiver === 0;
      return (
        <div
          key={index}
          className={classnames("chat", {
            "chat-left": isUser,
          })}
        >
          <div className={`chat-body mb-2 ${!isUser ? 'd-flex align-items-center justify-content-end chat-body__has-icon' : ''}`}>
            {
              !isUser && <Button color={'transparent'} className={'p-0 mr-50'} onClick={() => handleDeleteChatItem(item?.appUserChatLogId)}><Trash2 /></Button>
            }
            <div className="chat-content mb-0">
              <span
                dangerouslySetInnerHTML={{
                  __html: item?.appUserChatLogContent,
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  }, [selectedUser?.chat?.length]);

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (!Object.keys(selectedUser.conversation).length) {
      dispatch(selectChat(store?.chats?.data?.[0]));
    }
  };

  const handleUploadImage = (e) => {
    const reader = new FileReader();
    const files = e.target.files;
    if (!files.length) return;

    const file = files[0];
    if (file.size > 10048576) {
      toast.warn(intl.formatMessage({ id: "error_size" }));
      return;
    }
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      let baseString = reader.result;
      const params = {
        imageData: baseString.replace("data:" + file.type + ";base64,", ""),
        imageFormat: file.type.replace("image/", ""),
      };
      appUserConversation
        .uploadImage(params)
        .then((result) => {
          setUploadUrl(result);
        })
        .catch((error) => {
          toast.error(intl.formatMessage({ id: "delete_success" }));
        })
        .finally(() => {
          e.target.value = "";
        });
    };
    reader.onerror = function (error) {
      toast.error(intl.formatMessage({ id: "delete_success" }));
    };
  };

  // ** Sends New Msg
  const handleSendMsg = (e) => {
    e.preventDefault();
    // if (uploadUrl) {
    //   const contentHtml = `<div className="msg-text owner uploaded-file">
    //     <img src="${uploadUrl}"  alt="" />
    //   </div>`;
    //   dispatch(
    //     sendMsg({
    //       appUserChatLogContent: contentHtml,
    //       appUserConversationId:
    //         selectedUser?.conversation?.appUserConversationId,
    //       createdAt: new Date().toISOString(),
    //       isDeleted: 0,
    //       isHidden: 0,
    //       receiverId: selectedUser?.conversation?.receiverId,
    //       senderId: userData?.staffId,
    //     })
    //   );
    //   setUploadUrl(null);
    // }
    // if (msg.length) {
    //   dispatch(
    //     sendMsg({
    //       appUserChatLogContent: msg,
    //       appUserConversationId:
    //         selectedUser?.conversation?.appUserConversationId,
    //       createdAt: new Date().toISOString(),
    //       isDeleted: 0,
    //       isHidden: 0,
    //       receiverId: selectedUser?.conversation?.receiverId,
    //       senderId: userData?.staffId,
    //     })
    //   );
    //   setMsg("");
    // }
  };
  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div";
  // delete chat
  const handleDeteleChat = () => {
    // if (selectedChatLogId) {
    //   dispatch(deleteChatLogById(selectedChatLogId, selectedUser?.conversation))
    //   setSelectedChatLogId(null)
    // } else {
    //   Service.send({
    //     method: "POST",
    //     path: "AppUserConversation/deleteByID",
    //     data: { id: searchParams?.get("id") },
    //     headers: {},
    //   }).then((res) => {
    //     if (res) {
    //       const { statusCode, message } = res;
    //       if (statusCode === 200) {
    //         toast.success(intl.formatMessage({ id: "delete_success" }));
    //         dispatch(getChatContacts());
    //         history.push(`${window.location.pathname}`);
    //         window.location.reload();
    //       } else {
    //         toast.warn(message || intl.formatMessage({ id: "error" }));
    //       }
    //     } else {
    //     }
    //   });
    // }
  };
  return (
    <div className="chat-app-window">
      <div
        className={classnames("start-chat-area", {
          "d-none": Object.keys(selectedUser.conversation).length,
        })}
      >
        <div className="start-chat-icon mb-1">
          <MessageSquare />
        </div>
        <h4
          className="sidebar-toggle start-chat-text"
          onClick={handleStartConversation}
        >
          {intl.formatMessage({ id: "conversation" })}
        </h4>
      </div>
      {Object.keys(selectedUser?.conversation).length ? (
        <div
          className={classnames("active-chat", {
            "d-none": selectedUser === null,
          })}
        >
          <div className="chat-navbar">
            <header className="chat-header">
              <div className="d-flex align-items-center">
                <div
                  className="sidebar-toggle d-block d-lg-none mr-1"
                  onClick={handleSidebar}
                >
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight="36"
                  imgWidth="36"
                  img={userProfile?.userAvatar || defaultAvatar}
                  status="online"
                  className="avatar-border user-profile-toggle m-0 mr-1"
                />
                <h6 className="mb-0">
                  {selectedUser?.conversation?.stationsName}
                </h6>
              </div>
              <div className="d-flex align-items-center">
                <UncontrolledDropdown>
                  <DropdownToggle tag="div" className="btn btn-sm">
                    <MoreVertical size={20} className="cursor-pointer" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      onClick={() => {
                        setIsOpenModalDelete(true);
                      }}
                      className="w-100"
                    >
                      <Archive size={14} className="mr-50" />
                      <span className="align-middle">{intl.formatMessage({ id: "delete_action" })}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            className="user-chats"
            options={{ wheelPropagation: false }}
          >
            {selectedUser?.chat ? (
              <div className="chats">{renderChats}</div>
            ) : null}
          </ChatWrapper>

          <Form
            className="chat-app-form"
            style={{ position: "relative" }}
            onSubmit={(e) => handleSendMsg(e)}
          >
            {uploadUrl && (
              <div
                style={{ position: "absolute", left: 0, top: "-100px" }}
                className="w-100 bg-white p-1"
              >
                <div
                  style={{
                    position: "relative",
                    height: 80,
                    width: 165,
                  }}
                >
                  <img
                    src={uploadUrl}
                    alt=""
                    height={80}
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    onClick={() => setUploadUrl(null)}
                    style={{
                      borderRadius: "100%",
                      width: 14,
                      height: 14,
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                    }}
                    className="bg-danger text-white d-flex align-items-center justify-content-center cursor-pointer"
                  >
                    <X size={12} />
                  </div>
                </div>
              </div>
            )}
            <InputGroup className="input-group-merge mr-1 form-send-message">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder={intl.formatMessage({ id: "fill_message" })}
              />

              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <Label className="attachment-icon mb-0" for="attach-doc">
                    <Image
                      className="cursor-pointer text-secondary"
                      size={14}
                    />
                    <input
                      onChange={handleUploadImage}
                      type="file"
                      accept=".jpg, .png, .gif"
                      id="attach-doc"
                      hidden
                    />
                  </Label>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button className="send" color="primary">
              <Send size={14} className="d-lg-none" />
              <span className="d-none d-lg-block">{intl.formatMessage({ id: "send" })}</span>
            </Button>
          </Form>
        </div>
      ) : null}
       <ModalDeleteSupportChat
        isOpenModal={isOpenModalDelete}
        setIsOpenModal={setIsOpenModalDelete}
        handleDeteleChat={handleDeteleChat}
      />
    </div>
  );
};

export default injectIntl(memo(ChatLog))
