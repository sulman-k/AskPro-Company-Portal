import React from "react";
import "./Nav.css";
import Badge from "@mui/material/Badge";

import { GiLoveInjection } from "react-icons/gi";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Button } from "bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { isLoggedAction } from "../../../Redux/Actions/Action";
import { roleAdminAction } from "../../../Redux/Actions/Action";
import cleanAsk from "../../../Assets/Images/Group 3072.png";
// Icons

import bellIcon from "../../../Assets/Images/bellIcon.png";
import messageIcon from "../../../Assets/Images/messageIcon.png";
import { getConversationList } from "../../../api/Services";
import { toast } from "react-toastify";
export const Nav = () => {
  const notificationsCounting = useSelector((state) => state.notificationCountReducer);
  const isLoggedIn = useSelector((state) => state.isLogged);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const myFunction = () => {
    // dispatch(isLoggedAction());

    dispatch(roleAdminAction());
    let empty = "";
    window.localStorage.clear();
    navigate("/", { replace: true });
  };

  function NotificationButton() {
    navigate("/Notifications", { replace: true });
  }

  const messages = async () => {
    navigate("../Messages", { replace: true });
  };

  return (
    <div className="row justify-content-around headerMarginBottom">
      {/* <div className="row justify-content-around"> */}
      <nav className="navbar navbar-expand-lg navbar-dark nav_color">
        <div className="container-fluid">
          <Link to="/Dashboard" className="navbar-brand">
            <img style={{ marginLeft: "-29%" }} src={cleanAsk} alt="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarSupportedContent">
            &emsp;
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <Link to="/AllEstimators" className="nav-link active" aria-current="page">
                  {" "}
                  &emsp; History &emsp;
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  {" "}
                  &emsp; Profile &emsp;
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  {" "}
                  &emsp; Support &emsp;
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  {" "}
                  &emsp; FAQ &emsp;
                </Link>
              </li>
            </ul>
            <div>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                &nbsp;&nbsp;
                <li className="nav-item">
                  <Badge
                    badgeContent={notificationsCounting ? notificationsCounting : 0}
                    color={"warning"}
                    overlap="circular"
                    showZero
                  >
                    <button type="button" className="btn">
                      <img onClick={NotificationButton} src={bellIcon} height={35} width={35} />
                    </button>
                  </Badge>
                </li>
                &nbsp;&nbsp;
                <li onClick={messages} className="nav-item">
                  <button type="button" className="btn">
                    <Link to={"/Messages"}>
                      {" "}
                      <img src={messageIcon} height={35} width={35} />
                    </Link>
                  </button>
                </li>
                &nbsp;&nbsp;
                <li className="nav-item">
                  <Link to="/">
                    <button className="btn button_color  btn-lg logoutbutton" onClick={myFunction}>
                      Log Out
                    </button>
                  </Link>
                </li>
                &nbsp;&nbsp;
                {/* <li className="nav-item">
                                    <button type="button" className="btn btn-secondary  btn-md">
                                        <AiFillDollarCircle size={34} className="icondollar" />
                                        <BiDotsVerticalRounded size={30} />
                                    </button>
                                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

Nav.propTypes = {};

export default Nav;
