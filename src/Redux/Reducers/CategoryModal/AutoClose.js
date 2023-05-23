const CloseButtonFunc = (state = 0, action) => {
    switch (action.type) {
        case "CloseButton": {
            state = state + action.payload
            return state
        }
        default:
            return state;
    }
};

export default CloseButtonFunc;
