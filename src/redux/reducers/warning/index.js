const initialState = {
    dataUpload: [],
    isOpen: false
  }
  
  const importWarning = (state = initialState, action) => {
    switch (action.type) {
      case 'CHANGE_OPEN_IMPORT_WARNING':
        return { ...state, isOpen: action.payload, dataUpload: [] }
      case 'ADD_UPLOAD_DATA_IMPORT_WARNING':
        return { ...state, dataUpload: action.payload }
      default:
        return state
    }
  }
  
  export default importWarning