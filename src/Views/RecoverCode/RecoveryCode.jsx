import React, { useState } from "react";

import userManagment from "../../Assets/Images/Group 3512.png";
import notificationMessage from "../../Assets/Images/Group 3565.png";
import { Link, useNavigate } from "react-router-dom";
import cleanAsk from "../../Assets/Images/Group 3072.png";
import footer from "../../Assets/Images/Group 3071.png";
import "./RecoveryCode.css";
import { useSelector } from "react-redux";
import { companyVerifyOtpAPI } from "../../api/Services";
import OTPInput, { ResendOTP } from "otp-input-react";
import { toast } from "react-toastify";

const RecoveryCode = () => {
  const email = useSelector((state) => state.isNewPwdEmail);
  let navigate = useNavigate();
  // useEffect
  const [OTP, setOTP] = useState("");

  // Functions
  const recoveryCodeSubmit = async (e) => {
    e.preventDefault();
    var data = JSON.stringify({
      email: email,
      otp: OTP,
    });

    try {
      let companyVerifyOtpResponse = await companyVerifyOtpAPI(data);
      if (companyVerifyOtpResponse.success) {
        navigate("/CreateNewPassword", { replace: true });
      } else {
        toast.error("companyVerifyOtpResponse is not valid");
      }
    } catch (error) {
      toast.error("Something went wrong", error);
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
          <div className="col-1 d-flex flex-column-reverse">
            <img src={userManagment} alt="notFound" />
            <img src={notificationMessage} alt="notFound" />
          </div>
          <div className="col-3"></div>
          <div className="col-4 ">
            <div className="card signIn text-white">
              <div className="card-body text-center loginPadding">
                <div className="mb-md-5 mt-md-4">
                  {/* <Link to={"/"} className="navbar-brand"> */}
                  <h1 className="adminRecover">Enter 4-Digit Recovery Code</h1>
                </div>
                {/* <div className="mt-4"> */}
                <p>
                  The recovery code was sent to your mobile number.
                  <br /> Please enter the code:
                </p>
                {/* </div> */}
                <div className="mt-4">
                  <form className="recoverForm">
                    <br />
                    <OTPInput
                      required
                      value={OTP}
                      onChange={setOTP}
                      autoFocus
                      OTPLength={4}
                      otpType="number"
                      disabled={false}
                      secure={false}
                      style={{ display: "flex", justifyContent: "center" }}
                      // inputClassName={{ border: "2px solid red" }}
                      inputStyles={{
                        border: "3px solid #427fb9",
                        borderRadius: "7px",
                        height: "50px",
                        width: "50px",
                        marginRight: "15px",
                        backgroundColor: "#171d2a",
                        color: "white",
                      }}
                    />

                    <br />
                    <br />
                    <button
                      onClick={(e) => recoveryCodeSubmit(e)}
                      className="btn mb-4 mt-4 col-8 btnLoginSubmit"
                    >
                      Next
                    </button>
                    <p className="mt-4 HelveticaRecovery">
                      Haven't received the code?{" "}
                      <span className="resendCodeColor">resend code</span>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="col-4"></div>
          <div className="row">
            <img src={footer} alt="notFound" />
          </div>
        </div>
      </div>
      {/* </section> */}
    </div>
  );
};

export default RecoveryCode;
