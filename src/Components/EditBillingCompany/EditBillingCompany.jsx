import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ToastHeader } from "react-bootstrap";
import { Input, Label, Form } from "reactstrap";
import {
  addEstimatorAPI,
  addUserDisable,
  checkingBlackListed,
  EditCompanyBill,
  editPaymentDetails,
  getPaymentsDetails,
  removeBlackListed,
} from "../../api/Services";
import { getCompaniesAPI } from "../../api/Services";
import { BiUpload } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { uploadImage } from "../../api/Services";
import { useLocation } from "react-router-dom";
import { color, format } from "highcharts";
import debug from "react-scroll-to-bottom/lib/utils/debug";
import "./EditBillingCompany.css";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import LoaderAnimation from "../Loader/LoaderAnimation";
import { useAuthUser } from "react-auth-kit";
import { IsAuthorized } from "../../Auth/Authorization";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";

var countpicturelimit = 0;

const MAX_FILE_SIZE = 1000000 * 2.5,
  ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export const EditBillingCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const [name, setName] = useState(location.state.name);
  const [username, setUsername] = useState(location.state.username);
  const [Domain, setDomain] = useState(location.state.domain);
  const [Address, setAddress] = useState(location.state.address);
  const [CompanyContact, setCompanyContact] = useState(location.state.contact);
  const [POCEmailID, setPOCEmailID] = useState(location.state.pocEmail);
  const [POCName, setPOCName] = useState(location.state.pocName);
  const [POCContactNumber, setPOCContactNumber] = useState(location.state.pocContact);
  const [TAX_EIN, setTAX_EIN] = useState(location.state.tax);
  const [CompanyURL, setCompanyURL] = useState(location.state.url);
  const [businessType, setBusinessType] = useState(location.state.businessType);
  const [pocContactRole, setPocContactRole] = useState(location.state.pocContactRole);

  // services offered
  const [serviceCleaning, setServiceCleaning] = useState(location.state.cleaning);
  const [serviceFilterDisinfecting, setServiceFilterDisinfecting] = useState(
    location.state.disinfecting
  );
  const [serviceFilterLockers, setServiceFilterLockers] = useState(location.state.lockers);
  const [serviceFilterWindow, setServiceFilterWindow] = useState(location.state.polishing);
  const [serviceFilterPolishing, setServiceFilterPolishing] = useState(location.state.window);

  // Businesses Served ( Tags )
  const [servedBanks, setServedBanks] = useState(location.state.banks);
  const [servedGymsFilter, setServedGymsFilter] = useState(location.state.gyms);
  const [servedMosquesFilter, setServedMosquesFilter] = useState(location.state.mosques);
  const [servedChurchFilter, setServedChurchFilter] = useState(location.state.church);
  const [servedGoldCourseFilter, setServedGoldCourseFilter] = useState(location.state.goldCourse);

  const [checkStatus, setCheckStatus] = useState(location.state.status);

  const [license, setLicense] = useState("");
  const [paypal_id, setPayPalID] = useState("");

  const [isBlackListed, setIsBlackListed] = useState(true);

  const [picture, setPicture] = useState(
    location.state.picture
      ? location.state.picture.split("https://somecompany-images.s3.amazonaws.com/")[1]
      : location.state.picture
  );
  const [photo, setPhoto] = useState(
    location.state.photoid
      ? location.state.photoid.split("https://somecompany-images.s3.amazonaws.com/")[1]
      : location.state.photoid
  );
  const [certList, setCertList] = useState(
    location.state.certificateImages ? location.state.certificateImages.split(",") : ""
  );
  const [companyList, setCompanyList] = useState([]);
  const [estimatorAdded, setEstimatorAdded] = useState(false);
  const [estimatorNotAdded, setEstimatorNotAdded] = useState(false);

  const [inActiveModal, setInActiveModal] = useState(false);
  //error
  const cloneModalClose = () => setInActiveModal(false);
  const [showerror, setshowerror] = useState();

  // to show delete button

  const [deletebutton, setdeletebutton] = useState(false);

  // count check for select all or de select all

  //for button 1
  const [checkForSelectAll1, setcheckForSelectAll1] = useState(true);
  //for button 2
  const [checkForSelectAll, setcheckForSelectAll] = useState(true);

  var CountForSelectOrDeselectServiceOffered = 0;

  var CountForSelectOrDeselect = 0;

  useEffect(() => {
    setName(location.state.name);
    checkingBlackListedUser();
  }, []);

  const checkingBlackListedUser = async () => {
    try {
      let response = await checkingBlackListed(username);
      if (response.success) {
        response.msg === `Your account is blocked. you can't be login.`
          ? setIsBlackListed(false)
          : setIsBlackListed(true);
      } else {
        setIsBlackListed(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const isUpdateComapny = IsAuthorized("company").update;
  useEffect(() => {
    if (isUpdateComapny) {
    } else {
      toast.error("You are not authorized to uodate billing company");
      navigate("/ManageBillingCompany");
    }
  }, []);

  const makeInactive = () => {
    setInActiveModal(true);
    setDisabledButton(false);
  };
  const makeActive = async () => {
    try {
      let response = await removeBlackListed(username);
      if (response.success) {
        setIsBlackListed(true);
        setStatusTage(true);
        toast.success(response.msg);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setStatusTage(true);
  };
  const [reason, setReason] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const inActiveSubmit = async (e) => {
    e.preventDefault();
    setDisabledButton(true);
    var data = JSON.stringify({
      username: username,
      reason: reason,
    });
    try {
      let response = await addUserDisable(data);
      setDisabledButton(true);
      if (response.success) {
        setIsBlackListed(false);
        setStatusTage(true);
        toast.success(response.msg);
        cloneModalClose();
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      setDisabledButton(true);
      toast.error(error.msg);
    }
  };

  // filter counts for service offered
  var FilterCleaning = location.state.cleaning;
  var FilterDisinfecting = location.state.disinfecting;
  var FilterLockers = location.state.lockers;
  var FilterWindow = location.state.window;
  var FilterPolishing = location.state.polishing;

  // filter counts for Businesses Served

  var BanksFilter = location.state.banks;
  var GymsFilter = location.state.gyms;
  var MosquesFilter = location.state.mosques;
  var ChruchFilter = location.state.church;
  var GoldCourseFilter = location.state.goldCourse;

  //Upload Your Picture
  const [animationupload, setAnimationupload] = useState(false);

  //Upload Photo ID
  const [animationuploadPhoto, setAnimationuploadPhoto] = useState(false);
  const [statusTag, setStatusTage] = useState(false);
  //Upload Certificates (Multiple Uploads Available)
  const [animationuploadMultiple, setAnimationuploadMultiple] = useState(false);

  const addEstimatorButton = async (e) => {
    e.preventDefault();
    // !Integrating addEstimator API
    var payload = JSON.stringify({
      domain: Domain,
      name: name,
      username: username,
      address: Address,
      contact: CompanyContact,
      pocEmail: POCEmailID,
      pocName: POCName,
      role: "Company_Admin",
      businessType: businessType,
      pocContactRole: pocContactRole,
      pocContact: POCContactNumber,
      tax: TAX_EIN,
      // URL: CompanyURL,
      URL: "",
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

      // role: "manage billing",

      // driver_license: license,
      // paypal_id: paypal_id,

      picture: "https://somecompany-images.s3.amazonaws.com/" + picture,
      photoID: "https://somecompany-images.s3.amazonaws.com/" + photo,
      // picture: picture,
      // photoID: photo,
      certificateImages: certList.length ? certList.map((e) => e).join(",") : "",
    });

    //check response from API
    let result = await EditCompanyBill(payload);
    if (result.success) {
      setEstimatorAdded(true);
      setTimeout(() => {
        setEstimatorAdded(false);
      }, 4000);
      navigate("..//ManageBillingCompany", { replace: true });
    } else {
      if (result.msg) {
        toast.error(result.msg);
      } else if (result.message) {
        toast.error(result.message);
      } else {
        toast.error(result.error.response.data.message);
      }
      // setshowerror(result.message);
      // setEstimatorNotAdded(true);
      // setTimeout(() => {
      //   setEstimatorNotAdded(false);
      // }, 4000);
    }
    // Scrolling to the top of the page after submitting
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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

  const [uploadYourPictureTitle, setUploadYourPictureTitle] = useState(
    location.state.picture ? false : true
  );
  const uploadPicture = async (event) => {
    let image = event.target.files[0];
    if (checkImage(image)) {
      setAnimationupload(true);
      const result = await uploadImage(image);
      if (result.success) {
        setPicture(result.url.split("https://somecompany-images.s3.amazonaws.com/")[1]);
        setUploadYourPictureTitle(false);
        setAnimationupload(false);
      } else toast.error("Error while uploading image");
    } else {
      toast.error("File size should not exceed 2.5 MB");
    }
  };

  const deletePicture = () => {
    setPicture();
    // setTimeout(() => {
    setUploadYourPictureTitle(true);
    // }, 1);
  };

  const [uploadPhotoID, setUploadPhotoID] = useState(location.state.photoid ? false : true);
  const uploadPhoto = async (event) => {
    let image = event.target.files[0];

    setAnimationuploadPhoto(true);
    if (checkImage(image)) {
      const result = await uploadImage(image);
      if (result.success) {
        setPhoto(result.url.split("https://somecompany-images.s3.amazonaws.com/")[1]);
        setUploadPhotoID(false);
        setAnimationuploadPhoto(false);
      } else toast.error("Error while uploading image");
    } else {
      toast.error("File size should not exceed 2.5 MB");
    }
  };

  const deletePhotoID = () => {
    setPhoto();
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
          setCertList((certList) => [
            ...certList,
            result.url.split("https://somecompany-images.s3.amazonaws.com/")[1],
          ]);
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

  useEffect(async () => {
    await fetchCompanies();
  }, []);

  //! Get Companies API
  const getOptions = async () => {};

  const redOutline = () => {
    if (name === "") {
      showError("Name", true);
    } else {
      showError("Name", false);
    }
    if (POCEmailID === "") {
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

  function buttonfilter(e) {
    // select all filter

    if (e.currentTarget.value == "SelectAllFilter") {
      CountForSelectOrDeselectServiceOffered = CountForSelectOrDeselectServiceOffered + 1;

      if (CountForSelectOrDeselectServiceOffered % 2 !== 0) {
        setcheckForSelectAll1(false);
        FilterCleaning = 1;
        FilterDisinfecting = 1;
        FilterLockers = 1;
        FilterWindow = 1;
        FilterPolishing = 1;
        document.getElementById("FilterCleaning").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("FilterDisinfecting").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("FilterLockers").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("FilterWindow").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("FilterPolishing").style.backgroundColor = "rgb(217,229,241)";
      } else {
        setcheckForSelectAll1(true);
        FilterCleaning = 0;
        FilterDisinfecting = 0;
        FilterLockers = 0;
        FilterWindow = 0;
        FilterPolishing = 0;
        document.getElementById("FilterCleaning").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("FilterDisinfecting").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("FilterLockers").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("FilterWindow").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("FilterPolishing").style.backgroundColor = "rgb(255,255,255)";
      }
    }
    // individual filter

    if (e.currentTarget.value == "FilterCleaning") {
      FilterCleaning = FilterCleaning + 1;
      if (FilterCleaning % 2 == 0) {
        document.getElementById("FilterCleaning").style.backgroundColor = "rgb(255,255,255)";
        FilterCleaning = 0;
      }
      if (FilterCleaning % 2 != 0) {
        document.getElementById("FilterCleaning").style.backgroundColor = "rgb(217,229,241)";
        FilterCleaning = 1;
      }
    }

    if (e.currentTarget.value == "FilterDisinfecting") {
      FilterDisinfecting = FilterDisinfecting + 1;
      if (FilterDisinfecting % 2 == 0) {
        document.getElementById("FilterDisinfecting").style.backgroundColor = "rgb(255,255,255)";
        FilterDisinfecting = 0;
      }
      if (FilterDisinfecting % 2 != 0) {
        document.getElementById("FilterDisinfecting").style.backgroundColor = "rgb(217,229,241)";
        FilterDisinfecting = 1;
      }
    }
    if (e.currentTarget.value == "FilterLockers") {
      FilterLockers = FilterLockers + 1;
      if (FilterLockers % 2 == 0) {
        document.getElementById("FilterLockers").style.backgroundColor = "rgb(255,255,255)";
        FilterLockers = 0;
      }
      if (FilterLockers % 2 != 0) {
        document.getElementById("FilterLockers").style.backgroundColor = "rgb(217,229,241)";
        FilterLockers = 1;
      }
    }
    if (e.currentTarget.value == "FilterWindow") {
      FilterWindow = FilterWindow + 1;
      if (FilterWindow % 2 == 0) {
        document.getElementById("FilterWindow").style.backgroundColor = "rgb(255,255,255)";
        FilterWindow = 0;
      }
      if (FilterWindow % 2 != 0) {
        document.getElementById("FilterWindow").style.backgroundColor = "rgb(217,229,241)";
        FilterWindow = 1;
      }
    }
    if (e.currentTarget.value == "FilterPolishing") {
      FilterPolishing = FilterPolishing + 1;
      if (FilterPolishing % 2 == 0) {
        document.getElementById("FilterPolishing").style.backgroundColor = "rgb(255,255,255)";
        FilterPolishing = 0;
      }
      if (FilterPolishing % 2 != 0) {
        document.getElementById("FilterPolishing").style.backgroundColor = "rgb(217,229,241)";
        FilterPolishing = 1;
      }
    }
  }

  // filter buttons Businesses Served ( Tags )

  function buttonfilter2(e) {
    // select all filter

    if (e.currentTarget.value == "SelectAllFilter2") {
      CountForSelectOrDeselect = CountForSelectOrDeselect + 1;

      if (CountForSelectOrDeselect % 2 !== 0) {
        setcheckForSelectAll(false);
        BanksFilter = 1;
        GymsFilter = 1;
        MosquesFilter = 1;
        ChruchFilter = 1;
        GoldCourseFilter = 1;
        document.getElementById("BanksFilter").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("GymsFilter").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("MosquesFilter").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("ChruchFilter").style.backgroundColor = "rgb(217,229,241)";
        document.getElementById("GoldCourseFilter").style.backgroundColor = "rgb(217,229,241)";
      } else {
        setcheckForSelectAll(true);
        BanksFilter = 0;
        GymsFilter = 0;
        MosquesFilter = 0;
        ChruchFilter = 0;
        GoldCourseFilter = 0;
        document.getElementById("BanksFilter").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("GymsFilter").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("MosquesFilter").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("ChruchFilter").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("GoldCourseFilter").style.backgroundColor = "rgb(255,255,255)";
      }
    }
    // individual filter

    if (e.currentTarget.value == "BanksFilter") {
      BanksFilter = BanksFilter + 1;
      if (BanksFilter % 2 == 0) {
        document.getElementById("BanksFilter").style.backgroundColor = "rgb(255,255,255)";
        BanksFilter = 0;
      }
      if (BanksFilter % 2 != 0) {
        document.getElementById("BanksFilter").style.backgroundColor = "rgb(217,229,241)";
        BanksFilter = 1;
      }
    }

    if (e.currentTarget.value == "GymsFilter") {
      GymsFilter = GymsFilter + 1;
      if (GymsFilter % 2 == 0) {
        document.getElementById("GymsFilter").style.backgroundColor = "rgb(255,255,255)";
        GymsFilter = 0;
      }
      if (GymsFilter % 2 != 0) {
        document.getElementById("GymsFilter").style.backgroundColor = "rgb(217,229,241)";
        GymsFilter = 1;
      }
    }
    if (e.currentTarget.value == "MosquesFilter") {
      MosquesFilter = MosquesFilter + 1;
      if (MosquesFilter % 2 == 0) {
        document.getElementById("MosquesFilter").style.backgroundColor = "rgb(255,255,255)";
        MosquesFilter = 0;
      }
      if (MosquesFilter % 2 != 0) {
        document.getElementById("MosquesFilter").style.backgroundColor = "rgb(217,229,241)";
        MosquesFilter = 1;
      }
    }
    if (e.currentTarget.value == "ChruchFilter") {
      ChruchFilter = ChruchFilter + 1;
      if (ChruchFilter % 2 == 0) {
        document.getElementById("ChruchFilter").style.backgroundColor = "rgb(255,255,255)";
        ChruchFilter = 0;
      }
      if (ChruchFilter % 2 != 0) {
        document.getElementById("ChruchFilter").style.backgroundColor = "rgb(217,229,241)";
        ChruchFilter = 1;
      }
    }
    if (e.currentTarget.value == "GoldCourseFilter") {
      GoldCourseFilter = GoldCourseFilter + 1;
      if (GoldCourseFilter % 2 == 0) {
        document.getElementById("GoldCourseFilter").style.backgroundColor = "rgb(255,255,255)";
        GoldCourseFilter = 0;
      }
      if (GoldCourseFilter % 2 != 0) {
        document.getElementById("GoldCourseFilter").style.backgroundColor = "rgb(217,229,241)";
        GoldCourseFilter = 1;
      }
    }
  }

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

  //! ----------------------------
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalSubmit, setPaymentModalSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentExpiryDate, setPaymentExpiryDate] = useState();
  const [paymentSecurityCode, setPaymentSecurityCode] = useState("");
  const [paymentZipCode, setPaymentZipCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [cvv, setCvv] = useState("");
  const [getpaymentDetails, setGetpaymentDetails] = useState();

  useEffect(async () => {
    gettingDetails();
  }, []);

  const gettingDetails = async () => {
    try {
      const response = await getPaymentsDetails(location.state.username);
      if (response.success) {
        // setGetpaymentDetails(response.paymentsDetails);
        settingPaymentDetails(response.paymentsDetails);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const settingPaymentDetails = (data) => {
    setCvv(data.cvv);
    setEmail(data.email);
    setSelectedCompany(data.client_username);
    setPaymentName(data.card_holder_name);
    setPaymentCardNumber(data.card_number);
    setPaymentSecurityCode(data.security_code);
    // setPaymentExpiryDate(moment(data.expiry_date).calendar());
    setPaymentExpiryDate(data.expiry_date);
    setSelectedCompanyId(data.company_id);
    setPaymentZipCode(data.zip_code);
  };

  const openPaymentInfo = () => {
    setPaymentModal(true);
  };

  const closePaymentInfo = () => {
    setPaymentModal(false);
    setPaymentModalSubmit(false);
    gettingDetails();
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
    console.log("CVV: ", cvv.toString());
    console.log("LENGTH: ", cvv.toString().length);
    if (cvv.toString().length <= 3) {
      if (paymentExpiryDate) {
        setPaymentModalSubmit(true);

        const payload = JSON.stringify({
          client_username: username,
          card_holder_name: paymentName,
          card_number: paymentCardNumber,
          expiry_date: paymentExpiryDate, // MM/YY
          security_code: paymentSecurityCode,
          email: email,
          zip_code: paymentZipCode,
          company_id: location.state.fullData.company_id,
          cvv: cvv,
        });
        const response = await editPaymentDetails(payload);
        if (response.success) {
          toast.success("Payment details updated successfully");
          closePaymentInfo();
          gettingDetails();
        } else {
          const error = response.msg;
          toast.error(`Error: ${error}`);
        }
      } else {
        toast.error("Please enter valid Expiry Date");
      }
    } else {
      toast.warning("Max length for cvv is 3");
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
          <span className="addBillingCompanycss">Edit Billing Companies</span>
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
                <label htmlFor="Name" className="form-label " style={{ float: "left" }}>
                  Name
                </label>
                <input
                  //required={true}
                  type="text"
                  className="form-control required"
                  value={location.state.name}
                  id="Name"
                  aria-describedby="emailHelp"
                  placeholder="Estimator Name"
                  onChange={(e) => setName((location.state.name = e.target.value))}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Domain" className="form-label " style={{ float: "left" }}>
                  URL
                </label>
                <input
                  //required={true}
                  type="text"
                  className="form-control required"
                  value={location.state.domain}
                  readOnly={true}
                  id="Domain"
                  aria-describedby="emailHelp"
                  placeholder="URL"
                  onChange={(e) => setDomain((location.state.domain = e.target.value))}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="Username" className="form-label " style={{ float: "left" }}>
                  Username
                </label>
                <input
                  //required={true}
                  type="text"
                  className="form-control required"
                  value={location.state.username}
                  readOnly={true}
                  id="Username"
                  aria-describedby="emailHelp"
                  placeholder="Username"
                  onChange={(e) => setUsername((location.state.username = e.target.value))}
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
                  value={location.state.address}
                  id="Address"
                  aria-describedby="emailHelp"
                  placeholder="Enter Your Address"
                  onChange={(e) => setAddress((location.state.address = e.target.value))}
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
                  value={location.state.contact}
                  id="CompanyContact"
                  aria-describedby="emailHelp"
                  placeholder="Mobile #"
                  onChange={(e) => setCompanyContact((location.state.contact = e.target.value))}
                />
              </div>
              <div className="mb-3 fileds_input_css">
                <label htmlFor="email" className="form-label " style={{ float: "left" }}>
                  POC Email ID
                </label>
                <input
                  //required={true}
                  type="email"
                  className="form-control"
                  value={location.state.pocEmail}
                  id="email"
                  placeholder="abc@gmail.com"
                  onChange={(e) => setPOCEmailID((location.state.pocEmail = e.target.value))}
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
                  name="POCName"
                  id="POCName"
                  value={location.state.pocName}
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter POC Name"
                  onChange={(e) => setPOCName((location.state.pocName = e.target.value))}
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
                  defaultValue={pocContactRole}
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
                  defaultValue={businessType}
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
                  value={location.state.pocContact}
                  placeholder="No Of Certifications"
                  onChange={(e) =>
                    setPOCContactNumber((location.state.pocContact = e.target.value))
                  }
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
                  value={location.state.tax}
                  placeholder="Tax ID"
                  onChange={(e) => setTAX_EIN((location.state.tax = e.target.value))}
                />
              </div>
              {/* react strap  */}
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
                  <span className="divPlaceHolder col-4">
                    <div>
                      {!picture ? (
                        <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                      ) : (
                        <div className="row justify-content-start">{picture}</div>
                      )}
                    </div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">
                      {/* <span className="uploadItem">{location.state.picture}</span> */}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationupload == false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="upload"
                      className="btn btn-secondary uploadWidthClass col-3 "
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
                    className="btn btn-secondary uploadWidthClass col-3"
                    onChange={uploadPicture}
                  />
                </div>
              ) : (
                <div className="mt-3 row uploadWidth ">
                  {/* <span className="divPlaceHolder">
                      JPEG, PNG & less then 2.5MB
                    </span> */}
                  <span className="placeholderFileName col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;
                      {/* {picture.split("https://somecompany-images.s3.amazonaws.com/")[1]} */}
                      {picture}
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
              <br />
              <Label className="fileds_input_css" htmlFor="uploadphoto" style={{ float: "left" }}>
                Upload Company Logo
              </Label>{" "}
              <br />
              {uploadPhotoID ? (
                <div className="mt-3 row uploadWidth ">
                  <span className="divPlaceHolder col-4">
                    <div>
                      {!photo ? (
                        <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                      ) : (
                        <div className="row justify-content-start">{photo}</div>
                      )}
                    </div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">
                      &nbsp;
                      {/* <span className="uploadItem">{location.state.photo}</span> */}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationuploadPhoto == false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="photo"
                      className="btn btn-secondary uploadWidthClass col-3 "
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
                  {/* <span className="divPlaceHolder"> */}
                  {/* JPEG, PNG & less then 2.5MB */}
                  <span className="placeholderFileName  col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;
                      {/* {photo.split("https://somecompany-images.s3.amazonaws.com/")[1]} */}
                      {photo}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label htmlFor="photo" className="btn btn-danger uploadWidthClassDelete col-3 ">
                    Delete
                    <BiTrash className="uploadIconButton" />
                  </label>
                  <input
                    id="photo"
                    style={{ display: "none" }}
                    // type="file"
                    className="btn btn-secondary uploadWidthClass col-3"
                    onClick={deletePhotoID}
                  />{" "}
                </div>
              )}
              <br />
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
                    {/* {certList.map((e) => {
                            e.name ,
                            <button className="btn btn-primary btn-sm" >Delete</button>
                            })} */}

                    <div>
                      {certList.map((e, index) => (
                        <li className=" row">
                          <span className="placeholderFileName col-4">
                            {certList[index].includes(
                              "https://somecompany-images.s3.amazonaws.com/"
                            ) ? (
                              <div className="row justify-content-start">
                                &nbsp;&nbsp;&nbsp;
                                {
                                  certList[index].split(
                                    "https://somecompany-images.s3.amazonaws.com/"
                                  )[1]
                                }
                              </div>
                            ) : (
                              <div className="row justify-content-start">
                                &nbsp;&nbsp;&nbsp;
                                {certList[index]}
                              </div>
                            )}
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
                            className="btn btn-danger uploadWidthClassDelete col-2"
                            type="button"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                      {/* {certList.map((e) =>   <button className="btn btn-primary btn-sm" >Delete</button> )} */}
                    </div>
                  </div>
                ) : (
                  <p hidden>jshdkha</p>
                )}
                <span className="divPlaceHolde  col-4">
                  {/* <span className="leftAlignUp">Certification Name</span> <br />{" "} */}
                  <span className="leftAlignDown">
                    {!certList.name ? (
                      <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                    ) : (
                      <div className="row justify-content-start">{certList.name}</div>
                    )}
                  </span>
                </span>
                <div className="col-6"></div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {/* <span className="uploadItem">
                    {certList.length ? certList.map((e) => e.name).join(",") : ""}
                  </span> */}
                {animationuploadMultiple === false ? (
                  <label
                    style={{ backgroundColor: "#ffad10", border: "none" }}
                    htmlFor="formFileMultiple"
                    className="btn btn-secondary uploadWidthClass col-2 "
                  >
                    Upload
                    <BiUpload className="uploadIconButton" />
                  </label>
                ) : (
                  <span style={{ marginTop: "-50px" }} className="multipleLoader">
                    <LoaderAnimation size={40} />
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
              </div>{" "}
              <div className="mb-3">
                <Button className=" btn mt-2 d-flex" onClick={openPaymentInfo}>
                  Payment Information
                </Button>
              </div>
              <div className="row justify-content-evenly lastbuttoncss">
                <div className="col-3"></div>
                <div className="col-3">
                  {/* submit button  */}
                  <Button
                    type="submit"
                    id="submit"
                    className="btn buttonColor mt-2"
                    onClick={redOutline}
                  >
                    Update Billing Company
                  </Button>
                </div>

                <div className="col-3">
                  {isBlackListed ? (
                    <Button
                      // value="submit"
                      // type="submit"
                      onClick={() => {
                        redOutline();
                        makeInactive();
                      }}
                      id="submit"
                      className="btn buttonColor mt-2"
                    >
                      {" "}
                      Make In Active{" "}
                    </Button>
                  ) : (
                    <Button
                      // value="submit"
                      // type="submit"
                      onClick={() => {
                        redOutline();
                        makeActive();
                      }}
                      id="submit"
                      className="btn mt-2"
                    >
                      {" "}
                      Make Active{" "}
                    </Button>
                  )}
                </div>
                <div className="col-3"></div>

                {/* 
                <div className="col-3">
                  <Button
                    disabled
                     value="submit" type="submit" 
                    id="submit"
                    className="btn mt-2 "
                    onClick={redOutline}
                  >
                    Make In Active
                  </Button>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>{" "}
      &nbsp;
      <Modal
        show={inActiveModal}
        onHide={cloneModalClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Block Company </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={inActiveSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label modalLabel required">
                Reason to block Company
              </label>
              <textarea
                rows={3}
                type="text"
                className="form-control modalInput"
                id="name"
                placeholder="Enter reason to block company:"
                required={true}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {disabledButton ? (
              <input
                disabled
                type="submit"
                value="Submit"
                id="submit"
                className="btn buttonColor mt-2"
              />
            ) : (
              <input type="submit" value="Submit" id="submit" className="btn buttonColor mt-2" />
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cloneModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
              inputProps={{ readOnly: true }}
              color="secondary"
              className="mt-4"
              fullWidth
              label="Company"
              id="company"
              variant="outlined"
              required
              placeholder="Your Company"
              defaultValue={username}
            />
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
