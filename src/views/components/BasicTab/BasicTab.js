import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

const BasicTab = ({ tabs, defaultTab,onChangeMore }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
    onChangeMore && onChangeMore(tab)
  };

  return (
    <div>
      <Nav tabs>
        {tabs.map(tab => (
          <NavItem key={tab.id}>
            <NavLink
              className={classnames({ active: activeTab === tab.id })}
              onClick={() => toggle(tab.id)}
            >
              {tab.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {tabs.map(tab => (
          <TabPane tabId={tab.id} key={tab.id}>
          {tab.id ===  activeTab && tab.content}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};

export default BasicTab;