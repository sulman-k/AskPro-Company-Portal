/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import Table from "react-bootstrap/Table";
import "./RecentEstimates.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
// images
import LoaderAnimation from "../../Loader/LoaderAnimation";
import Icon_map_expand from "../../../Assets/Images/Icon_map_expand.png";
import { RecentEstimatesAPI, searchAPI } from "../../../api/Services";
// Full screen
import moment from "moment";
import { useDispatch } from "react-redux";
import { recentEstimatesFilter } from "../../../Redux/Actions/Action";
import { IsAuthorized } from "../../../Auth/Authorization";

const column = [
  { id: "client_name", label: "Client Name", minWidth: 170, align: "left" },
  {
    id: "estimatorName",
    label: "Estimator Name",
    minWidth: 100,
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 150,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "businessType",
    label: "Business Type",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "timeStamp",
    label: "Time Stamp",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "left",
    childalign: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "left",
    childalign: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(client_name, estimatorName, address, businessType, timeStamp, status, action) {
  // const density = population / size;
  return {
    client_name,
    estimatorName,
    address,
    businessType,
    timeStamp,
    status,
    action,
  };
}
let previousDropdownValue = "";

// ! Export This statusExport to service file
// export let statusEXPORT;
const RecentEstimates = (props) => {
  const isViewEstimate = IsAuthorized("estimate").view;
  const [dataTableManageEstimatorList, setDataTableManageEstimatorList] = useState([]);
  const [animation, setAnimation] = useState(true);
  const [status, setStatus] = useState("");
  // const status = searchParams.get("status") || '';
  const dispatch = useDispatch();

  useEffect(async () => {
    await manageEstimator("");
  }, []);

  const manageEstimator = async (status) => {
    setAnimation(true);
    let response = await RecentEstimatesAPI(status);
    //debugger
    if (response.success) {
      setDataTableManageEstimatorList(response.estimates);
      setAnimation(false);
    } else {
      setAnimation(false);
      setDataTableManageEstimatorList([]);
    }
  };

  // useEffect(() => {
  //   if (dataTableManageEstimatorList.length < 1) {
  //   } else {
  //   }
  // });

  let rows = [];
  const navigate = useNavigate();

  const LinkToQuotations = (e, id, clientId, data) => {
    navigate("/quotation", {
      state: {
        ID: id,
        clientID: clientId,
        FullData: data,
      },
    });
  };

  const viewRecent = (data) => {
    if (isViewEstimate) {
      navigate("/RecentOfferas", {
        state: {
          FullData: data,
        },
      });
    } else {
      toast.error("You are not authorized to view estimate");
    }
  };

  for (let data of dataTableManageEstimatorList) {
    // rows.push(createData(data.name, data.jobcompleted,data.rating,data.rejectionratio,data.company,data.avgjobtime, <Link to={`/UpdateEstimators`}> <Button className="btn-sm buttoninside w-75 buttonColor">Edit</Button> </Link>));
    rows.push(
      createData(
        data.client_name,
        data.estimator_name,
        data.company_details[0]?.address,
        data.company_details[0]?.businessType,
        moment.utc(data.updatedAt).format("MMM Do, YYYY"),

        data.status === "live" ? (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={(e) => LinkToQuotations(e, data.estimatorId, data.clientId, data)}
          >
            {data.status}
          </span>
        ) : data.status === "terminated" ? (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={(e) => LinkToQuotations(e, data.estimatorId, data.clientId, data)}
          >
            {data.status}
          </span>
        ) : (
          <p>{data.status}</p>
        ),
        <span
          onClick={() => viewRecent(data)}
          className="btn-sm buttonView pointer w-75 "
          style={{ color: "#29ABE2" }}
        >
          View
        </span>
      )
    );
  }

  // material ui tables for pages
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dropDown = async (status) => {
    if (previousDropdownValue === status) {
      // When user select previous value
    } else {
      // when user select new value
      previousDropdownValue = status;
      dispatch(recentEstimatesFilter(status));
      setStatus(status);
      await manageEstimator(status);
    }
  };

  const moveTop = () => {
    // Scrolling to the top of the page after submitting
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const searchValues = async (e) => {
    if (e.length > 1) {
      // setSearchValue(e);
      try {
        let searchResponse = await searchAPI(status, e);
        if (searchResponse.success) {
          setDataTableManageEstimatorList(searchResponse.result);
          setAnimation(false);
        } else {
          setAnimation(false);
          setDataTableManageEstimatorList([]);
        }
      } catch (error) {
        toast.error("something went wrong");
      }
    } else {
      manageEstimator(status);
    }
  };

  return (
    <div className="col-12">
      <div className="card recentEstimatesCard">
        <div className="card-title incomingBar">
          <span className="FontSizeAllEstimators">Recent Estimates</span>
          <form className="form-inline  searchBarRecentEstimatesSearch">
            {props.searchBar ? (
              <input
                className="form-control  inputIcon mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => searchValues(e.target.value)}
              />
            ) : (
              <span hidden></span>
            )}
            &nbsp;&nbsp;&nbsp;
            <select onClick={(e) => dropDown(e.target.value)} id="cars" className="buttonColorr">
              <option value="">&nbsp;&nbsp;Select All</option>
              <option value="in_rebid">&nbsp;&nbsp;In Rebid</option>
              <option value="pending">&nbsp;&nbsp;Pending</option>
              <option value="accepted">&nbsp;&nbsp;Accepted</option>
              <option value="rejected">&nbsp;&nbsp;Rejected</option>
              <option value="scheduled">&nbsp;&nbsp;Scheduled </option>
              <option value="live">&nbsp;&nbsp;Live</option>
              <option value="expiring_soon">&nbsp;&nbsp;Expiring soon</option>
              <option value="in_progress">&nbsp;&nbsp;In Progress</option>
              <option value="terminated">&nbsp;&nbsp;Terminated</option>
              <option value="revise">&nbsp;&nbsp;Revise</option>
            </select>
            {props.icon ? (
              <Link to="/RecentEstimates">
                <img src={Icon_map_expand} alt={"Not Found"} />
              </Link>
            ) : (
              <span hidden></span>
            )}
          </form>
        </div>
        {props.moveup ? moveTop() : <p hidden></p>}
        <div className="card-body text-center ">
          {/* Table start */}
          {/* <FullScreen handle={handle}> */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 740 }}>
              <Table hover={true} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow className="text-center">
                    {column.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {animation === false ? (
                  dataTableManageEstimatorList.length ? (
                    <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "20%",
                              }}
                            >
                              {column.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    style={{
                                      fontWeight: "bold",
                                      color: "gray",
                                    }}
                                    key={column.id}
                                    align={column.childalign}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  ) : (
                    <h3 className="mt-4">No Data Found</h3>
                  )
                ) : (
                  <div className="loaderCenter">
                    <LoaderAnimation size={100} />
                  </div>
                )}
              </Table>
            </TableContainer>
            {props.paginator ? (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : (
              <p hidden></p>
            )}
          </Paper>
          {/* </FullScreen> */}
          {/* Table end */}
        </div>
      </div>
    </div>
  );
};

export default RecentEstimates;
