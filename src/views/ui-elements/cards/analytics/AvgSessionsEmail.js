import { kFormatter } from '@utils'
import {
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  Progress
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import './AvgSessions.scss'
import _ from 'lodash'

const AvgSessions = props => {
  const { data = {} } = props 

  function findEmailValue(searchText1, searchText2) {
    if(data && data.totalEmailMessageByStatus && data.totalEmailMessageByStatus.length > 0) {
      let findMessageSent
      if(searchText2) {
        findMessageSent = data.totalEmailMessageByStatus.find(item => (item.customerMessageStatus === searchText2 ||  item.customerMessageStatus === searchText1))
      } else {
        findMessageSent = data.totalEmailMessageByStatus.find(item => item.customerMessageStatus === searchText1)
      }
      if(findMessageSent && findMessageSent.count) {
        return findMessageSent.count
      }
    }
    return 0
  }
  
  const EmailSent = findEmailValue("Completed")
  const EmailUnSend = findEmailValue("New", "Sending")
  const EmailSendFail = findEmailValue("Failed", "Canceled")

  return data !== null ? (
    <Card>
      <CardBody>
        <Row className='pb-50'>
          <Col
            sm={{ size: 6, order: 1 }}
            xs={{ order: 2 }}
            className='d-flex justify-content-between mt-lg-0 mt-2'
          >
            <div className='session-info mb-1 mb-lg-0'>
              <h2 className='font-weight-bold mb-25'>{kFormatter(data.totalEmailMessage)}</h2>
              <CardText className='font-weight-bold mb-2'>{props.intl.formatMessage({id: "message"})} Email</CardText>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className='pt-50'>
          <div className='col-12'>
            {/*  */}
            {/* <div className='mb-3'>
              <p className='mb-50 my_text'>{props.intl.formatMessage({id: "money"})} Email: {kFormatter(data.emailSpentAmount ? data.emailSpentAmount : 0)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={data.emailSpentAmount ? (data.emailSpentAmount/data.TotalMoney*100) : 0} />
            </div> */}
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>{props.intl.formatMessage({id: "sent"}, { type: "Email" })}: {kFormatter(EmailSent)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={EmailSent !== 0 ? (EmailSent/data.totalMessageCount*100) : EmailSent} />
            </div>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>
                {props.intl.formatMessage({id: "unsentMessage"}, { type: "Email" })}: {kFormatter(EmailUnSend)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={EmailUnSend !== 0 ? (EmailUnSend/data.totalMessageCount*100) : EmailUnSend} />
            </div>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>
                {props.intl.formatMessage({id: "sendFailed"}, { type: "Email" })}: {kFormatter(EmailSendFail)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={EmailSendFail !== 0 ? (EmailSendFail/data.totalMessageCount*100) : EmailSendFail} />
            </div>
            {/*  */}
          </div>
        </Row>
      </CardBody>
    </Card>
  ) : null
}
export default injectIntl(AvgSessions)