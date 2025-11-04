import Chart from 'react-apexcharts'
import { MoreVertical, Loader } from 'react-feather'
import {
  Card,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Media,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import "./index.scss";
import { readAllStationsDataFromLocal } from "../../../../helper/localStorage";
import { readAllArea } from "../../../../helper/localStorage";
import { storeAllStationsDataToLocal } from "../../../../helper/localStorage";
import { storeAllArea } from "../../../../helper/localStorage";
import { useHistory } from 'react-router-dom'

const readLocal = readAllStationsDataFromLocal();
const readArea = readAllArea()
const EnableBooking = ({ intl }) => {
  const [listStationArea, setListStationArea] = useState(readLocal)
  const [area, setArea] = useState(readArea)
  const [modal, setModal] = useState(false);
  const history = useHistory()
  const data = async () =>{
    const result = await storeAllStationsDataToLocal()
    const area = await storeAllArea()
  }

  const array = [];
  area?.map((item, index) => {
    array[index] = {
      name : item.value ,
      data : listStationArea?.filter((el) => el.stationArea === item.value),
    }
  })

  const newArray = array.filter((item) => {
    return item.data.length > 0
  })

  const resultArray = newArray?.map((item) => {
    const variable = item.data?.map((res) =>{
      return (res.stationBookingConfig?.filter(value => value.enableBooking !== 0 ))
    }
    )
    const newArr = variable.filter(item =>{
      return item.length > 0
    })
    const totalItem = item.data.length
    const totalActive = newArr.length
    const percent = (totalActive  * 100 / totalItem).toFixed(0)
    return {
      ...item, 
      percent 
    }
  })
  resultArray.sort((a,b) => b.percent - a.percent)
  const topArea = resultArray.slice(0, 10)

  useEffect(() => {
    if(!readLocal) {
      data().then(res => {
        setListStationArea(readAllStationsDataFromLocal())
      })
    }
    if(!readArea) {
      data().then(res => {
        setArea(readAllStationsDataFromLocal())
      })
    }
  },[readLocal,readArea])

  const statesArr = topArea.map(item =>
    (
      {
      title: item?.name,
      value: item?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [item?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
          },
          stroke: {
            lineCap: 'round'
          },
        }
      }
    }
  ))

  const chartArea = resultArray.map(item =>(
    {
      title: item?.name,
      value: item?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [item?.percent],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else if(value > 60){
                  return '#16a34a'
              }
            }]
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#C0C0C0']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }}
  ))

  const renderStates = () => {
    return statesArr.map((state) => {
      return (
        <div key={state.title} className="browser-states">
          <Media>
            <h5 className="align-self-center mb-0">{state.title}</h5>
          </Media>
          <div className="d-flex align-items-center">
            <div className="font-weight-bold text-body-heading mr-1">{state.value}</div>
            <Chart
              options={state.chart.options}
              series={state.chart.series}
              type={state.chart.type}
              height={state.chart.height}
              width={state.chart.width}
            />
          </div>
        </div>
      )
    })
  }

  const renderArea = () => {
    return chartArea.map((state) => {
      return (
        <div key={state.title} className="d-flex browser-states flex-nowrap justify-content-between">
          <Media>
          <h5 className="align-self-center mb-0 style_text"
            onClick={(e) => {
              e.preventDefault();
              history.push("/pages/detail", state.title)
            }}
            >{state.title}</h5>
          </Media>
          <div className="d-flex align-items-center">
            <div className="font-weight-bold text-body-heading mr-1">{state.value}</div>
            <Chart
              options={state.chart.options}
              series={state.chart.series}
              type={state.chart.type}
              height={state.chart.height}
              width={state.chart.width}
            />
          </div>
        </div>
      )
    })
  }

  return readAllArea !== null ?(
    <Row>
      <Col>
        <Card className="card-browser-states">
          <CardHeader className='flex-nowrap'>
            <div>
              <CardTitle tag="h3">{intl.formatMessage({ id: 'Activation' })}</CardTitle>
              <CardText className="font-small-2">{intl.formatMessage({ id: 'action_area' })}</CardText>
            </div>
            <UncontrolledDropdown className="chart-dropdown">
              <DropdownToggle color="" className="bg-transparent btn-sm border-0 p-50">
                <MoreVertical size={18} className="cursor-pointer" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="w-100" onClick={() =>setModal(true)}>{intl.formatMessage({ id: 'see_all' })}</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardHeader>
          <CardBody 
          className="pointer"
          onClick={(e) => {
            e.preventDefault();
            history.push("/pages/detail")
          }}
          >{renderStates()}</CardBody>
        </Card>
      </Col>
      <Modal
      isOpen={modal}
      toggle={() => setModal(false)}
      className={`modal-dialog-centered name_text`}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "Area" })}
        </ModalHeader>
        <ModalBody>
          <div className="area_text">
             {renderArea()}
          </div>
        </ModalBody>
      </Modal>
    </Row>
  ) : (
    ( <Card className='d-flex justify-content-center align-items-center'>
          <CardHeader>
            <Loader size={60}/>
          </CardHeader>
        </Card>)
  )
}

export default injectIntl(memo(EnableBooking))
