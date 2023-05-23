import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { TemplateAPI } from '../../api/Services';
import Toast from '../Toast/Toast';
import { useDispatch } from 'react-redux';
import { AutoCloseModal } from '../../Redux/Actions/Action';

const CloneCategoryModal = (props) => {
  const [cloneName, setClonename] = useState('');
  const [clonePopup, setClonePopup] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [notClone, setNotClone] = useState(false);
  let dispatch = useDispatch();

  const redOutline = () => {
    if (cloneName === '') {
      showError('name', true);
    } else {
      showError('name', false);
    }
  };

  const showError = (elementID, flag) => {
    if (flag === true) {
      document.getElementById(elementID).style.border = '1px solid red';
    } else {
      document.getElementById(elementID).style.border = '1px solid lightgray';
    }
  };

  // function called when form is submitted
  const formSubmit = async (e) => {
    e.preventDefault();
    setDisabledButton(false);
    var data = JSON.stringify({
      questionnaire_name: props.name,
      new_questionnaire_name: cloneName,
    });
    let response = await TemplateAPI(data);
    if (response.success) {
      setDisabledButton(true);
      dispatch(AutoCloseModal(1));
      setClonePopup(true);
      setTimeout(() => {
        setClonePopup(false);
      }, 5000);
    } else {
      setNotClone(true);
      setTimeout(() => {
        setNotClone(false);
      }, 5000);
      setClonePopup(false);
      setDisabledButton(true);
    }

    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={formSubmit}>
        <div className="mb-3">
          {clonePopup ? (
            <div className=" col-10 toastClass">
              <Toast message="Category Cloned Successfully!" />
            </div>
          ) : (
            <span hidden></span>
          )}
          {notClone ? (
            <div className=" col-10 toastClass">
              <Toast success="danger" message="something went wrong!" />
            </div>
          ) : (
            <span hidden></span>
          )}
          <label htmlFor="name" className="form-label modalLabel required">
            Name
          </label>
          <input
            type="text"
            className="form-control modalInput"
            id="name"
            placeholder="Enter New Name:"
            required={true}
            onChange={(e) => setClonename(e.target.value)}
          />
        </div>
        {disabledButton ? (
          <Button
            value="submit"
            type="submit"
            id="submit"
            className="btn buttonColor mt-2"
            onClick={redOutline}>
            Done
          </Button>
        ) : (
          <>
            {' '}
            <Button
              disabled
              value="submit"
              type="submit"
              id="submit"
              className="btn buttonColor mt-2"
              onClick={redOutline}>
              Done
            </Button>
            <br />
            <br />
            <p className="mt-2" style={{ color: 'blue' }}>
              Cloning Data please wait.
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default CloneCategoryModal;
