const isRecentEstFilter = (state, action) => {
    switch (action.type) {
        case "FilterValue":
            return {
                slctdValue: action.payload
            }
        default:
            return state
    }
};

export default isRecentEstFilter;