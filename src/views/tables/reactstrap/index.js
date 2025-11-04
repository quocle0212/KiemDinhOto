import { Fragment, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import prism from 'prismjs'
import TableBasic from './TableBasic'

import Breadcrumbs from '@components/breadcrumbs'
import Card from '@components/card-snippet'

const Tables = () => {
  useEffect(() => {
    prism.highlightAll()
  })

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Users List' breadCrumbParent='' breadCrumbActive='' />
      <Row>
        <Col sm='12'>
          <Card >

            <TableBasic />
          </Card>
        </Col>

      </Row>
    </Fragment>
  )
}

export default Tables
