import React, { useRef, useEffect, useState } from 'react'
import { XSquare } from 'react-feather'
import { Button } from 'reactstrap'

const FileUploadMultipleName = ({ setDataFiles, documentFiles, userData , onDelete , onAdd , onEdit }) => {
  const [files, setFiles] = useState([])
  const inputRef = useRef()
  const [fileNames, setFileNames] = useState([])


  const removeFile = (index) => {
    if(onDelete) {
      onDelete(userData.documentFiles[index].stationDocumentFileId)
      return;
    }

    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    const newFileNames = [...fileNames]
    newFileNames.splice(index, 1)
    setFileNames(newFileNames)
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
      for (const item of data) {
        const arrayName = item.url.split('/')

        if (arrayName.length > 1) {
          const name = arrayName[arrayName.length - 1]
          const file = await getFileFromUrl(item.url, name)
          if (item) {
            listData.push({
              ...item,
              file,
              name : item.name || file.name,   
              size : item.size
            })
          }
        }
      }
      if (listData.length) {
        setFiles([...listData])
        const initialFileNames = listData.map((file) => file.name)
        setFileNames(initialFileNames)
      }
    }
  }

  useEffect(() => {
    handleSetData(documentFiles)
  }, [userData])

  useEffect(() => {
    setDataFiles([...files])
  }, [files])

  const handleBlur = (index) => {
    if (onEdit) {
      onEdit({
        id: userData.documentFiles[index].stationDocumentFileId,
        data : {
          documentFileName: files[index].name
        }
      })
    }
  };

  const handleFileNameChange = (index, newName) => {
    const newFileNames = [...fileNames]
    const newFiles = [...files]
    newFiles[index].name = newName
    newFileNames[index] = newName
    setFileNames(newFileNames)
    setFiles(newFiles)
  }

  return (
    <div css={CSS}>
      <div className="form-container">
        <div>
          {files.map((item, index) => (
            <p key={index}>
              <input
                type="text"
                value={fileNames[index]}
                onChange={(e) => handleFileNameChange(index, e.target.value)}
                onBlur={() => handleBlur(index)}
                style={{ width : "50%" }}
              />
              <span
                onClick={() => removeFile(index)}
              >
                <XSquare />
              </span>
            </p>
          ))}
        </div>

        <div>
          <Button onClick={() => inputRef.current.click()}>File</Button>

          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files)
              const updatedFiles = selectedFiles.map((file) => ({
                file,
                name: file.name,
                size : file.size
              }))

              if(onAdd) {
                onAdd(updatedFiles);
                return;
              }

              setFiles([...files, ...updatedFiles])
              const updatedFileNames = selectedFiles.map((file) => file.name)
              setFileNames([...fileNames, ...updatedFileNames])
              inputRef.current.value = null
            }}
            />
          </div>
        </div>
      </div>
    )
  }
  
  export default FileUploadMultipleName;
  