// ** React Imports
import { Fragment, useState, useEffect,memo } from 'react'
import { injectIntl } from "react-intl";
// ** Chat App Component Imports
import Chat from './Chat'
import Sidebar from './SidebarLeft'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, getChatContacts } from './store/actions'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

const AppChat = ({intl}) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.chat);

  const [sidebar, setSidebar] = useState(false);
  const [userSidebarRight, setUserSidebarRight] = useState(false);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);
  const handleSidebar = () => setSidebar((pre) => !pre);
  const handleOverlayClick = () => {
    setSidebar(false);
    setUserSidebarRight(false);
    setUserSidebarLeft(false);
  };

  // ** Get data on Mount
  useEffect(() => {
    // dispatch(getChatContacts());
  }, []);

  if (!store.chats) return null;

  return (
    <Fragment>
      <Sidebar
        store={store}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
      />

      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <div
              className={classnames("body-content-overlay", {
                show:
                  userSidebarRight === true ||
                  sidebar === true ||
                  userSidebarLeft === true,
              })}
              onClick={handleOverlayClick}
            />
            <Chat
              store={store}
              userSidebarLeft={userSidebarLeft}
              handleSidebar={handleSidebar}
              getChatContacts={getChatContacts}
              intl={intl}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default injectIntl(memo(AppChat))
