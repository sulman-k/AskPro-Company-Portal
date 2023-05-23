/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import {
  ClientProfileAPI,
  EstimateIDFromDashboard,
  GetAnswersFromCleintID,
  getQuotationAPI,
  getReviewListAPI,
  getViewCategoryAPI,
  submitRebidQuotation,
  UpdateEstimate,
} from "../../api/Services";
import "./Rebid.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Group2649 from "../../Assets/Images/Group2649.png";
import deletew from "../../Assets/Images/Group 3595.png";
import phone from "../../Assets/Images/Icon awesome-phone-alt.png";
import line from "../../Assets/Images/Path 9263.png";
import message from "../../Assets/Images/Icon material-chat.png";
import plus from "../../Assets/Images/PlusCircle.png";
import edit from "../../Assets/Images/Icon feather-edit.png";
import blueCircle from "../../Assets/Images/Ellipse 93.png";
import filledstar from "../../Assets/Images/fillStarY.png";
import graystar from "../../Assets/Images/Icon feather-star.png";
import Toast from "../Toast/Toast";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
import { toast } from "react-toastify";
import { IsAuthorized } from "../../Auth/Authorization";

var arrayForDollars = [];
var arrayForDollarsStore = [];
var arrayForDollarsStoreTotal = 0;
let spaces = "  ";

// var ElaspedTimeCheck

var ElaspedTimeCheck = 1;

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

const Rebid = () => {
  // BUILD IN HOOKS

  const navigate = useNavigate();
  const location = useLocation();

  const isViewRebid = IsAuthorized("estimate").view;
  const isAddRebid = IsAuthorized("estimate").create;

  // HOOKS

  const [estimateResponse, setEstimateResponse] = useState({});
  const [GetAnswerDiscriptionArray, setGetAnswerDiscriptionArray] = useState();
  const [cleaningCompanyResponse, setCleaningCompanyeResponse] = useState({});
  const [getQuotation, setGetQuotation] = useState();
  const [getRealQuotation, setGetRealQuotation] = useState();
  const [ViewCategoryAPI, setViewCategoryAPI] = useState([]);
  const [depthValueCheck, setdepthValueCheck] = useState("");
  const [reason, setReason] = useState(location.state.FullData.reason);
  const [starRating, setStarRating] = useState();
  // Elapsed Time
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);
  const [getQuotationTotal, setGetQuotationTotal] = useState();
  const [getRealQuotationTotal, setGetRealQuotationTotal] = useState();
  const [estimateId, setEstimateId] = useState(location.state.FullData._id);
  const [estimatorId, setEstimatorId] = useState(location.state.FullData.estimatorId);
  const [status, setStatus] = useState(location.state.FullData.status);
  const [inRebidError, setInRebidError] = useState(false);
  // const [clientIDFromDashBoard, setclientIDFromDashBoard] = useState(
  //   location.state.FullData.clientId
  // );const [EditValueLoader, setEditValueLoader] = useState(true);
  const [clientIDFromDashBoard, setclientIDFromDashBoard] = useState(
    location.state.FullData.clientId
  );
  const [client, setClient] = useState([]);
  const [GetDollar, setGetDollar] = useState([]);
  const [GetAnswers, setGetAnswers] = useState([]);
  const [GetRealAnswers, setGetRealAnswers] = useState([]);
  const [editEnable, setEditEnable] = useState(false);
  // GET TOTAL DOLLARS

  const [GetTotalDollar, setGetTotalDollar] = useState(0);
  // ("clientID", clientIDFromDashBoard);
  // Modal Add Line Item
  const [Editshow, setEditshow] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [EditModalValue, setEditModalValue] = useState();
  const [editValue, setEditValue] = useState();
  const [editPlaceHolder, setEditPlaceHolder] = useState("");
  const [editIndex, setEditIndex] = useState();
  const [frequency, setFrequency] = useState(1);
  const [getQuotationMonthlyTotal, setGetQuotationMonthlyTotal] = useState(0);
  const [submitForRebidIsDisable, setSubmitForRebidIsDisable] = useState(true);
  const [reviewClientName, setReviewClientName] = useState("");
  const [reviewShow, setReviewShow] = useState(false);
  const [reviewDetails, setReviewDetails] = useState([]);

  //! USE EFFECTS

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(async () => {
    // window.scrollTo(0, 0);
    if (isViewRebid) {
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
        let responsegetReviewListAPI = await getReviewListAPI(estimateId);
        if (responsegetReviewListAPI.success) {
          if (responsegetReviewListAPI.estimateReview.length === 1) {
            setReviewDetails(responsegetReviewListAPI.estimateReview[0]);
            setStarRating(responsegetReviewListAPI.estimateReview[0]?.rating);
            setReviewClientName(responsegetReviewListAPI.estimateReview[0]?.client_details[0].name);
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

  const [allGetQuotationResponse, setAllGetQuotationResponse] = useState([]);

  useEffect(async () => {
    let getQuotationResponse = await getQuotationAPI(estimateId, estimatorId);
    if (getQuotationResponse.success) {
      setAllGetQuotationResponse(getQuotationResponse.quotation);
      setGetQuotation(getQuotationResponse.quotation.description);
      setGetQuotationTotal(getQuotationResponse.quotation.total_amount);
      setGetQuotationMonthlyTotal(getQuotationResponse.quotation.monthly_total);
      setGetTotalDollar(getQuotationResponse.quotation.total_amount);
      for (let index = 0; index < getQuotationResponse.quotation.description.length; index++) {
        arrayForDollarsStore[index] = getQuotationResponse.quotation.description[index].amount;
      }
    }
    // else {
    //   toast.error('Something went wrong');
    // }
  }, []);
  useEffect(async () => {
    let getQuotationResponse = await getQuotationAPI(estimateId, estimatorId);
    if (getQuotationResponse.success) {
      setGetRealQuotation(getQuotationResponse.quotation.description);
      setGetRealQuotationTotal(getQuotationResponse.quotation.total_amount);
    }
    // else {
    //   toast.error("Something went wrong");
    // }
  }, []);

  // Elapsed time
  useEffect(() => {
    handleStart();
  }, []);

  useEffect(async () => {
    // let Response = await GetAnswersFromCleintID(clientIDFromDashBoard);
    let Response = await GetAnswersFromCleintID(clientIDFromDashBoard, estimatorId, estimateId);
    if (Response.success) {
      setGetAnswers(Response.answers);
      setGetRealAnswers(Response.answers);
    }
  }, [clientIDFromDashBoard]);

  // FUNCTIONS
  let nanNumber;
  const getDollarFunction = (e, index) => {
    nanNumber = e.target.value;
    if (nanNumber === "") {
      nanNumber = 0;
    }

    arrayForDollars[index] = nanNumber;
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
    // setGetQuotationMonthlyTotal(arrayForDollarsStoreTotal);
    // setGetQuotationTotal(arrayForDollarsStoreTotal);
  };

  // Elapsed time
  useEffect(() => {
    handleStart();
  }, [ElaspedTimeCheck]);

  const SubmitForRebid = async () => {
    if (isAddRebid) {
      setSubmitForRebidIsDisable(false);
      // submit for rebid api adding
      let getStatus = await EstimateIDFromDashboard(estimateId);
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
        // let response = await submitRebidQuotation(data);
        let response = await UpdateEstimate(estimateId, data);
        if (response.success) {
          navigate("/dashboard", { replace: true });
        } else {
          setSubmitForRebidIsDisable(true);
        }
      } else {
        SubmitForRebidFlase();
      }
    } else {
      toast.error("You are not authorized to Rebid");
    }
  };

  const SubmitForRebidFlase = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setInRebidError(true);
    setSubmitForRebidIsDisable(true);
    setTimeout(() => {
      setInRebidError(false);
    }, 4000);
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
      setTimer((differenceM) => differenceM + 500);
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
  const editCalled = async (index, categoryName) => {
    setEditItem(true);
    setEditPlaceHolder(categoryName);
    setEditIndex(index);
  };
  const EditItemClose = () => {
    setEditItem(false);
  };
  const deleteCalled = async (index) => {
    arrayForDollarsStoreTotal = 0;

    getQuotation.splice(index, 1);
    arrayForDollarsStore.splice(index, 1);
    // setViewCategoryAPI(GetAnswers);
    // working on array

    for (let index = 0; index < arrayForDollarsStore.length; index++) {
      arrayForDollarsStoreTotal += parseInt(arrayForDollarsStore[index]);
    }
    setGetTotalDollar(arrayForDollarsStoreTotal);
  };

  // Add line Item Modal
  const EdithandleClose = () => {
    setEditshow(false);
  };

  const AddLineItemForm = async (e) => {
    e.preventDefault();
    getQuotation.push({ lineItemAnswer: EditModalValue });
    EdithandleClose();
  };

  const EditItemForm = async (e) => {
    e.preventDefault();
    // debugger;
    getQuotation[editIndex].lineItemAnswer = editValue;
    // setViewCategoryAPI(GetAnswers);
    EditItemClose();
  };
  const handleFrequency = (event) => {
    setFrequency(event.target.value);
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

  const imgSize = (url) => {
    document.getElementById(`imgSizes${url}`).requestFullscreen();
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <div className="row">
        {inRebidError ? (
          <div className=" col-12 toastClass">
            <Toast
              success={"danger"}
              message="Unable to send Offer until status is 'Terminated' or 'Rejected' "
            />
          </div>
        ) : null}
        <div className="col-12 mt-4 d-flex justify-content-between">
          <span className="">Offers# {estimateId}</span>
        </div>
        <div className="col-12 mt-4 d-flex justify-content-between">
          <div className="elapsedTime">
            <span className="elapseSpan">Elasped Time</span>: {formatTime()}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="elapsedPara">
              Elapsed Time since the quotation request is received
            </span>
          </div>

          <div class="test d-flex flex-end"></div>
        </div>
        <div className="col-12 mt-4">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">Client Information</div>

            <div className="card-body">
              <div className="row">
                <div className=" col-5 col5">
                  <p className="fontBold">Zip Code</p>
                </div>
                <div className="col-7 col7">{client?.zipCode ? client.zipCode : "Not Found"}</div>
              </div>
              <hr />

              <div className="row">
                <div className=" col-5 col5">
                  <p className="fontBold">Business Type</p>
                </div>
                <div className="col-7 col7">
                  {client?.businessType ? client.businessType : "Not Found"}
                </div>
              </div>
              <div className="mt-4"></div>
            </div>
          </div>
        </div>

        {/* from */}

        <div className="col-12 mt-4 mb-4">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
              <span className="col-3 text-center">Total</span>
            </div>

            <div className="card-body">
              {/* {ViewCategoryAPI.map((item, index) => ( */}
              <table className="table table-bordered">
                <tbody>
                  {getQuotation ? (
                    getQuotation.map((item, index) => (
                      <>
                        <tr>
                          <td className="col-10 ">
                            <span
                              style={{
                                fontSize: "17px",
                                fontFamily: "MyriadPro-Regular",
                                wordBreak: "break-all",
                              }}
                            >
                              <p className="d-flex">
                                {" "}
                                {item.depth ? item.depth : "0"}.&nbsp;
                                {item?.lineItemQuestion}
                              </p>
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
                            </span>
                          </td>

                          <td className="col-1">
                            <span className="EnterAmountInDollar">
                              $
                              <input
                                style={{ border: "none", outline: " none" }}
                                id="getAnswerInputDollar"
                                placeholder="Enter Amount"
                                defaultValue={
                                  arrayForDollarsStore[index] === 0
                                    ? ""
                                    : arrayForDollarsStore[index]
                                }
                                // defaultValue={
                                //   arrayForDollarsStore[index] === 0
                                //     ? ""
                                //     : arrayForDollarsStore[index]
                                // }
                                onChange={(e) => getDollarFunction(e, index)}
                                type="number"
                                min="0"
                              />
                            </span>
                          </td>
                          <td className="col-1">
                            <img
                              onClick={() => editCalled(index, item.lineItemAnswer)}
                              className="q1Image pointer"
                              src={edit}
                              alt="Not Found"
                            />
                            <ImCross className="pointer ml-2" onClick={() => deleteCalled(index)} />
                          </td>
                        </tr>
                      </>
                    ))
                  ) : (
                    <h1>No Data Found</h1>
                  )}
                </tbody>
              </table>
              <div className="row mt-4 mb-4 hidden">
                <div className="btn_addLnItms">
                  <button onClick={() => setEditshow(true)} className="btn buttonColor">
                    Add Line Items <img className="qImage pluscircle" src={plus} alt="Not Found" />
                  </button>
                </div>
              </div>
              {/* Edit item modal start */}
              <Modal
                show={editItem}
                onHide={EditItemClose}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <form id="EditModalID" onSubmit={(e) => EditItemForm(e)}>
                        <label className="row">
                          Enter New Name&nbsp;
                          <textarea
                            required
                            id="EditModalIDChild"
                            type="text"
                            className="mt-2"
                            defaultValue={editPlaceHolder}
                            placeholder={editPlaceHolder}
                            onChange={(e) => setEditValue(e.target.value)}
                          ></textarea>
                        </label>
                        <br />

                        <div className="row">
                          <div className="col-11"></div>
                          <div className="col-1">
                            <input className="btn btn-primary" value="submit" type="submit" />
                          </div>
                        </div>
                        {/* {EditValueLoader ? (
                          <div className="row">
                          <div className="col-11"></div>
                          <div className="col-1">
                              <input className="btn btn-primary"  value="submit" type="submit"  />
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-11"></div>
                            <div className="col-1">
                              <input disabled className="btn btn-primary"  value="submit" type="submit"  />
                            </div>
                          </div>
                        )} */}
                      </form>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={EditItemClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* Edit item modal End  */}
              {/* Add new modal start */}
              <Modal
                show={Editshow}
                onHide={EdithandleClose}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <form id="EditModalID" onSubmit={(e) => AddLineItemForm(e)}>
                        <label>
                          Enter New Item <br />
                        </label>
                        <textarea
                          required
                          id="EditModalIDChild"
                          type="text"
                          className="col-12"
                          onChange={(e) => setEditModalValue(e.target.value)}
                        />
                        <br />
                        <br />
                        <div className="row">
                          <div className="col-11"></div>
                          <div className="col-1">
                            <input className="btn btn-primary" value="submit" type="submit" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={EdithandleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              {/*Add new modal End  */}
              {/* <div className="mt-4"></div> */}
              <div className="row text-light gTotalColor">
                <span className="col-9 gthead">
                  Monthly Total:{" "}
                  <span contenteditable="true" id="idMonthlyTotal" className="monthlyGT">
                    {GetTotalDollar}
                  </span>
                </span>
                <span className="col-3">
                  Total: &nbsp;&nbsp;
                  <span contenteditable="true" id="idGrandTotal" className="numberGT">
                    {GetTotalDollar}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* to  */}

        <div className="row">
          <div className="col-4">
            <div className="row">
              <div className="col-6">
                <span className="fontHelveticaOnly">Cleaning frequency</span>
              </div>
              <div className="col-6 fontHelveticaBorder">
                {allGetQuotationResponse?.cleaningFrequency
                  ? allGetQuotationResponse?.cleaningFrequency
                  : "Not Available"}
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
                  {allGetQuotationResponse?.contractTermFrom
                    ? moment(allGetQuotationResponse?.contractTermFrom).format("YY-MM-DD")
                    : "0-0-0"}
                </span>
                <span style={{ float: "right" }}>to</span>
              </div>
              <div className="col-4">
                <span className="fontHelveticaBorder">
                  {allGetQuotationResponse?.contractTermTo
                    ? moment(allGetQuotationResponse?.contractTermTo).format("YY-MM-DD")
                    : "0-0-0"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="mt-4">
            {submitForRebidIsDisable ? (
              <button onClick={SubmitForRebid} type="button" class="btn col-2 btnFont btnBgColor ">
                <b>Submit For Rebid</b>
              </button>
            ) : (
              <>
                <button disabled type="button" class="btn col-2 btnFont btnBgColor ">
                  <b>Submit For Rebid</b>
                </button>
                <br />
                <br />
                <b style={{ color: "red" }}>Please Wait...</b>
              </>
            )}
            <br />
          </div>
        </div>
        <h3 className="EstimateQuotation mt-4">Estimate</h3>
        <div className="col-12 ">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
              <span className="col-3 text-center">Total</span>
            </div>

            <div className="card-body">
              {getRealQuotation ? (
                getRealQuotation.map((item, index) => (
                  <>
                    <div className="row">
                      <div className=" col-9 col9">
                        <p className="col-9 col9">
                          <span
                            style={{
                              fontSize: "17px",
                              fontFamily: "MyriadPro-Regular",
                              wordBreak: "break-all",
                            }}
                          >
                            <span>
                              {" "}
                              {item.depth ? item.depth : "0"}.&nbsp; {item.lineItemQuestion}
                            </span>{" "}
                            <br />
                            <p style={{ fontFamily: "MyriadPro-Regular" }} className="d-flex">
                              &nbsp; Answer.&nbsp;
                              {(() => {
                                switch (item?.answer_type ? item?.answer_type : "Text") {
                                  case "Text":
                                    return item?.answer;
                                  case "date":
                                    return item?.answer;
                                  case "Picture":
                                    return item?.answer?.map((itemI, IndexI) => (
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
                                          <source src={item?.answer} />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                    );

                                  default:
                                    return item?.answer;
                                }
                              })()}
                            </p>
                          </span>
                        </p>
                      </div>

                      <div className="col-3">
                        <span className="numberT d-flex justify-content-end">
                          $
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
                    &nbsp;
                  </>
                ))
              ) : (
                <h1>No Data Found</h1>
              )}

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
        <div className="row mt-4 mb-4">
          <div className="col-4">
            <div className="row">
              <div className="col-6">
                <span className="fontHelveticaOnly">Cleaning frequency</span>
              </div>
              <div className="col-6 fontHelveticaBorder">
                {allGetQuotationResponse?.cleaningFrequency
                  ? allGetQuotationResponse?.cleaningFrequency
                  : "Not Available"}
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
                  {allGetQuotationResponse?.contractTermFrom
                    ? moment(allGetQuotationResponse?.contractTermFrom).format("YY-MM-DD")
                    : "0-0-0"}
                </span>
                <span style={{ float: "right" }}>to</span>
              </div>
              <div className="col-4">
                <span className="fontHelveticaBorder">
                  {allGetQuotationResponse?.contractTermTo
                    ? moment(allGetQuotationResponse?.contractTermTo).format("YY-MM-DD")
                    : "0-0-0"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-4 ">
          <div className="row d-flex justify-content-center">
            <div className="elapsedTimeBottom">
              <span className="">
                <span className="elapseSpan">Status</span>:
                <span style={{ color: "red" }}>
                  {" "}
                  &nbsp; &nbsp; {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>{" "}
              </span>
              <span className="elapsedPara">
                <b>Reason:</b>{" "}
                <span className="fontHelvetica">{reason ? reason : "Reason Not Found"}</span>
              </span>
            </div>
          </div>
        </div>
        <h3 className="EstimateQuotation mt-4">Estimators Input</h3>
        <div className="col-12 ">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
            </div>

            <div className="card-body">
              {/* {ViewCategoryAPI.map((item, index) => ( */}
              {GetRealAnswers.map((item, index) => (
                <>
                  <div className="row">
                    <div className=" col-9 col9">
                      <p className="col-9 col9">
                        <span
                          style={{
                            fontSize: "17px",
                            fontFamily: "MyriadPro-Regular",
                            wordBreak: "break-all",
                          }}
                        >
                          <span className="d-flex">
                            {" "}
                            {item.depth ? item.depth : "0"}.&nbsp;
                            {item.question}
                          </span>{" "}
                          <br />
                          <p style={{ fontFamily: "MyriadPro-Regular" }} className="d-flex">
                            &nbsp; Answer.&nbsp;
                            {(() => {
                              switch (item?.answer_type ? item?.answer_type : "Text") {
                                case "Text":
                                  return item?.answer;
                                case "date":
                                  return item?.answer;
                                case "Picture":
                                  return item?.answer?.map((itemI, IndexI) => (
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
                                        <source src={item?.answer} />
                                        Your browser does not support the video tag.
                                      </video>
                                    </div>
                                  );

                                default:
                                  return item?.answer;
                              }
                            })()}
                          </p>
                        </span>
                      </p>
                    </div>
                  </div>
                  <hr className="nomargin" />
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4"></div>
        <div className="mt-4"></div>

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
                        <Avatar sx={{ width: 56, height: 56 }}>
                          {reviewClientName.slice(0, 1)}
                        </Avatar>
                      )}
                    </div>

                    <div style={{ color: "#666666", padding: "0px" }} className="col-11">
                      <h3>{reviewClientName}</h3>
                      <span>
                        {reviewDetails?.client_details[0]?.designation
                          ? reviewDetails?.client_details[0]?.designation
                          : null}{" "}
                      </span>
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

        {/* <div className="row mt-4">
          <div className="col-1"></div>
          <div className="col-10 mt-4">
            <div className="col-12 d-flex flex-start">
              <h5>Additional Notes</h5>
            </div>
            <div className="card quotationCard">
              <div className="card-body d-flex additionalNotesCard">
                <span className="additionalNotes">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat sequi culpa
                  aliquid numquam nobis. Doloremque illum aperiam, architecto ipsum cupiditate eaque
                  nemo enim modi distinctio dolores necessitatibus unde vitae officia! Lorem ipsum,
                  dolor sit amet consectetur adipisicing elit. Impedit, hic modi aut minus aliquam
                  tempore doloribus voluptatibus esse consectetur odit quam accusantium magnam
                  eveniet ducimus necessitatibus dolores! Vitae, modi corporis!
                </span>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div> */}

        <div className="mt-4"></div>
        <div className="mt-4"></div>
        <div className="mt-4"></div>
      </div>
    </ErrorBoundary>
  );
};

export default Rebid;
