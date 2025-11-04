import { useEffect, useState } from 'react'
import { Pagination, Input } from 'reactstrap'
import { ChevronLeft, ChevronRight } from 'react-feather'
import './style.scss'

const BasicTablePagingCopy = ({ handlePaginations, totalRestData, setCurrentPage, currentPage }) => {
  const Enter = 13
  const [value, setValue] = useState(currentPage || 1)

  useEffect(()=>{
    setValue(currentPage)
  },[currentPage])

  const onKeyDown = (e) => {
    if (e.keyCode === Enter) {
      // click vào phím enter
      const targetValue = +e.target?.value || 1 // Mặc định giá trị là 1 nếu không có giá trị hợp lệ
      setCurrentPage(targetValue)
      setValue(targetValue)
      handlePaginations(targetValue)
    }
  }

  const handleChange = (value) => {
    let newValue = Number(value.replace(/[^0-9]/g, ''))
    setValue(newValue)
  }

  const moveToNextPage = () => {
    if (totalRestData > 0) {
      setValue(value + 1)
      setCurrentPage((prev) => {
        const nextPage = prev + 1
        handlePaginations(nextPage)
        return nextPage
      })
    }
  }

  const moveToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const prevPage = prev - 1
        handlePaginations(prevPage)
        return prevPage
      })
      setValue(value - 1)
    }
  }

  return (
    <Pagination className="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-3 mt-1">
      <div className="prev-item position-relative">
        <span onClick={() => moveToPreviousPage()} className={`bg_left ${currentPage === 1 ? 'disabled' : ''}`}>
          <ChevronLeft />
        </span>
      </div>
      <div>
        <Input
          className="input_paging"
          value={value}
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => {
            handleChange(e.target.value)
          }}
        />
      </div>
      <div className="next-item position-relative">
        <span onClick={() => moveToNextPage()} className={`bg_right ${totalRestData === 0 ? 'disabled' : ''} `}>
          <ChevronRight />
        </span>
      </div>
    </Pagination>
  )
}

export default BasicTablePagingCopy
