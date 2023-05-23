/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BiUpload } from "react-icons/bi";
import VerticalLine from "../../Assets/Images/VerticalLine.png";
import { AiOutlinePlus } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import "./EditCategoryModal.css";
import { useEffect } from "react";
import { AiOutlineMinusSquare } from "react-icons/ai";
import { Button } from "react-bootstrap";
import {
  AddCategoryModal,
  FirstNodeCategoryModal,
  FirstNodeCategoryModalAPI,
  SecondNodeCategoryModal,
  SecondNodeCategoryModalAPI,
  UpdateCategoryAPI,
} from "../../api/Services";
import Toast from "../Toast/Toast";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { CategoryId, CategoryModalID, EditCatModal } from "../../Redux/Actions/Action";

const ALLOWED_FILE_TYPES = ["image/png", "image/svg"];

let globalArr = [];
let count = 0;

const EditCategoryModal = (props) => {
  const [radioText, setRadioText] = useState("");
  let dispatch = useDispatch();
  // debugger;

  useEffect(() => {
    globalArr = [];
    setDoneBtn(true);
    if (props.flagMcqs) {
      for (let index = 0; index < props.allData.ref_child_nodes.length; index++) {
        // debugger;

        globalArr.push({
          identifier: props.allData.ref_child_nodes[index].identifier,
          child_id: props.allData.ref_child_nodes[index].child_id,
        });
      }
      setRadioText(globalArr);
    }
    // count++;
  }, []);
  const [mcqsEdit, setMcqsEdit] = useState("");
  const [name, setName] = useState(props.allData.question);
  const [description, setDescription] = useState(props.allData.description);
  const [info, setInfo] = useState(props.allData.information);

  const [answerType, setAnswerType] = useState(props.allData.answer_type);
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

  const [doneBtn, setDoneBtn] = useState(true);
  const [radioButton, setRadioButton] = useState("");
  const [instanceButton, setInstanceButton] = useState(props.allData.isMultiple);

  const [childId, setChildId] = useState("");

  const [toast, setToast] = useState(false);
  const [addItemBtn, setAddItemBtn] = useState(false);
  const newIdToShow = useSelector((state) => state.CategoryModal);
  const [lengthError, setLengthError] = useState(false);
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
      answer_type: radioButton ? radioButton : props.allData.answer_type,
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
      // parent_id: "62595bebed2f8315403653f1",
    });
    try {
      let update = await UpdateCategoryAPI(props.allData._id, data);
      if (update.success) {
        count = 0;
        globalArr = [];
        e.target.reset();
        dispatch(EditCatModal(false));
        //Close Modal
      }
    } catch (error) {}
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

  // let newValue = "";

  const checkEmptyField = (e) => {
    // newValue = e.target.value;
    setMcqsEdit(e.target.value);
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
    // let newValue = document.getElementById("mcqs").value;
    setAddItemBtn(false);

    globalArr.push({ identifier: mcqsEdit, child_id: "" });
    setInputOption((certList) => [...certList, { mcqsEdit }]);
    var b = globalArr.map((str) => str);

    let newArr = [];
    // for (let index = 0; index < b.length; index++) {
    //   newArr.push({
    //     identifier: b[index],
    //     child_id: "",
    //   });
    // }

    setRadioText(b);

    if (globalArr.length > 0) {
      setList(true);
      setDoneBtn(true);
    } else {
      setList(false);
      setDoneBtn(false);
    }
    // document.getElementById("mcqsOptionss").value = "";
    setMcqsEdit("");
  };

  const deleteItem = (val) => {
    globalArr.splice(val, 1);
    setRadioText(globalArr);
    setInputOption([...globalArr]);
    if (globalArr.length > 0) {
      setDoneBtn(true);
    } else {
      setDoneBtn(false);
    }
  };

  useEffect(() => {
    if (answerType === "Mcqs") {
      mcqRadioButton();
    }
  }, []);

  const mcqRadioButton = () => {
    if (globalArr.length > 0) {
      setDoneBtn(true);
    } else {
      setDoneBtn(false);
    }

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

  const otherRadioButtons = (val) => {
    setRadioButton(val);
    setDoneBtn(true);
    setMcqsRadioButton(false);
    setTextRadioButton(false);
    setDateRadioButton(false);
    setMeasurementsRadioButton(false);
    setNumericRadioButton(false);
    setBooleanRadioButton(false);
    setPictureRadioButton(false);
    setVideoRadioButton(false);

    globalArr = [];
    setInputOption([...globalArr]);
  };

  const instanceSelection = () => {
    var getSelectedValueInstance = document.getElementById("SelectSingle").value;
    // debugger;
    if (getSelectedValueInstance === "SelectMultiple") {
      setInstanceButton(true);
    } else {
      setInstanceButton(false);
    }
  };

  const instanceSelection1 = () => {
    var getSelectedValueInstance = document.getElementById("SelectMultiple").value;
    // debugger;
    if (getSelectedValueInstance === "SelectMultiple") {
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
                      value={name}
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
                      value={description}
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
                      value={info}
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
                            defaultChecked={answerType === "Text" ? true : false}
                            type="radio"
                            id="Text"
                            name="answerTyp"
                            value="Text"
                            // onClick={TextRadioButtons}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />

                          <input
                            defaultChecked={answerType === "date" ? true : false}
                            type="radio"
                            id="date"
                            name="answerTyp"
                            value="date"
                            // onClick={DateRadioButtons}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />

                          <input
                            defaultChecked={answerType === "Picture" ? true : false}
                            type="radio"
                            id="Picture"
                            name="answerTyp"
                            value="Picture"
                            // onClick={PictureRadioButtons}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />
                          <input
                            type="radio"
                            id="Mcqs"
                            name="answerTyp"
                            value="Mcqs"
                            defaultChecked={answerType === "Mcqs" ? true : false}
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
                            defaultChecked={answerType === "Measurements" ? true : false}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />
                          <input
                            type="radio"
                            id="Numeric"
                            name="answerTyp"
                            value="Numeric"
                            // onClick={NumericRadioButtons}
                            defaultChecked={answerType === "Numeric" ? true : false}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />
                          <input
                            type="radio"
                            id="Yes/No"
                            name="answerTyp"
                            value="Yes/No"
                            // onClick={BooleanRadioButtons}
                            defaultChecked={answerType === "Yes/No" ? true : false}
                            onClick={(e) => otherRadioButtons(e.target.value)}
                          />
                          <input
                            type="radio"
                            id="Video"
                            name="answerTyp"
                            value="Video"
                            // onClick={VideoRadioButtons}
                            defaultChecked={answerType === "Video" ? true : false}
                            onClick={(e) => otherRadioButtons(e.target.value)}
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
                            {e.identifier} &nbsp;
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
                              id="mcqs"
                              type="text"
                              className="form-control modalInput"
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
                      value="submit"
                      type="submit"
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
                        type="radio"
                        id="SelectSingle"
                        name="radioInstance"
                        value="SelectSingle"
                        defaultChecked={!instanceButton ? true : false}
                        onClick={instanceSelection}
                      />

                      <input
                        type="radio"
                        id="SelectMultiple"
                        name="radioInstance"
                        value="SelectMultiple"
                        defaultChecked={instanceButton ? true : false}
                        onClick={instanceSelection1}
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

export default EditCategoryModal;
