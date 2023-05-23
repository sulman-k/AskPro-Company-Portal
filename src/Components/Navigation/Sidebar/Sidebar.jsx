import React from "react";
import "./Sidebar.css";
import Badge from "@mui/material/Badge";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "../../../Assets/Images/DashboardIcon.png";
import DashMessagesIcon from "../../../Assets/Images/DashMessagesIcon.png";
import DashBellIcon from "../../../Assets/Images/DashBellIcon.png";
import DashWindow from "../../../Assets/Images/DashWindow.png";
import DashMan from "../../../Assets/Images/DashMan.png";
import DashFile from "../../../Assets/Images/DashFile.png";
import DashFile2 from "../../../Assets/Images/DashFile2.png";
import Questionare from "../../../Assets/Images/Questionare.png";
import { IsAuthorized } from "../../../Auth/Authorization";
import userManagementIcon from "../../../Assets/Images/Group 3511.png";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// import { getConversationList } from "../../../api/Services";

function Sidebar(props) {
  let navigate = useNavigate();
  const notificationsCounting = useSelector((state) => state.notificationCountReducer);
  const isViewQuestionare = IsAuthorized("questionaire").view;
  const isViewUserMang = IsAuthorized("user").view;

  function category() {
    if (isViewQuestionare) {
      navigate("../Category_Main", { replace: true });
    } else {
      toast.error("You are not authorized to view questionares");
    }
  }

  function allestimates() {
    navigate("../AllEstimators", { replace: true });
  }

  function NotificationButton() {
    navigate("../Notifications", { replace: true });
  }

  function allestimates() {
    navigate("../AllEstimators", { replace: true });
  }
  const userManagement = () => {
    if (isViewUserMang) {
      navigate("../User-Management", { replace: true });
    } else {
      toast.error("You are not authorized to view Users");
    }
  };

  const messages = () => {
    navigate("../Messages", { replace: true });
  };

  return (
    <div className="text-white">
      <ul className="nav nav-pills d-flex align-items-center flex-column" id="menu">
        <li className="nav-item mt-4">
          <a className="nav-link align-middle px-0">
            <i className="fs-4 bi-house"></i>{" "}
            <span className="ms-1  d-sm-inline ">
              <Link to="/Dashboard">
                <img src={DashboardIcon} height={40} width={40} />
              </Link>
            </span>
          </a>
          Dashboard
        </li>

        <li className="mt-2" onClick={messages}>
          <Link to={"/Messages"} data-bs-toggle="collapse" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-speedometer2"></i>{" "}
            <span className="ms-1  d-sm-inline">
              <img src={DashMessagesIcon} height={40} width={40} />
            </span>{" "}
          </Link>
          Messages
        </li>
        <li className="mt-2">
          <a href="#" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-table"></i>{" "}
            <span className="ms-1  d-sm-inline">
              <Badge
                badgeContent={notificationsCounting ? notificationsCounting : 0}
                color={"warning"}
                overlap="circular"
                showZero
              >
                {" "}
                <img onClick={NotificationButton} src={DashBellIcon} height={40} width={40} />
              </Badge>
            </span>
          </a>
          Notification
        </li>

        <li className="mt-2 nav-item pointer">
          <span className="pointer nav-link px-0 align-middle">
            <i className="fs-4 bi-table"></i>{" "}
            <span className="ms-1  d-sm-inline">
              {" "}
              <img onClick={category} src={Questionare} height={40} width={40} />
            </span>
          </span>
          Questionare
        </li>

        <li className="mt-2 nav-item pointer">
          <span className="pointer nav-link px-0 align-middle">
            <i className="fs-4 bi-table"></i>{" "}
            <span className="ms-1  d-sm-inline">
              {" "}
              <img onClick={userManagement} src={userManagementIcon} height={40} width={40} />
            </span>
          </span>
          User Management
        </li>

        <li className="mt-2">
          <a href="#" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-table"></i>{" "}
            <span className="ms-1  d-sm-inline">
              {" "}
              <img src={Questionare} height={40} width={40} />
            </span>
          </a>
          Notification Management
        </li>

        <li className="mt-2">
          <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
            <i className="fs-4 bi-bootstrap"></i>{" "}
            <span className="ms-1 d-sm-inline">
              <img onClick={allestimates} src={DashWindow} height={40} width={40} />
            </span>
          </a>
        </li>

        <li className="mt-2">
          <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-grid"></i>{" "}
            <span className="ms-1  d-sm-inline">
              <img src={DashMan} height={40} width={40} />
            </span>{" "}
          </a>
        </li>

        <li className="mt-2">
          <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-grid"></i>{" "}
            <span className="ms-1  d-sm-inline">
              <img onClick={allestimates} src={DashFile} height={40} width={40} />
            </span>{" "}
          </a>
        </li>

        <li className="mt-2">
          <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
            <i className="fs-4 bi-grid"></i>{" "}
            <span className="ms-1  d-sm-inline">
              <img src={DashFile2} height={40} width={40} />
            </span>{" "}
          </a>
        </li>
      </ul>{" "}
    </div>
  );
}

Sidebar.propTypes = {};

export default Sidebar;
