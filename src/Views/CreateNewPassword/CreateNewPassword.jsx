import React, { useState } from "react";

import userManagment from "../../Assets/Images/Group 3512.png";
import notificationMessage from "../../Assets/Images/Group 3565.png";
import { Link, useNavigate } from "react-router-dom";
import cleanAsk from "../../Assets/Images/Group 3072.png";
import footer from "../../Assets/Images/Group 3071.png";
import "./CreateNewPassword.css";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { SendNewPassword } from "../../api/Services";
import { toast } from "react-toastify";

const CreateNewPassword = () => {
  let navigate = useNavigate();
  const email = useSelector((state) => state.isNewPwdEmail);
  const [values, setValues] = useState({
    password: "",
    password2: "",
    showPassword1: false,
    showPassword2: false,
  });

  // Functions
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword1: !values.showPassword1,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange2 = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword2 = () => {
    setValues({
      ...values,
      showPassword2: !values.showPassword2,
    });
  };

  const handleMouseDownPassword2 = (e) => {
    e.preventDefault();
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    if (values.password !== "" && values.password === values.password2) {
      var data = JSON.stringify({
        email: email,
        password: values.password,
      });
      try {
        let sendNewPasswordResponse = await SendNewPassword(data);
        if (sendNewPasswordResponse.success) {
          navigate("/passwordreset", { replace: true });
        } else {
          toast.error("sendNewPasswordResponse is not valid");
        }
      } catch (error) {
        toast.error("Something went wrong", error);
      }
    } else {
      toast.error("Please enter your password correctly");
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
                  <h1 className="adminRecover">Create New Password</h1>
                </div>
                {/* <div className="mt-4"> */}
                <p>
                  Set your new password so you can login <br />
                  and Access .
                </p>
                {/* </div> */}
                <div className="">
                  <form className="recoverForm">
                    <div className="row mt-4 newPasswordClass">
                      <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
                        <InputLabel style={{ color: "white" }} htmlFor="filled-adornment-password">
                          Create new password
                        </InputLabel>
                        <FilledInput
                          id="filled-adornment-password"
                          style={{ color: "white" }}
                          type={values.showPassword1 ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange("password")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {values.showPassword1 ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>
                    <div className="row mt-4  newPasswordClass">
                      <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
                        <InputLabel style={{ color: "white" }} htmlFor="filled-adornment-password2">
                          Confirm new password
                        </InputLabel>
                        <FilledInput
                          id="filled-adornment-password2"
                          type={values.showPassword2 ? "text" : "password"}
                          value={values.password2}
                          onChange={handleChange2("password2")}
                          style={{ color: "white" }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password2 visibility"
                                onClick={handleClickShowPassword2}
                                onMouseDown={handleMouseDownPassword2}
                                edge="end"
                              >
                                {values.showPassword2 ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>
                    <button
                      onClick={(e) => submitNewPassword(e)}
                      value="submit"
                      type="submit"
                      className="btn mb-4 mt-4 col-12 btnLoginSubmit"
                    >
                      Reset Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="col-4"></div>
          <div className="row">
            <img className="footerPic" src={footer} alt="notFound" />
          </div>
        </div>
      </div>
      {/* </section> */}
    </div>
  );
};

export default CreateNewPassword;
