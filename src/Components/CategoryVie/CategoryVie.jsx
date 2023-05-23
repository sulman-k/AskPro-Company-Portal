import React from "react";
import { Link } from "react-router-dom";
import DashBoardSeacrhIcon from "../../Assets/Images/DashBoardSeacrhIcon.png";
import ManageClientsIcon from "../../Assets/Images/ManageClientsIcon.png";
import { useNavigate } from "react-router-dom";
import "./CategoryVie.css";

const CategoryVie = () => {
  let navigate = useNavigate();

  const navigation = () => {
    navigate("/Category", { replace: true });
  };

  return (
    <div className="col-12">
      <div className="card recentEstimatesCard">
        <div className="card-title incomingBar">
          <h6>Questionare</h6>
        </div>
        <div className="row mt-4 mb-4">
          <div className="col-6">
            <div className="categoryAlign align-items-stretch mb-2">
              <div onClick={navigation} className="card kpiCVCard ">
                {/* <Link > */}
                <button className="btn btn-light btnInsideCard">
                  <div className="card-body kpiCard ">
                    <div className="row">
                      <div className="col-3">
                        <div>
                          <img src={DashBoardSeacrhIcon} height="45y" width="50" />
                        </div>
                      </div>

                      <div className="col-9">
                        <h6 className="card-text ">Estimators Questionare</h6>
                      </div>
                    </div>
                  </div>
                </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className=" d-flex align-items-stretch mb-2">
              <div className="card kpiCVCard ">
                {/* <Link > */}
                <button className="btn btn-light btnInsideCard">
                  <div className="card-body kpiCard ">
                    <div className="row">
                      <div className="col-3">
                        <div>
                          <img src={ManageClientsIcon} height="45y" width="50" />
                        </div>
                      </div>

                      <div className="col-9">
                        <h6 className="card-text ">Clients Questionare</h6>
                      </div>
                    </div>
                  </div>
                </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryVie;
