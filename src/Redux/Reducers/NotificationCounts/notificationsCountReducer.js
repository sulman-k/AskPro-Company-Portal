const notificationCountReducer = (state = "", action) => {
  switch (action.type) {
    case "notificationCount": {
      state = action.payload;
      return state;
    }
    default:
      return state;
  }
};

export default notificationCountReducer;
