const CategoryId = (state = "", action) => {
    switch (action.type) {
      case "CategoryID": {
        state = action.payload
        return state
      }
      default:
        return state;
    }
  };
  
  export default CategoryId;
  