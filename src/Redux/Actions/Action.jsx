export const isLoggedAction = () => {
  return {
    type: "Login",
  };
};

export const roleAdminAction = () => {
  return {
    type: "Admin",
  };
};

export const roleNormalAction = () => {
  return {
    type: "Normal",
  };
};

export const isLoggedOutAction = () => {
  return {
    type: "LogOut",
  };
};

export const recentEstimatesFilter = (value) => {
  return {
    type: "FilterValue",
    payload: value,
  };
};

export const CategoryId = (value) => {
  return {
    type: "CategoryID",
    payload: value,
  };
};

export const CategoryModalID = (value) => {
  return {
    type: "CategoryModal",
    payload: value,
  };
};

export const AutoCloseModal = (value) => {
  return {
    type: "CloseButton",
    payload: value,
  };
};

export const EditCatModal = (value) => {
  return {
    type: "editModal",
    payload: value,
  };
};

export const newPwdEmailAction = (value) => {
  return {
    type: "EmailId",
    payload: value,
  };
};

export const notificationCountAction = (value) => {
  return {
    type: "notificationCount",
    payload: value,
  };
};
