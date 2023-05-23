/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./RecentOfferas.css";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ClientProfileAPI,
  EstimateIDFromDashboard,
  GetAnswersFromCleintID,
  getQuotationAPI,
  getReviewListAPI,
  getViewCategoryAPI,
} from "../../api/Services";

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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Toast from "../Toast/Toast";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import { IsAuthorized } from "../../Auth/Authorization";

var ElaspedTimeCheck = 1;

var arrayForDollars = [];
var arrayForDollarsStore = [];
var arrayForDollarsStoreTotal = 0;

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

const RecentOfferas = () => {
  let navigate = useNavigate();

  // BUILD IN HOOKS

  const location = useLocation();

  const isViewEstimate = IsAuthorized("estimate").view;
  const isUpdateEstimate = IsAuthorized("estimate").update;

  // HOOKS

  const [estimateResponse, setEstimateResponse] = useState({});
  const [GetAnswerDiscriptionArray, setGetAnswerDiscriptionArray] = useState();
  const [cleaningCompanyResponse, setCleaningCompanyeResponse] = useState({});

  const [ViewCategoryAPI, setViewCategoryAPI] = useState([]);
  const [depthValueCheck, setdepthValueCheck] = useState("");
  const [getQuotation, setGetQuotation] = useState();
  const [getQuotationTotal, setGetQuotationTotal] = useState();
  const [starRating, setStarRating] = useState();
  const [getQuotationMonthlyTotal, setGetQuotationMonthlyTotal] = useState(0);
  // Elapsed Time
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);

  const [totalDataFromDashboard, setTotalDataFromDashboard] = useState(location.state.FullData);

  const [estimateId, setEstimateId] = useState(location.state.FullData._id);
  const [estimatorId, setEstimatorId] = useState(location.state.FullData.estimatorId);
  const [clientIDFromDashBoard, setclientIDFromDashBoard] = useState(
    location.state.FullData.clientId
  );
  const [status, setStatus] = useState(location.state.FullData.status);
  const [reason, setReason] = useState(location.state.FullData.reason);
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
  const [editError, setEditError] = useState(false);

  const [reviewClientName, setReviewClientName] = useState("");
  const [reviewShow, setReviewShow] = useState(false);
  const [reviewDetails, setReviewDetails] = useState([]);
  //! USE EFFECTS

  useEffect(async () => {
    // window.scrollTo(0, 0);
    if (!isViewEstimate) {
      toast.error("You are not authorized to view Estimate");
      navigate("/Dashboard");
    }
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
      toast.error(error.message);
    }

    let getQuotationResponse = await getQuotationAPI(estimateId, estimatorId);
    // let getQuotationResponse = await getQuotationAPI(
    //   "62318a3a58c0b1c341a5e5d1",
    //   "622b2568ac688df6da75d475"
    // );
    if (getQuotationResponse.success) {
      setGetQuotation(getQuotationResponse.quotation.description);
      setGetQuotationTotal(getQuotationResponse.quotation.total_amount);
      setGetQuotationMonthlyTotal(getQuotationResponse.quotation.monthly_total);
    }
    //  else {
    //   toast.error('Something went wrong');
    // }
    // debugger;
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
      // toast.error("Something went wrong");
      toast.error(error.message);
    }
  }, []);

  // Elapsed time
  useEffect(() => {
    handleStart();
  }, [ElaspedTimeCheck]);

  useEffect(() => {
    getAnswers();
  }, [clientIDFromDashBoard]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getAnswers();
  //   }, 5000);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);
  const moveTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setEditError(true);
    setTimeout(() => {
      setEditError(false);
    }, 4000);
  };
  const getAnswers = async () => {
    let Response = await GetAnswersFromCleintID(clientIDFromDashBoard, estimatorId, estimateId);

    if (Response.success) {
      setGetAnswers(Response.answers);

      for (let index = 0; index < Response.answers.length; index++) {
        arrayForDollarsStore[index] = 0;
      }
    }
  };

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
  };

  // Elapsed Time
  const handleStart = () => {
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const AddLineItemForm = async (e) => {
    e.preventDefault();
    GetAnswers.push({ answer: EditModalValue });
    setViewCategoryAPI(GetAnswers);
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

  const editNavigate = async () => {
    if (isUpdateEstimate) {
      let getStatus = await EstimateIDFromDashboard(estimateId);
      if (getStatus.estimate.status === "terminated" || getStatus.estimate.status === "rejected") {
        navigate("/rebid", {
          state: {
            FullData: totalDataFromDashboard,
          },
        });
      } else {
        moveTop();
      }
    } else {
      toast.error("You are not authorized to update quotation");
    }
  };

  const imgSize = (url) => {
    document.getElementById(`imgSizes${url}`).requestFullscreen();
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      {editError ? (
        <div className=" col-12 toastClass">
          <Toast
            success={"danger"}
            message="Unable to edit until your status is 'Terminated' or 'rejected' "
          />
        </div>
      ) : null}
      <div className="row">
        <div className="col-12 mt-4 d-flex justify-content-between">
          <span className="">Offers# {estimateId}</span>
        </div>

        <div className="col-12 mt-4 mb-4">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">Client Information</div>

            <div className="card-body">
              <div className="row">
                <div className=" col-5 col5">
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
                <div className="col-7 col7">{client.companyPhone}</div>
              </div>
              <hr />

              <div className="row">
                <div className=" col-5 col5">
                  <p className="fontBold">Point of Contact Cell Number</p>
                </div>
                <div className="col-7 col7">{client.contact}</div>
              </div>
              <hr />

              <div className="row">
                <div className=" col-5 col5">
                  <p className="fontBold">Address</p>
                </div>
                <div className="col-7 col7">{client.address}</div>
              </div>
              <div className="mt-4"></div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4 mb-4">
          <div className="card quotationCard">
            <div className="card-title incomingBarQuotation">
              <span className="col-9 col9">Description</span>
              <span className="col-3 text-center">Total</span>
            </div>

            <div className="card-body">
              {getQuotation ? (
                getQuotation.map((item, index) => (
                  <>
                    <div className="row">
                      <div className=" col-9 d-flex flex-column " style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: "17px",
                            fontFamily: "MyriadPro-Regular",
                            // textOverflow: "ellipsis",
                          }}
                          className=""
                        >
                          {" "}
                          {item.depth ? item.depth : "0"}.&nbsp; {item.lineItemQuestion}
                        </span>{" "}
                        {/* <br /> */}
                        <span className="">
                          {" "}
                          <br />
                          Answer: &nbsp;{" "}
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
                        </span>
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
                <b>Reason:</b> <span className="fontHelvetica">{reason}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="mt-4">
            {/* <button onClick={SubmitForRebid} type="button" class="btn col-2 btnFont "> */}
            <button onClick={editNavigate} type="button" class="btn col-2 btnFont ">
              <b>Edit</b>
            </button>
          </div>
        </div>
      </div>

      <h5 className="EstimateQuotation mt-4 mb-4">Estimator Input</h5>
      <div className="col-12 mt-4 ">
        <div className="card quotationCard">
          <div className="card-title incomingBarQuotation">
            <span className="col-9 col9">Description</span>
          </div>

          <div className="card-body">
            {/* {ViewCategoryAPI.map((item, index) => ( */}
            {GetAnswers.length ? (
              GetAnswers.map((item, index) => (
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
                          <p className="d-flex" style={{ textAlign: "left" }}>
                            {" "}
                            {item.depth ? item.depth : "0"}.&nbsp;{item?.question}
                          </p>
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
                          {/* {depthValueCheck[index]}
                           {item.depth}: {item.category_name}
                            */}
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

      <div className="mt-4"></div>
      <div className="mt-4"></div>
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
                      <Avatar sx={{ width: 56, height: 56 }}>{reviewClientName.slice(0, 1)}</Avatar>
                    )}{" "}
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

      <div className="mt-4"></div>
      <div className="mt-4"></div>
      <div className="mt-4"></div>
    </ErrorBoundary>
  );
};

export default RecentOfferas;
