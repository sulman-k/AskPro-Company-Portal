const CategoryModal = (state = "", action) => {
    switch (action.type) {
        case "CategoryModal": {
            state = action.payload
            return state
        }
        default:
            return state;
    }
};

export default CategoryModal;
