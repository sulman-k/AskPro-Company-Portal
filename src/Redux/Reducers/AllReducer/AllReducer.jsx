import isLogged from "../Login/IsLogged";
import isAdmin from "../Roles/Admin";
import isUser from "../Roles/User";
import CategoryModal from "../CategoryModal/CategoryModal";
import RecentEstimatesDropdown from "../RecentEstimatesDropdown/RecentEstimatesDropdown";
import CategoryId from "../category/categoryId";
import CloseButtonFunc from "../CategoryModal/AutoClose";
import EditCatModal from "../EditCatModal/EditcatModal";
import isNewPwdEmail from "../Login/NewPwdEmail";
import notificationCountReducer from "../NotificationCounts/notificationsCountReducer";

import { combineReducers } from "redux";

// const allReducer = storage.reducer(
const allReducer = combineReducers({
  // combineReducers({
  isLogged,
  isAdmin,
  isUser,
  RecentEstimatesDropdown,
  CategoryId,
  CategoryModal,
  CloseButtonFunc,
  EditCatModal,
  isNewPwdEmail,
  notificationCountReducer,
});
// );

export default allReducer;
