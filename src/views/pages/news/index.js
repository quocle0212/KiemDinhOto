import React, { Fragment, memo, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Col, Input, InputGroup, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import { ChevronDown, ChevronLeft, Eye, Search } from 'react-feather'
import { injectIntl } from 'react-intl'
import NewsService from '../../../services/news'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import ListNews from './ListNews'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import PostNews from './PostNews'
import HotNew from "./HotNew";
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import './index.scss'

const DefaultFilter = {
  filter: {
    stationNewsCategories : "ALL"
  },
  skip: 0,
  limit: 20
}

function News({ intl }) {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('1')
  const [searchValue, setSearchValue] = useState('')
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(20)
  const [embeddedCode , setEmbeddedCode ] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatePost, setUpdatePost] = useState('')
  const [news, setNews] = useState([])
  const [firstPage, setFirstPage] = useState(false)
  // const [file, setFile] = useState()
  const [postData, setPostData] = useState({
      postTitle: "",
      documentContent: "",
      embeddedCode: ""
  })
  const [blob, setBlob] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const DefaultFilters = {
    filter: {
    },
    skip: 0,
    limit: 20
  }

  const getListNews = (DefaultFilter) => {
    NewsService.getListNews(DefaultFilter).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          let newData=data.data
          newData.unshift({
            stationNewsCategoryId:'ALL',
            stationNewsCategoryTitle:'Tất cả danh mục'
          });
          setNews(newData)
        }
      }
    })
  }

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue
    }
    if (newParams.searchText) {
      setParamsFilter(newParams)
      getData(newParams)
    } else {
      getData(DefaultFilter)
    }
  }

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  function getData(params) {
    if(params.filter.stationNewsCategories === 'ALL'){
      delete params.filter.stationNewsCategories
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      NewsService.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
      })
    } else {
      window.localStorage.clear()
    }
  }
  function handelUpdatePost(row) {
    setUpdatePost(row)
    setPostData({
      ...postData,
      postTitle: row.stationNewsTitle,
      documentContent: row.stationNewsContent,
      category: row.stationNewsCategories,
      embeddedCode: row.embeddedCode,
      ordinalNumber : row.ordinalNumber,
      stationNewsExpirationDate:row.stationNewsExpirationDate
    })
    setEmbeddedCode(row.embeddedCode || "");
    setBlob(row.stationNewsAvatar)
    setActiveTab('3')
  }

  const handleFilterStartDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    if(newDateObj){
      setStartDate(newDate)
    }else{
      setStartDate()
    }
  }
  const handleFilterEndDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY");
    if(newDateObj){
      setEndDate(newDate)
    }else{
      setEndDate()
    }
    // const newDateFlat = moment(newDateObj).format('DD/MM/YYYY')
    // setFlat(newDateFlat)
  }

  const handleFilterDay = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      skip: 0,
      limit: 20,
      startDate: startDate,
      endDate: endDate
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  useEffect(() => {
    getListNews(DefaultFilters)
    getData(paramsFilter)
  }, [])

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  return (
    <Fragment>
      <Card className="newTab">
      <Nav tabs>
          <NavItem>
            <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
              {intl.formatMessage({ id: 'content' })}
            </NavLink>
          </NavItem>

          {/* <NavItem>
            <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
              {intl.formatMessage({ id: 'outstanding' })}
            </NavLink>
          </NavItem> */}

          <NavItem>
            <NavLink className={activeTab == '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
              {intl.formatMessage({ id: 'new_post' })}
            </NavLink>
          </NavItem>
        </Nav>
      
        {activeTab == 1 ?<Row className="mt-1">
          <Col sm="4" xs="12" lg='3' className="d-flex mt-sm-0 mt-1 h-100">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
              <Button color="primary" size="md" className="mb-1" onClick={() => handleSearch()}>
                <Search size={15} />
              </Button>
            </InputGroup>
          </Col>
          <Col sm="4" xs="12" lg='3' className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder={'Loại bài đăng'}
                name='stationNewsCategories'
                options={news}
                getOptionLabel={(option) => option.stationNewsCategoryTitle}
                getOptionValue={(option) => option.stationNewsCategoryId}
                onChange={(e) => {
                  handleFilterChange('stationNewsCategories', `${e.stationNewsCategoryId}`);
                }}
              />
              
          </Col>
          <Col className="mb-1 d-flex" sm="4" xs="12">
            <Flatpickr
              id="single"
              value={startDate}
              options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: "start-date" }) + " - " + intl.formatMessage({ id: "end-date" })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterStartDate([date[0]]);
                handleFilterEndDate([date[1]]);
              }}
            />
            <Button color="primary" size="md" className="" onClick={() => handleFilterDay()}>
              <Search size={15} />
            </Button>
          </Col>
        </Row> : <Row></Row>}
      
      <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <div className="mx-0 mb-50 [dir]">
              <ListNews
                items={items}
                total={total}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                firstPage={firstPage}
                handlePagination={handlePagination}
                getData={getData}
                paramsFilter={paramsFilter}
                handelUpdatePost={handelUpdatePost}
              />
            </div>
          </TabPane>
          {/* <TabPane tabId="2">
             <HotNew 
             handelUpdatePost={handelUpdatePost}
           />
          </TabPane> */}
          <TabPane tabId="3">
            <PostNews
              paramsFilter={paramsFilter}
              getData={getData}
              updatePost={updatePost}
              blob={blob}
              setBlob={setBlob}
              postData={postData}
              embeddedCode={embeddedCode}
              setEmbeddedCode={setEmbeddedCode}
              setPostData={setPostData}
            />
          </TabPane>
        </TabContent>
        </Card>
    </Fragment>
  )
}
export default injectIntl(memo(News))
