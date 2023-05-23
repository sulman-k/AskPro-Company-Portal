/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./Quotation.css";
import Table from "react-bootstrap/Table";
import { AiOutlineMore, AiOutlinePrinter } from "react-icons/ai";
import plus from "../../Assets/Images/PlusCircle.png";
import Group2649 from "../../Assets/Images/Group2649.png";
import phone from "../../Assets/Images/Icon ionic-ios-call.png";
import edit from "../../Assets/Images/Icon feather-edit.png";
import deletew from "../../Assets/Images/Group 3595.png";
import blueCircle from "../../Assets/Images/Ellipse 93.png";
import filledstar from "../../Assets/Images/fillStarY.png";
import graystar from "../../Assets/Images/Icon feather-star.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import Toast from "../Toast/Toast";
import Avatar from "@mui/material/Avatar";

import {
  EstimateIDFromDashboard,
  GetAnswersFromCleintID,
  ClientProfileAPI,
  GetCompanyDetailsAPI,
  getViewCategoryAPI,
  getReviewDetailsAPI,
  GetQuotationAPI,
  getQuotationAPI,
  getReviewListAPI,
  getEstimatorDetailsAPI,
  submitRebidQuotation,
  UpdateEstimate,
} from "../../api/Services";
import { ErrorBoundary } from "react-error-boundary";
import { Modal, Button } from "react-bootstrap";
import { TryRounded } from "@mui/icons-material";
import { toast } from "react-toastify";
import { IsAuthorized } from "../../Auth/Authorization";

var ElaspedTimeCheck = 1;

var arrayForDollars = [];
var arrayForDollarsStore = [];
var arrayForDollarsStoreTotal = 0;
let spaces = "  ";

function ErrorHandler({ error }) {
  const reload = () => {
    reload();
  };

  return (
    <div role="alert">
      <p>An error occurred:</p>
      <pre>{error.message}</pre>
      <button onClick={reload}>Reload Page</button>
    </div>
  );
}

export const Quotation = () => {
  // BUILD IN HOOKS

  const location = useLocation();
  const navigate = useNavigate();
  const isViewQuotation = IsAuthorized("estimate").view;
  const isAddQuotation = IsAuthorized("estimate").create;
  // HOOKS

  const [estimateResponse, setEstimateResponse] = useState();
  const [GetAnswerDiscriptionArray, setGetAnswerDiscriptionArray] = useState();
  const [cleaningCompanyResponse, setCleaningCompanyeResponse] = useState({});

  const [ViewCategoryAPI, setViewCategoryAPI] = useState([]);
  const [depthValueCheck, setdepthValueCheck] = useState("");
  const [getQuotation, setGetQuotation] = useState();
  const [getQuotationTotal, setGetQuotationTotal] = useState();
  const [starRating, setStarRating] = useState();
  const [status, setStatus] = useState(location.state.FullData.status);
  // Elapsed Time
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);
  const [reason, setReason] = useState(
    location.state.FullData.reason ? location.state.FullData.reason : " Reason Not Available"
  );

  const [estimateId, setEstimateId] = useState(location.state.FullData._id);
  // const [estimatorId, setEstimatorId] = useState(location.state.FullData.estimatorId);
  const [estimatorId, setEstimatorId] = useState(location.state.FullData._id);
  const [clientIDFromDashBoard, setclientIDFromDashBoard] = useState(
    location.state.FullData.clientId
  );
  const [notTerminatedError, setNotTerminatedError] = useState(false);
  const [client, setClient] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [GetDollar, setGetDollar] = useState([]);
  const [GetAnswers, setGetAnswers] = useState([]);
  const [editEnable, setEditEnable] = useState(false);
  const [getQuotationMonthlyTotal, setGetQuotationMonthlyTotal] = useState(0);
  // GET TOTAL DOLLARS

  const [GetTotalDollar, setGetTotalDollar] = useState(0);

  const [Editshow, setEditshow] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [EditModalValue, setEditModalValue] = useState();
  const [editValue, setEditValue] = useState();
  const [editPlaceHolder, setEditPlaceHolder] = useState("");
  const [editIndex, setEditIndex] = useState();
  const [getQuotationAPIResponse, setGetQuotationAPIResponse] = useState({});
  const [submitForRebidIsDisable, setSubmitForRebidIsDisable] = useState(true);
  const [reviewClientName, setReviewClientName] = useState("");
  const [reviewShow, setReviewShow] = useState(false);
  const [reviewDetails, setReviewDetails] = useState([]);

  useEffect(async () => {
    // window.scrollTo(0, 0);
    if (isViewQuotation) {
      try {
        let clientApiResponse;
        // clientApiResponse = await ClientProfileAPI(clientDataFromDashBoard.username);
        clientApiResponse = await ClientProfileAPI(clientIDFromDashBoard);
        if (clientApiResponse.success) {
          setClient(clientApiResponse.client);
        }
        // else {
        //   toast.error('Something went wrong');
        // }
      } catch (error) {
        toast.error("Something went wrong");
      }

      try {
        let companyDetail;
        // companyDetail = await GetCompanyDetailsAPI(company Name Here);
        companyDetail = await GetCompanyDetailsAPI(location.state.FullData.company_id);
        // companyDetail = await GetCompanyDetailsAPI("629489d40733678a7e691f86");
        if (companyDetail.success) {
          setCleaningCompanyeResponse(companyDetail.company);
        }
        // else {
        //   toast.error('Something went wrong');
        // }
      } catch (error) {
        toast.error("Something went wrong");
      }

      try {
        let responsegetReviewListAPI = await getReviewListAPI(estimatorId);
        if (responsegetReviewListAPI.success) {
          if (responsegetReviewListAPI.estimateReview.length === 1) {
            setReviewDetails(
              responsegetReviewListAPI.estimateReview[responsegetReviewListAPI.estimateReview[0]]
            );
            setStarRating(
              responsegetReviewListAPI.estimateReview[responsegetReviewListAPI.estimateReview[0]]
                .rating
            );
            setReviewClientName(
              responsegetReviewListAPI.estimateReview[responsegetReviewListAPI.estimateReview[0]]
                .client_details[0].name
            );
            setReviewShow(true);
          } else if (responsegetReviewListAPI.estimateReview.length > 1) {
            setReviewDetails(
              responsegetReviewListAPI.estimateReview[
                responsegetReviewListAPI.estimateReview.length - 1
              ]
            );
            setStarRating(
              responsegetReviewListAPI.estimateReview[
                responsegetReviewListAPI.estimateReview.length - 1
              ].rating
            );
            setReviewClientName(
              responsegetReviewListAPI.estimateReview[
                responsegetReviewListAPI.estimateReview.length - 1
              ].client_details[0].name
            );
            setReviewShow(true);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("You are not authorized to view quotation");
      navigate("/Dashboard");
    }
  }, []);

  // Elapsed time
  useEffect(() => {
    handleStart();
  }, [ElaspedTimeCheck]);

  useEffect(async () => {
    try {
      let getQuotationResponse = await getQuotationAPI(estimateId, estimatorId);
      if (getQuotationResponse.success) {
        setGetQuotation(getQuotationResponse.quotation.description);
        setGetQuotationTotal(getQuotationResponse.quotation.total_amount);
        setGetQuotationAPIResponse(getQuotationResponse.quotation);
        setGetQuotationMonthlyTotal(getQuotationResponse.quotation.monthly_total);
      }
      // else {
      //   toast.error("Something went wrong");
      // }
    } catch (error) {
      toast.error("Something went wrong");
    }
    try {
      let getEstimatorDetail = await getEstimatorDetailsAPI(
        location.state.FullData.estimator_username
      );
      if (getEstimatorDetail.success) {
        setEstimateResponse(getEstimatorDetail.estimator);
      }
      // else {
      //   toast.error("Something went wrong");
      // }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, []);

  useEffect(() => {
    getAnswers();
  }, [clientIDFromDashBoard]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAnswers();
    }, 5000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const getAnswers = async () => {
    let Response = await GetAnswersFromCleintID(clientIDFromDashBoard, estimatorId, estimateId);
    // let Response = await GetAnswersFromCleintID(
    //   "624c1af1656b6613ebc1190d",
    //   "6256f0ecbf5cef7e60177baa"
    // );
    // let Response = await GetAnswersFromCleintID("624c1af1656b6613ebc1190d");
    if (Response.success) {
      setGetAnswers(Response.answers);

      for (let index = 0; index < Response.answers.length; index++) {
        arrayForDollarsStore[index] = 0;
      }
    }
  };

  // FUNCTIONS
  const getDollarFunction = (e, index) => {
    arrayForDollars[index] = e.target.value;
    arrayForDollarsStore[index] = arrayForDollars[index];
    arrayForDollarsStoreTotal = 0;
    for (let index = 0; index < arrayForDollarsStore.length; index++) {
      if (arrayForDollarsStore[index] === undefined) {
      } else {
        arrayForDollarsStoreTotal =
          parseInt(arrayForDollarsStoreTotal) + parseInt(arrayForDollarsStore[index]);
      }
    }
    setGetTotalDollar(arrayForDollarsStoreTotal);
  };

  const SubmitForRebid = async () => {
    if (isAddQuotation) {
      setSubmitForRebidIsDisable(false);

      let getStatus = await EstimateIDFromDashboard(estimateId);
      // submit for rebid api adding
      if (getStatus.estimate.status === "terminated" || getStatus.estimate.status === "rejected") {
        // let newArr = [];
        // for (let index = 0; index < GetAnswers.length; index++) {
        //   newArr.push({
        //     lineItems: GetAnswers[index].answer,
        //     amount: arrayForDollarsStore[index],
        //   });
        // }

        // setGetAnswerDiscriptionArray(newArr);

        // var data = JSON.stringify({
        //   estimateId: estimateId,
        //   company_id: location.state.FullData.company_id,
        // });
        var data = JSON.stringify({
          status: "in_rebid",
        });
        setSubmitForRebidIsDisable(true);
        let response = await UpdateEstimate(estimateId, data);
        if (response.success) {
          navigate("/dashboard", { replace: true });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setNotTerminatedError(true);
        setSubmitForRebidIsDisable(true);
        setTimeout(() => {
          setNotTerminatedError(false);
        }, 4000);
      }
    } else {
      toast.error("You are not authorized to add quotation");
    }
  };

  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
        timeZone: tzString,
      })
    );
  }
  // Elapsed Time
  const handleStart = () => {
    var timeUpdate = location.state.FullData.updatedAt;
    var today = new Date();

    timeUpdate = convertTZ(timeUpdate, "Asia/Karachi").getTime();
    today = convertTZ(today, "Asia/Karachi").getTime();
    let differenceM = today - timeUpdate;
    setTimer(differenceM);

    countRef.current = setInterval(() => {
      setTimer((differenceM) => differenceM + 1000);
    }, 1000);
  };

  const formatTime = () => {
    var milliseconds = parseInt((timer % 1000) / 100),
      seconds = Math.floor((timer / 1000) % 60),
      minutes = Math.floor((timer / (1000 * 60)) % 60),
      hours = Math.floor((timer / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  };

  //edit quotation
  const editCalled = (index, categoryName) => {
    setEditItem(true);
    setEditPlaceHolder(categoryName);
    setEditIndex(index);
  };
  const EditItemClose = () => {
    setEditItem(false);
  };
  const deleteCalled = (index) => {
    GetAnswers.splice(index, 1);
    setViewCategoryAPI(GetAnswers);
  };

  // Add line Item Modal
  const EdithandleClose = () => {
    setEditshow(false);
  };

  const AddLineItemForm = async (e) => {
    e.preventDefault();
    GetAnswers.push({ answer: EditModalValue });
    setViewCategoryAPI(GetAnswers);
    EdithandleClose();
  };

  const EditItemForm = async (e) => {
    e.preventDefault();
    GetAnswers[editIndex].answer = editValue;
    setViewCategoryAPI(GetAnswers);
    EditItemClose();
  };

  const yellowStars = (animals) => {
    let content = [];
    for (let i = 0; i < animals; i++) {
      content.push(<li key={i}>{<img src={filledstar} />}</li>);
    }
    return content;
  };

  const grayStars = (animals) => {
    let content = [];
    for (let i = 0; i < animals; i++) {
      content.push(<li key={i}>{<img src={graystar} />}</li>);
    }
    return content;
  };

  const printPage = () => {
    window.print();
  };

  function isValidUrl(_string) {
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return matchPattern.test(_string);
  }
  const imgSize = (index) => {
    document.getElementById(`imgSizes${index}`).requestFullscreen();
  };
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <div className="row">
        <div className="col-1"></div>
        <div className="col-9 mt-4 d-flex justify-content-between">
          <div className="elapsedTime">
            <span className="elapseSpan">Elasped Time</span>: {formatTime()}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="elapsedPara">
              Elapsed Time since the quotation request is received
            </span>
          </div>
          {/* <img src={Group2646} size={30} alt="Not Found" /> */}
          {/* <span>&#8942;</span> */}
          <div className="test d-flex flex-end"></div>
        </div>
      </div>
      {notTerminatedError ? (
        <div className=" col-12 toastClass">
          <Toast success={"danger"} message="Unable to submit untill status is 'Terminated' " />
        </div>
      ) : null}
      <div className="row">
        <div className="col-12">
          <p></p>
        </div>
      </div>
      {/* ************************************************************************* Information Block  ************************************************************************* */}
      <div className="row mt-4 justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start bg_color_client_information">
          Client Information
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      <div className="row justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start card">
          <div className="col-12">
            <div className="row">
              <div className="col-2 ">Client Name</div>
              <div className="col-1"></div>
              <div className="col-2 ">Address</div>
              <div className="col-1"></div>
              <div className="col-2">Business Type</div>
              <div className="col-1"></div>
              <div className="col-3">Contact</div>
            </div>

            <div className="row">
              <div className="col-12">
                <hr />
              </div>
            </div>

            <div className="row fontSizeInformation">
              <div className="col-2 mt-2">{client.fullname}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{client?.address}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{client.businessindustry}</div>
              <div className="col-1"></div>
              <div className="col-3">
                <button className="btn btn_color_set">{client.contact}</button>
              </div>
            </div>

            <div className="row">
              <div className="col-12">&nbsp;</div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="d-flex p-3 align-items-start bg_color_client_information2">
                  POC Information to shown
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">&nbsp;</div>
            </div>

            <div className=" quotationCard ">
              <div className="">
                <div className="row d-flex justify-content-start">
                  <div className=" col-5 col5 ">
                    <p className="fontBold">Point Of Contact Role</p>
                  </div>
                  <div className="col-7 col7">{client.role}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Name</p>
                  </div>
                  <div className="col-7 col7">{client.pocname}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Email</p>
                  </div>
                  <div className="col-7 col7">{client.emailaddress}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Company Phone Number</p>
                  </div>
                  <div className="col-7 col7">
                    {client.companyPhone}
                    {/* <div className="phoneDiv">
                      &nbsp; &nbsp; &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" />
                    </div> */}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Cell Number</p>
                  </div>
                  <div className="col-7 col7">
                    {client.poccellnumber}
                    {/* <div className="phoneDiv">
                      &nbsp; &nbsp; &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" />
                    </div> */}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Address</p>
                  </div>
                  <div className="col-7 col7">{client?.address}</div>
                </div>
                <div className="mt-4"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      {/* ************************************************************************* Information Block Ends ************************************************************************* */}
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
      <div className="row mt-4 justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start bg_color_client_information">
          Cleaning Company
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      <div className="row justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start card">
          <div className="col-12">
            <div className="row">
              <div className="col-2 ">Client Name</div>
              <div className="col-1"></div>
              <div className="col-2 ">Address</div>
              <div className="col-1"></div>
              <div className="col-2">Business Type</div>
              <div className="col-1"></div>
              <div className="col-3">Contact</div>
            </div>
            <div className="row">
              <div className="col-12">
                <hr />
              </div>
            </div>
            <div className="row fontSizeInformation">
              <div className="col-2 mt-2">{cleaningCompanyResponse?.name}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{cleaningCompanyResponse?.address}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{cleaningCompanyResponse?.businessType}</div>
              <div className="col-1"></div>
              <div className="col-3">
                <button className="btn btn_color_set">{cleaningCompanyResponse.contact}</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">&nbsp;</div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-flex p-3 align-items-start bg_color_client_information2">
                  POC Information to shown
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">&nbsp;</div>
            </div>
            <div className=" quotationCard ">
              <div className="">
                <div className="row d-flex justify-content-start">
                  <div className=" col-5 col5 ">
                    <p className="fontBold">Point Of Contact Role</p>
                  </div>
                  <div className="col-7 col7">{cleaningCompanyResponse.pocRole}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Name</p>
                  </div>
                  <div className="col-7 col7">{cleaningCompanyResponse.pocName}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Email</p>
                  </div>
                  <div className="col-7 col7">{cleaningCompanyResponse.pocEmail}</div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Company Phone Number</p>
                  </div>
                  <div className="col-7 col7">
                    {cleaningCompanyResponse.contact}
                    {/* <div className="phoneDiv">
                      &nbsp; &nbsp; &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" />
                    </div> */}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Point of Contact Cell Number</p>
                  </div>
                  <div className="col-7 col7">
                    {cleaningCompanyResponse.pocContact}
                    {/* <div className="phoneDiv">
                      &nbsp; &nbsp; &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" /> &nbsp;
                      &nbsp;
                      <img className="qImage" alt="Not Found" />
                    </div> */}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className=" col-5 col5">
                    <p className="fontBold">Address</p>
                  </div>
                  <div className="col-7 col7">{cleaningCompanyResponse.address}</div>
                </div>
                <div className="mt-4"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
      {/* ************************************************ cleanig Company ends *************************** */}
      <div className="row mt-4 justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start bg_color_client_information">
          Estimator Information
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      <div className="row justify-content-start">
        <div className="d-flex col-1 align-items-start"></div>
        <div className="d-flex p-3 col-10 align-items-start card">
          <div className="col-12">
            <div className="row">
              <div className="col-2 ">Client Name</div>
              <div className="col-1"></div>
              <div className="col-2 ">Address</div>
              <div className="col-1"></div>
              <div className="col-2">Business Type</div>
              <div className="col-1"></div>
              <div className="col-3">Contact</div>
            </div>

            <div className="row">
              <div className="col-12">
                <hr />
              </div>
            </div>

            <div className="row fontSizeInformation">
              <div className="col-2 mt-2">{estimateResponse?.fullname}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{estimateResponse?.emailaddress}</div>
              <div className="col-1"></div>
              <div className="col-2 mt-2">{estimateResponse?.businessType}</div>
              <div className="col-1"></div>
              <div className="col-3">
                <button className="btn btn_color_set">
                  {estimateResponse?.contact ? estimateResponse?.contact : "Not Available"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-1 align-items-start"></div>
      </div>
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
      {/* Starting from here */}
      <div className="row">
        <div className="col-1"></div>
        <div className="col-10 mt-4">
          <div className="col-12 d-flex flex-start">
            <h5>Estimate</h5>
          </div>
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
              <span className="col-3 col3 text-center">Total</span>
            </div>

            <div className="card-body">
              {/* {ViewCategoryAPI.map((item, index) => ( */}
              {getQuotation ? (
                getQuotation.map((item, index) => (
                  <>
                    <div className="row">
                      <div className=" col-9 col9">
                        <p className="col-9 col9">
                          <pre
                            style={{
                              fontSize: "17px",
                              fontFamily: "MyriadPro-Regular",
                            }}
                          >
                            <p className="d-flex">
                              {item.depth ? item.depth : "0"}.&nbsp;
                              {item?.lineItemQuestion}
                            </p>
                            <br />
                            <p style={{ fontFamily: "MyriadPro-Regular" }} className="d-flex">
                              &nbsp; Answer.&nbsp;
                              {(() => {
                                switch (item?.answer_type ? item?.answer_type : "Text") {
                                  case "Text":
                                    return item?.lineItemAnswer;
                                  case "date":
                                    return item?.lineItemAnswer;
                                  case "Picture":
                                    return item?.lineItemAnswer?.map((itemI, IndexI) => (
                                      <img
                                        style={{
                                          height: "100%",
                                          width: "10%",
                                          marginLeft: "20px",
                                        }}
                                        onClick={() => imgSize(IndexI)}
                                        className="answerImages pointer"
                                        src={itemI.url}
                                        alt="imageNotFound"
                                        id={`imgSizes${IndexI}`}
                                      />
                                    ));
                                  case "Measurements":
                                    return item?.LineItemAnswer;
                                  case "Numeric":
                                    return item?.LineItemAnswer;
                                  case "Yes/No":
                                    return item?.LineItemAnswer;
                                  case "Video":
                                    return (
                                      <div className="video-responsive">
                                        <video width="320" height="240" controls>
                                          <source src={item?.answer} />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                    );

                                  default:
                                    return item?.LineItemAnswer;
                                }
                              })()}
                            </p>
                          </pre>
                        </p>
                      </div>

                      <div className="col-3">
                        <span className="numberT d-flex justify-content-end">
                          <input
                            readOnly
                            style={{
                              border: "none",
                              outline: " none",
                              background: "white",
                              color: "black",
                            }}
                            id="getAnswerInputDollar"
                            placeholder="Enter Amount"
                            value={item.amount === 0 ? "" : item.amount}
                            onChange={(e) => getDollarFunction(e, index)}
                            type="number"
                            min="0"
                          />
                        </span>
                      </div>
                    </div>
                    <hr className="nomargin" />
                    &nbsp;
                  </>
                ))
              ) : (
                <h1>No Data Found</h1>
              )}
              {/* <div className="row mt-4 mb-4">
                <div className="btn_addLnItms">
                  <button onClick={() => setEditshow(true)} className="btn buttonColor">
                    Add Line Items <img className="qImage pluscircle" src={plus} alt="Not Found" />
                  </button>
                </div>
              </div> */}

              {/*Add new modal End  */}
              {/* <div className="mt-4"></div> */}

              <div className="row text-light gTotalColor">
                <span className="col-9 gthead">
                  Monthly Total:{" "}
                  <span contenteditable="true" id="idMonthlyTotal" className="monthlyGT">
                    {getQuotationMonthlyTotal}
                  </span>
                </span>
                <span className="col-3">
                  Total: &nbsp;&nbsp;
                  <span contenteditable="true" id="idGrandTotal" className="numberGT">
                    {getQuotationTotal}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
      {/* cleaning frequency  */}
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10">
          <div className="row">
            <div className="col-4">
              <div className="row">
                <div className="col-6">
                  <span className="fontHelveticaOnly">Cleaning frequency</span>
                </div>
                <div className="col-6">
                  <span className="fontHelveticaBorder">
                    {getQuotationAPIResponse.cleaningFrequency
                      ? getQuotationAPIResponse.cleaningFrequency
                      : "Not Available"}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-2"></div>
            <div className="col-6">
              <div className="row">
                <div className="col-4">
                  <span className="fontHelveticaOnly">Contract term </span>
                </div>
                <div className="col-4">
                  <span className="fontHelveticaBorder">
                    {getQuotationAPIResponse.contractTermFrom
                      ? getQuotationAPIResponse.contractTermFrom
                      : "0-0-0"}
                  </span>
                  <span style={{ float: "right" }}>to</span>
                </div>
                <div className="col-4">
                  <span className="fontHelveticaBorder">
                    {" "}
                    {getQuotationAPIResponse.contractTermTo
                      ? getQuotationAPIResponse.contractTermTo
                      : "0-0-0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>

      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      {/* estimators input  */}
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10 mt-4">
          <div className="col-12 d-flex flex-start">
            <h5>Estimators input </h5>
          </div>
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
            </div>

            <div className="card-body">
              {GetAnswers.length ? (
                GetAnswers.map((item, index) => (
                  <>
                    <div className="row">
                      <div className=" col-9 col9">
                        <p className="col-9 col9 d-block">
                          <span className="d-flex">
                            {" "}
                            {item.depth ? item.depth : "0"}. &nbsp; {item.question}
                          </span>
                          <span className="d-flex">
                            &nbsp; Answer.&nbsp;
                            {(() => {
                              switch (item?.answer_type ? item?.answer_type : "Text") {
                                case "Text":
                                  return item?.answer;
                                case "date":
                                  return item?.answer;
                                case "Picture":
                                  return item.answer.map((itemI, IndexI) => (
                                    <img
                                      style={{
                                        height: "100%",
                                        width: "10%",
                                        marginLeft: "20px",
                                      }}
                                      onClick={() => imgSize(IndexI)}
                                      className="answerImages pointer"
                                      src={itemI.url}
                                      alt="imageNotFound"
                                      id={`imgSizes${IndexI}`}
                                    />
                                  ));
                                case "Measurements":
                                  return item?.answer;
                                case "Numeric":
                                  return item?.answer;
                                case "Yes/No":
                                  return item?.answer;
                                case "Video":
                                  return (
                                    <div className="video-responsive">
                                      <video width="320" height="240" controls>
                                        <source src={item.answer} />
                                        Your browser does not support the video tag.
                                      </video>
                                    </div>
                                  );

                                default:
                                  return item?.answer;
                              }
                            })()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <hr className="nomargin" />
                  </>
                ))
              ) : (
                <h1>No Data Found</h1>
              )}
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
      {/* cleaning frequency  */}
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10">
          <div className="row">
            <div className="col-4">
              <div className="row">
                <div className="col-6">
                  <span className="fontHelveticaOnly">Cleaning frequency</span>
                </div>
                <div className="col-6">
                  <span className="fontHelveticaBorder">
                    {getQuotationAPIResponse.cleaningFrequency
                      ? getQuotationAPIResponse.cleaningFrequency
                      : "Not Available"}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-2"></div>
            <div className="col-6">
              <div className="row">
                <div className="col-4">
                  <span className="fontHelveticaOnly">Contract term </span>
                </div>
                <div className="col-4">
                  <span className="fontHelveticaBorder">
                    {getQuotationAPIResponse.contractTermFrom
                      ? getQuotationAPIResponse.contractTermFrom
                      : "0-0-0"}
                  </span>
                  <span style={{ float: "right" }}>to</span>
                </div>
                <div className="col-4">
                  <span className="fontHelveticaBorder">
                    {" "}
                    {getQuotationAPIResponse.contractTermTo
                      ? getQuotationAPIResponse.contractTermTo
                      : "0-0-0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
      {/* Total fee  */}
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10">
          <div className="row mt-4">
            <span className="fontHelveticaOnly d-flex justify-content-start">
              Total Fee &nbsp; &nbsp; 20%
            </span>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
      {/* status rejected  */}
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10 mt-4 ">
          <div className="row d-flex justify-content-start">
            <div className="elapsedTimeBottom">
              <span className="">
                <span className="elapseSpan">Status</span>:
                <span style={{ color: "red" }}>
                  {" "}
                  &nbsp; {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>{" "}
              </span>
              <span className="elapsedPara">
                <b>Reason:</b>{" "}
                <span className="fontHelvetica">{reason ? reason : "Reason Not Found"}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
      <div className="row mt-4"></div>
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10 releaseEstimator">
          <span className="releaseEstimatorPayment">Release Estimators Payments</span>
          <span className="fontHelveticaBorder col-2" style={{ marginRight: "1%" }}>
            20%
          </span>
          <button className="btn btnRelease col-2">Release</button>
        </div>
        <div className="col-1"></div>
      </div>
      <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10 releaseEstimator">
          <span className="releaseEstimatorPayment">Refund Client</span>
          <span className="fontHelveticaBorder col-2" style={{ marginRight: "1%" }}>
            20%
          </span>
          <button className="btn btnRelease col-2">Refund </button>
        </div>
        <div className="col-1"></div>
      </div>
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      <div className="col-12 mt-4">
        <div className="mt-4">
          {submitForRebidIsDisable ? (
            <button onClick={SubmitForRebid} type="button" className="btn col-2 btnFont ">
              <img className="qImage1" src={phone} alt="Not Found" /> &nbsp; &nbsp;
              <b>Submit For Rebid</b>
            </button>
          ) : (
            <>
              <button disabled type="button" className="btn col-2 btnFont ">
                <img className="qImage1" src={phone} alt="Not Found" /> &nbsp; &nbsp;
                <b>Submit For Rebid</b>
              </button>{" "}
              <br />
              <br />
              <b style={{ color: "red" }}>Please Wait...</b>
            </>
          )}
          <br />
          <div className="mt-4">
            <span>
              <span className="elapseSpan">Status</span>:
              <span style={{ color: "red" }}>
                {" "}
                &nbsp; {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>{" "}
            </span>
          </div>

          <button onClick={printPage} type="button" className="btn btn-lg btn-light btnPrinter">
            <img src={Group2649} alt="Not working" />
          </button>
        </div>
      </div>
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      {reviewShow ? (
        <div className="row mt-4">
          <div className="col-1"></div>
          <div className="col-10 ">
            <div className="col-12 d-flex flex-start">
              <h5>Client Reviews </h5>
            </div>
            <div className="card quotationCard">
              <div className="card-title  clientReviewsQuotation">
                <div className="row incomingBarQuotation" style={{ flexWrap: "nowrap" }}>
                  <div className="col-1">
                    {reviewDetails?.client_details[0]?.profilepicture ? (
                      <img
                        className="blueCircleImages"
                        src={reviewDetails?.client_details[0]?.profilepicture}
                        alt="notFound"
                      />
                    ) : (
                      <Avatar sx={{ width: 56, height: 56 }}>{reviewClientName.slice(0, 1)}</Avatar>
                    )}
                  </div>

                  <div style={{ color: "#666666", padding: "0px" }} className="col-11">
                    <h3>{reviewClientName}</h3>
                    <span>
                      {reviewDetails?.client_details[0]?.designation
                        ? reviewDetails?.client_details[0]?.designation
                        : null}
                    </span>
                    {console.log("reviewDetails: ", reviewDetails)}
                  </div>
                  <div style={{ marginLeft: "-25%", display: "flex" }}>
                    <ul style={{ display: "flex", paddingLeft: "0px" }}>
                      {yellowStars(starRating)}
                    </ul>
                    <ul style={{ display: "flex", paddingLeft: "0px" }}>
                      {grayStars(5 - starRating)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="container alignStart clientReview">{reviewDetails?.comment}</div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      ) : null}
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      <div className="row mt-4">
        <div className="col-1"></div>

        {/*         
        <div className="col-10 mt-4">
          <div className="col-12 d-flex flex-start">
            <h5>Status Log</h5>
          </div>
          <div className="card quotationCard">
            <div className="card-title clientReviewsQuotation">
              <div className="d-flex col-1 align-items-start"></div>
              <div className="d-flex col-10 align-items-start bg_color_client_information">
                Status Log
              </div>
              <div className="d-flex col-1 align-items-start"></div>
            </div>

            <div className="card-body">
              <div className="row mb-4">
                <div className="col-2">
                  <span className="firstRowEstimatorReview">List of Estimates</span>
                </div>
                <div className="col-2">
                  <span className="firstRowEstimatorReview">Date</span>
                </div>
                <div className="col-2">
                  <span className="firstRowEstimatorReview">Time</span>
                </div>
                <div className="col-2">
                  <span className="firstRowEstimatorReview">Company</span>
                </div>
                <div className="col-2">
                  <span className="firstRowEstimatorReview">Status</span>
                </div>
                <div className="col-2">
                  <span className="firstRowEstimatorReview">Reason</span>
                </div>

                {/* {reviewList ? (
              reviewList.length ? (
                reviewList.map((item, index) => (
                  <>
                    <div className="col-3 mt-4">
                      <span className="detailRowEstimatorReview">
                        {reviewList[index].client_details[0].name}
                      </span>
                    </div>
                    <div className="col-3 mt-4">
                      <span className="detailRowEstimatorReview">Job Number</span>
                    </div>
                    <div className="col-6 mt-4">
                      <span className="detailsRowEstimatorReview d-flex">
                        {reviewList[index].comment}
                      </span>
                    </div>
                  </>
                ))
              ) : (
                <LoaderAnimation />
              )
            ) : (
              <h1>No Data Found</h1>
            )} 
                
              </div>
            </div>
          </div>
        </div> */}
        <div className="col-1"></div>
      </div>
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
      {/* <div className="row mt-4">
        <div className="col-1"></div>
        <div className="col-10 mt-4">
          <div className="col-12 d-flex flex-start">
            <h5>Additional Notes</h5>
          </div>
          <div className="card quotationCard">
            <div className="card-body d-flex additionalNotesCard">
              <span className="additionalNotes">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat sequi culpa aliquid
                numquam nobis. Doloremque illum aperiam, architecto ipsum cupiditate eaque nemo enim
                modi distinctio dolores necessitatibus unde vitae officia! Lorem ipsum, dolor sit
                amet consectetur adipisicing elit. Impedit, hic modi aut minus aliquam tempore
                doloribus voluptatibus esse consectetur odit quam accusantium magnam eveniet ducimus
                necessitatibus dolores! Vitae, modi corporis!
              </span>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div> */}
      <div className="row mt-4"></div>
      <div className="row mt-4"></div>
    </ErrorBoundary>
  );
};
