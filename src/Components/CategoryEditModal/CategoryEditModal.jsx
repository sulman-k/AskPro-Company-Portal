import React, { useState } from "react";
import { BiUpload } from "react-icons/bi";
import VerticalLine from "../../Assets/Images/VerticalLine.png";
import { AiOutlinePlus } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import "./CategoryEditModal.css";
import { useEffect } from "react";
import { AiOutlineMinusSquare } from "react-icons/ai";
import { Button } from "react-bootstrap";
import { AddCategoryModal, UpdateCategoryAPI } from "../../api/Services";
import Toast from "../Toast/Toast";
import { useLocation } from "react-router-dom";

const ALLOWED_FILE_TYPES = ["image/png", "image/svg"];

let globalArr = [];

const CategoryModal = (props) => {
  const location = useLocation();
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [info, setInfo] = useState(props.info);

  const [answerType, setAnswerType] = useState(props.answerType);

  const [picture, setPicture] = useState({});
  const [uploadYourIcon, setUploadYourIcon] = useState(true);
  const [radioButtonError, setRadioButtonError] = useState(false);
  const [inputOption, setInputOption] = useState([]);
  const [list, setList] = useState(false);

  const [mcqsRadioButton, setMcqsRadioButton] = useState(false);
  const [textRadioButton, setTextRadioButton] = useState(false);
  const [dateRadioButton, setDateRadioButton] = useState(false);
  const [pictureRadioButton, setPictureRadioButton] = useState(false);
  const [MeasurementsRadioButton, setMeasurementsRadioButton] = useState(false);
  const [numericRadioButton, setNumericRadioButton] = useState(false);
  const [booleanRadioButton, setBooleanRadioButton] = useState(false);
  const [videRadioButton, setVideoRadioButton] = useState(false);
  const [radioText, setRadioText] = useState("");
  const [radioButton, setRadioButton] = useState("");
  const [instanceButton, setInstanceButton] = useState("");

  const [toast, setToast] = useState(false);

  // hooks for default checkedof radio buttons
  const [checkedMcqs, setCheckedMcqs] = useState(false);
  const [checkedText, setCheckedText] = useState(false);
  const [checkedDate, setCheckedDate] = useState(false);
  const [checkedPicture, setCheckedPicture] = useState(false);
  const [checkedMeasurements, setCheckedMeasurements] = useState(false);
  const [checkedNumeric, setCheckedNumeric] = useState(false);
  const [checkedBoolean, setCheckedBoolean] = useState(false);
  const [checkedVideo, setCheckedVideo] = useState(false);

  // hooks for default value of radio buttons
  const [dateValue, setDateValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [numericValue, setNumericValue] = useState("");

  //! on edit change case names ("answer_type") if anycheckbox is not working
  //  ? I think you have to mkae this useeffect a function
  useEffect(() => {
    switch (answerType) {
      case "Mcqs":
        setMcqsRadioButton(true);
        setCheckedMcqs(true);

        setTextRadioButton(false);
        setDateRadioButton(false);
        setPictureRadioButton(false);
        setMeasurementsRadioButton(false);
        setNumericRadioButton(false);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);

        break;

      case "Text":
        setTextRadioButton(true);
        setCheckedText(true);

        setTextValue(props.values[0].name);

        setMcqsRadioButton(false);
        setDateRadioButton(false);
        setPictureRadioButton(false);
        setMeasurementsRadioButton(false);
        setNumericRadioButton(false);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);
        break;

      case "Date":
        setDateRadioButton(true);
        setCheckedDate(true);

        setDateValue(props.values[0].name);

        setMcqsRadioButton(false);
        setTextRadioButton(false);
        setPictureRadioButton(false);
        setMeasurementsRadioButton(false);
        setNumericRadioButton(false);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);

        break;

      case "Picture":
        setPictureRadioButton(true);
        setCheckedPicture(true);

        setMcqsRadioButton(false);
        setTextRadioButton(false);
        setDateRadioButton(false);
        // setPictureRadioButton(true);
        setMeasurementsRadioButton(false);
        setNumericRadioButton(false);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);
        break;

      case "Measurements":
        setMeasurementsRadioButton(true);
        setCheckedMeasurements(true);

        setMcqsRadioButton(false);
        setTextRadioButton(false);
        setDateRadioButton(false);
        setPictureRadioButton(false);
        // setMeasurementsRadioButton(true);
        setNumericRadioButton(false);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);
        break;

      case "Numeric":
        setNumericRadioButton(true);
        setCheckedNumeric(true);

        setNumericValue(props.values[0].name);

        setMcqsRadioButton(false);
        setTextRadioButton(false);
        setDateRadioButton(false);
        setPictureRadioButton(false);
        setMeasurementsRadioButton(false);
        // setNumericRadioButton(true);
        setBooleanRadioButton(false);
        setVideoRadioButton(false);
        break;

      case "Boolean":
        setBooleanRadioButton(true);
        setCheckedBoolean(true);

        setMcqsRadioButton(false);
        setTextRadioButton(false);
        setDateRadioButton(false);
        setPictureRadioButton(false);
        setMeasurementsRadioButton(false);
        setNumericRadioButton(false);
        // setBooleanRadioButton(true);
        setVideoRadioButton(false);
        break;

      case "Video":
        setVideoRadioButton(true);
        setCheckedVideo(true);

        setCheckedMcqs(false);
        setCheckedText(false);
        setCheckedDate(false);
        setCheckedPicture(false);
        setCheckedMeasurements(false);
        setCheckedNumeric(false);
        setCheckedBoolean(false);

        break;

      default:
        break;
    }
  });

  // function called when form is submitted
  const formSubmit = async (e) => {
    e.preventDefault();

    var data = JSON.stringify({
      questionnaire_name: props.CategoryName,
      // questionnaire_name: "CategoryName",
      name: name,
      description: description,
      information: info,
      answer_type: radioButton,
      ref_child_nodes:
        radioButton === "Mcqs"
          ? radioText
          : [
              {
                name: radioText,
                child_id: "",
              },
            ],
      // parent_id: "62595bebed2f8315403653f1",
    });
    //todo update your api here parent_id = id
    let result = await UpdateCategoryAPI(props.id);
    // debugger;
    if (result.success) {
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 5000);
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

      case "Text":
        setTextRadioButton(true);
        break;

      case "date":
        setDateRadioButton(true);
        break;

      case "Picture":
        setPictureRadioButton(true);
        break;

      case "Measurements":
        setMeasurementsRadioButton(true);
        break;

      case "Numeric":
        setNumericRadioButton(true);
        break;

      case "Yes/No":
        setBooleanRadioButton(true);
        break;

      case "Video":
        setVideoRadioButton(true);
        break;

      default:
        break;
    }
  }, []);

  const addOptions = (e) => {
    e.preventDefault();
    let newValue = document.getElementById("mcqsOptions").value;

    globalArr.push(newValue);
    setInputOption((certList) => [...certList, { newValue }]);
    var b = globalArr.map((str) => str);
    // [{name:1},{name:2}]
    let newArr = [];
    for (let index = 0; index < b.length; index++) {
      newArr.push({
        name: b[index],
        child_id: "",
      });
    }

    setRadioText(newArr);

    if (globalArr.length > 0) {
      setList(true);
    } else {
      setList(false);
    }
    document.getElementById("mcqsOptions").value = "";
    newValue = "";
  };

  const deleteItem = (val) => {
    globalArr.splice(val, 1);
    setInputOption([...globalArr]);
  };

  const mcqRadioButton = () => {
    setRadioButton("Mcqs");
    setAnswerType("Mcqs");
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
    setAnswerType("Text");
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
    setAnswerType("Date");
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
    setAnswerType("Measurements");
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
    setAnswerType("Numeric");
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
    setAnswerType("Boolean");
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
    setAnswerType("Picture");
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
    setAnswerType("Picture");
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
    var getSelectedValue = document.querySelector('input[name="answerType"]:checked');
    // debugger
    if (getSelectedValue != null) {
      setRadioButton(getSelectedValue.value);
      setRadioButtonError(false);
    } else {
      setRadioButtonError(true);
    }
  };

  const instanceSelection = () => {
    var getSelectedValueInstance = document.querySelector('input[name="radioInstance"]:checked');

    if (getSelectedValueInstance != null) {
      setInstanceButton(getSelectedValueInstance.value);
      // setRadioButtonError(false);
    }
  };

  return (
    <div className="row modalCenter">
      <div className="col-10">
        <div className="card recentEstimatesCard cardBorder mb-4">
          <div className="card-title incomingBarCategoryModal">
            <h6>Edit Details</h6>
          </div>
          {toast ? (
            <div className=" col-12 toastClass">
              <Toast message="Category added successfully" />
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
                      value={name}
                      readOnly
                      type="text"
                      className="form-control modalInput"
                      id="name"
                      placeholder="What is the floor type"
                      required={true}
                      onChange={(e) => setName(e.target.value)}
                      // onChange={(e) =>
                      //     setName((location.state.name = e.target.value))
                      // }
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label modalLabel">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      value={description}
                      className="form-control modalInput"
                      id="description"
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="info" className="form-label modalLabel">
                      Info
                    </label>
                    <textarea
                      className="form-control modalInput"
                      value={info}
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
                            // defaultChecked={{ checkedText }}
                            type="radio"
                            id="Text"
                            name="answerType"
                            value="Text"
                            onClick={TextRadioButtons}
                          />

                          <input
                            // defaultChecked={{ checkedDate }}

                            type="radio"
                            id="date"
                            name="answerType"
                            value="date"
                            onClick={DateRadioButtons}
                          />

                          <input
                            // defaultChecked={{ checkedPicture }}
                            type="radio"
                            id="Picture"
                            name="answerType"
                            value="Picture"
                            onClick={PictureRadioButtons}
                          />
                          <input
                            // defaultChecked={{ checkedMcqs }}
                            type="radio"
                            id="Mcqs"
                            name="answerType"
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
                            // defaultChecked={{ checkedMeasurements }}
                            type="radio"
                            id="Measurements"
                            name="answerType"
                            value="Measurements"
                            onClick={MeasurementsRadioButtons}
                          />
                          <input
                            // defaultChecked={{ checkedNumeric }}
                            type="radio"
                            id="Numeric"
                            name="answerType"
                            value="Numeric"
                            onClick={NumericRadioButtons}
                          />
                          <input
                            // defaultChecked={{ checkedBoolean }}
                            type="radio"
                            id="Yes/No"
                            name="answerType"
                            value="Yes/No"
                            onClick={BooleanRadioButtons}
                          />
                          <input
                            // defaultChecked={{ checkedVideo }}
                            type="radio"
                            id="Video"
                            name="answerType"
                            value="Video"
                            onClick={VideoRadioButtons}
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
                      {pictureRadioButton ? (
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

                                  <input
                                    id="icon"
                                    style={{ display: "none" }}
                                    onClick={deleteIcon}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="col-3"></div>
                      )}

                      {videRadioButton ? (
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

                                  <input
                                    id="icon"
                                    style={{ display: "none" }}
                                    onClick={deleteIcon}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="col-3"></div>
                      )}

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
                            {e}

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
                              required={true}
                            />
                            <button
                              onClick={addOptions}
                              className="btn addItemColor mt-2"
                              value="submit"
                              type="submit"
                            >
                              <AiOutlinePlus /> Add Item
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}

                      {/* text button  */}
                      {textRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <label htmlFor="name" className="form-label modalLabel required">
                              Text
                            </label>
                            <input
                              value={textValue}
                              type="text"
                              className="form-control modalInput"
                              id="radioTextFun"
                              placeholder="Enter Text Here"
                              required={true}
                              onChange={(e) => setTextValue(e.target.value)}
                            />
                            <br />
                            <button
                              onClick={radioTextFunction}
                              type="button"
                              className="btn btn-sm btn-primary"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}

                      {/* date button  */}
                      {dateRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <label htmlFor="name" className="form-label modalLabel required">
                              Date
                            </label>
                            <input
                              checked={true}
                              value={dateValue}
                              type="date"
                              className="form-control modalInput"
                              id="radioTextFun"
                              placeholder="Enter Date Here"
                              required={true}
                            />
                            <br />
                            <button
                              onClick={radioTextFunction}
                              type="button"
                              className="btn btn-sm btn-primary"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}

                      {/* Measurements button  */}
                      {MeasurementsRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <label htmlFor="name" className="form-label modalLabel required">
                              Measurement
                            </label>
                            <input
                              type="number"
                              min={0}
                              className="form-control modalInput"
                              id="radioTextFunL"
                              placeholder="Enter Length Here"
                              required={true}
                            />{" "}
                            <br />
                            <input
                              type="number"
                              min={0}
                              className="form-control modalInput"
                              id="radioTextFunW"
                              placeholder="Enter Width Here"
                              required={true}
                            />
                            <br />
                            <input
                              type="number"
                              min={0}
                              className="form-control modalInput"
                              id="radioTextFunH"
                              placeholder="Enter Height Here"
                              required={true}
                            />
                            <br />
                            <button
                              onClick={radioTextFunctionArr}
                              type="button"
                              className="btn btn-sm btn-primary"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}

                      {/* numeric button  */}

                      {numericRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <label htmlFor="name" className="form-label modalLabel required">
                              Numeric
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={numericValue}
                              className="form-control modalInput"
                              id="radioTextFun"
                              onChange={(e) => setNumericValue(e.target.value)}
                              placeholder="Enter Numeric value Here"
                              required={true}
                            />
                            <br />
                            <button
                              onClick={radioTextFunction}
                              type="button"
                              className="btn btn-sm btn-primary"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}

                      {/* Boolean button  */}
                      {booleanRadioButton ? (
                        <div style={{ border: "2px solid gray" }} className="mb-3 modalInput">
                          <div className="borderPadding">
                            <label htmlFor="name" className="form-label modalLabel required">
                              Select Yes or No
                            </label>
                            <div className="col-8 d-flex  borderColor instanceAlign ">
                              <div className="col-1"></div>
                              <div className=" d-flex flex-column justify-content-around">
                                <input
                                  type="radio"
                                  id="yes"
                                  name="radioInstanceBoolean"
                                  value="yes"
                                  onClick={instanceSelectionBoolean}
                                />

                                <input
                                  type="radio"
                                  id="no"
                                  name="radioInstanceBoolean"
                                  value="no"
                                  onClick={instanceSelectionBoolean}
                                />
                              </div>
                              <div className="col-1"></div>
                              <div className=" d-flex flex-column justify-content-around textData ">
                                <label className="mb-1" htmlFor="text">
                                  &nbsp;Yes
                                </label>
                                <label className="mt-1" htmlFor="text">
                                  &nbsp;No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span hidden></span>
                      )}
                    </div>
                  </div>

                  <Button
                    value="submit"
                    type="submit"
                    id="submit"
                    className="btn buttonColor mt-2"
                    onClick={redOutline}
                  >
                    Edit
                  </Button>
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
