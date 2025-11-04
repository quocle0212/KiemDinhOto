
import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useState } from 'react'
import { injectIntl } from "react-intl"
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import HomepageServiceItem from './homepageServiceItem'

const Automation = ({intl}) => {
    const [active, setActive] = useState('1')

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
            active={active === '1'}
            onClick={() => {
                toggle('1')
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'driver_amenities' })}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
                toggle('2')
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'government_agency' })}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
                toggle('3')
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'partner' })}</span>
          </NavLink>
        </NavItem>
      </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId={'1'}>
            <Row >
              <Col sm='12' xs='12'>
                <HomepageServiceItem configCategory={1}/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={'2'}>
            <Row >
              <Col sm='12' xs='12'>
                <HomepageServiceItem configCategory={2}/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={'3'}>
            <Row >
              <Col sm='12' xs='12'>
                <HomepageServiceItem configCategory={3}/>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Fragment>
  );
}

export default injectIntl(memo(Automation)) 

