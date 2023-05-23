import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isLoggedAction } from "../../Redux/Actions/Action";
import { roleAdminAction } from "../../Redux/Actions/Action";
import { roleNormalAction } from "../../Redux/Actions/Action";
import { getPermissionApi, getUsersListUserName, logIn } from "../../api/Services";
import LoaderAnimation from "../../Components/Loader/LoaderAnimation";
import cleanAsk from "../../Assets/Images/Group 3072.png";
import userName from "../../Assets/Images/username.png";
import password from "../../Assets/Images/password.png";
import footer from "../../Assets/Images/Group 3071.png";
import userManagment from "../../Assets/Images/Group 3512.png";
import notificationMessage from "../../Assets/Images/Group 3565.png";
import "./Login.css";
import { useCookies } from "react-cookie";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";

var qs = require("qs");

export let roled;
export const Login = () => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();

  const [cookies, setCookie] = useCookies(["userNameCookie", "passwordCookie"]);
  const [loginError, setLoginError] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  useSelector((state) => state.isAdmin);
  useSelector((state) => state.isUser);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const buttonHide = () => {
    setLoginError(false);
  };

  const myFunction = async (e) => {
    e.preventDefault();
    setLoginPending(true);
    var UserEmail = document.getElementById("typeEmailX").value;
    var UserPassword = document.getElementById("typePasswordX").value;

    // getting token and auth from API
    var data1 = qs.stringify({
      grant_type: "password",
      username: UserEmail,
      password: UserPassword,
      scope: "admin_access",
    });
    var data = qs.stringify({
      grant_type: "password",
      username: UserEmail,
      scope: "admin_access",
    });

    let role;

    var response = {};
    var error = "";
    try {
      response = await logIn(data1);
      localStorage.setItem("token", response.access_token);
      const rolesPermission = await getPermissionApi(UserEmail);
      role = rolesPermission.permission;
      const { access_token, refresh_token, scope, token_type } = response;
      const authState = {
        username: UserEmail,
        data,
        role,
      };

      if (
        signIn({
          token: access_token,
          expiresIn: "3600",
          tokenType: "Bearer",
          refreshToken: refresh_token,
          scope,
          authState,
        }) &&
        response.access_token
      ) {
        //api call to get roles

        if (rolesPermission.success) {
          // end testing
          localStorage.setItem("refresh_token", response.refresh_token);
          localStorage.setItem("scope", response.scope);
          localStorage.setItem("token_type", response.token_type);
          setLoginPending(false);

          warningFunction();

          navigate("../Dashboard", { replace: true });

          dispatch(roleAdminAction());
        } else {
          toast.error("Failed to login");
          setLoginPending(false);
          localStorage.clear();
          navigate("/");
        }
      } else {
        setLoginError(true);
        setLoginPending(false);
        setTimeout(() => {
          setLoginError(false);
        }, 4000);
      }
    } catch (err) {
      error = err.message;
    }
  };

  const warningFunction = () => {
    setTimeout(() => {
      toast.warning("Your token will expire in 5 minutes. Please save your work and login again");
    }, 3300000);
  };

  const rememberMe = () => {
    var UserEmailForCookie = document.getElementById("typeEmailX").value;
    var UserPasswordForCookie = document.getElementById("typePasswordX").value;
    var remember = document.getElementById("rememberMe");

    if (remember.checked) {
      setCookie("userNameCookie", UserEmailForCookie, { path: "/" });
      setCookie("passwordCookie", UserPasswordForCookie, { path: "/" });
    } else {
      setCookie("userNameCookie", "", { path: "/" });
      setCookie("passwordCookie", "", { path: "/" });
    }
  };

  return (
    <div className="row loginComponent">
      <div className="container h-100">
        <div className="row mt-4">
          <div className="col-2">
            <img src={cleanAsk} alt="" />
          </div>
          <div className="col-8">
            <span className="adminSignIN">Admin Sign In</span>
          </div>
        </div>
        <div className="row d-flex justify-content-center mt-4 h-100">
          <div className="col-1 d-flex flex-column-reverse"></div>
          <div className="col-3"></div>
          <div className="col-4 ">
            <div className="card signIn text-white">
              <div className="card-body text-center loginPadding">
                <Link to={"/"} className="navbar-brand">
                  <h1 className="adminSignIN">SIGN IN</h1>
                </Link>

                <div className="mt-4"></div>
                {loginError ? (
                  <div
                    className="alert alert-danger alert-dismissible fade show col-12 "
                    role="alert"
                  >
                    <h6 className="estimatorHHeading">Invalid username or Password</h6>
                    <button onClick={buttonHide} type="button" className="btn-close"></button>
                  </div>
                ) : (
                  <p hidden></p>
                )}

                <form style={{ width: "-webkit-fill-available" }} onSubmit={myFunction}>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      required
                      id="typeEmailX"
                      className="form-control inputBg form-control-lg Helvetica textCenter"
                      name="centerPlaceHolder"
                      placeholder="User Name"
                      defaultValue={cookies.userNameCookie ? `${cookies.userNameCookie}` : ""}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      required
                      name="centerPlaceHolder"
                      type="password"
                      id="typePasswordX"
                      className="form-control inputBg form-control-lg Helvetica textCenter"
                      placeholder="Password"
                      defaultValue={cookies.passwordCookie ? `${cookies.passwordCookie}` : ""}
                    />
                  </div>
                  <div className="row EurostileBoldCSS">
                    <div className="col-6">
                      <label onClick={() => rememberMe()}>
                        <input
                          type="checkbox"
                          checked={cookies.passwordCookie && cookies.userNameCookie ? true : false}
                          id="rememberMe"
                        />
                        &nbsp;Remember me
                      </label>
                    </div>
                    <Link className="col-6 forgotPassword" to={"/ForgotPassword"}>
                      <div>Forgot Password?</div>
                    </Link>
                  </div>

                  {!loginPending ? (
                    <button className="btn mt-4 col-12 btnLoginSubmit" value="submit" type="submit">
                      Sign in
                    </button>
                  ) : (
                    <LoaderAnimation />
                  )}
                </form>
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
export default Login;
