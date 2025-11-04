const initialState = {
  dataUpload: [],
  isOpen: false
}

const importReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_OPEN_IMPORT':
      return { ...state, isOpen: action.payload, dataUpload: [] }
    case 'ADD_UPLOAD_DATA_IMPORT':
      return { ...state, dataUpload: action.payload }
    default:
      return state
  }
}

export default importReducer
