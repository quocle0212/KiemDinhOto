import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useState } from 'react'
import { injectIntl } from "react-intl"
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import Marketing from './marketing'

const Automation = ({intl}) => {
    let schedules = '1'
    const [active, setActive] = useState(schedules)

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
      }

  return (
    <Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === schedules}
            onClick={() => {
                toggle(schedules)
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'marketing' })}</span>
          </NavLink>
        </NavItem>
      </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId={schedules}>
            <Row >
              <Col sm='12' xs='12'>
                <Marketing />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Fragment>
  );
}

export default injectIntl(memo(Automation)) 
