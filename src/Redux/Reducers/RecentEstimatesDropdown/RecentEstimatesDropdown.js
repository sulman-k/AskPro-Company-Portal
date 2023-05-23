const RecentEstimatesDropdown = (state = "", action) => {
  switch (action.type) {
    case "FilterValue": {
      state = action.payload
      return state
    }
    default:
      return state;
  }
};

export default RecentEstimatesDropdown;
