const EditCatModal = (state = false, action) => {
  switch (action.type) {
    case "editModal": {
      state = action.payload;
      return state;
    }
    default:
      return state;
  }
};

export default EditCatModal;
