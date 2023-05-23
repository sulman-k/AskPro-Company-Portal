import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Label } from "reactstrap";
import { addBillingCompanyAPI, addPaymentDetails } from "../../api/Services";
import { getCompaniesAPI } from "../../api/Services";
import { BiUpload } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { uploadImage } from "../../api/Services";
import "./AddBillingCompanies.css";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import LoaderAnimation from "../Loader/LoaderAnimation";
import { toast } from "react-toastify";
import { IsAuthorized } from "../../Auth/Authorization";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Modal } from "react-bootstrap";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

var CountForDomain = 1;

const MAX_FILE_SIZE = 1000000 * 2.5,
  ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export const AddBillingCompanies = () => {
  const [name, setName] = useState("");
  const [Domain, setDomain] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Address, setAddress] = useState("");
  const [CompanyContact, setCompanyContact] = useState("");
  const [POCEmailID, setPOCEmailID] = useState("");
  const [POCName, setPOCName] = useState("");
  const [POCContactNumber, setPOCContactNumber] = useState("");
  const [TAX_EIN, setTAX_EIN] = useState("");
  const [CompanyURL, setCompanyURL] = useState("");
  const [license, setLicense] = useState("");
  const [paypal_id, setPayPalID] = useState("");
  const [picture, setPicture] = useState({});
  const [photo, setPhoto] = useState({});
  const [certList, setCertList] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [estimatorAdded, setEstimatorAdded] = useState(false);
  const [estimatorNotAdded, setEstimatorNotAdded] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [pocContactRole, setPocContactRole] = useState("");
  //error

  const [showerror, setshowerror] = useState();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const isAddBilCompany = IsAuthorized("company").create;

  // services offered
  const [serviceCleaning, setServiceCleaning] = useState(false);
  const [serviceFilterDisinfecting, setServiceFilterDisinfecting] = useState(false);
  const [serviceFilterLockers, setServiceFilterLockers] = useState(false);
  const [serviceFilterWindow, setServiceFilterWindow] = useState(false);
  const [serviceFilterPolishing, setServiceFilterPolishing] = useState(false);

  // Businesses Served ( Tags )
  const [servedBanks, setServedBanks] = useState(false);
  const [servedGymsFilter, setServedGymsFilter] = useState(false);
  const [servedMosquesFilter, setServedMosquesFilter] = useState(false);
  const [servedChurchFilter, setServedChurchFilter] = useState(false);
  const [servedGoldCourseFilter, setServedGoldCourseFilter] = useState(false);

  useEffect(() => {
    if (isAddBilCompany) {
    } else {
      toast.error("You are not authorized to add company");
      navigate("/ManageBillingCompany");
    }
  }, []);

  // domain error

  const [userNameError, setUserNameError] = useState(false);

  // count check for select all or de select all

  //for button 1
  const [checkForSelectAll1, setcheckForSelectAll1] = useState(true);
  //for button 2
  const [checkForSelectAll, setcheckForSelectAll] = useState(true);

  //Upload Your Picture
  const [animationupload, setAnimationupload] = useState(false);

  //Upload Photo ID
  const [animationuploadPhoto, setAnimationuploadPhoto] = useState(false);

  //Upload Certificates (Multiple Uploads Available)
  const [animationuploadMultiple, setAnimationuploadMultiple] = useState(false);

  const addEstimatorButton = async (e) => {
    e.preventDefault();
    if (Password.length >= 8) {
      CountForDomain = CountForDomain + 1;

      // !Integrating addEstimator API
      if (Password === ConfirmPassword) {
        var payload = JSON.stringify({
          domain: Domain,
          name: name,
          username: Username,
          password: Password,
          confirmPassword: ConfirmPassword,
          address: Address,
          contact: CompanyContact,
          pocEmail: POCEmailID,
          pocName: POCName,
          businessType: businessType,
          pocContactRole: pocContactRole,
          pocContact: POCContactNumber,
          role: "Company_Admin",
          tax: TAX_EIN,
          url: CompanyURL,
          servicesOffered: {
            cleaning: serviceCleaning,
            disinfecting: serviceFilterDisinfecting,
            lockers: serviceFilterLockers,
            window: serviceFilterWindow,
            polishing: serviceFilterPolishing,
          },
          businessOffered: {
            banks: servedBanks,
            gyms: servedGymsFilter,
            mosques: servedMosquesFilter,
            church: servedChurchFilter,
            goldCourse: servedGoldCourseFilter,
          },
          picture: picture.url ? picture.url : "",
          photoID: photo.url ? photo.url : "",
          certificateImages: certList.length ? certList.map((e) => e.url).join(",") : "",
        });
      } else {
        showError("Password", true);
      }
      //check response from API
      let result = await addBillingCompanyAPI(payload);
      if (result.success) {
        // open toast
        setEstimatorAdded(true);
        setTimeout(() => {
          setEstimatorAdded(false);
        }, 4000);
        // Reseting Form after submitting
        e.target.reset();
        setName("");
        setDomain("");
        setUsername("");
        setAddress("");
        setPassword("");
        setConfirmPassword("");
        setCompanyContact("");
        setPOCEmailID("");
        setPOCName("");
        setPOCContactNumber("");
        setTAX_EIN("");
        setCompanyURL("");
        setLicense("");
        setPayPalID("");
        setPicture("");
        setPhoto("");
        setCertList("");
        setUploadYourPictureTitle(true);
        setUploadPhotoID(true);
        setBusinessType("");
        setPocContactRole("");
        deSelectServices();
        deSelectServed();
      } else {
        if (result.msg) {
          toast.error(result.msg);
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error(result.error.response.data.message);
        }
        // setshowerror(result?.msg ? result?.msg : result?.message);
        // setEstimatorNotAdded(true);
        // setTimeout(() => {
        //   setEstimatorNotAdded(false);
        // }, 4000);
      }

      // Scrolling to the top of the page after submitting
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } else {
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
      }, 3000);
    }
  };

  const buttonHideNotEstimator = () => {
    setEstimatorNotAdded(false);
  };

  const buttonHideEstimator = () => {
    setEstimatorAdded(false);
  };

  const checkImage = async (image) => {
    let file_size = image.size;
    let file_type = image.type;

    if (file_size >= MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file_type)) return false;
    else return true;
  };

  const [uploadYourPictureTitle, setUploadYourPictureTitle] = useState(true);
  const uploadPicture = async (event) => {
    let image = event.target.files[0];
    if (checkImage(image)) {
      setAnimationupload(true);
      const result = await uploadImage(image);
      if (result.success) {
        setPicture({ name: image.name, url: result.url });
        setUploadYourPictureTitle(false);
        setAnimationupload(false);
      } else toast.error("Error while uploading image");
    } else {
      toast.error("File size should not exceed 2.5 MB");
    }
  };

  const deletePicture = () => {
    setPicture({});
    // setTimeout(() => {
    setUploadYourPictureTitle(true);
    // }, 1);
  };

  const [uploadPhotoID, setUploadPhotoID] = useState(true);
  const uploadPhoto = async (event) => {
    let image = event.target.files[0];

    setAnimationuploadPhoto(true);
    if (checkImage(image)) {
      const result = await uploadImage(image);
      if (result.success) {
        setPhoto({ name: image.name, url: result.url });
        setUploadPhotoID(false);
        setAnimationuploadPhoto(false);
      } else toast.error("Error while uploading image");
    } else {
      toast.error("File size should not exceed 2.5 MB");
    }
  };

  const deletePhotoID = () => {
    setPhoto({});
    // setTimeout(() => {
    setUploadPhotoID(true);
    // }, 1);
  };

  const [uploadCertificateMulti, setUploadCertificateMulti] = useState(true);
  const uploadCertificate = async (event) => {
    setAnimationuploadMultiple(true);
    for (let index = 0; index < event.target.files.length; index++) {
      let image = event.target.files[index];

      if (checkImage(image)) {
        const result = await uploadImage(image);
        setAnimationuploadMultiple(true);
        if (result.success) {
          setCertList((certList) => [...certList, { name: image.name, url: result.url }]);
          setUploadCertificateMulti(false);
          setAnimationuploadMultiple(false);
        } else toast.error("Error while uploading image: ", image.name);
      } else {
        toast.error("File size should not exceed 2.5 MB");
      }
    }
  };

  const deleteCertificate = (val) => {
    // e.preventDefault();
    certList.splice(val, 1);
    setCertList((certList) => [
      ...certList,
      // certList.splice(val, 1)
    ]);

    // setTimeout(() => {
    setUploadCertificateMulti(true);
    // }, 1);
  };

  const fetchCompanies = async () => {
    let response = await getCompaniesAPI();
    if (response.success) {
      setCompanyList(response.data);
    } else {
      setCompanyList([]);
    }
  };
  const [statusTag, setStatusTage] = useState(false);
  const makeInactive = () => {
    setStatusTage(false);
  };
  const moveToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  useEffect(async () => {
    await fetchCompanies();
  }, []);

  const redOutline = () => {
    if (Username === "") {
      moveToTop();
      showError("Username", true);
    } else {
      showError("Username", false);
    }
    if (name === "") {
      moveToTop();
      showError("Name", true);
    } else {
      showError("Name", false);
    }

    if (Password === "" || Password !== ConfirmPassword) {
      moveToTop();
      showError("Password", true);
    } else {
      showError("Password", false);
    }
    if (Domain === "") {
      moveToTop();
      showError("Domain", true);
    } else {
      showError("Domain", false);
    }
    if (POCEmailID === "") {
      moveToTop();
      showError("email", true);
    } else {
      showError("email", false);
    }
  };

  const showError = (elementID, flag) => {
    if (flag === true) {
      document.getElementById(elementID).style.border = "1px solid red";
    } else {
      document.getElementById(elementID).style.border = "1px solid lightgray";
    }
  };

  const validateUserName = (username) => {
    var usernameRegex = /^[a-z0-9.]+$/;
    // return usernameRegex.test(username);
    if (usernameRegex.test(username)) {
      setDomain(username);
      setUserNameError(false);
    } else {
      setUserNameError(true);
    }
  };

  const deSelectServices = () => {
    setServiceCleaning(false);
    setServiceFilterDisinfecting(false);
    setServiceFilterLockers(false);
    setServiceFilterWindow(false);
    setServiceFilterPolishing(false);
    setcheckForSelectAll1(true);
  };

  const deSelectServed = () => {
    setServedBanks(false);
    setServedGymsFilter(false);
    setServedMosquesFilter(false);
    setServedChurchFilter(false);
    setServedGoldCourseFilter(false);
    setcheckForSelectAll(true);
  };

  const selectServed = () => {
    setServedBanks(true);
    setServedGymsFilter(true);
    setServedMosquesFilter(true);
    setServedChurchFilter(true);
    setServedGoldCourseFilter(true);
    setcheckForSelectAll(false);
  };

  const selectServices = () => {
    setServiceCleaning(true);
    setServiceFilterDisinfecting(true);
    setServiceFilterLockers(true);
    setServiceFilterWindow(true);
    setServiceFilterPolishing(true);
    setcheckForSelectAll1(false);
  };

  // ! auto select and deselect working remaining

  // ----------------------------
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalSubmit, setPaymentModalSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentPassword, setPaymentPassword] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentExpiryDate, setPaymentExpiryDate] = useState();
  const [paymentSecurityCode, setPaymentSecurityCode] = useState("");
  const [paymentZipCode, setPaymentZipCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [cvv, setCvv] = useState("");

  const openPaymentInfo = () => {
    setPaymentModal(true);
  };

  const closePaymentInfo = () => {
    setPaymentModal(false);
    setPaymentModalSubmit(false);
    setEmail("");
    setPaymentPassword("");
    setPaymentName("");
    setPaymentCardNumber("");
    setPaymentExpiryDate();
    setPaymentSecurityCode("");
    setPaymentZipCode("");
    setSelectedCompany("");
    setSelectedCompanyId("");
    setCvv("");
  };

  const getDomainName = (domain) => {
    setSelectedCompanyId(domain);
    companyList.map((e) => {
      if (e.tenant_id === domain) {
        setSelectedCompany(e.tenantDomain);
      }
    });
  };

  const paymentInfo = async (e) => {
    e.preventDefault();

    if (cvv.length >= 3) {
      if (paymentExpiryDate) {
        setPaymentModalSubmit(true);

        const payload = JSON.stringify({
          client_username: selectedCompany,
          card_holder_name: paymentName,
          card_number: paymentCardNumber,
          expiry_date: paymentExpiryDate,
          security_code: paymentSecurityCode,
          email: email,
          zip_code: paymentZipCode,
          company_id: selectedCompanyId,
          cvv: cvv,
        });
        const response = await addPaymentDetails(payload);
        if (response.success) {
          toast.success("Payment details added successfully");
          closePaymentInfo();
        } else {
          const error = response.msg;
          toast.error(`Error: ${error}`);
        }
      } else {
        toast.error("Please enter valid Expiry Date");
      }
    } else {
      toast.error("Max length for cvv is 3");
    }
  };

  const expiryDateFun = (e) => {
    let selectedDate = new Date(e);
    let dateNow = new Date();
    var prevDate = new Date(dateNow);
    prevDate.setDate(dateNow.getDate() - 1);
    if (selectedDate > prevDate) {
      setPaymentExpiryDate(e);
    } else {
      setPaymentExpiryDate("");
      toast.error("Your card is already expired");
    }
  };

  const setCvvFunction = (value) => {
    if (value.length <= 3) {
      setCvv(value);
    } else {
      toast.warning("Max length for cvv is 3");
    }
  };

  return (
    <div className="col-12">
      <div className="card recentEstimatesCard">
        <div className="card-title incomingBar">
          <span className="addBillingCompanycss">Add Billing Companies</span>
        </div>

        <div className="card-body text-center">
          <div className="col-11 formDiv">
            {estimatorAdded ? (
              <div
                className="alert alert-primary alert-dismissible fade show col-6 estimatorAlert"
                role="alert"
              >
                <h6 className="estimatorHHeading">Billing Companies Added Successfully!</h6>
                <button type="button" className="btn-close" onClick={buttonHideEstimator}></button>
              </div>
            ) : (
              <p hidden></p>
            )}
            {estimatorNotAdded ? (
              <div
                className="alert alert-danger alert-dismissible fade show col-6 estimatorAlert"
                role="alert"
              >
                <h6 className="estimatorHHeading">{showerror}</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={buttonHideNotEstimator}
                ></button>
              </div>
            ) : null}
            <form id="addEstimatorForm" onSubmit={addEstimatorButton}>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Name" className="form-label required" style={{ float: "left" }}>
                  Name
                </label>
                <input
                  required={true}
                  type="text"
                  className="form-control required"
                  id="Name"
                  aria-describedby="emailHelp"
                  placeholder="Company Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Domain" className="form-label required" style={{ float: "left" }}>
                  URL
                </label>
                <input
                  required={true}
                  type="text"
                  className="form-control required"
                  id="Domain"
                  aria-describedby="emailHelp"
                  placeholder="URL"
                  onChange={(e) => validateUserName(e.target.value)}
                />

                {userNameError ? (
                  <>
                    <br />
                    <span style={{ color: "red", float: "left" }}>Only lower case allowed</span>
                    <br />
                  </>
                ) : (
                  <span hidden></span>
                )}
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Username" className="form-label required" style={{ float: "left" }}>
                  Username
                </label>
                <input
                  required={true}
                  type="text"
                  className="form-control required"
                  id="Username"
                  aria-describedby="emailHelp"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Password" className="form-label required" style={{ float: "left" }}>
                  Password
                </label>
                <input
                  required={true}
                  type="password"
                  className="form-control required"
                  id="Password"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError ? (
                  <span className="passwordError">
                    <br />
                    Password length should be greater then 8
                  </span>
                ) : null}
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="ConfirmPassword" className="form-label " style={{ float: "left" }}>
                  Confirm Password
                </label>
                <input
                  //required={true}
                  type="password"
                  className="form-control required"
                  id="ConfirmPassword"
                  aria-describedby="emailHelp"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Address" className="form-label " style={{ float: "left" }}>
                  Address
                </label>
                <input
                  //required={true}
                  type="text"
                  className="form-control"
                  id="Address"
                  aria-describedby="emailHelp"
                  placeholder="Enter Your Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="CompanyContact" className="form-label " style={{ float: "left" }}>
                  Company Contact
                </label>
                <input
                  // required={true}
                  type="text"
                  className="form-control"
                  id="CompanyContact"
                  aria-describedby="emailHelp"
                  placeholder="Mobile #"
                  onChange={(e) => setCompanyContact(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="email" className="form-label required" style={{ float: "left" }}>
                  POC Email ID
                </label>
                <input
                  required={true}
                  type="email"
                  className="form-control required"
                  id="email"
                  placeholder="abc@gmail.com"
                  onChange={(e) => setPOCEmailID(e.target.value)}
                />
              </div>
              {/* ! Email Here  */}
              <div className="mb-3 fileds_input_css">
                <label htmlFor="POCName" className="form-label " style={{ float: "left" }}>
                  POC Name
                </label>
                <input
                  //required={true}
                  type="text"
                  name=" POCName"
                  id=" POCName"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter POC Name"
                  onChange={(e) => setPOCName(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="POCCONTACT" className="form-label " style={{ float: "left" }}>
                  POC Contact Role
                </label>
                <input
                  //required={true}
                  type="text"
                  name=" POCCONTACT"
                  id=" POCCONTACT"
                  className="form-control"
                  placeholder="Enter POC Contact Role"
                  onChange={(e) => setPocContactRole(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="businessType" className="form-label " style={{ float: "left" }}>
                  Business Type
                </label>
                <input
                  //required={true}
                  type="text"
                  name=" businessType"
                  id=" businessType"
                  className="form-control"
                  placeholder="Enter Business Type"
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="number" className="form-label" style={{ float: "left" }}>
                  POC Contact Number
                </label>
                <input
                  /*required={true}*/
                  type="number"
                  className="form-control"
                  id="number"
                  placeholder="Enter POC Contact Number"
                  onChange={(e) => setPOCContactNumber(e.target.value)}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="text" className="form-label" style={{ float: "left" }}>
                  TAX/EIN
                </label>
                <input
                  /*required={true}*/
                  type="text"
                  className="form-control"
                  id="text"
                  placeholder="Tax ID"
                  onChange={(e) => setTAX_EIN(e.target.value)}
                />
              </div>
              <Label
                className="fileds_input_css"
                htmlFor="uploadyourpicture"
                style={{ float: "left" }}
              >
                Upload Resale Certificate
              </Label>{" "}
              <br />
              {uploadYourPictureTitle ? (
                <div className="mt-3 row uploadWidth ">
                  <span className="divPlaceHolder  col-4">
                    <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">&nbsp; {picture.name}</div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationupload === false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="upload"
                      className="btn btn-secondary uploadWidthClass col-2   "
                    >
                      Upload
                      <BiUpload className="uploadIconButton" />
                    </label>
                  ) : (
                    <div className="loaderUploadCSS col-1">
                      <LoaderAnimation size={20} />
                    </div>
                  )}
                  <input
                    id="upload"
                    style={{ display: "none" }}
                    type="file"
                    className="btn btn-secondary uploadWidthClass col-2"
                    onChange={uploadPicture}
                  />
                </div>
              ) : (
                <div className="mt-3 row uploadWidth ">
                  <span className="placeholderFileName col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;{picture.name}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label
                    htmlFor="uploadDelete"
                    className="btn btn-danger uploadWidthClassDelete col-2 "
                  >
                    Delete
                    <BiTrash className="uploadIconButton" />
                  </label>
                  <input
                    id="uploadDelete"
                    style={{ display: "none" }}
                    className="btn btn-secondary uploadWidthClass col-2"
                    onClick={deletePicture}
                  />{" "}
                </div>
              )}
              {/* YAHA SAY */}
              <br />
              <Label className="fileds_input_css" htmlFor="uploadphoto" style={{ float: "left" }}>
                Upload Company Logo
              </Label>{" "}
              <br />
              {uploadPhotoID ? (
                <div className="mt-3 row uploadWidth ">
                  <span className="divPlaceHolder col-4">
                    <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">
                      &nbsp;
                      {photo.name}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationuploadPhoto === false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="photo"
                      className="btn btn-secondary uploadWidthClass col-3  "
                    >
                      Upload
                      <BiUpload className="uploadIconButton" />
                    </label>
                  ) : (
                    <div className="loaderUploadCSS col-1">
                      <LoaderAnimation size={20} />
                    </div>
                  )}
                  <input
                    id="photo"
                    style={{ display: "none" }}
                    type="file"
                    className="btn btn-secondary uploadWidthClass col-3"
                    onChange={uploadPhoto}
                  />
                </div>
              ) : (
                <div className="mt-3 row uploadWidth ">
                  <span className="placeholderFileName col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;
                      {photo.name}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* </span> */}
                  <label htmlFor="photo" className="btn btn-danger uploadWidthClassDelete col-2 ">
                    Delete
                    <BiTrash className="uploadIconButton" />
                  </label>
                  <input
                    id="photo"
                    style={{ display: "none" }}
                    // type="file"
                    className="btn btn-secondary uploadWidthClass col-2"
                    onClick={deletePhotoID}
                  />{" "}
                </div>
              )}
              <br />
              {/* yaha say  */}
              <Label
                className="fileds_input_css"
                htmlFor="formFileMultiple"
                style={{ float: "left" }}
              >
                Upload Certificates (Multiple Uploads)
              </Label>{" "}
              <br />
              <div className="mt-3 row uploadWidth">
                {certList.length ? (
                  <div>
                    <div>
                      {certList.map((e, index) => (
                        <li className="mt-3 row">
                          <span className="placeholderFileName col-4">
                            <div className="row justify-content-start">
                              &nbsp;&nbsp;&nbsp;
                              {e.name}
                            </div>
                          </span>
                          <div className="col-6"></div>
                          &nbsp;&nbsp;&nbsp;
                          <label
                            htmlFor="formFileMultipleDel"
                            className="btn  btn-danger uploadWidthClassDelete col-2 "
                            onClick={() => deleteCertificate(index)}
                          >
                            Delete
                            <BiTrash className="uploadIconButton" />
                          </label>
                          <button
                            style={{ display: "none" }}
                            id="formFileMultipleDel"
                            className="btn btn-secondary uploadWidthClassDelete col-2"
                            type="button"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p hidden></p>
                )}
                <span className="divPlaceHolde  col-4">
                  <span className="leftAlignDown">
                    <div className="row mt-3 justify-content-start">
                      JPEG, PNG & less then 2.5MB
                    </div>
                  </span>
                </span>
                <div className="col-6"></div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {animationuploadMultiple === false ? (
                  <label
                    style={{ backgroundColor: "#ffad10", border: "none" }}
                    htmlFor="formFileMultiple"
                    className="btn btn-secondary uploadWidthClass col-2"
                  >
                    Upload
                    <BiUpload className="uploadIconButton" />
                  </label>
                ) : (
                  <span className="multipleLoader">
                    <LoaderAnimation size={30} />
                  </span>
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="formFileMultiple"
                  multiple
                  className="btn btn-secondary uploadWidthClass col-2"
                  onChange={uploadCertificate}
                />
              </div>
              <br />
              <div className="mb-3 fileds_input_css">
                <label htmlFor="" className="" style={{ float: "left" }}>
                  Services Offered ( Tags )
                </label>
                <span className=" allselectcss">
                  {checkForSelectAll1 ? (
                    <button
                      id="SelectAllFilter"
                      value="SelectAllFilter"
                      onClick={() => selectServices()}
                      type="button"
                      className="mb-1 p-1 allselectbuttoncss"
                    >
                      Select All
                    </button>
                  ) : (
                    <button
                      id="SelectAllFilter"
                      value="SelectAllFilter"
                      onClick={() => deSelectServices()}
                      type="button"
                      className="mb-1 p-1 allselectbuttoncss"
                    >
                      De Select
                    </button>
                  )}
                </span>
                <div className="form-control row tagsFieldAlign">
                  <div className="mt-4 mb-4 col-12 sameLinesForButtons">
                    <button
                      id="FilterCleaning"
                      value="FilterCleaning"
                      // onClick={buttonfilter}
                      onClick={() => setServiceCleaning(!serviceCleaning)}
                      style={
                        serviceCleaning
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Cleaning
                    </button>
                    &nbsp;
                    <button
                      id="FilterDisinfecting"
                      value="FilterDisinfecting"
                      onClick={() => setServiceFilterDisinfecting(!serviceFilterDisinfecting)}
                      style={
                        serviceFilterDisinfecting
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Disinfecting
                    </button>
                    &nbsp;
                    <button
                      id="FilterLockers"
                      value="FilterLockers"
                      onClick={() => setServiceFilterLockers(!serviceFilterLockers)}
                      style={
                        serviceFilterLockers
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Lockers
                    </button>
                    &nbsp;
                    <button
                      id="FilterWindow"
                      value="FilterWindow"
                      onClick={() => setServiceFilterWindow(!serviceFilterWindow)}
                      style={
                        serviceFilterWindow
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Window
                    </button>
                    &nbsp;
                    <button
                      id="FilterPolishing"
                      value="FilterPolishing"
                      onClick={() => setServiceFilterPolishing(!serviceFilterPolishing)}
                      style={
                        serviceFilterPolishing
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Polishing
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="" className="" style={{ float: "left" }}>
                  Businesses Served ( Tags )
                </label>
                <span className=" allselectcss">
                  {checkForSelectAll ? (
                    <button
                      id="SelectAllFilter2"
                      value="SelectAllFilter2"
                      onClick={selectServed}
                      type="button"
                      className="mb-1 p-1 allselectbuttoncss"
                    >
                      Select All
                    </button>
                  ) : (
                    <button
                      id="SelectAllFilter2"
                      value="SelectAllFilter2"
                      onClick={deSelectServed}
                      type="button"
                      className="mb-1 p-1 allselectbuttoncss"
                    >
                      De Select
                    </button>
                  )}
                </span>
                <div className="form-control row tagsFieldAlign">
                  <div className="mt-4 mb-4 col-12 sameLinesForButtons">
                    <button
                      id="BanksFilter"
                      value="BanksFilter"
                      onClick={() => setServedBanks(!servedBanks)}
                      style={
                        servedBanks
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Banks
                    </button>
                    &nbsp;
                    <button
                      id="GymsFilter"
                      value="GymsFilter"
                      onClick={() => setServedGymsFilter(!servedGymsFilter)}
                      style={
                        servedGymsFilter
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Gyms
                    </button>
                    &nbsp;
                    <button
                      id="MosquesFilter"
                      value="MosquesFilter"
                      onClick={() => setServedMosquesFilter(!servedMosquesFilter)}
                      style={
                        servedMosquesFilter
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Mosques
                    </button>
                    &nbsp;
                    <button
                      id="ChruchFilter"
                      value="ChruchFilter"
                      onClick={() => setServedChurchFilter(!servedChurchFilter)}
                      style={
                        servedChurchFilter
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Church
                    </button>
                    &nbsp;
                    <button
                      id="GoldCourseFilter"
                      value="GoldCourseFilter"
                      onClick={() => setServedGoldCourseFilter(!servedGoldCourseFilter)}
                      style={
                        servedGoldCourseFilter
                          ? { backgroundColor: "rgb(217,229,241)" }
                          : { backgroundColor: "rgb(255,255,255)" }
                      }
                      type="button"
                      className="mt-1 p-1 allselectbuttoncssinner"
                    >
                      Gold Course
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="mb-3">
                <Button className="  btn mt-2 d-flex" onClick={openPaymentInfo}>
                  Payment Information
                </Button>
              </div> */}
              {/* submit button  */}
              <div className="row justify-content-evenly lastbuttoncss">
                <div className="col-3"></div>
                <div className="col-3">
                  <Button
                    value="submit"
                    type="submit"
                    id="submit"
                    className="btn col-12 buttonColor mt-2"
                    onClick={redOutline}
                  >
                    Add Billing Company
                  </Button>
                </div>

                <div className="col-3"></div>
              </div>
            </form>
          </div>
        </div>
      </div>{" "}
      &nbsp;
      <Modal
        show={paymentModal}
        onHide={closePaymentInfo}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Information </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={paymentInfo}>
            <TextField
              color="secondary"
              className="mt-4"
              fullWidth
              label="Email"
              id="email"
              variant="outlined"
              required
              type="email"
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={email}
            />
            <TextField
              color="secondary"
              className="mt-4"
              fullWidth
              label="Password"
              id="password"
              variant="outlined"
              required
              type="password"
              placeholder="Enter your Password"
              onChange={(e) => setPaymentPassword(e.target.value)}
              defaultValue={paymentPassword}
            />
            <FormControl color="secondary" className="mt-4" fullWidth>
              <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCompanyId}
                label="Company"
                onChange={(e) => getDomainName(e.target.value)}
              >
                {companyList.map((e) => (
                  <MenuItem key={e.tenant_id} value={e.tenant_id}>
                    {e.tenantDomain}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              color="secondary"
              className="mt-4"
              fullWidth
              label="Name on Card"
              id="name"
              variant="outlined"
              required
              placeholder="Enter your Name"
              onChange={(e) => setPaymentName(e.target.value)}
              defaultValue={paymentName}
            />
            <TextField
              color="secondary"
              className="mt-4"
              fullWidth
              label="Card No"
              id="cardNo"
              variant="outlined"
              required
              type="number"
              placeholder="Enter your Card Number"
              onChange={(e) => setPaymentCardNumber(e.target.value)}
              defaultValue={paymentCardNumber}
            />

            <div className="row">
              <div className="col-6">
                <TextField
                  color="secondary"
                  className="mt-4"
                  fullWidth
                  label="Security Code"
                  id="sCode"
                  variant="outlined"
                  required
                  type="password"
                  placeholder="Enter your security code"
                  onChange={(e) => setPaymentSecurityCode(e.target.value)}
                  defaultValue={paymentSecurityCode}
                />
              </div>
              <div className="col-6">
                <TextField
                  color="secondary"
                  className="mt-4"
                  fullWidth
                  label="CVV"
                  id="cvv"
                  variant="outlined"
                  required
                  type="number"
                  placeholder="Enter your CVV"
                  onChange={(e) => setCvvFunction(e.target.value)}
                  defaultValue={cvv}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <TextField
                  color="secondary"
                  className="mt-4"
                  fullWidth
                  label="Zip Code"
                  id="zCode"
                  variant="outlined"
                  required
                  type="number"
                  placeholder="Enter your Zip Code"
                  onChange={(e) => setPaymentZipCode(e.target.value)}
                  defaultValue={paymentZipCode}
                />
              </div>
              <div className="col-6">
                <div className="mt-4">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      color="secondary"
                      label="Expiry Date"
                      inputFormat="dd/MM/yyyy"
                      value={paymentExpiryDate}
                      onChange={(e) => expiryDateFun(e)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <input
                disabled={paymentModalSubmit}
                type="submit"
                value="Submit"
                id="submit"
                className="btn buttonColor mt-4 "
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePaymentInfo}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
