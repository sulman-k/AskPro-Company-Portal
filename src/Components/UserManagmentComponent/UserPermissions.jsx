import React, { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { roleListApi, updatePermissions } from "../../api/Services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "EstimatorManagement",
  "CleaningCompanyManagement",
  "Qustionaire",
  "UserManagement",
  "AllEstimate",
];
const UserPermissions = () => {
  const navigate = useNavigate();

  const [roles, setRole] = useState([]);

  let newobject = {};
  let newU = [];

  const setFalse = () => {
    for (let i = 0; i < users.length; i++) {
      let key = users[i].name;
      newobject[[users[i].name]] = false;
    }
    newU.push(newobject);
  };
  useEffect(() => {
    setFalse();
    roleListsApi();
  }, []);

  const roleListsApi = async () => {
    let apiResponse = await roleListApi();
    if (apiResponse.success) {
      toast.success(apiResponse.msg);
      setRole(apiResponse.roles);
      toast.error(apiResponse.msg);
    }
  };
  const [personName, setPersonName] = useState("");
  const [nameRole, setNameRole] = useState("");

  const [users, setUsers] = useState([
    { name: "create" },
    { name: "view" },
    { name: "update" },
    { name: "delete" },

    { name: "active" },
    { name: "inActive" },
  ]);

  const handleChangeRoles = (event) => {
    const {
      target: { value },
    } = event;
    setNameRole(
      // On autofill we get a stringified value.
      value
    );
  };
  const [isDisabled, setIsDisabled] = useState(false);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.

      value
    );
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    let moduleName;

    for (let i = 0; i < users.length; i++) {
      let key = users[i].name;
      newobject[[users[i].name]] = users[i].isChecked;
    }
    newU.push(newobject);

    let exists = false;
    for (let i = 0; i < users.length; i++) {
      let key = users[i].name;
      if (users[i].isChecked) {
        exists = true;
        break;
      }
    }

    switch (personName) {
      case "EstimatorManagement":
        moduleName = "estimator";
        break;
      case "CleaningCompanyManagement":
        moduleName = "company";
        break;
      case "Qustionaire":
        moduleName = "questionaire";
        break;
      case "UserManagement":
        moduleName = "user";
        break;
      case "AllEstimate":
        moduleName = "estimate";
        break;
      default:
        return (moduleName = "estimator");
    }

    let newObj = {
      module_name: moduleName,
      portal: "admin",
      role: nameRole,
      permissions: newU,
    };

    if (exists) {
      let apiResponse = await updatePermissions(newObj);
      if (apiResponse.success) {
        toast.success(apiResponse.msg);
        setUsers([
          { name: "create" },
          { name: "view" },
          { name: "update" },
          { name: "delete" },

          { name: "active" },
          { name: "inActive" },
        ]);
        setIsDisabled(false);

        setNameRole("");
        setPersonName("");
      } else {
        toast.error(apiResponse.msg);
        setIsDisabled(false);
      }
    } else {
      toast.info("Select atleast one permission");
      setIsDisabled(false);
    }
  };

  const handleChangeSelectAll = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      let tempUser = users.map((user) =>
        user.name === name ? { ...user, isChecked: checked } : user
      );
      for (let i = 0; i < tempUser.length; i++) {
        if (tempUser[i].isChecked !== true) {
          tempUser[i].isChecked = false;
        }
      }

      setUsers(tempUser);
    }
  };

  const addRoleFun = () => {
    navigate("/Add-Roles");
  };

  return (
    <div className="card recentEstimatesCard mb-4">
      <div className="card-title incomingBar">
        <h6>User Management</h6>
      </div>

      <div className="card-body text-center">
        <div className="col-11 formDiv">
          <div className="row">
            <div className="col-10">
              {" "}
              <p className="per  mt-4">Permissions Access</p>
            </div>
            <div className="col-2">
              <button
                onClick={addRoleFun}
                className="d-flex justify-content-start mt-4  btn btnUser "
              >
                Add Role
              </button>
            </div>
          </div>

          <hr />
          <form onSubmit={handleAddUser}>
            <FormGroup>
              <div className="row">
                <div className="col-6 d-flex justify-content-start">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="allSelect"
                        checked={!users.some((user) => user?.isChecked !== true)}
                        onChange={(e) => {
                          handleChangeSelectAll(e);
                        }}
                      />
                    }
                    label="Select All"
                    className="per2"
                  />
                </div>
                <div className="col-6 d-flex  justify-content-end">
                  <FormControl sx={{ m: 1, width: 290 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
                    <Select
                      required={true}
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      value={nameRole}
                      onChange={handleChangeRoles}
                      input={<OutlinedInput label="Role" />}
                      renderValue={(nameRole) => nameRole}
                      MenuProps={MenuProps}
                    >
                      {roles.map((item) => (
                        <MenuItem key={item.name} value={item.name}>
                          {/* <Checkbox checked={nameRole.indexOf(item.name) > -1} /> */}
                          <ListItemText primary={item.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div className="col-6 d-flex  justify-content-start">
                    <FormControl sx={{ m: 1, width: 290 }}>
                      <InputLabel id="demo-multiple-checkbox-label">Module</InputLabel>
                      <Select
                        required={true}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput label="Module" />}
                        renderValue={(personName) => personName}
                        MenuProps={MenuProps}
                      >
                        {names.map((name) => (
                          <MenuItem key={name} value={name}>
                            {/* <Checkbox checked={personName.indexOf(name) > -1} /> */}
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row mt-4 per2">
                {users.map((user, index) => (
                  <div className="col-6 d-flex" key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={user.name}
                          checked={user?.isChecked || false}
                          onChange={(e) => {
                            handleChangeSelectAll(e);
                          }}
                        />
                      }
                      required
                      label={user.name}
                    />
                  </div>
                ))}
              </div>
            </FormGroup>
            <div className="row ">
              <div className=" d-flex justify-content-center">
                <button disabled={isDisabled} type="submit" className=" btn btnUser mt-5">
                  Update Permission
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
