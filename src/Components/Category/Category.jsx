/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import "./Category.css";
import { Modal } from "react-bootstrap";
import CategoryModal from "../CategoryModal/CategoryModal";
import CategoryEditModal from "../CategoryEditModal/CategoryEditModal";
// Images
import doubleboxsmall from "../../Assets/Images/doubleboxsmall.png";
import crosssmall from "../../Assets/Images/crosssmall.png";
import Line from "../../Assets/Images/Line.png";
import VerticalLine from "../../Assets/Images/VerticalLine.png";
import { Button } from "react-bootstrap";
import {
  AddQuestionareAPI,
  CloneSubCategoryAPI,
  DeleteSubCategoryAPI,
  DeleteVariableAPI,
  DeleteViewCategoryChildAPI,
  getViewCategoryAPI,
  questionnairesListAPI,
  TemplateAPI,
  UpdateCategoryAPI,
  UpdateIdentifierAPI,
  viewCategoryforSpecificAPI,
  viewQuestionareforSpecificAPI,
} from "../../api/Services";
import LoaderAnimation from "../Loader/LoaderAnimation";
import Toast from "../Toast/Toast";
import { useSelector } from "react-redux";
import { getCategoryTreeAPI } from "../../api/Services";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CategoryId, CategoryModalID, EditCatModal } from "../../Redux/Actions/Action";
import CloneCategoryModal from "../CloneCategoryModal/CloneCategoryModal";
import EditCategoryModal from "../EditCategoryModal/EditCategoryModal";
import { useAuthUser } from "react-auth-kit";
import { IsAuthorized } from "../../Auth/Authorization";
// export api to edit modal to show values only
let uniqueArr = [];
let spaces = "  ";
var AlphabaticOrdernumber = 65;
var ArrayForAlphabatic = [];
var ArrayForCategories = [];

const Category = () => {
  const dispatch = useDispatch();
  const authUser = useAuthUser();

  const isViewQuestionare = IsAuthorized("questionaire").view;
  const isAddQuestionare = IsAuthorized("questionaire").create;
  const isUpdateQuestionare = IsAuthorized("questionaire").update;
  const isDeleteQuestionare = IsAuthorized("questionaire").delete;

  const newIdToShow = useSelector((state) => state.CategoryModal);
  const _id = useSelector((state) => state.CategoryId);
  const Editshow1 = useSelector((state) => state.EditCatModal);
  const editModal2 = useSelector((state) => state.EditCatModal);
  const pushClose = useSelector((state) => state.CloseButtonFunc);

  const [TreeData, setTreeData] = useState();
  const [LengthOfCommercialClick, setLengthOfCommercialClick] = useState();
  const [clickChangeCatForColorRed, setclickChangeCatForColorRed] = useState();
  const [sendingIdToChild, setSendingIdtoChild] = useState(newIdToShow);
  const [questionareFlagCheck, setquestionareFlagCheck] = useState(true);
  const [parentFlagCheck, setparentFlagCheck] = useState(false);
  const [rootCategoryCheck, setrootCategoryCheck] = useState();
  const [DeleteFlagCheck, setDeleteFlagCheck] = useState();
  const [DeleteFlagWithNameCheck, setDeleteFlagWithNameCheck] = useState();
  const [editReRender, seteditReRender] = useState();
  const [EditModalValue, setEditModalValue] = useState();
  const [EditChildValue, setEditChildValue] = useState();
  const [depthValueCheck, setdepthValueCheck] = useState();
  const [ViewSpecificCategoryAPI, setViewSpecificCategoryAPI] = useState([]);
  const [dataToEditModal, setDataToEditModal] = useState({});
  const [ListCategoryMain, setListCategoryMain] = useState([]);
  const [editOpenModalID, setEditOpenModalID] = useState("");
  const [ViewSpecificCategoryEditAPI, setViewSpecificCategoryEditAPI] = useState([]);
  const [answerType, setAnswerType] = useState("");
  const [addQuestionare, setaddQuestionare] = useState("");
  const [addQuestionarecheck, setaddQuestionarecheck] = useState(0);
  const [showcategorybar, setshowcategorybar] = useState(0);
  const [showcategoryChildbar, setshowcategoryChildbar] = useState(0);
  const [parentIDforchild, setparentIDforchild] = useState();
  const [QuestionareID, setQuestionareID] = useState();
  const [ViewCategoryAPI, setViewCategoryAPI] = useState([]);
  const [QuestionStatement, setQuestionStatement] = useState("");
  const [InputField, setInputField] = useState();
  const [InputFieldChild, setInputFieldChild] = useState();
  const [AddCategoryButton, setAddCategoryButton] = useState();
  const [catArray, setCatArray] = useState([]);
  const [animation, setAnimation] = useState(true);
  const [allQuestionare, setAllQuestionare] = useState([]);
  const [allQuestionareAnimation, setallQuestionareAnimation] = useState(true);
  const [rangeToast, setRangeToast] = useState(false);
  const [DeleteToast, setDeleteToast] = useState(false);
  const [lastMcq, setLastMcq] = useState(false);
  const [AlphabaticOrder, setAlphabaticOrder] = useState();
  const [addcatParentBtn, setAddCatParentBtn] = useState();
  const [multipleSelect, setMultipleSelect] = useState();
  const [CloneValueLoader, setCloneValueLoader] = useState(true);
  const [EditValueLoader, setEditValueLoader] = useState(true);
  const [DeleteValueLoader, setDeleteValueLoader] = useState(true);
  const [show, setShow] = useState(false);
  const [Editshow, setEditshow] = useState(false);
  const [CatListCheckToast, setCatListCheckToast] = useState(false);
  const [cloneModal, setCloneModal] = useState(false);
  const [oldName, setOldName] = useState("");
  const [toastSucces, setToastSucces] = useState(false);
  const [toastNotSucces, setToastNotSucces] = useState(false);
  const [categoryTreeResponse, setCategoryTreeResponse] = useState([]);
  const [clonePopup, setClonePopup] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [showCloneToast, setShowCloneToast] = useState(false);
  const [globalLoader, setGlobalLoader] = useState(true);
  const [showCloneToastNotSuccess, setShowCloneToastNotSuccess] = useState(false);

  useEffect(() => {
    if (!isViewQuestionare) {
      toast.error("You are not authorized to view questionares");
    }
    questionarireList();
  }, []);

  useEffect(() => {
    if (ViewSpecificCategoryAPI.length < 1) {
      setAnimation(true);
    } else {
      setAnimation(false);
    }
  });

  useEffect(() => {
    let countLength = ViewSpecificCategoryAPI.length;
    if (countLength < 5) {
      countLength = 4;
      setLengthOfCommercialClick(countLength);
    } else {
      setLengthOfCommercialClick(countLength);
    }
  });

  useEffect(async () => {
    questionarireList();
  }, [cloneModal]);

  useEffect(async () => {
    if (catArray.includes(InputField) === false) {
      setCatArray([...catArray, InputField]);
    }
    if (AddCategoryButton === rootCategoryCheck) {
      let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

      // debugger;
      if (ViewCategoryResponse.success) {
        if (ViewCategoryResponse.categories[0].category_name === AddCategoryButton) {
          setViewSpecificCategoryEditAPI(ViewCategoryResponse.categories[0]);
        }
      }
    } else {
      let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

      // debugger;
      if (ViewCategoryResponse.success) {
        for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
          if (AddCategoryButton === ViewCategoryResponse.categories[index].category_name) {
            setViewSpecificCategoryEditAPI(ViewCategoryResponse.categories[index]);
          }
        }
      }
    }
  }, [AddCategoryButton]);

  useEffect(() => {
    cloneModalClose();
  }, [pushClose]);

  useEffect(async () => {
    let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);
    for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
      if (dataToEditModal._id === ViewCategoryResponse.categories[index]._id) {
        setViewSpecificCategoryAPI([]);
        setMultipleSelect();
        let category = ViewCategoryResponse.categories[index]._id;
        setAnswerType(ViewCategoryResponse.categories[index].answer_type);

        setQuestionStatement(ViewCategoryResponse.categories[index].question);
        setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
        setDataToEditModal(ViewCategoryResponse.categories[index]);
        setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
        // it's in change cat sub
        // debugger;
      }
    }
  }, [Editshow1, editModal2]);

  useEffect(async () => {
    setSendingIdtoChild(newIdToShow);
    setGlobalLoader(false);

    setViewSpecificCategoryAPI([]);
    setMultipleSelect();
    EdithandleClose();
    handleClose();
    handleClose2();

    let ViewCategoryResponseTree = await getViewCategoryAPI(addQuestionare);

    setTreeData(ViewCategoryResponseTree);

    let ViewSpecificCategoryResponse = await viewCategoryforSpecificAPI(newIdToShow);
    setDataToEditModal(ViewSpecificCategoryResponse.category);
    if (ViewSpecificCategoryResponse.success) {
      setAnswerType(ViewSpecificCategoryResponse.category.answer_type);
      setQuestionStatement(ViewSpecificCategoryResponse.category.question);
      // setSendingIdtoChild(ViewSpecificCategoryResponse.category._id);
      setDataToEditModal(ViewSpecificCategoryResponse.category);
      if (ViewSpecificCategoryResponse.category.ref_child_nodes === "") {
        setViewSpecificCategoryAPI([]);
        setMultipleSelect([]);
      } else {
        setViewSpecificCategoryAPI(
          ViewSpecificCategoryResponse.category.ref_child_nodes
          // ViewSpecificCategoryResponse.category
        );
        setMultipleSelect(ViewSpecificCategoryResponse.category.isMultiple);
      }
    }
    updatevariablelist(addQuestionare);
  }, [newIdToShow]);

  // !----------------------------------------------------------------------

  const questionarireList = async () => {
    setallQuestionareAnimation(true);
    let reponseQuestions = await questionnairesListAPI();
    if (reponseQuestions.success) {
      setAllQuestionare(reponseQuestions.questionnaires);
      setallQuestionareAnimation(false);
      setListCategoryMain(reponseQuestions);
    }
  };

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow(false);
  const handleShow = () => {
    if (isAddQuestionare) {
      setShow(true);
    } else {
      toast.error("You are not authorized to Add Question");
    }
  };

  const EdithandleClose = () => {
    setEditshow(false);
  };

  const EdithandleShow = () => {
    setEditshow(true);
  };
  const EdithandleClose1 = () => {
    dispatch(EditCatModal(false));
  };
  const EdithandleClose2 = () => {
    dispatch(EditCatModal(false));
  };

  const EdithandleShow1 = () => {
    if (isUpdateQuestionare) {
      dispatch(EditCatModal(true));
    } else {
      toast.error("You are not authorized to update Question");
    }
  };
  const EdithandleShow2 = () => {
    dispatch(EditCatModal(true));
  };

  const cloneModalClose = () => setCloneModal(false);
  // questionare function

  const submitQuestionare = async (e) => {
    e.preventDefault();
    if (isAddQuestionare) {
      setGlobalLoader(false);
      let flagCat = 0;

      for (let index = 0; index < ListCategoryMain.questionnaires.length; index++) {
        if (ListCategoryMain.questionnaires[index].questionnaire_name === addQuestionare) {
          flagCat = 1;
        }
      }

      if (flagCat === 1) {
        setGlobalLoader(true);
        setCatListCheckToast(true);
        setTimeout(() => {
          setCatListCheckToast(false);
        }, 5000);
      } else {
        // add api call
        setViewCategoryAPI([]);
        var data = JSON.stringify({
          questionnaire_name: addQuestionare,
        });

        let questionairapi = await AddQuestionareAPI(data);
        setGlobalLoader(true);

        if (questionairapi.success) {
          setQuestionareID(questionairapi.questionnaire._id);
          setshowcategorybar(1);
          setaddQuestionarecheck(1);
        } else {
          toast.error("failed to create questionairapi");
        }
      }
    } else {
      toast.error("You are not authorized to create a new questionaire");
    }
  };

  // category childs

  const submitcategoryChild = async (e) => {
    e.preventDefault();
    // debugger;
    setGlobalLoader(false);

    setViewSpecificCategoryAPI([]);
    setMultipleSelect();
    // debugger;

    setAddCategoryButton(InputFieldChild);
    setshowcategoryChildbar(0);
    setViewCategoryAPI([]);
    // flags

    setquestionareFlagCheck(false);

    setparentFlagCheck(true);
    // dispatch(CategoryModalID(""));
    // search category from tree.allRootCategories
    let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

    // debugger;
    if (ViewCategoryResponse.success) {
      for (let outer = 0; outer < ViewCategoryResponse.categories.length; outer++) {
        for (
          let index = 0;
          index < ViewCategoryResponse.categories[outer].ref_child_nodes.length;
          index++
        ) {
          if (
            ViewCategoryResponse.categories[outer].ref_child_nodes[index].child_id !== "" &&
            ViewCategoryResponse.categories[outer].ref_child_nodes[index].identifier === identifier
          ) {
            //if body
            let ViewSpecificCategoryResponse = await viewCategoryforSpecificAPI(
              ViewCategoryResponse.categories[outer].ref_child_nodes[index].child_id
            );
            setDataToEditModal(ViewSpecificCategoryResponse.category);
            for (
              let index = 0;
              index < ViewSpecificCategoryResponse.category.ref_child_nodes.length;
              index++
            ) {
              setViewSpecificCategoryAPI(ViewSpecificCategoryResponse.category.ref_child_nodes);
              setMultipleSelect(ViewSpecificCategoryResponse.category.isMultiple);
              // debugger
              setQuestionStatement(ViewSpecificCategoryResponse.category.question);
            }
          } else {
          }
        }
      }
    }

    //tree
    updatevariablelist(addQuestionare);
  };

  const clone = (oldName) => {
    if (isAddQuestionare) {
      setCloneModal(true);
      setOldName(oldName);
    } else {
      toast.error("You are authorized to clone questionare");
    }
  };

  const submitcategory = async (e) => {
    if (document.getElementById("inputid").value) {
      if (document.getElementById("inputid").value.length < 20) {
        e.preventDefault();
        setGlobalLoader(false);

        setAddCategoryButton(InputField);
        setshowcategorybar(0);
        setViewCategoryAPI([]);
        setQuestionStatement("");
        // flags

        setquestionareFlagCheck(true);

        setparentFlagCheck(false);

        setrootCategoryCheck(InputField);

        document.getElementById("inputid").value = "";

        // It will print alphabets from A to Z
        // A to Z
        let k = AlphabaticOrdernumber;
        //convert the char code to string (Alphabets)
        var str = String.fromCharCode(k);

        ArrayForAlphabatic.push(str + ".");

        setAlphabaticOrder(ArrayForAlphabatic);
        //print the result in console
        AlphabaticOrdernumber = AlphabaticOrdernumber + 1;

        // viewspecificcategory(addQuestionare);

        dispatch(CategoryModalID(""));
        // search category from tree.allRootCategories
        let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

        if (ViewCategoryResponse.success) {
          setTreeData(ViewCategoryResponse);
          setAnswerType(ViewCategoryResponse.categories[0].answer_type);
          if (ViewCategoryResponse.categories[0].category_name === InputField) {
            dispatch(CategoryModalID(ViewCategoryResponse.categories[0]._id));
          } else {
            toast.error("Categroy not found");
          }
        }
        updatevariablelist(addQuestionare);
      } else {
        e.preventDefault();
        setRangeToast(true);
        setTimeout(() => {
          setRangeToast(false);
        }, 5000);
      }
    } else e.preventDefault();
    setGlobalLoader(true);
  };
  //this fuction is for specific view catgory

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // this function is for tree

  const updatevariablelist = async (IpField) => {
    setGlobalLoader(false);

    let ViewCategoryResponse = await getViewCategoryAPI(IpField);
    setGlobalLoader(true);

    let deptharr = [];
    let deptharrForSpaces = [];
    if (ViewCategoryResponse.success) {
      for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
        deptharr[index] = ViewCategoryResponse.categories[index].depth;
      }

      for (let index = 0; index < deptharr.length; index++) {
        deptharrForSpaces[index] = spaces.repeat(deptharr[index]);
      }
      setdepthValueCheck(deptharrForSpaces);
      setViewCategoryAPI(ViewCategoryResponse.categories);
    }
  };
  const repeatStr = (n, s) => {
    s.repeat(n);
    return s;
  };

  const changecat = async (cat, id) => {
    // for color change
    setGlobalLoader(false);

    setclickChangeCatForColorRed(id);
    setSendingIdtoChild(id);
    setAddCategoryButton(cat);
    setViewSpecificCategoryAPI([]);
    setMultipleSelect();
    getViewCategoryAPI([]);
    setAnimation(false);

    let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);
    setGlobalLoader(true);

    // debugger;
    if (ViewCategoryResponse.success) {
      for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
        if (id === ViewCategoryResponse.categories[index]._id) {
          let category = ViewCategoryResponse.categories[index]._id;
          setAnswerType(ViewCategoryResponse.categories[index].answer_type);
          dispatch(CategoryModalID(category));
          setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
          setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
          // it's in change cat sub
        }
      }
    }

    ArrayForCategories.push(AddCategoryButton);

    //checking id
    setQuestionStatement("");
    let ViewSpecificCategoryResponse = await viewCategoryforSpecificAPI(id);
    setDataToEditModal(ViewSpecificCategoryResponse.category);

    setQuestionStatement(ViewSpecificCategoryResponse.category.question);
  };

  const commercialClick = async (e, id) => {
    setGlobalLoader(false);

    // for color change in tree
    setclickChangeCatForColorRed(id);

    setEditOpenModalID(id);
    //setAddCatParentBtn(AddCategoryButton);
    setQuestionStatement("");
    let parentAddCategoryButton = AddCategoryButton;
    setIdentifier(e);
    setparentIDforchild(_id);

    getViewCategoryAPI([]);
    setquestionareFlagCheck(false);
    setparentFlagCheck(true);
    // dispatch(CategoryModalID(""));

    setAddCategoryButton(e);
    setViewCategoryAPI([]);
    setAnimation(false);

    // dispatch(CategoryModalID(""));
    setViewSpecificCategoryAPI([]);
    setMultipleSelect();
    let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

    for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
      if (id === ViewCategoryResponse.categories[index]._id) {
        let category = ViewCategoryResponse.categories[index]._id;
        // dispatch(CategoryModalID(category));
        setAnswerType(ViewCategoryResponse.categories[index].answer_type);

        setQuestionStatement(ViewCategoryResponse.categories[index].question);
        setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
        setDataToEditModal(ViewCategoryResponse.categories[index]);
        setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
        // it's in change cat sub
        // debugger;
      }
    }

    updatevariablelist(addQuestionare);
  };

  // Delete DeleteSubCategoryAPI
  const deleteVariable = async (questionnaire_name) => {
    if (isDeleteQuestionare) {
      setDeleteValueLoader(false);
      setDeleteFlagWithNameCheck(questionnaire_name.child_id);

      if (questionnaire_name.child_id) {
        setGlobalLoader(false);
        if (ViewSpecificCategoryAPI.length >= 2) {
          let response = await DeleteViewCategoryChildAPI(
            questionnaire_name.child_id,
            questionnaire_name.identifier
          );
          /// inner specific API

          setViewSpecificCategoryAPI([]);
          setMultipleSelect();
          getViewCategoryAPI([]);
          setAnimation(false);
          setDeleteValueLoader(true);
          // view category tree

          if (AddCategoryButton === rootCategoryCheck) {
            let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

            setAnswerType(ViewCategoryResponse.categories[0].answer_type);

            if (ViewCategoryResponse.success) {
              if (ViewCategoryResponse.categories[0].category_name === AddCategoryButton) {
                setViewSpecificCategoryAPI(ViewCategoryResponse.categories[0].ref_child_nodes);
                setMultipleSelect(ViewCategoryResponse.categories[0].isMultiple);
              } else {
                toast.error("Categroy not found");
              }
            }
          } else {
            let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

            if (ViewCategoryResponse.success) {
              for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
                if (AddCategoryButton === ViewCategoryResponse.categories[index].category_name) {
                  //let category = ViewCategoryResponse.categories[index]._id;
                  setAnswerType(ViewCategoryResponse.categories[index].answer_type);
                  //dispatch(CategoryModalID(category));
                  setViewSpecificCategoryAPI(
                    ViewCategoryResponse.categories[index].ref_child_nodes
                  );
                  setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
                  // it's in change cat sub
                  // debugger;
                }
              }
            }
          }

          updatevariablelist(addQuestionare);
          setDeleteFlagCheck(1);
        } else {
          // change this
          setGlobalLoader(true);
          setLastMcq(true);
          setTimeout(() => {
            setLastMcq(false);
          }, 5000);
        }
      } else {
        setGlobalLoader(true);

        // e.preventDefault();
        setDeleteToast(true);
        setTimeout(() => {
          setDeleteToast(false);
        }, 5000);
      }
    } else {
      toast.error("You are not allowed to delete");
    }
  };

  const refreshCategories = async () => {
    setGlobalLoader(false);

    let reponseQuestions = await questionnairesListAPI();
    setGlobalLoader(true);

    if (reponseQuestions.success) {
      setAllQuestionare(reponseQuestions.questionnaires);
      setallQuestionareAnimation(false);
      setListCategoryMain(reponseQuestions);
    } else {
      setallQuestionareAnimation(false);
    }
  };

  // all questions
  // eslint-disable-next-line react-hooks/exhaustive-deps

  //todo
  const QuestionareClicked = async (name, id) => {
    setGlobalLoader(false);
    //dispatch(CategoryModalID(""));
    //only for root
    setAnimation(true);
    // id is Questionare ID
    // dispatch(CategoryModalID(id));

    setaddQuestionare(name);

    // setViewSpecificCategoryAPI()

    let ViewCategoryResponse = await getViewCategoryAPI(name);
    setGlobalLoader(true);
    if (ViewCategoryResponse.success) {
      //dispatch(CategoryModalID(ViewCategoryResponse.categories[0]._id));
      if (ViewCategoryResponse.categories[0]._id) {
        setAddCategoryButton(ViewCategoryResponse.categories[0].category_name);
        setrootCategoryCheck(ViewCategoryResponse.categories[0].category_name);
        setSendingIdtoChild(ViewCategoryResponse.categories[0]._id);
        setshowcategorybar(0);
        setaddQuestionarecheck(1);
        setTreeData(ViewCategoryResponse);

        setrootCategoryCheck(ViewCategoryResponse.categories[0].category_name);
        // wokred for root Questionare
        // debugger;
        for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
          if (index === 0) {
            setAddCategoryButton(ViewCategoryResponse.categories[0].category_name);
            setDataToEditModal(ViewCategoryResponse.categories[0]);
          }
          if (ViewCategoryResponse.categories[index].isRoot) {
            //only for root
            setAnimation(false);
            setQuestionStatement(ViewCategoryResponse.categories[index].question);
            setAnswerType(ViewCategoryResponse.categories[index].answer_type);
            setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
            setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
            setDataToEditModal(ViewCategoryResponse.categories[index]); // debugger;
          }
        }
      }

      // flag
      setquestionareFlagCheck(true);

      setparentFlagCheck(false);

      updatevariablelist(name);
      setViewCategoryAPI([]);
    } else {
      setQuestionareID(id);
      setshowcategorybar(1);
      setaddQuestionarecheck(1);
    }
  };

  // edit modal work

  const EditModalFields = async (e, item) => {
    e.preventDefault();
    setEditValueLoader(false);
    setGlobalLoader(false);

    for (let index = 0; index < ViewSpecificCategoryEditAPI.ref_child_nodes.length; index++) {
      if (EditChildValue === ViewSpecificCategoryEditAPI.ref_child_nodes[index].identifier) {
        ViewSpecificCategoryEditAPI.ref_child_nodes[index].identifier = EditModalValue;
      }
    }

    var data = JSON.stringify({
      old_identifier: EditChildValue,
      new_identifier: EditModalValue,
    });

    let EditResponse = await UpdateIdentifierAPI(ViewSpecificCategoryEditAPI._id, data);

    if (EditResponse.success) {
      setEditValueLoader(true);

      updatevariablelist(addQuestionare);

      setViewSpecificCategoryAPI([]);
      setMultipleSelect();

      if (AddCategoryButton === rootCategoryCheck) {
        let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);

        // Delete
        setAnswerType(ViewCategoryResponse.categories[0].answer_type);
        // debugger;
        if (ViewCategoryResponse.success) {
          if (ViewCategoryResponse.categories[0].category_name === AddCategoryButton) {
            //   "ViewCategoryResponse",
            //   ViewCategoryResponse.categories[0]._id
            // );
            dispatch(CategoryModalID(ViewCategoryResponse.categories[0]._id));
            setViewSpecificCategoryAPI(ViewCategoryResponse.categories[0].ref_child_nodes);
            setMultipleSelect(ViewCategoryResponse.categories[0].isMultiple);
          }
        }
      } else {
        let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);
        setAnswerType(ViewCategoryResponse.categories[0].answer_type);
        // debugger;
        if (ViewCategoryResponse.success) {
          for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
            if (AddCategoryButton === ViewCategoryResponse.categories[index].category_name) {
              let category = ViewCategoryResponse.categories[index]._id;
              dispatch(CategoryModalID(category));
              setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
              setMultipleSelect(ViewCategoryResponse.categories[index].isMultiple);
            }
          }
        }
      }
      EdithandleClose();
      setGlobalLoader(true);
    }
  };

  const EditFunction = (e, item) => {
    e.preventDefault();
    if (isUpdateQuestionare) {
      setEditChildValue(item);
      EdithandleShow();
    } else {
      toast.error("You are not authorized to update name");
    }
  };

  const cloneCategory = async (id, item) => {
    if (isAddQuestionare) {
      setGlobalLoader(false);

      setCloneValueLoader(false);
      try {
        if (id) {
          let cloneCategoryResponse = await CloneSubCategoryAPI(id);
          setGlobalLoader(true);

          if (cloneCategoryResponse.success) {
            setCloneValueLoader(true);
            setShowCloneToast(true);
            updateTreeAndList(id, item);
            setTimeout(() => {
              setShowCloneToast(false);
            }, 5000);
          } else {
            setCloneValueLoader(true);
            setShowCloneToastNotSuccess(true);
            setTimeout(() => {
              setShowCloneToastNotSuccess(false);
            }, 5000);
          }
        } else {
          toast.error("Did't have any child");
          setGlobalLoader(true);
        }
      } catch (error) {
        toast.error("something went wrong");
      }
    } else {
      toast.error("You are not authorized to clone category");
    }
  };

  const updateTreeAndList = async (id, item) => {
    setGlobalLoader(false);

    // Update tree
    updatevariablelist(addQuestionare);

    //updtae List
    let ViewCategoryResponse = await getViewCategoryAPI(addQuestionare);
    setGlobalLoader(true);

    if (ViewCategoryResponse.success) {
      // wokred for root Questionare
      //debugger;

      for (let index = 0; index < ViewCategoryResponse.categories.length; index++) {
        for (
          let index1 = 0;
          index1 < ViewCategoryResponse.categories[index].ref_child_nodes.length;
          index1++
        ) {
          if (id === ViewCategoryResponse.categories[index].ref_child_nodes[index1].child_id) {
            setAddCategoryButton(ViewCategoryResponse.categories[index].category_name);
            setDataToEditModal(ViewCategoryResponse.categories[index]);

            setAnimation(false);

            setQuestionStatement(ViewCategoryResponse.categories[index].question);
            setAnswerType(ViewCategoryResponse.categories[index].answer_type);
            setViewSpecificCategoryAPI(ViewCategoryResponse.categories[index].ref_child_nodes);
            setMultipleSelect(ViewCategoryResponse[index].isMultiple);
            setDataToEditModal(ViewCategoryResponse.categories[index]);
            // it's in change cat sub
            // debugger;
          }
        }
      }

      setAnimation(false);
    }
  };

  function MenuDropDown() {
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }
  }

  const deleteCategoryMain = async (id) => {
    if (isDeleteQuestionare) {
      setGlobalLoader(false);

      try {
        setallQuestionareAnimation(true);
        let response = await DeleteViewCategoryChildAPI(id.ref_root_category);
        setGlobalLoader(true);

        if (response.success) {
          refreshCategories();
        } else {
          setallQuestionareAnimation(false);
          toast.error("something went wrong while deleting");
        }
      } catch (error) {
        setallQuestionareAnimation(false);
        toast.error("something went wrong while deleting");
      }
    } else {
      toast.error("You are authorized to delete questionare");
    }
  };

  return (
    <>
      {globalLoader ? (
        <div>
          {AddCategoryButton ? (
            <div className="col-12">
              <div className="card recentEstimatesCard mb-4">
                <div className="card-title incomingBar">
                  <span className="cssforcategoryheading">{AddCategoryButton}</span>
                </div>
                &nbsp;
                {toastSucces ? (
                  <div className=" col-12 toastClass">
                    <Toast message="Category Deleted Successfully!" />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                {toastNotSucces ? (
                  <div className=" col-12 toastClass">
                    <Toast message="Something went wrong!" />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                {showCloneToast ? (
                  <div className=" col-12 toastClass">
                    <Toast message="Msqs Cloned Successfully!" />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                {showCloneToastNotSuccess ? (
                  <div className=" col-12 toastClass">
                    <Toast message="Something went wrong!" />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                {DeleteToast ? (
                  <div className=" col-12 toastClass">
                    <Toast message="Cannot be Deleted. its contains no childs. if you want to remove then Click on Edit Button and remove this " />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                {lastMcq ? (
                  <div className=" col-12 toastClass">
                    <Toast
                      success="danger"
                      message="Mcqs last node can not be deleted, use edit button to remove it"
                    />
                  </div>
                ) : (
                  <span hidden></span>
                )}
                <div className="row justify-content-center">
                  <div className="col-8">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-1"></div>
                          <div className="col-5 d-flex align-items-start cssforEnterCategoryStatementQuestion">
                            1. Enter Category Statement / Question
                          </div>
                          <div className="col-6"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-1"></div>
                          <div className="col-9 d-flex align-items-start cssforEnterCategoryStatementQuestion">
                            <label htmlFor="url" className="form-label"></label>
                            <input
                              //required={true}
                              readOnly
                              type="text"
                              id="text"
                              className="form-control"
                              placeholder="Please Enter A Question Statement"
                              value={QuestionStatement}
                              onChange={(e) => setQuestionStatement(e.target.value)}
                            />
                          </div>
                          <div className="col-4"></div>
                        </div>
                      </div>
                    </div>
                    &nbsp;
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-1"></div>
                          <div className="col-6 d-flex align-items-start cssforEnterCategoryStatementQuestion">
                            2. Added Variables
                          </div>
                          &nbsp; &nbsp;
                          <div className="col-4 d-flex align-items-start cssforEnterCategoryStatementQuestion">
                            3. Choose an option
                          </div>
                          <div className="col-1"></div>
                        </div>
                      </div>
                    </div>
                    &nbsp;
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-1"></div> &nbsp; &nbsp;
                          <div className="col-5">
                            {animation === false ? (
                              answerType === "mcqs" || answerType === "Mcqs" ? (
                                // ViewSpecificCategoryAPI[0] !== null ? (
                                ViewSpecificCategoryAPI.map((item, index) => (
                                  <div className="row mt-2 justify-content-start">
                                    <div className="card col-6 cssForCard cssforEnterCategoryStatementQuestion ">
                                      <button
                                        className="editButton wraptheCommercialClick"
                                        disabled={item.child_id ? true : false}
                                        onClick={(e) =>
                                          commercialClick(item.identifier, item.child_id)
                                        }
                                      >
                                        <span className="">{item.identifier}</span>
                                        <br />
                                        <span className="cssforwritethediscription mb-0">
                                          {item.description}
                                        </span>
                                        &nbsp;
                                      </button>
                                    </div>
                                    &nbsp;
                                    <div className="card col-3 cssForCard">
                                      <button
                                        className="editButton"
                                        onClick={(e) => EditFunction(e, item.identifier)}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    <Modal
                                      show={Editshow}
                                      onHide={EdithandleClose}
                                      size="xl"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header closeButton>
                                        <Modal.Title>Edit Details</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <form
                                          id="EditModalID"
                                          onSubmit={(e) => EditModalFields(e, item.identifier)}
                                        >
                                          <label className="row">
                                            <span> Edit Value:</span> <br />
                                            <textarea
                                              className="mt-2"
                                              required
                                              id="EditModalIDChild"
                                              // type="textfield"
                                              defaultValue={EditChildValue}
                                              // defaultValue={item.identifier}
                                              onChange={(e) => setEditModalValue(e.target.value)}
                                            ></textarea>
                                          </label>
                                          <br />

                                          {EditValueLoader ? (
                                            <div className="row">
                                              <div className="col-11"></div>
                                              <div className="col-1">
                                                <input
                                                  className="btn btn-primary"
                                                  value="submit"
                                                  type="submit"
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="row">
                                              <div className="col-11"></div>
                                              <div className="col-1">
                                                <input
                                                  disabled
                                                  className="btn btn-primary"
                                                  value="submit"
                                                  type="submit"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </form>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button variant="secondary" onClick={EdithandleClose}>
                                          Close
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                    &nbsp;
                                    <Modal
                                      show={Editshow1}
                                      onHide={EdithandleClose1}
                                      size="xl"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header closeButton>
                                        <Modal.Title>Edit Details</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <EditCategoryModal
                                          flagMcqs={true}
                                          allData={dataToEditModal}
                                        />
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button variant="secondary" onClick={EdithandleClose1}>
                                          Close
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                    <div
                                      onClick={() => cloneCategory(item.child_id, item)}
                                      className="card col-1 cssForCard"
                                    >
                                      <p className="mt-2">
                                        {CloneValueLoader ? (
                                          <button className="buttonForClone">
                                            <img src={doubleboxsmall} />
                                          </button>
                                        ) : (
                                          <button className="buttonForClone" disabled>
                                            {" "}
                                            <img src={doubleboxsmall} />
                                          </button>
                                        )}
                                      </p>
                                    </div>
                                    &nbsp;
                                    {/* integrating delete API  */}
                                    <div className="card col-1 cssForCard">
                                      <button
                                        onClick={(e) => deleteVariable(item)}
                                        className="editButton"
                                      >
                                        <p className="mt-2">
                                          {DeleteValueLoader ? (
                                            <button className="buttonForClone">
                                              <img src={crosssmall} />
                                            </button>
                                          ) : (
                                            <button disabled className="buttonForClone">
                                              <img src={crosssmall} />
                                            </button>
                                          )}
                                        </p>
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="row mt-2 justify-content-start">
                                  <div className="card col-6 cssForCard cssforEnterCategoryStatementQuestion ">
                                    <span
                                      style={{
                                        marginTop: "20px",
                                        color: "black",
                                      }}
                                    >
                                      {" "}
                                      {answerType}{" "}
                                    </span>
                                  </div>
                                  &nbsp;
                                  <div className="card col-3 cssForCard">
                                    <button
                                      className="editButton"
                                      disabled
                                      // onClick={EdithandleShow}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  {/* <Modal
                                  show={Editshow}
                                  onHide={EdithandleClose}
                                  size="xl"
                                  aria-labelledby="contained-modal-title-vcenter"
                                  centered
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Edit Details</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <CategoryEditModal />
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                      Close
                                    </Button>
                                   
                                  </Modal.Footer>
                                </Modal> */}
                                  &nbsp;
                                  <div className="card col-1 cssForCard">
                                    <p className="mt-2">
                                      <img src={doubleboxsmall} />
                                    </p>
                                  </div>
                                  &nbsp;
                                  {/* integrating delete API  */}
                                  <div className="card col-1 cssForCard">
                                    <button
                                      // onClick={(e) =>
                                      //   deleteVariable(item.questionnaire_name)
                                      // }
                                      className="editButton"
                                    >
                                      <p className="mt-2">
                                        <img src={crosssmall} />
                                      </p>
                                    </button>
                                  </div>
                                </div>
                              )
                            ) : (
                              <h1>Click Add Button To Add Data</h1>
                            )}
                          </div>
                          <div className="col-1">
                            <img src={Line} />
                          </div>
                          <div className="col-3 d-flex align-items-start ">
                            <div className="card cssforcardradio">
                              <div className="col-12 d-flex flex-row justify-content-around ">
                                <div className=" d-flex flex-column justify-content-around">
                                  <input
                                    checked={multipleSelect == false}
                                    type="radio"
                                    id="SelectSingle"
                                    name="answerType"
                                    value="SelectSingle"
                                  />

                                  <input
                                    checked={multipleSelect == true}
                                    type="radio"
                                    id="SelectMultiple"
                                    name="answerType"
                                    value="SelectMultiple"
                                  />
                                </div>

                                <div className=" d-flex flex-column justify-content-around textData ">
                                  <label className="mb-1" for="text">
                                    &nbsp;Select Single
                                  </label>
                                  <img className="cssforverticalline" src={VerticalLine} />
                                  <label className="mt-1" for="text">
                                    &nbsp;Select Multiple
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-2 d-flex align-items-start mb-2 AddAndEditButtonForCommercialClick">
                          {/* {false ? ( */}
                          {ViewSpecificCategoryAPI.length > 0 ? (
                            answerType === "Mcqs" ? (
                              <Button onClick={EdithandleShow1}>Edit </Button>
                            ) : (
                              <Button onClick={EdithandleShow2}>Edit </Button>
                            )
                          ) : (
                            <div>
                              <Button onClick={handleShow}>Add</Button> &nbsp;
                            </div>
                          )}
                          {/* ) : (
                    <div>
                      <Button disabled>Add</Button> &nbsp;
                    </div>
                  ) */}
                        </div>
                      </div>
                    </div>
                    &nbsp;
                  </div>
                  <div className="col-2">
                    {/* <div className="row"> */}
                    {/* <div className="col-12 cssforcommercial"> */}
                    {/* <div className="row"> */}
                    {/* <div className="col-12"> */}
                    <div
                      // style={{ width: "300px", height: "auto" }}
                      // style={{ width: "300px", height: "auto" }}
                      className="cssButtonLookLikeLink newStyleForButtonLink"
                      style={{ height: LengthOfCommercialClick * 100 }}
                    >
                      {/* <ul style={{ color: "black" }}>{addQuestionare}</ul> */}
                      <ul
                        className="cssForCategoryButtons changeCat"
                        style={{ overFlow: "scroll" }}
                      >
                        <pre>
                          <li style={{ color: "black" }}>{addQuestionare}</li>
                        </pre>
                        {ViewCategoryAPI.map((item, index) => (
                          <pre>
                            <li
                              className=""
                              style={
                                clickChangeCatForColorRed == item._id
                                  ? { color: "red" }
                                  : { color: "blue" }
                              }
                              // key={item}
                              onClick={(e) => {
                                changecat(item.category_name, item._id);
                              }}
                            >
                              {/* {previousDepthValue === depthValueCheck[index] ? (
                                    <>
                                      {depthValueCheck[index]}
                                      {item.depth}: {item.category_name}
                                    </>
                                  ) : (
                                    <>
                                      {(previousDepthValue = depthValueCheck[index])}
                                      {depthValueCheck[index]}
                                      {item.depth}: {item.category_name}
                                    </>
                                  )} */}
                              {depthValueCheck[index]}
                              {item.depth}: {item.category_name}
                              {/* 
                               
                                  {dataToEditModal.depth}: {item.category_name}
                                  */}
                            </li>
                          </pre>
                        ))}
                      </ul>
                    </div>
                    {/* </div> */}

                    {/* <ul>
                          {ArrayForCategories.map((value, index) => {
                            return <div className="col-12">
                              <button onClick={ShowCategory(index)} className="cssButtonLookLikeLink">
                                {AlphabaticOrder} {AddCategoryButton}
                              </button>

                            </div>
                          })}
                        </ul> */}
                    {/* </div> */}
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                  &nbsp;
                  <div className="row">
                    <div className="col-2"></div>
                    {/* <Modal
                  show={editModal2}
                  onHide={handleClose2}
                  size="xl"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditCategoryModal allData={dataToEditModal} />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModal2(false)}>
                      Close
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button> */}
                    {/* </Modal.Footer>
                </Modal> */}

                    <Modal
                      show={editModal2}
                      onHide={EdithandleClose2}
                      size="xl"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <EditCategoryModal flagMcqs={false} allData={dataToEditModal} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={EdithandleClose2}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div className="col-6"></div>
                    <div className="col-2 deleteButton">
                      {/* <Button onClick={deleteCategory} className="btn btn-danger">
                    Delete {AddCategoryButton}{" "}
                  </Button> */}
                    </div>

                    <Modal
                      show={show}
                      onHide={handleClose}
                      size="xl"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <CategoryModal
                          CategoryName={AddCategoryButton}
                          questionareIDforroot={QuestionareID}
                          // parentID={newIdToShow}
                          parentID={sendingIdToChild}
                          identifierName={identifier}
                          //flag
                          isquestionareFlagCheck={questionareFlagCheck}
                          isparentFlagCheck={parentFlagCheck}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        {/* <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button> */}
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
              {/* <button onClick={checkvalue}>hello</button> */}
            </div>
          ) : (
            <div></div>
          )}

          {showcategorybar == 1 ? (
            <div>
              {" "}
              &nbsp;
              <div className="row justify-content-center">
                <div className="col-12">
                  {rangeToast ? (
                    <div className=" col-12 toastClass">
                      <Toast message="Please Input length of Questionare less then 20 " />
                    </div>
                  ) : (
                    <span hidden></span>
                  )}

                  <form id="formid" onSubmit={submitcategory}>
                    <label>
                      Enter a Questionare&nbsp;
                      <input
                        required
                        id="inputid"
                        type="text"
                        className=""
                        // value={name}
                        onChange={(e) => setInputField(e.target.value)}
                      />
                    </label>
                    &nbsp;
                    <input className="btn btn-secondary" value="submit" type="submit" />
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {addQuestionarecheck === 0 ? (
            <div>
              {" "}
              &nbsp;
              <div className="row justify-content-center">
                <div className="col-12">
                  <form id="formid1" onSubmit={submitQuestionare}>
                    <label>
                      Enter a Category&nbsp;
                      {/* its a questionanre in API */}
                      <input
                        required
                        id="questioanreid"
                        type="text"
                        className=""
                        // value={name}
                        onChange={(e) => setaddQuestionare(e.target.value)}
                      />
                    </label>
                    &nbsp;
                    <input className="btn btn-secondary" value="submit" type="submit" />
                    {CatListCheckToast ? (
                      <div className="mt-2 col-8 toastClass">
                        <Toast message="Category Already Exist!!!" />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </form>
                  <hr />

                  <div className="row">
                    {/* its a Questionare list */}
                    <h4>Category List</h4>
                    {clonePopup ? (
                      <div className=" col-10 toastClass">
                        <Toast message="Category Cloned Successfully!" />
                      </div>
                    ) : (
                      <span hidden></span>
                    )}

                    {!allQuestionareAnimation ? (
                      allQuestionare.map((item, index) => (
                        <>
                          <div className="col-2"></div>
                          <div className="col-8 mt-2">
                            <div className="card ExpiringSoonCard d-flex justify-content-around flex-row">
                              <div
                                onClick={(e) =>
                                  QuestionareClicked(item.questionnaire_name, item._id)
                                }
                                className="card-title incomingBarCategory pointer"
                              >
                                <span className="FontSizeAllEstimators">
                                  {index}. &nbsp;
                                  {item.questionnaire_name}
                                </span>
                              </div>
                              {/* <div className="col-3"> */}
                              <ul id="myUL">
                                <li>
                                  <span class="caret" onClick={MenuDropDown}>
                                    Options
                                  </span>
                                  <ul class="nested">
                                    &nbsp;
                                    <li>
                                      <button
                                        onClick={(e) => clone(item.questionnaire_name)}
                                        className="btn  btn-sm btn-primary  "
                                      >
                                        Clone
                                      </button>
                                    </li>
                                    &nbsp;
                                    <li>
                                      {" "}
                                      <button
                                        onClick={(e) => deleteCategoryMain(item)}
                                        className="btn  btn-sm btn-danger  "
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </li>
                              </ul>

                              {/* </div> */}
                            </div>
                          </div>{" "}
                          <div className="col-2"></div>
                        </>
                      ))
                    ) : (
                      <LoaderAnimation />
                    )}

                    <Modal
                      show={cloneModal}
                      onHide={cloneModalClose}
                      size="xl"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <CloneCategoryModal name={oldName} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={cloneModalClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    {/* {!allQuestionareAnimation ? (
                  allQuestionare.map((item, index) => (
                    <>
                      <div className="col-2"></div>
                      <div
                        onClick={(e) =>
                          QuestionareClicked(item.questionnaire_name)
                        }
                        className="col-8 mt-2 questionAlign"
                      >
                        {index}. &nbsp; &nbsp;{" "}
                        <h5>{item.questionnaire_name}</h5>{" "}
                        <div className="col-10"></div>
                      </div>
                      <div className="col-2">
                        <button
                          onClick={(e) => clone(item.questionnaire_name)}
                          className="btn btn-sm btn-primary "
                        >
                          Clone Category {item.questionnaire_name}
                        </button>
                      </div>
                    </>
                  ))
                ) : (
                  <LoaderAnimation />
                )} */}
                    <div className="mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {showcategoryChildbar == 1 ? (
            <div>
              {" "}
              &nbsp;
              <div className="row justify-content-center">
                <div className="col-12">
                  <form id="formid" onSubmit={submitcategoryChild}>
                    <label>
                      Enter a category&nbsp;
                      <input
                        required
                        id="inputidChild"
                        type="text"
                        className=""
                        // value={name}
                        onChange={(e) => setInputFieldChild(e.target.value)}
                      />
                    </label>
                    &nbsp;
                    <input className="btn btn-secondary" value="submit" type="submit" />
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        // <div className="d-flex justify-content-center align-item-center">
        <div>
          <LoaderAnimation />
          <h5 className="mt-4" style={{ color: "red" }}>
            Please wait, this may take few minutes.
          </h5>
        </div>
      )}
    </>
  );
};

export default Category;
