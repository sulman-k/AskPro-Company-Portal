import { useSelector } from "react-redux";
import { get_api, post_api, put_api, get_SignIN, delete_api } from "./axios";

// Using this APIs to get data and initiliazing token for Auth user

////////// GET ///////////////

// export const signIn = post_api(SIGN_IN + "/token", CONTENT_TYPE_SIGN_IN, data)

export const logIn = async (data) => {
  let response = get_SignIN("/token", data);
  return response;
};

//  API to Get Companies
export const getCompaniesAPI = async () => {
  let response = get_api("/get-companies");
  return response;
};

// API to Manage Estimators
export const ManageEstimatorsAPI = async () => {
  let response = get_api("/estimatorsList");
  return response;
};

export const RecentEstimatesAPI = async (status) => {
  let response = get_api(`/recentEstimates?status=${status}`);
  return response;
};

export const getStatesOfEstimatesAPI = async () => {
  let response = get_api("/getStatesOfEstimates");
  return response;
};

export const getStatesOfEstimatorsAPI = async () => {
  let response = get_api("/getStatesOfEstimators");
  return response;
};

export const getStatesOfClientsAPI = async () => {
  let response = get_api("/getStatesOfClients");
  return response;
};

export const getStatesOfCompaniesAPI = async () => {
  let response = get_api("/getStatesOfCompanies");
  return response;
};

export const RebidRequestsAPI = (status) => {
  let response = get_api(`/rebidEstimates?status=${status}`);
  return response;
};

export const ManageBillingCompanyAPI = async (name) => {
  let response = get_api(`/getCompaniesList?value=${name}`);
  return response;
};

export const ExpiringSoonAPI = async () => {
  let response = get_api("/expiringEstimates");
  return response;
};

export const getEstimatorDetailsAPI = async (username) => {
  let response = get_api(`/getEstimatorDetails?username=${username}`);
  return response;
};

export const getViewCategoryAPI = async (questionnaire_name) => {
  let response = get_api(`/viewCategories?questionnaire_name=${questionnaire_name}`);
  return response;
};

export const getCategoryTreeAPI = async () => {
  let response = get_api("/allRootCategories");
  return response;
};

export const viewCategoryforSpecificAPI = async (dataID) => {
  let response = get_api(`/viewCategory?category_id=${dataID}`);
  return response;
};

export const viewQuestionareforSpecificAPI = async (dataID) => {
  let response = get_api(`/getQuestionnaire?questionnaire_name=${dataID}`);
  return response;
};

export const questionnairesListAPI = async () => {
  let response = get_api("/questionnairesList");
  return response;
};

export const EstimateIDFromDashboard = async (estimateId) => {
  let response = get_api(`/getEstimate?estimateId=${estimateId}`);
  return response;
};

export const GetAnswersFromCleintID = async (CleintID, estimatorId, estimateId) => {
  let response = get_api(
    `/getAnswers?client_id=${CleintID}&estimator_id=${estimatorId}&estimate_id=${estimateId}`
  );
  return response;
};

export const getQuotationAPI = async (estimateId, estimatorId) => {
  let response = get_api(`/getQuotation?estimateId=${estimateId}&estimatorId=${estimatorId}`);
  return response;
};

export const ClientProfileAPI = async (clientID) => {
  let response = get_api(`/clientProfile?clientId=${clientID}`);
  return response;
};

export const getReviewListAPI = async (estimatorId) => {
  let response = get_api(`/getReviewList?estimateId=${estimatorId}`);
  return response;
};
export const getReviewListAPIEstimator = async (estimatorId) => {
  let response = get_api(`/getReviewList?estimatorId=${estimatorId}`);
  return response;
};

export const GetCompanyDetailsAPI = async (domain) => {
  let response = get_api(`/getCompanyDetails?company_id=${domain}`);
  return response;
};

export const GetLimitedNotificationsAPI = async (limit) => {
  let response = get_api(`/getNotifications?limit=${limit}`);
  return response;
};

export const getReviewDetailsAPI = async (estimatorId, clientid) => {
  let response = get_api(`/getReviewDetails?estimatorId=${estimatorId}&clientId=${clientid}`);
  return response;
};

export const SendNewPassword = async (password) => {
  let response = get_api(`/companyResetPassword`, password);
  return response;
};

export const searchEstimatorAPI = async (estimator_name) => {
  let response = get_api(`/searchEstimator?estimator_name=${estimator_name}`);
  return response;
};
export const searchAPI = async (status, search) => {
  let response = get_api(`/search?status=${status}&search=${search}`);
  return response;
};

export const getConversationList = async () => {
  let response = get_api(`/getConversationList`);
  return response;
};
export const checkingBlackListed = async (userName) => {
  let response = get_api(`/checkingBlackListed?username=${userName}`);
  return response;
};
export const getUsersList = async () => {
  let response = get_api(`/get-usersList?isAdmin=true`);
  return response;
};
export const getUsersListUserName = async (userName) => {
  let response = get_api(`/get-user?userName=${userName}`);
  return response;
};

export const roleListApi = async () => {
  let response = get_api("/roleList?portal=admin");
  return response;
};
export const getPermissionApi = async (userName) => {
  let response = get_api(`/getPermission?userName=${userName}&portal=admin`);
  return response;
};

export const getPaymentsDetails = async (userName) => {
  let response = get_api(`/getPaymentsDetails?username=${userName}`);
  return response;
};

export const getUnreadNotifications = async () => {
  let response = get_api(`/getUnreadNotifications`);
  return response;
};

////////// POST ///////////////
export const removeBlackListed = async (userName) => {
  let response = post_api(`/removeBlackListed?username=${userName}`);
  return response;
};

// this API is for Add Estimator Page
export const addUserDisable = async (payload) => {
  let response = post_api("/add-userDisable", payload);
  return response;
};
export const addEstimatorAPI = async (payload) => {
  let response = post_api("/addEstimator", payload);
  return response;
};

// this API is for Add Billing company Page
export const addBillingCompanyAPI = async (payload) => {
  let response = post_api("/add-company", payload);
  return response;
};

//  API to Get Image URL
export const uploadImage = async (data) => {
  let formData = new FormData();
  formData.append("image", data);
  let response = post_api("/upload-image", formData);
  return response;
};

export const EditCompanyBill = async (payload) => {
  let response = post_api("/updateCompanyDetails", payload);
  return response;
};

export const AddCategoryModal = async (payload) => {
  let response = post_api("/addCategory", payload);
  return response;
};

export const FirstNodeCategoryModalAPI = async (payload, data) => {
  let response = post_api(`/addCategory?questionnaire_id=${payload}`, data);
  return response;
};

export const searchEstimatesAPI = async (data) => {
  let response = post_api("/searchEstimates", data);
  return response;
};

export const SecondNodeCategoryModalAPI = async (payload, data) => {
  let response = post_api(`/addCategory?parent_id=${payload}`, data);
  return response;
};

export const AddQuestionareAPI = async (payload) => {
  let response = post_api("/addQuestionnaire", payload);
  return response;
};

export const TemplateAPI = async (payload) => {
  let response = post_api("/cloneQuestionnaire", payload);
  return response;
};
export const submitRebidQuotation = async (payload) => {
  let response = post_api("/submitRebidQuotation", payload);
  return response;
};

export const CloneSubCategoryAPI = async (id) => {
  let response = post_api(`/cloneCategory?categoryId=${id}`);
  return response;
};

export const companyForgotPasswordAPI = async (payload) => {
  let response = post_api("/companyForgotPassword", payload);
  return response;
};

export const companyVerifyOtpAPI = async (payload) => {
  let response = post_api("/companyVerifyOtp", payload);
  return response;
};
export const updateUserApi = async (payload) => {
  let response = post_api("/update-user", payload);
  return response;
};
export const addUserApi = async (payload) => {
  let response = post_api("/addAdminUser", payload);
  return response;
};

export const DeleteViewCategoryChildAPI = async (Child_ID, id) => {
  let response = post_api(`/deleteCategory?categoryId=${Child_ID}&identifier=${id}`);
  return response;
};
export const updatePermissions = async (payload) => {
  let response = post_api(`/update-permissions`, payload);
  return response;
};
export const addPaymentDetails = async (payload) => {
  let response = post_api(`/addPaymentDetails`, payload);
  return response;
};

export const deleteUserApi = async (userName) => {
  let response = post_api(`/delete-user?userName=${userName}`);
  return response;
};

export const addRole = async (payload) => {
  let response = post_api("/addRole", payload);
  return response;
};

export const updateRole = async (payload) => {
  let response = post_api("/update-role", payload);
  return response;
};

export const deleteRole = async (userName) => {
  let response = post_api(`/delete-role?name=${userName}`);
  return response;
};

////////// PUT ///////////////

// API to Update Estimators
export const UpdateEstimatorsAPI = async (updateData) => {
  let response = put_api("/updateEstimatorDetails", updateData);
  return response;
};

export const UpdateEstimate = async (estimateId, data) => {
  let response = put_api(`/updateEstimate?estimateId=${estimateId}`, data);
  return response;
};

export const UpdateCategoryAPI = async (id, data) => {
  let response = put_api(`/updateCategory?category_id=${id}`, data);
  return response;
};

export const UpdateIdentifierAPI = async (id, data) => {
  let response = put_api(`/updateIdentifier?category_id=${id}`, data);
  return response;
};

export const editPaymentDetails = async (data) => {
  let response = put_api(`/editPaymentDetails`, data);
  return response;
};

export const readAllNotifications = async () => {
  let response = put_api(`/readAllNotifications`);
  return response;
};

//Delete API
export const DeleteVariableAPI = async (data) => {
  let response = delete_api(`/deleteCategory?name=${data}`);
  return response;
};

export const DeleteSubCategoryAPI = async (name, questionnaire_name) => {
  let response = delete_api(
    `/deleteCategory?name=${name}&questionnaire_name=${questionnaire_name}`
  );
  return response;
};
