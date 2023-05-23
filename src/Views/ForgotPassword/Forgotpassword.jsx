import React, { useState } from "react";
import cleanAsk from "../../Assets/Images/Group 3072.png";
import userManagment from "../../Assets/Images/Group 3512.png";
import notificationMessage from "../../Assets/Images/Group 3565.png";
import footer from "../../Assets/Images/Group 3071.png";
import { Link, useNavigate } from "react-router-dom";
import { companyForgotPasswordAPI } from "../../api/Services";
import { newPwdEmailAction } from "../../Redux/Actions/Action";
import { useDispatch } from "react-redux";
import "./ForgotPassword.css";
import { toast } from "react-toastify";

const Forgotpassword = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  //! Hooks start
  const [emailValue, setEmailValue] = useState("");
  const [responseError, setResponseError] = useState(false);
  //! Hooks end

  // Functions Here
  const forgotButton = async (e) => {
    e.preventDefault();
    var payLoad = JSON.stringify({
      email: emailValue,
    });

    try {
      let response = await companyForgotPasswordAPI(payLoad);
      if (response.success) {
        navigate("/RecoveryCode");
        dispatch(newPwdEmailAction(emailValue));
      } else {
        setResponseError(true);
        setTimeout(() => {
          setResponseError(false);
        }, 5000);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="row loginComponent">
      {/* <button className="btn btn-danger" onClick={() => navigate("/Join")}>
        Chat
      </button> */}
      {/* <section className="vh-100 bgColorLogin"> */}
      <div className="container h-100">
        <div className="row mt-4">
          <div className="col-2">
            <Link to={"/"} className="navbar-brand">
              <img src={cleanAsk} alt="" />
            </Link>
          </div>
          <div className="col-8">
            <span className="adminSignIN">Admin Sign In</span>
          </div>
        </div>
        <div className="row d-flex justify-content-center mt-4 h-100">
          <div className="col-1  d-flex flex-column-reverse">
            <img className="d-none" src={userManagment} alt="notFound" />
            <img className="d-none" src={notificationMessage} alt="notFound" />
          </div>
          <div className="col-3"></div>
          <div className="col-4 ">
            <div className="card signIn text-white">
              <div className="card-body text-center loginPadding">
                <div className="mb-md-5 mt-md-4">
                  {/* <Link to={"/"} className="navbar-brand"> */}
                  <h1 className="adminForgot">Forgot Your Password</h1>
                </div>
                {/* <div className="mt-4"> */}
                <p className="mb-4">
                  Select which contact details <br /> Should we use to reset your password
                  {/* </div> */}
                  <form className="mt-4" onSubmit={(e) => forgotButton(e)}>
                    <input
                      required
                      type="text"
                      name="centerPlaceHolder"
                      onChange={(e) => setEmailValue(e.target.value)}
                      className="forgotEmail col-12"
                      placeholder="Enter Your Email"
                    />

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <button type="submit" className="btn mt-4 col-8 btnLoginSubmit">
                      Send Code
                    </button>
                  </form>{" "}
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="col-4"></div>
          <div className="row">
            <img className="loginFooterCss" src={footer} alt="notFound" />
          </div>
        </div>
      </div>
      {/* </section> */}
    </div>
  );
};

export default Forgotpassword;
