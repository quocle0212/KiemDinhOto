import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import { useIntl } from 'react-intl';
import { Button, Col, Row } from 'reactstrap';
import { toast } from "react-toastify";
import { kFormatter } from '@utils'
import CustomStatsCard from '../../ui-elements/cards/statistics/CustomStatsCard';
import { Search, Grid, Smartphone, MessageSquare, Mail } from 'react-feather'
import moment from 'moment';
import MessageCustomerMarketingServise from '../../../services/MessageCustomerMarketingServise';
import addKeyLocalStorage from '../../../helper/localStorage';
import { getDateStringFromMoment } from '../../../constants/dateFormats';
import MessageStatisticsLineChart from './MessageStatisticsLineChart';
import MessageStatisticsChart from './MessageStatisticsChart';
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats';
import './index.scss'

const convertDataForChart = (reportOutput) => {
  const labels = reportOutput.summaryMessageByType?.map(item => {
    let year = '';
    let month = '';
    if (item.month && item.month?.toString()?.length >= 6) {
      year = item.month.toString().slice(0, 4);
      month = item.month.toString().slice(4);
    }
    return "Tháng " + month + "- " + year;
  }) || [];
  const totalMessageSMS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageSMS || 0) || [];
  const totalMessageAPNS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageAPNS || 0) || [];
  const totalMessageZNS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageZNS || 0) || [];
  const totalMessageEmail = reportOutput.summaryMessageByType?.map(item => item?.totalMessageEmail || 0) || [];

  const chart = {
    labels,
    datasets: [
      {
        label: "Tổng số tin nhắn SMS",
        data: totalMessageSMS,
        backgroundColor: "#52C41A",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: "Tổng số tin nhắn APNS",
        data: totalMessageAPNS,
        backgroundColor: "#1890FF",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: "Tổng số tin nhắn ZNS",
        data: totalMessageZNS,
        backgroundColor: "#d48806",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: "Tổng số tin nhắn Email",
        data: totalMessageEmail,
        backgroundColor: "#CF1322",
        barThickness: 50,
        stack: 'Stack 0',
      },
    ],
  };

  const messages = {
    total: reportOutput?.totalMessage, // Tổng số tin nhắn của tất cả các nền tảng
    sms: {
      total: reportOutput?.totalMessageSMS, // Tổng số tin nhắn SMS
    },
    zns: {
      total: reportOutput?.totalMessageZNS, // Tổng số tin nhắn ZNS
    },
    apns: {
      total: reportOutput?.totalMessageAPNS, // Tổng số tin nhắn APNS
    },
    email: {
      total: reportOutput?.totalMessageEmail, // Tổng số tin nhắn Email
    },
  };

  return { chart, messages };
};

const convertDataForChartAndMessages = (reportOutput) => {
  const labels = reportOutput.summaryMessageByStatus?.map(item => {
    let year = '';
    let month = '';
    if (item.month && item.month?.toString()?.length >= 6) {
      year = item.month.toString().slice(0, 4);
      month = item.month.toString().slice(4);
    }
    return "Tháng " + month + "- " + year;
  }) || [];;
  const datasetSuccess = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageSuccess || 0) || [];;
  const datasetInProgress = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageInprogress || 0) || [];;
  const datasetFailed = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageFailed || 0) || [];;

  const chart = {
    labels,
    datasets: [
      {
        label: "Gửi thành công",
        data: datasetSuccess,
        backgroundColor: "#52C41A",
        fill: false,
        barThickness: 50,
        borderColor: "#52C41A",
      },
      {
        label: "Đang gửi",
        data: datasetInProgress,
        backgroundColor: "#d48806",
        barThickness: 50,
        borderColor: "#d48806",
        fill: false,
      },
      {
        label: "Gửi thất bại",
        data: datasetFailed,
        backgroundColor: "#CF1322",
        barThickness: 50,
        borderColor: "#CF1322",
        fill: false,
      },
    ],
  }

  const messages = {
    sms: {
      total: reportOutput?.totalMessage, // Tổng số tin nhắn
      sent: {
        value: reportOutput?.totalMessageSuccess, // Tổng số tin nhắn đã gửi thành công
        lastMonthValueDiff: {
          type: "increase", // Giả sử rằng số lượng tin nhắn đã gửi tăng so với tháng trước
        },
      },
      pending: {
        value: reportOutput?.totalMessageInprogress, // Tổng số tin nhắn đang chờ gửi
        lastMonthValueDiff: {
          type: "decrease", // Giả sử rằng số lượng tin nhắn đang chờ giảm so với tháng trước
        },
      },
      failed: {
        value: reportOutput?.totalMessageFailed, // Tổng số tin nhắn gửi thất bại
        lastMonthValueDiff: {
          type: "increase", // Giả sử rằng số lượng tin nhắn thất bại tăng so với tháng trước
        },
      },
    },
  };

  return { chart, messages };
}

function SmsStatistical({ stationsId }) {
  const intl = useIntl();
  const [paramsFilter, setParamsFilter] = useState({
    id: stationsId
  });
  const [startDate, setStartDate] = useState(getDateStringFromMoment(moment().subtract(5, 'months')))
  const [endDate, setEndDate] = useState(getDateStringFromMoment(moment()))
  const [statisticalData, setStatisticalData] = useState({})
  const [data, setData] = useState({});
  const messageStatistics = convertDataForChartAndMessages(statisticalData);
  const messagingPlatformStatistics = convertDataForChart(statisticalData);
  const [qtyMessageSms, setQtyMessageSms] = useState();
  const [qtyMessageZms, setQtyMessageZms] = useState();

  const handleFilterDay = () => {
    let endMonth = moment(endDate, DATE_DISPLAY_FORMAT).startOf('month');
    let startMonth = moment(startDate, DATE_DISPLAY_FORMAT).startOf('month');
    let totalMonthsInRange = endMonth.diff(startMonth, 'months');
    if(totalMonthsInRange <= -1) {
      toast.warn(intl.formatMessage({ id: 'invalidTimePeriod' }));
      return;
    }

    if (totalMonthsInRange <= 6) {
      const newParams = {
        ...paramsFilter,
        startDate: startDate,
        endDate: endDate
      };
      setParamsFilter(newParams);
      getData(newParams);
      return;
    }

    toast.warn(intl.formatMessage({ id: 'maxSixMonths' }));
  }

  function getData(params) {
    const newParams = {
      ...params
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')
      MessageCustomerMarketingServise.getReportOfStation(newParams, newToken).then((res) => {
        if (res) {
          setStatisticalData(res);
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    const newToken = token.replace(/"/g, '')
    setTimeout(() => {
      MessageCustomerMarketingServise.getMessageMarketingConfig({
        stationsId: stationsId
      }, newToken).then((res) => {
        if (res) {
          setData(res)
          setQtyMessageSms(res.remainingQtyMessageSmsCSKH + res.remainingQtyMessageSmsPromotion)
          setQtyMessageZms(res.remainingQtyMessageZaloCSKH + res.remainingQtyMessageZaloPromotion)
        }
      }) 
    }, 1000);
  }, []);

  useEffect(() => {
    getData({
      ...paramsFilter,
      startDate,
      endDate
    })
  }, [])

  // filter
  const handleFilterStartDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setStartDate(newDate)
  }

  const handleFilterEndDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY");
    setEndDate(newDate)
  }

  return (
    <div>
      <div className='d-flex justify-content-end w-100'>
        <Col className="mb-1 d-flex" sm="4" xs="12">
          <Flatpickr
            id="single"
            value={[startDate,endDate]}
            options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true' }}
            placeholder={intl.formatMessage({ id: 'start-date' })}
            className="form-control form-control-input font"
            onChange={(date) => {
              handleFilterStartDate([date[0]]);
              handleFilterEndDate([date[1]]);
            }}
          />
          <Button color="primary" size="sm" className="ml-1" style={{ height: 37, boxSizing: "border-box" }} onClick={() => handleFilterDay()}>
            <Search size={15} />
          </Button>
        </Col>
      </div>
      <div>
        <h3 className='title-normal mt-2 mb-0'>
          {intl.formatMessage({ id: 'messagesUsageTitle' })}
        </h3>
        <Row className='mt-2'>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={data?.remainingQtyMessageAPNS}
              kFormatter={kFormatter}
              icon={<Grid size={21} />}
              color='primary'
              statTitleId={intl.formatMessage({ id: 'remainingAPNSMessages' })}
            />
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={qtyMessageSms}
              kFormatter={kFormatter}
              icon={<Smartphone size={21} />}
              color='success'
              statTitleId={intl.formatMessage({ id: 'remainingSMSMessages' })}
            />
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={qtyMessageZms}
              kFormatter={kFormatter}
              icon={<MessageSquare size={21} />}
              color='warning'
              statTitleId={intl.formatMessage({ id: 'remainingZaloMessages' })}
            />
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={data?.remainingQtyMessageEmail}
              kFormatter={kFormatter}
              icon={<Mail size={21} />}
              color='info'
              statTitleId={intl.formatMessage({ id: 'remainingEmailMessages' })}
            />
          </Col>
        </Row>
        <h3 className='title-normal mt-2 mb-0'>
          {intl.formatMessage({ id: 'messagesStatusStatisticsTitle' })}
        </h3>
        <div className='row mt-2'>
          <div className='col-12 col-lg-12'>
            <MessageStatisticsLineChart chartData={messageStatistics.chart} />
          </div>
        </div>
        <h3 className='title-normal mt-2 mb-0'>
          {intl.formatMessage({ id: 'messagesQuantityStatisticsTitle' })}
        </h3>
        <Row className='mt-2'>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={messagingPlatformStatistics.messages?.apns?.total}
              kFormatter={kFormatter}
              icon={<Grid size={21} />}
              color='primary'
              statTitleId={intl.formatMessage({ id: 'quantityAPNS' })}
            >
              <div className='mess-qty-type'>
                <div className='message-success'><div>Thành công</div><div className='text-large'>{statisticalData?.totalMessageAPNSSuccess}</div></div>
                <div className='message-fail'><div>Thất bại</div><div className='text-large'>{statisticalData?.totalMessageAPNSFail}</div></div>
              </div>
            </CustomStatsCard>
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={messagingPlatformStatistics.messages?.sms?.total}
              kFormatter={kFormatter}
              icon={<Smartphone size={21} />}
              color='success'
              statTitleId={intl.formatMessage({ id: 'quantitySMS' })}
            ><div className='mess-qty-type'>
                <div className='message-success'><div>Thành công</div><div className='text-large'>{statisticalData?.totalMessageSMSSuccess}</div></div>
                <div className='message-fail'><div>Thất bại</div><div className='text-large'>{statisticalData?.totalMessageSMSFail}</div></div>
              </div>
            </CustomStatsCard>
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={messagingPlatformStatistics.messages?.zns?.total}
              kFormatter={kFormatter}
              icon={<MessageSquare size={21} />}
              color='warning'
              statTitleId={intl.formatMessage({ id: 'quantityZNS' })}
            >
              <div className='mess-qty-type'>
                <div className='message-success'><div>Thành công</div><div className='text-large'>{statisticalData?.totalMessageZNSSuccess}</div></div>
                <div className='message-fail'><div>Thất bại</div><div className='text-large'>{statisticalData?.totalMessageZNSFail}</div></div>
              </div>
            </CustomStatsCard>
          </Col>
          <Col lg='3' sm='6' className='mt-lg-0 mt-2'>
            <CustomStatsCard
              data={messagingPlatformStatistics.messages?.email?.total}
              kFormatter={kFormatter}
              icon={<Mail size={21} />}
              color='danger'
              statTitleId={intl.formatMessage({ id: 'quantityEmail' })}
            >
              <div className='mess-qty-type'>
                <div className='message-success'><div>Thành công</div><div className='text-large'>{statisticalData?.totalMessageEmailSuccess}</div></div>
                <div className='message-fail'><div>Thất bại</div><div className='text-large'>{statisticalData?.totalMessageEmailFail}</div></div>
              </div>
            </CustomStatsCard>
          </Col>
        </Row>
        <h3 className='title-normal mt-2 mb-0'>
          {intl.formatMessage({ id: 'messagesTypeStatisticsTitle' })}
        </h3>
        <div className='row mt-2'>
          <div className='col-12 col-lg-12'>
            <MessageStatisticsChart chartData={messagingPlatformStatistics.chart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsStatistical;