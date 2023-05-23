const isWareHouseFilter = (state = 0, action) => {
    switch (action.type) {
        case "Filter":
            return state = 1;

        default:
            return state = 0;
    }
};

export default isWareHouseFilter;