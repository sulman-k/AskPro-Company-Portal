import React, { useState } from "react";
import { BiUpload } from "react-icons/bi";
import VerticalLine from "../../Assets/Images/VerticalLine.png";
import { AiOutlinePlus } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import "./CategoryModal.css";
import { useEffect } from "react";
import { AiOutlineMinusSquare } from "react-icons/ai";
import { Button } from "react-bootstrap";
import {
  AddCategoryModal,
  FirstNodeCategoryModal,
  FirstNodeCategoryModalAPI,
  SecondNodeCategoryModal,
  SecondNodeCategoryModalAPI,
} from "../../api/Services";
import Toast from "../Toast/Toast";

import { useDispatch, useSelector } from "react-redux";
import { CategoryId, CategoryModalID } from "../../Redux/Actions/Action";
import { toast } from "react-toastify";

const ALLOWED_FILE_TYPES = ["image/png", "image/svg"];

// let globalArr = [];

const CategoryModal = (props) => {
  let dispatch = useDispatch();

  const [globalArr, setGlobalArr] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [info, setInfo] = useState("");

  const [answerType, setAnswerType] = useState("");
  const [picture, setPicture] = useState({});

  const [uploadYourIcon, setUploadYourIcon] = useState(true);
  const [radioButtonError, setRadioButtonError] = useState(false);

  const [inputOption, setInputOption] = useState([]);
  const [list, setList] = useState(false);

  const [mcqsRadioButton, setMcqsRadioButton] = useState(false);
  const [textRadioButton, setTextRadioButton] = useState(true);
  const [dateRadioButton, setDateRadioButton] = useState(false);
  const [pictureRadioButton, setPictureRadioButton] = useState(false);
  const [MeasurementsRadioButton, setMeasurementsRadioButton] = useState(false);
  const [numericRadioButton, setNumericRadioButton] = useState(false);
  const [booleanRadioButton, setBooleanRadioButton] = useState(false);
  const [videRadioButton, setVideoRadioButton] = useState(false);

  const [radioText, setRadioText] = useState("");
  const [doneBtn, setDoneBtn] = useState(true);
  const [radioButton, setRadioButton] = useState("Text");
  const [instanceButton, setInstanceButton] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [childId, setChildId] = useState("");

  const [toast, setToast] = useState(false);
  const [addItemBtn, setAddItemBtn] = useState(false);
  const newIdToShow = useSelector((state) => state.CategoryModal);

  // toast

  const [failedtocreateNode, setfailedtocreateNode] = useState(false);

  // function called when form is submitted
  const formSubmit = async (e) => {
    e.preventDefault();

    var data = JSON.stringify({
      identifier: props.isquestionareFlagCheck === true ? "" : props.identifierName,
      category_name: props.CategoryName,
      question: name,
      description: description,
      information: info,
      answer_type: radioButton,
      isMultiple: instanceButton,
      ref_child_nodes:
        radioButton === "Mcqs"
          ? radioText
          : [
              {
                identifier: radioText,
                child_id: "",
              },
            ],
    });
    // In case of first node

    if (props.isquestionareFlagCheck === true) {
      let firstNode = await FirstNodeCategoryModalAPI(props.questionareIDforroot, data);
      if (firstNode.success) {
        dispatch(CategoryModalID(firstNode.category._id));
        setGlobalArr([]);
        e.target.reset();
      } else {
        toast.error("failed to create first node");
        setfailedtocreateNode(true);
        setTimeout(() => {
          setfailedtocreateNode(false);
        }, 5000);
      }
    }
    if (props.isparentFlagCheck === true) {
      // debugger;
      let secondNode = await SecondNodeCategoryModalAPI(props.parentID, data);
      if (secondNode.success) {
        dispatch(CategoryModalID(secondNode.childCategory._id));
        setGlobalArr([]);
        e.target.reset();
      } else {
        toast.error("failed to create second parent");
        setfailedtocreateNode(true);
        setTimeout(() => {
          setfailedtocreateNode(false);
        }, 5000);
      }
    }
  };

  const redOutline = () => {
    if (name === "") {
      showError("name", true);
    } else {
      showError("name", false);
    }
    if (description === "") {
      showError("description", true);
    } else {
      showError("description", false);
    }
    if (info === "") {
      showError("info", true);
    } else {
      showError("info", false);
    }
  };

  const showError = (elementID, flag) => {
    if (flag === true) {
      document.getElementById(elementID).style.border = "1px solid red";
    } else {
      document.getElementById(elementID).style.border = "1px solid lightgray";
    }
  };

  // validate Image icon
  const checkImage = (image) => {
    let file_type = image.type;
    if (ALLOWED_FILE_TYPES.includes(file_type) === true) return true;
    else return false;
  };
  // On upload Icon this function will call
  const uploadIcon = (event) => {
    let image = event.target.files[0];
    if (checkImage(image)) {
      setPicture({ name: image.name });
      setUploadYourIcon(false);
    } else return toast.error("invalid image");
  };

  const deleteIcon = () => {
    setPicture({});
    setTimeout(() => {
      // DELETE
      setUploadYourIcon(true);
    }, 1);
  };

  useEffect(() => {
    var getSelectedValue = document.querySelector('input[name="answerType"]:checked');

    switch (getSelectedValue) {
      case "Mcqs":
        setMcqsRadioButton(true);
        break;

      // case "Text":
      //   setTextRadioButton(true);
      //   break;

      // case "date":
      //   setDateRadioButton(true);
      //   break;

      // case "Picture":
      //   setPictureRadioButton(true);
      //   break;

      // case "Measurements":
      //   setMeasurementsRadioButton(true);
      //   break;

      // case "Numeric":
      //   setNumericRadioButton(true);
      //   break;

      // case "Yes/No":
      //   setBooleanRadioButton(true);
      //   break;

      // case "Video":
      //   setVideoRadioButton(true);
      //   break;

      default:
        break;
    }
  }, []);

  const checkEmptyField = (e) => {
    //changed here

    if (e.target.value && e.target.value.replace(/\s/g, "").length) {
      if (e.target.value.length < 200) {
        setAddItemBtn(true);
      } else {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setAddItemBtn(false);
        setLengthError(true);
        setTimeout(() => {
          setLengthError(false);
        }, 5000);
      }
    } else {
      setAddItemBtn(false);
    }
  };

  const addOptions = (e) => {
    e.preventDefault();
    setAddItemBtn(false);
    let newValue = document.getElementById("mcqsOptions").value;
    newValue = newValue.trim();
    globalArr.push(newValue);
    setInputOption((certList) => [...certList, { newValue }]);
    var b = globalArr.map((str) => str);
    // [{name:1},{name:2}]
    let newArr = [];
    for (let index = 0; index < b.length; index++) {
      newArr.push({
        identifier: b[index],
        child_id: "",
      });
    }

    setRadioText(newArr);

    if (globalArr.length > 0) {
      setList(true);
      setDoneBtn(true);
    } else {
      setList(false);
      setDoneBtn(false);
    }
    document.getElementById("mcqsOptions").value = "";
    newValue = "";
  };

  const deleteItem = (val) => {
    globalArr.splice(val, 1);
    setInputOption([...globalArr]);
    if (globalArr.length > 0) {
      setDoneBtn(true);
    } else {
      setDoneBtn(false);
    }
  };

  const mcqRadioButton = () => {
    setDoneBtn(false);

    setRadioButton("Mcqs");

    setMcqsRadioButton(true);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);

    // setRadioButton("");
  };

  const TextRadioButtons = () => {
    setRadioButton("Text");
    setMcqsRadioButton(false);
    setTextRadioButton(true);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);
    // setRadioButton("");
  };

  const DateRadioButtons = () => {
    setRadioButton("Date");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(true);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);
  };

  const MeasurementsRadioButtons = () => {
    setRadioButton("Measurements");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(true);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);
  };

  const NumericRadioButtons = () => {
    setRadioButton("Numeric");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(true);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);
  };

  const BooleanRadioButtons = () => {
    setRadioButton("Boolean");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(true);
    setVideoRadioButton(false);
  };

  const PictureRadioButtons = () => {
    setRadioButton("Picture");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(true);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(false);
  };
  const VideoRadioButtons = () => {
    setRadioButton("Picture");
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setPictureRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setVideoRadioButton(true);
  };

  const radioTextFunction = () => {
    let text = document.getElementById("radioTextFun").value;
    setRadioText(text);
    // debugger;
    // document.getElementById("radioTextFun").value = "";
    text = "";
  };

  const radioTextFunctionArr = () => {
    let length = document.getElementById("radioTextFunL").value;
    let width = document.getElementById("radioTextFunW").value;
    let height = document.getElementById("radioTextFunH").value;

    let str = length + "," + width + "," + height;

    setRadioText(str);

    // document.getElementById("radioTextFun").value = "";
    length = width = height = "";
  };

  const instanceSelectionBoolean = () => {
    var getSelectedValueInstance = document.querySelector(
      'input[name="radioInstanceBoolean"]:checked'
    );

    setRadioText([getSelectedValueInstance]);
  };

  const otherRadioButtons = () => {
    setDoneBtn(true);
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setPictureRadioButton(false);
    setVideoRadioButton(false);
    setGlobalArr([]);
    setInputOption([...globalArr]);

    // var getSelectedValue = document.querySelectorAll(
    //   'input[name="answerType"]:checked'
    // );

    var getSelectedValue = document.querySelector('input[name="answerTyp"]:checked');

    if (getSelectedValue != null) {
      setRadioButton(getSelectedValue.value);
      setRadioButtonError(false);
    } else {
      setRadioButtonError(true);
    }
  };

  const instanceSelection = () => {
    var getSelectedValueInstance = document.querySelector('input[name="radioInstance"]:checked');
    // debugger;
    if (getSelectedValueInstance.value === "SelectMultiple") {
      setInstanceButton(true);
    } else {
      setInstanceButton(false);
    }
  };

  return (
    <div className="row modalCenter">
      <div className="col-10">
        <div className="card recentEstimatesCard cardBorder mb-4">
          <div className="card-title incomingBarCategoryModal">
            <h6>Add Details</h6>
          </div>
          {toast ? (
            <div className=" col-12 toastClass">
              <Toast message="Category added successfully" />
            </div>
          ) : (
            <span hidden></span>
          )}
          {lengthError ? (
            <div className=" col-12 toastClass">
              <Toast success="danger" message="Length should be less than 200" />
            </div>
          ) : (
            <span hidden></span>
          )}
          {failedtocreateNode ? (
            <div className=" col-12 toastClass">
              <Toast message="Failed to Create Node close it and try again!!!!" />
            </div>
          ) : (
            <span hidden></span>
          )}
          <div className="card-body text-center">
            <div className="row">
              <form className="d-flex flex-row" onSubmit={formSubmit}>
                <div className="col-8 ">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label modalLabel required">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control modalInput"
                      id="name"
                      placeholder="What is the floor type"
                      required={true}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label modalLabel required">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control modalInput"
                      id="description"
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="info" className="form-label modalLabel required">
                      Info
                    </label>
                    <textarea
                      className="form-control modalInput"
                      id="info"
                      required
                      placeholder="write useful information"
                      rows="3"
                      onChange={(e) => setInfo(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="answerType" className="form-label modalLabel required">
                      Select the Answer Type
                    </label>{" "}
                    <br /> <br />
                    <div className="row">
                      <div className="col-3 d-flex flex-row justify-content-around ">
                        <div id="" className=" d-flex flex-column justify-content-around">
                          <input
                            defaultChecked
                            type="radio"
                            id="Text"
                            name="answerTyp"
                            value="Text"
                            // onClick={TextRadioButtons}
                            onClick={otherRadioButtons}
                          />

                          <input
                            type="radio"
                            id="date"
                            name="answerTyp"
                            value="date"
                            // onClick={DateRadioButtons}
                            onClick={otherRadioButtons}
                          />

                          <input
                            type="radio"
                            id="Picture"
                            name="answerTyp"
                            value="Picture"
                            // onClick={PictureRadioButtons}
                            onClick={otherRadioButtons}
                          />
                          <input
                            type="radio"
                            id="Mcqs"
                            name="answerTyp"
                            value="Mcqs"
                            onClick={mcqRadioButton}
                          />
                        </div>

                        <div className=" d-flex flex-column justify-content-around textData ">
                          <label htmlFor="text">Text</label>
                          <label htmlFor="date">Date</label>
                          <label htmlFor="Picture">Picture</label>
                          <label htmlFor="Mcqs">Mcqs</label>
                        </div>
                      </div>
                      <div className="col-4 d-flex flex-row justify-content-around ">
                        <div className=" d-flex flex-column justify-content-around">
                          <input
                            type="radio"
                            id="Measurements"
                            name="answerTyp"
                            value="Measurements"
                            // onClick={MeasurementsRadioButtons}
                            onClick={otherRadioButtons}
                          />
                          <input
                            type="radio"
                            id="Numeric"
                            name="answerTyp"
                            value="Numeric"
                            // onClick={NumericRadioButtons}
                            onClick={otherRadioButtons}
                          />
                          <input
                            type="radio"
                            id="Yes/No"
                            name="answerTyp"
                            value="Yes/No"
                            // onClick={BooleanRadioButtons}
                            onClick={otherRadioButtons}
                          />
                          <input
                            type="radio"
                            id="Video"
                            name="answerTyp"
                            value="Video"
                            // onClick={VideoRadioButtons}
                            onClick={otherRadioButtons}
                          />
                        </div>

                        <div className=" d-flex flex-column justify-content-around textData ">
                          <label htmlFor="Measurements">Measurements</label>
                          <label htmlFor="Numeric">Numeric</label>
                          <label htmlFor="Yes/No">Yes/No</label>
                          <label htmlFor="Video">Video</label>
                        </div>
                      </div>

                      <div className="col-2"></div>
                      {/* picture  */}
                      {/* {pictureRadioButton ? ( */}
                      <div className="col-3">
                        <div className="card-title ">
                          <h6 className="uploadIcon">Upload icon</h6>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            {uploadYourIcon ? (
                              <div>
                                <label htmlFor="photo" className="btn  ">
                                  <BiUpload /> <br />
                                  <span className="uploadModal">
                                    Upload Icon <br />
                                    (PNG or SVG)
                                  </span>
                                </label>

                                <input
                                  id="photo"
                                  style={{ display: "none" }}
                                  type="file"
                                  className="btn "
                                  onChange={uploadIcon}
                                />
                              </div>
                            ) : (
                              <div>
                                <label htmlFor="icon" className="btn  ">
                                  <BiTrash /> <br />
                                  <span className="uploadModal">
                                    Delete Picture <br />
                                    {picture.name}
                                  </span>
                                </label>

                                <input id="icon" style={{ display: "none" }} onClick={deleteIcon} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* ) : (
                        <div className="col-3"></div>
                      )} */}

                      {radioButtonError ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}
                          * Select a radio button
                        </span>
                      ) : (
                        <span hidden></span>
                      )}
                    </div>
                    {/* MCQS types   */}
                    <div className="col-3 mt-2">
                      {globalArr ? (
                        globalArr.map((e, index) => (
                          <li>
                            {e} &nbsp;
                            <label className="btn col-2 " onClick={() => deleteItem(index)}>
                              <AiOutlineMinusSquare className="uploadIconButton" />
                            </label>
                          </li>
                        ))
                      ) : (
                        <span hidden></span>
                      )}

                      {/* mcqs button  */}
                      {mcqsRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <input
                              type="text"
                              className="form-control modalInput"
                              id="mcqsOptions"
                              placeholder="Enter Option here"
                              // required={true}
                              onChange={(e) => checkEmptyField(e)}
                            />
                            {addItemBtn ? (
                              <button
                                onClick={addOptions}
                                className="btn addItemColor mt-2"
                                value="submit"
                                type="submit"
                              >
                                <AiOutlinePlus /> Add Item
                              </button>
                            ) : (
                              <button
                                disabled
                                // onClick={addOptions}
                                className="btn addItemColor mt-2"
                                value="submit"
                                type="submit"
                              >
                                <AiOutlinePlus /> Add Item
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}
                    </div>
                  </div>
                  {doneBtn ? (
                    <Button
                      value="submit"
                      type="submit"
                      id="submit"
                      className="btn buttonColor mt-2"
                      onClick={redOutline}
                    >
                      Done
                    </Button>
                  ) : (
                    <Button
                      disabled
                      type="submit"
                      value="Submit"
                      id="submit"
                      className="btn buttonColor mt-2"
                      // onClick={redOutline}
                    >
                      Done
                    </Button>
                  )}
                </div>
                <div className="col-4">
                  <div className="textAlign hidden">
                    <div className="textAlignInner">
                      <li>A. Commercial</li>
                      <li>B. Educational</li>
                      <li>C. School</li>
                      <li>D. Floor</li>
                    </div>
                  </div>
                  <br />
                  <h5>Instances</h5>

                  <div className="col-8 d-flex  borderColor instanceAlign ">
                    <div className="col-1"></div>
                    <div className=" d-flex flex-column justify-content-around">
                      <input
                        defaultChecked
                        type="radio"
                        id="SelectSingle"
                        name="radioInstance"
                        value="SelectSingle"
                        onClick={instanceSelection}
                      />

                      <input
                        type="radio"
                        id="SelectMultiple"
                        name="radioInstance"
                        value="SelectMultiple"
                        onClick={instanceSelection}
                      />
                    </div>
                    <div className="col-1"></div>
                    <div className=" d-flex flex-column justify-content-around textData ">
                      <label className="mb-1" htmlFor="text">
                        &nbsp;Select Single
                      </label>
                      <img className="cssforverticalline" src={VerticalLine} />
                      <label className="mt-1" htmlFor="text">
                        &nbsp;Select Multiple
                      </label>
                    </div>
                  </div>
                </div>
              </form>
              {/* <div> */}

              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
