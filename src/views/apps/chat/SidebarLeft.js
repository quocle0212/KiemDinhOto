// ** React Imports
import { useEffect, useMemo, useRef, useState, memo } from "react";

// ** Custom Components
import Avatar from "@components/avatar";
import { injectIntl } from "react-intl";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from "./store/actions";
// ** Utils
import { formatDateToMonthShort } from "@utils";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

// ** Third Party Components
import { getUserData } from "@utils";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Search, X } from "react-feather";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
} from "reactstrap";
import classNames from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { getChatContacts } from "./store/actions";

const SidebarLeft = ({ sidebar, handleSidebar, store, intl } = {}) => {
  const { chats, selectedUser } = store;
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchText, setSearchText] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const userData = getUserData();
  const conversationId = queryParams.get("id");
  const userAvatar = userData?.avatar || defaultAvatar;

  const handleUserClick = (item) => {
    // history.push(`${window.location.pathname}?id=${item.appUserConversationId}`);
    // dispatch(selectChat(item));
  };

  const listRender = useMemo(() => {
    return chats?.data?.filter((item) => {
      if (!searchText) return true;
      return `${item?.stationsName}`.includes?.(searchText);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, chats?.data]);

  useEffect(() => {
    // const selecter = chats?.data?.find(
    //   (item) => item.appUserConversationId === Number(conversationId)
    // );
    // if (selecter) {
    //   dispatch(selectChat(selecter));
    // }
  }, []);

  useEffect(() => {
    let timer;
    timer = setInterval(() => {
      dispatch(getChatContacts());
    }, 30000);
  }, []);
  return (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classNames("sidebar-content", {
            show: sidebar === true,
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div className="sidebar-profile-toggle">
                <Avatar
                  className="avatar-border"
                  img={userAvatar}
                  status="online"
                  imgHeight="42"
                  imgWidth="42"
                />
              </div>
              <InputGroup className="input-group-merge ml-1 w-100">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  value={searchText}
                  className="round"
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
          >
            <h4 className="chat-list-title">
              {intl.formatMessage({ id: "message" })}  ({!searchText ? chats?.total : listRender?.length})
            </h4>
            <ul className="chat-users-list chat-list media-list">
              {!listRender?.length && (
                <li className="no-results show">
                  <h6 className="mb-0">{intl.formatMessage({ id: "empty_message" })} </h6>
                </li>
              )}
              {listRender?.map?.((item) => {
                const time = formatDateToMonthShort(item?.updatedAt);
                return (
                  <li
                    key={item.appUserConversationId}
                    onClick={() => handleUserClick(item)}
                    className={classNames("cursor-pointer", {
                      active:
                        store?.selectedUser?.conversation
                          ?.appUserConversationId ===
                        item?.appUserConversationId,
                    })}
                  >
                    <div className="chat-info flex-grow-1">
                      <h5 className="mb-0">{item?.stationsName}</h5>
                      <Avatar
                        className="avatar-border"
                        img={item?.userAvatar ? item?.userAvata : userAvatar}
                        status="online"
                        imgHeight="42"
                        imgWidth="42"
                      />
                      <div>{item?.newestMessage?.appUserChatLogContent}</div>
                    </div>
                    <div className="chat-meta text-nowrap">
                      <small className="chat-time ml-25">{time}</small>
                      {item?.senderReadMessage === 0 && (
                        <div
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: "100%",
                            marginTop: 5,
                          }}
                          className="float-right bg-danger ml-1"
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(memo(SidebarLeft));
