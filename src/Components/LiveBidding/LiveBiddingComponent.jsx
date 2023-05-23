/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './LiveBiddingComponent.css';
import liveBid from '../../Assets/Images/LiveBidding.png';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LoaderAnimation from '../../Components/Loader/LoaderAnimation';
// import RecentEstimatesAPI from "../../api/Services/RecentEstimatesAPI";
import { RecentEstimatesAPI } from '../../api/Services';
import { useNavigate } from 'react-router-dom';

// const TableCell = withStyles({
//     root: {
//       borderBottom: "none"
//     }
//   })(MuiTableCell);

// Headers
const column = [
  { id: 'clientName', label: 'Client Name', minWidth: 100, align: 'center' },
  {
    id: 'estimatorName',
    label: 'Estimator Name',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'makeEstimate',
    label: 'Make Estimate',
    minWidth: 100,
    align: 'center',
  },
];

function createData(clientName, estimatorName, makeEstimate) {
  // const density = population / size;
  return {
    clientName,
    estimatorName,
    makeEstimate,
  };
}

const dummyData = [
  { client_name: '', estimator_name: 'Something Went Wrong', status: '' },
];

const LiveBiddingComponent = () => {
  let rows = [];
  const navigate = useNavigate();

  // Hooks
  const [animation, setAnimation] = useState(true);
  const [dataTableManageEstimatorList, setDataTableManageEstimatorList] =
    useState([]);

  //! useEffects

  useEffect(async () => {
    window.scrollTo(0, 0);
    await manageEstimator();
  }, []);

  //! End Of Use Effect

  const manageEstimator = async () => {
    setAnimation(true);
    // try {
    let response = await RecentEstimatesAPI('live');
    if (response.success) {
      // debugger;
      setDataTableManageEstimatorList(response.estimates);
      setAnimation(false);
    } else {
      setDataTableManageEstimatorList(dummyData);
      setAnimation(false);
    }
  };

  // NAVIGATE TO QUOTATTION

  const LinkToQuotations = (e, id, clientId, data) => {
    navigate('/quotation', {
      state: {
        ID: id,
        clientID: clientId,
        FullData: data,
      },
    });
  };

  return (
    <div className="col-12 mb-4 ">
      <div className="card ExpiringSoonCard">
        <div className="card-title incomingBar">
          <span className="FontSizeAllEstimators">Live Bidding</span>
          <img className="floatRight" src={liveBid} alt="Image Not found" />
        </div>

        <div className="card-body text-center ">
          <div className="row">
            <div className="col-4">
              <span className="liveHeaders">Client Name</span>
            </div>
            <div className="col-4">
              <span className="liveHeaders">Estimator Name</span>
            </div>
            <div className="col-4">
              <span className="liveHeaders">Make Estimate</span>
            </div>
          </div>

          {!animation ? (
            dataTableManageEstimatorList.map((item) => (
              <div className="row mt-4">
                <div className="col-4">
                  <span className="liveBody ">{item.client_name}</span>
                </div>

                <div className="col-4">
                  <span className="liveBody">{item.estimator_name}</span>
                </div>
                <div className="col-4">
                  <span
                    onClick={(e) =>
                      LinkToQuotations(e, item.estimatorId, item.clientId, item)
                    }
                    className="btn col-4 btnLive">
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <LoaderAnimation />
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingComponent;
