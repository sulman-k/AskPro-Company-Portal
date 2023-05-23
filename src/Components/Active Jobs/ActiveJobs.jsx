import React from "react";
import "./ActiveJobs.css";
import Table from "react-bootstrap/Table";

const ActiveJobs = () => {
  return (
    <div className="card activeJobsCard mt-4">
      <div>
        <h6 className="card-title activeJobsBar">Active Jobs</h6>
      </div>
      <div className="card-body text-center ">
        {/* Table start */}

        <Table hover>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Estimator Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Job Title one</td>
              <td>Kashif</td>
              <td>Testing address somewhere at rwp</td>
              <td className="Action">Quote</td>
            </tr>
            <tr>
              <td>Job Title one</td>
              <td>Kashif</td>
              <td>Testing address somewhere at rwp</td>
              <td className="Action">Quote</td>
            </tr>
            <tr>
              <td>Job Title one</td>
              <td>Kashif</td>
              <td>Testing address somewhere at rwp</td>
              <td className="Action">Quote</td>
            </tr>
            <tr>
              <td>Job Title one</td>
              <td>Kashif</td>
              <td>Testing address somewhere at rwp</td>
              <td className="Action">Quote</td>
            </tr>
            <tr>
              <td>Job Title one</td>
              <td>Kashif</td>
              <td>Testing address somewhere at rwp</td>
              <td className="Action">Quote</td>
            </tr>
          </tbody>
        </Table>

        {/* Table end */}
      </div>
    </div>
  );
};

export default ActiveJobs;
