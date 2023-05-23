import React from "react";
import { Link } from "react-router-dom";
import "./Kpi.css";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IsAuthorized } from "../../Auth/Authorization";

export default function Kpi(props, { size, color }) {
  let navigate = useNavigate();
  const isViewEtimator = IsAuthorized("estimator").view;
  const isViewCompany = IsAuthorized("company").view;

  function navegate(e) {
    e.preventDefault();
    if (props.id === "ManageEstimators") {
      if (isViewEtimator) {
        navigate("/manageestimators", { replace: true });
      } else {
        toast.error("You are not authorized to view etimators");
      }
    }
    if (props.id === "ManageBillingCompany") {
      if (isViewCompany) {
        navigate("/ManageBillingCompany", { replace: true });
      } else {
        toast.error("You are not authorized to view companies");
      }
    }
  }
  return (
    <div className="col-lg-2 col-md-4 col-sm-4 col-xs-6 d-flex align-items-stretch mb-2">
      <div className="card kpiMCard ">
        {/* <Link > */}
        <button id={props.id} onClick={navegate} className="btn btn-light btnInsideCard">
          <div className="card-body kpiCard ">
            <div className="row">
              <div className="col-3">
                <div size={size} fill={color}>
                  <img src={props.icon} height={props.height} width={props.width} />
                </div>
              </div>
              <div className="col-9">
                <h6 className="card-text ">{props.title}</h6>
              </div>
            </div>
          </div>
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
}
