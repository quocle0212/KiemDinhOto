import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StationFunctions from '../services/StationFunctions'
import addKeyLocalStorage from '../helper/localStorage'
import { stationTypes } from '../constants/dateFormats'

const MetadataAndConfig = createContext({})

export const MetadataAndConfigProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(
    localStorage.getItem(addKeyLocalStorage('metadata')) ? JSON.parse(localStorage.getItem(addKeyLocalStorage('metadata'))) : {}
  )
  const getMetadata = () => {
    StationFunctions.MetaData().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          localStorage.setItem(addKeyLocalStorage('metadata'), JSON.stringify(data))
          setMetadata(data)
        }
      }
    })
  }

  useEffect(() => {
    getMetadata()
  }, [])

  const STATION_TYPE = useMemo(() => {
    if (metadata && metadata?.STATION_TYPE_OBJECTS) {
      const stationTypeObject = metadata?.STATION_TYPE_OBJECTS || {}
      const result = Object.values(stationTypeObject).map((item) => ({
        label: item.stationTypeName,
        value: item.stationType
      }))
      return result
    }
    return stationTypes
  }, [metadata])

  return <MetadataAndConfig.Provider value={{ metadata, STATION_TYPE }}>{children}</MetadataAndConfig.Provider>
}

export const useMetadataAndConfig = () => useContext(MetadataAndConfig)
