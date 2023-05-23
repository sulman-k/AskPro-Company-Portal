import React, { useState, useEffect } from "react";
import { MdPersonAddAlt } from "react-icons/md";
import { Button } from "react-bootstrap";
import {
  GetCompanyDetailsAPI,
  ManageBillingCompanyAPI,
  ManageEstimatorsAPI,
} from "../../api/Services";
import "./ManageBillingCompany.css";

// MUI Tables
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// ICON

import ManageBillingCompanyPlusIcon from "../../Assets/Images/ManageBillingCompanyPlusIcon.png";
import LoaderAnimation from "../Loader/LoaderAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import debug from "react-scroll-to-bottom/lib/utils/debug";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { IsAuthorized } from "../../Auth/Authorization";
import { useNavigate } from "react-router-dom";

// domain store

localStorage.setItem("Domain", "com.some.rpa.extension.anotherone");

const columns = [
  { id: "name", label: "Name", minWidth: 150 },
  {
    id: "jobcompleted",
    label: "Jobs Completed",
    minWidth: 100,
    align: "center",
  },
  {
    id: "rating",
    label: "Rating",
    minWidth: 100,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "rejectionratio",
    label: "Rejection Ratio",
    minWidth: 150,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "AvgEstimate",
    label: "Avg. Estimate",
    minWidth: 150,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 120,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "AvgJobtime",
    label: "Avg, Job time",
    minWidth: 120,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 150,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];
function createData(
  name,
  jobcompleted,
  rating,
  rejectionratio,
  AvgEstimate,
  status,
  AvgJobtime,
  action
) {
  // const density = population / size;
  return {
    name,
    jobcompleted,
    rating,
    rejectionratio,
    AvgEstimate,
    status,
    AvgJobtime,
    action,
  };
}

export const ManageBillingCompany = () => {
  const authUser = useAuthUser();
  const navigate = useNavigate();
  let rows = [];
  let newRows = [];
  const [val, setVal] = useState(0);
  const [icon, setIcon] = useState(faSort);

  const [dataTableManageEstimatorList, setDataTableManageEstimatorList] = useState([]);

  const [animation, setAnimation] = useState(true);

  const [rowComp, setRowComp] = useState([]);
  const isViewCompany = IsAuthorized("company").view;
  useEffect(() => {
    if (isViewCompany) {
      manageEstimator();
    } else {
      toast.error("You are not authorized to view companies");
      navigate("/Dashboard");
    }
  }, []);

  const manageEstimator = async () => {
    let response = await ManageBillingCompanyAPI("");
    try {
      if (response.success) {
        setDataTableManageEstimatorList(response.companies);
        setAnimation(false);
      } else {
        setDataTableManageEstimatorList([]);
        setAnimation(false);
      }
    } catch (error) {
      toast.error(error.msg);
      setAnimation(false);
      setDataTableManageEstimatorList([]);
    }
  };

  const isAddComapny = IsAuthorized("company").create;
  const isUpdateCompany = IsAuthorized("company").update;
  const getId = async (data) => {
    if (isUpdateCompany) {
      try {
        toast.info("wait a minute while collecting data");
        const response = await GetCompanyDetailsAPI(data._id);
        if (response.success) {
          navigate("/EditManageBillingCompany", {
            state: {
              fullData: response.company,
              name: response.company.name,
              domain: response.company.domain,
              username: response.company.username,
              address: response.company.address,
              contact: response.company.contact,
              pocEmail: response.company.pocEmail,
              pocName: response.company.pocName,
              pocContact: response.company.pocContact,
              tax: response.company.tax,
              url: response.company.url,
              jobcompleted: response.company.jobcompleted,
              rating: response.company.rating,
              rejectionratio: response.company.rejectionratio,
              AvgEstimate: response.company.AvgEstimate,
              status: response.company.status,
              AvgJobtime: response.company.AvgJobtime,
              businessType: response.company.businessType,
              pocContactRole: response.company.pocContactRole,

              photoid: response.company.photoID,
              picture: response.company.picture,
              certificateImages: response.company.certificateImages,

              banks: response.company.businessOffered.banks,
              church: response.company.businessOffered.church,
              goldCourse: response.company.businessOffered.goldCourse,
              gyms: response.company.businessOffered.gyms,
              mosques: response.company.businessOffered.mosques,

              cleaning: response.company.servicesOffered.cleaning,
              disinfecting: response.company.servicesOffered.disinfecting,
              lockers: response.company.servicesOffered.lockers,
              polishing: response.company.servicesOffered.polishing,
              window: response.company.servicesOffered.window,
            },
          });
        } else {
          toast.error("something went wrong");
        }
      } catch (error) {
        toast.error(error.message || error.msg);
      }
    } else {
      toast.error("You are not authorized to update Company");
    }
  };

  for (let data of dataTableManageEstimatorList) {
    // rows.push(createData(data.name, data.jobcompleted,data.rating,data.rejectionratio,data.company,data.avgjobtime, <Link to={`/UpdateEstimators`}> <Button className="btn-sm buttoninside w-75 buttonColor">Edit</Button> </Link>));
    // if (rows.length < 5) {

    rows.push(
      createData(
        data.name,
        data.jobs_completed,
        parseFloat(data.rating).toFixed(2),
        parseFloat(data.rejection_ratio).toFixed(2),
        parseFloat(data.avg_estimate).toFixed(2),
        data.status,
        data.avg_job_time,
        <Button onClick={() => getId(data)} className="btn-sm buttoninside w-75 buttonColor">
          Edit
        </Button>
      )
    );
  }

  const sortFunc = (rows) => {
    setVal(val + 1);
    if (val % 2) {
      setIcon(faSortUp);
      newRows = rows.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else {
      setIcon(faSortDown);
      newRows = rows.sort(function (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    rows = newRows;
    setRowComp(rows);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const AddBillingCompaniesF = () => {
    if (isAddComapny) {
      navigate("/AddBillingCompanies");
    } else {
      toast.error("You are not authorized to add Company");
    }
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const handleSearch = debounce(async (e) => {
    e.preventDefault();
    setAnimation(true);

    let response = await ManageBillingCompanyAPI(e.target.value.toLowerCase());
    try {
      if (response.success) {
        setDataTableManageEstimatorList(response.companies);
        setAnimation(false);
      } else {
        setDataTableManageEstimatorList([]);
        setAnimation(false);
      }
    } catch (error) {
      toast.error(error.msg);
      setAnimation(false);
      setDataTableManageEstimatorList([]);
    }
  }, 500);

  return (
    <div className="col-12">
      <div className="card ManageBillingCompanyCard">
        {/* <div className="card-title incomingBar">
          <span className="ManageBillingCompanyListCss">&nbsp; Manage Billing Company List</span>
          <span className="pointer" onClick={AddBillingCompaniesF}>
            <img src={ManageBillingCompanyPlusIcon} className="manageEstimatorIconBilling" />
          </span>
        </div> */}
        <div className="card-title incomingBar">
          <h6>&nbsp; Manage Billing Company List</h6>
          <form className="form-inline  searchBarRecentEstimatesSearch" style={{ right: "3%" }}>
            <input
              style={{ marginLeft: "-15%" }}
              className="form-control  mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => handleSearch(e)}
            />
          </form>
          <span className="pointer" onClick={AddBillingCompaniesF}>
            <img src={ManageBillingCompanyPlusIcon} className="manageEstimatorIcon" alt="" />
          </span>
        </div>
        <div className="card-body">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          // fontSize: 18,
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}{" "}
                        {column.id === "name" ? (
                          <FontAwesomeIcon onClick={() => sortFunc(rows)} icon={icon} />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {animation == false ? (
                  <TableBody>
                    {val === 0 ? (
                      rows.length ? (
                        rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell
                                      // style={{alignItems:'left'}}
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {column.format && typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })
                      ) : (
                        <h1>No Data Found </h1>
                      )
                    ) : (
                      rowComp
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];

                                return (
                                  <TableCell
                                    // style={{alignItems:'left'}}
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                ) : (
                  <div className="loaderCenter">
                    <LoaderAnimation size={100} />
                  </div>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};
