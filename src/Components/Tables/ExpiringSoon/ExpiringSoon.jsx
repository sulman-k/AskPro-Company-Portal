import React, { useEffect, useState, useCallback } from "react";
import Nav from "../../Navigation/Navbar/Nav";
import Sidebar from "../../Navigation/Sidebar/Sidebar";
import Footer from "../../Navigation/Footer/Footer";
// import Table from "react-bootstrap/Table";
import "./ExpiringSoon.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { borderLeft } from "@mui/system";
import { Link, useSearchParams } from "react-router-dom";
// Full screen
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ExpiringSoonAPI, RebidRequestsAPI } from "../../../api/Services";
import moment from "moment";
// images
import LoaderAnimation from "../../Loader/LoaderAnimation";
import Icon_map_expand from "../../../Assets/Images/Icon_map_expand.png";

var state = {
  options: [
    { name: "Option 1", id: 1 },
    { name: "Option 2️", id: 2 },
  ],
};

const column = [
  {
    id: "clientName",
    label: "Client Name",
    minWidth: 170,
    align: "left",
    childalign: "left",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 130,
    align: "left",
    childalign: "left",
  },
  {
    id: "businessType",
    label: "Business Type",
    minWidth: 170,
    align: "left",
    childalign: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "expirationDate",
    label: "Expiration Date",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "lastEstimateValue",
    label: "Estimate Total",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
    childalign: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(
  clientName,
  address,
  businessType,
  expirationDate,
  status,
  lastEstimateValue,
  action
) {
  return {
    clientName,
    address,
    businessType,
    expirationDate,
    status,
    lastEstimateValue,
    action,
  };
}

const ExpiringSoon = (props) => {
  const [dataTableManageEstimatorList, setDataTableManageEstimatorList] = useState([]);
  const [animation, setAnimation] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  // const status = searchParams.get("status") || '';

  useEffect(async () => {
    await manageEstimator();
  }, []);

  const manageEstimator = async () => {
    setAnimation(true);
    let response = await ExpiringSoonAPI();
    //debugger;
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

  for (let data of dataTableManageEstimatorList) {
    // rows.push(createData(data.name, data.jobcompleted,data.rating,data.rejectionratio,data.company,data.avgjobtime, <Link to={`/UpdateEstimators`}> <Button className="btn-sm buttoninside w-75 buttonColor">Edit</Button> </Link>));
    rows.push(
      createData(
        data.client_name,
        data.address,
        data.business_type,
        moment.utc(data.expiry).format("MMM Do, YYYY"),
        // data.expiry,
        data.status,
        data.lastEstimateValue,
        <span
          // onClick={() => getId(data)}
          className="btn-sm buttonView w-75 "
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

  const moveTop = () => {
    // Scrolling to the top of the page after submitting
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <div className="col-12 ">
      <div className="card ExpiringSoonCard">
        <div className="card-title incomingBar">
          <span className="FontSizeAllEstimators">Expiring Soon</span>

          <form className="form-inline col-lg-5 searchBarRecentEstimates justify-content-end">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* <img onClick={handle.enter} src={Icon_map_expand} /> */}
            {props.icon ? (
              <Link to="/ExpiringSoon">
                <img src={Icon_map_expand} alt={"Not Found"} />
              </Link>
            ) : (
              <span hidden></span>
            )}
            &nbsp;
          </form>
        </div>
        {props.moveup ? moveTop() : <p hidden></p>}

        <div className="card-body text-center">
          {/* Table start */}
          {/* <FullScreen handle={handle}> */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table hover={true} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
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
                {animation == false ? (
                  rows.length ? (
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
                                    style={{ color: "gray", fontWeight: "bold" }}
                                    className="tableContentCenter "
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

export default ExpiringSoon;
