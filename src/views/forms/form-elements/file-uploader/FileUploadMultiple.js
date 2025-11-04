import React, { useRef, useEffect, useState } from 'react'

import { XSquare } from 'react-feather'
import { Button } from 'reactstrap'

const UploadFilesImage = ({ setDataFiles, documentFiles, userData }) => {
  const [files, setFiles] = useState([])

  const inputRef = useRef()
  const removeFile = (index) => {
    const newData = files.filter((item, indexActive) => indexActive !== index)
    setFiles(newData)
  }
  async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
    const response = await fetch(url)
    const data = await response.blob()
    return new File([data], name, {
      type: data.type || defaultType
    })
  }

  async function handleSetData(data) {
    const listData = []

    if (data) {
      for (const url of data) {
        const arrayName = url.split('/')

        if (arrayName.length > 1) {
          const name = arrayName[arrayName.length - 1]
          const item = await getFileFromUrl(url, name)
          if (item) {
            listData.push(item)
          }
        }
      }
      if (listData.length) {
        setFiles([...listData])
      }
    }
  }

  useEffect(() => {
    handleSetData(documentFiles)
  }, [userData])

  useEffect(() => {
    setDataFiles([...files])
  }, [files])

  return (
    <div css={CSS}>
      <div className="form-container">
        <div>
          <p>
            {files.map((item, index) => (
              <p>
                {documentFiles[index] ? (
                  <p
                    className="link"
                    onClick={() => {
                      window.location.href = documentFiles[index]
                    }}
                    key={item?.name}>
                    <span>{item?.name}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}>
                      <XSquare />
                    </span>
                  </p>
                ) : (
                  <p>
                    <span>{item?.name}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}>
                      <XSquare />
                    </span>
                  </p>
                )}
              </p>
            ))}
          </p>
        </div>

        <div>
          <Button onClick={() => inputRef.current.click()}>File</Button>

          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              setFiles([...files, e.target.files[0]])
              inputRef.current.value = null
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadFilesImage
