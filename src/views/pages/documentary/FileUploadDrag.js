import React, { useRef, useEffect, useState } from 'react'
import { Link, Plus } from 'react-feather'
import './index.scss' 
import { toast } from 'react-toastify'

const FileUploadMultipleName = ({ setDataFiles, documentFiles, userData , onDelete , onAdd , onEdit }) => {
  const [files, setFiles] = useState([])
  const inputRef = useRef()
  const [fileNames, setFileNames] = useState([])
  const onDragEnter = () => inputRef.current.classList.add('dragover');
  const onDragLeave = () => inputRef.current.classList.remove('dragover');
  const onDrop = () => inputRef.current.classList.remove('dragover');


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
      <div onClick={() => inputRef.current.click()}>
        <div
          ref={inputRef}
          className="drop-file-input"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          setDataFiles={setDataFiles}
          userData={{}} 
          >
          <div className="drop-file-input__label">
            <Plus size={40} className="icon"></Plus>
            <p>Kéo thả hoặc bấm để chọn file</p>
          </div>
            <input type="file" multiple  onChange={(e) => {
              if (files.length >=2) {
                return toast.warn("Tải tối đa 2 file")
              }
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
            }}/>
          </div>
          {files.length > 0 ? (
            <div className="drop-file-preview">
              <p className="drop-file-preview__title">
                Danh sách file:
              </p>
              {files.map((item, index) => (
                <div key={index} className="drop-file-preview__item">
                  <div className="drop-file-preview__item__info">
                    <p key={index} 
                      onChange={(e) => handleFileNameChange(index, e.target.value)}
                      onBlur={() => handleBlur(index)}
                    >
                      {fileNames[index]}
                    </p>
                  </div>
                  <span className="drop-file-preview__item__del" onClick={() => removeFile(index)}>x</span>
                  {item.url &&
                    <a className="drop-file-preview__item__del" href={item.url} style={{right: "-20px", padding:"4px", backgroundColor:"green"}}><Link/></a>
                  }
                </div>
              ))}
            </div>
          ) : null
        }
      </div>
        </div>
      </div>
    )
  }
  
  export default FileUploadMultipleName;
  