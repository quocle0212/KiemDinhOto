import React from 'react'
import BasicAutoCompleteDropdown from '../BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { APP_USER_DATA_KEY } from '../../../helper/localStorage'

const ServiceFunction = ({ listArea }) => {
  const dataUser = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY))
  let newListArea = []
  if (dataUser.stationArea.length !== 3) {    // 3 nghĩa là 'ALL'
    let check = dataUser.stationArea.indexOf(',')
    if (check === -1) {
      DefaultFilter.filter.stationArea = dataUser.stationArea
      const item = { value: dataUser.stationArea, label: dataUser.stationArea }
      newListArea.push(item)
    }
    if (check !== -1) {
      let newArr = dataUser.stationArea.split(',')
      DefaultFilter.filter.stationArea = newArr[0]
      newArr.map((item) => {
        let Arr = listArea?.filter((el) => el.value === item)
        Arr?.map((op) => {
          newListArea.push(op)
        })
      })
    }
  }

  return (
    <div>
      <BasicAutoCompleteDropdown
        placeholder="Khu vực"
        name="stationArea"
        options={newListArea.length > 0 ? newListArea : listArea}
        onChange={({ value }) => handleFilterChange('stationArea', value)}
      />
    </div>
  )
}

export default ServiceFunction
