import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Label, Button } from "reactstrap";
import {
  getCompaniesAPI,
  getUsersListUserName,
  roleListApi,
  updateUserApi,
  uploadImage,
} from "../../api/Services";
import "./userManagement.css";
import { BiUpload } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import LoaderAnimation from "../Loader/LoaderAnimation";
import { useAuthUser } from "react-auth-kit";
import { IsAuthorized } from "../../Auth/Authorization";

const UpdateUser = () => {
  const MAX_FILE_SIZE = 1000000 * 2.5,
    ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [totalExperienceError, setTotatlExperienceError] = useState(false);
  const [totalExperience, setTotalExperience] = useState("");
  const [certificationError, setCertificationError] = useState(false);
  const [certifications, setCertifications] = useState("");
  const [domainId, setDomainId] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [ssn, setSsn] = useState("");
  const [license, setLicense] = useState("");
  const [paypalId, setPayPalID] = useState("");
  const [uploadYourPictureTitle, setUploadYourPictureTitle] = useState(true);
  const [picture, setPicture] = useState({});
  const [animationupload, setAnimationupload] = useState(false);
  const [password, setPassword] = useState("");
  const [uploadPhotoID, setUploadPhotoID] = useState(true);
  const [photo, setPhoto] = useState({});
  const [animationuploadPhoto, setAnimationuploadPhoto] = useState(false);
  const [certList, setCertList] = useState([]);
  const [uploadCertificateMulti, setUploadCertificateMulti] = useState(true);
  const [animationuploadMultiple, setAnimationuploadMultiple] = useState(false);
  const [addUserLoader, setAddUserLoader] = useState(true);
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState("");
  const isUpdateUser = IsAuthorized("user").update;
  useEffect(() => {
    if (isUpdateUser) {
    } else {
      toast.error("You are not authorized to Update User");
      navigate("/User-Management");
    }
    fetchUserDetails(location.state.fullData.userName);
    getRoleList();
    fetchCompanies();
  }, []);

  const fetchUserDetails = async (userName) => {
    try {
      const userResponse = await getUsersListUserName(userName);
      if (userResponse.success) {
        settingDataForAll(userResponse.user);
      } else {
        toast.error("No Data Available");
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const settingDataForAll = (data) => {
    setUserName(data.userName);
    setPhone(data.phone);
    setEmail(data.email);
    setTotalExperience(data.totalExperience);
    setCertifications(data.certifications);
    setDomainId(data.domainId);
    setDomainName(data.domainName);
    setSsn(data.ssn);
    setLicense(data.license);
    setPayPalID(data.paypalId);
    setPassword(data.password);
    setRole(data.role);

    setUploadYourPictureTitle(data?.picture ? false : true);
    setPicture(
      data?.picture
        ? {
            name: data?.picture.split("https://somecompany-images.s3.amazonaws.com/")[1],
            url: data?.picture,
          }
        : {}
    );

    setUploadPhotoID(data?.photoID ? false : true);
    setPhoto(
      data?.photoID
        ? {
            name: data?.photoID.split("https://somecompany-images.s3.amazonaws.com/")[1],
            url: data?.photoID,
          }
        : {}
    );

    setCertList(data?.certificateImages ? data?.certificateImages.split(",") : "");
  };

  const validateUserName = (username) => {
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(username)) {
      setUserNameError(false);
      setUserName(username);
    } else {
      setUserNameError(true);
    }
  };

  const validateExperience = (experience) => {
    if (experience > -1) {
      setTotatlExperienceError(false);
      setTotalExperience(experience);
    } else {
      setTotatlExperienceError(true);
    }
  };

  const validateCertifications = (certification) => {
    if (certification > -1) {
      setCertificationError(false);
      setCertifications(certification);
    } else {
      setCertificationError(true);
    }
  };

  const getDomainName = (domain) => {
    setDomainId(domain);
    companyList.map((e) => {
      if (e.tenant_id === domain) {
        setDomainName(e.tenantDomain);
      }
    });
  };

  const fetchCompanies = async () => {
    try {
      let response = await getCompaniesAPI();
      if (response.success) {
        setCompanyList(response.data);
      } else {
        setCompanyList([]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getRoleList = async () => {
    try {
      let response = await roleListApi();
      if (response.success) {
        setRoleList(response.roles);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const uploadPicture = async (event) => {
    let image = event.target.files[0];
    if (checkImage(image)) {
      setAnimationupload(true);
      const result = await uploadImage(image);
      if (result.success) {
        setPicture({ name: image.name, url: result.url });
        setUploadYourPictureTitle(false);
        setAnimationupload(false);
      } else {
        toast.error("Error while uploading image");
        setAnimationupload(false);
      }
    } else {
      setAnimationupload(false);
      toast.error("Either size exceeds 2.5 MB or type is not png/jpeg");
    }
  };

  const checkImage = (image) => {
    let file_size = image.size;
    let file_type = image.type;

    if ((file_size <= MAX_FILE_SIZE && ALLOWED_FILE_TYPES.includes(file_type)) === true)
      return true;
    else return false;
  };

  const deletePicture = () => {
    setPicture({});
    setUploadYourPictureTitle(true);
  };

  const autoGeneratePassword = () => {
    var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  };

  const uploadPhoto = async (event) => {
    let image = event.target.files[0];
    if (checkImage(image)) {
      setAnimationuploadPhoto(true);
      const result = await uploadImage(image);
      if (result.success) {
        setPhoto({ name: image.name, url: result.url });
        setUploadPhotoID(false);
        setAnimationuploadPhoto(false);
      } else {
        setAnimationuploadPhoto(false);
        toast.error("Error while uploading image");
      }
    } else {
      setAnimationuploadPhoto(false);
      toast.error("Either size exceeds 2.5 MB or type is not png/jpeg");
    }
  };

  const deletePhotoID = () => {
    setPhoto({});
    setUploadPhotoID(true);
  };

  const deleteCertificate = (val) => {
    certList.splice(val, 1);
    setCertList((certList) => [...certList]);

    setUploadCertificateMulti(true);
  };

  const redOutline = () => {
    if (username === "") {
      showError("Name", true);
    } else {
      showError("Name", false);
    }
    if (phone === "") {
      showError("contact", true);
    } else {
      showError("contact", false);
    }
    if (email === "") {
      showError("email", true);
    } else {
      showError("email", false);
    }

    if (password === "") {
      showError("password", true);
    } else {
      showError("password", false);
    }
  };

  const showError = (elementID, flag) => {
    if (flag === true) {
      document.getElementById(elementID).style.border = "1px solid red";
    } else {
      document.getElementById(elementID).style.border = "1px solid lightgray";
    }
  };

  const uploadCertificate = async (event) => {
    setAnimationuploadMultiple(true);
    for (let index = 0; index < event.target.files.length; index++) {
      let image = event.target.files[index];

      if (checkImage(image)) {
        const result = await uploadImage(image);
        setAnimationuploadMultiple(true);
        if (result.success) {
          setCertList((certList) => [...certList, result.url]);
          setUploadCertificateMulti(false);
          setAnimationuploadMultiple(false);
        } else {
          setAnimationuploadMultiple(false);
          toast.error(`Error while uploading image:  ${image.name}`);
        }
      } else {
        setAnimationuploadMultiple(false);
        toast.error("Either size exceeds 2.5 MB or type is not png/jpeg");
      }
    }
  };
  const [passwordError, setPasswordError] = useState(false);

  const addUser = async (e) => {
    e.preventDefault();
    if (password.length < 8 || password.includes(" ")) {
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
      }, 5000);
    } else {
      setAddUserLoader(false);

      var payload = JSON.stringify({
        userName: username.trim(),
        phone: phone.trim(),
        email: email.trim(),
        totalExperience: totalExperience,
        certifications: certifications,
        domainName: "Primary",
        domainId: "",
        // domainName: domainName,
        // domainId: domainId,
        ssn: ssn,
        role: role,
        license: license,
        paypalId: paypalId,
        password: password,
        picture: picture.url ? picture.url : "",
        photoID: photo.url ? photo.url : "",
        certificateImages: certList.length ? certList.map((e) => e).join(",") : "",
        isAdmin: true,
      });

      const updateUser = await updateUserApi(payload);
      if (updateUser.success) {
        setAddUserLoader(true);
        toast.success("User updated successfully");
        navigate("/User-Management");
      } else {
        setAddUserLoader(true);
        toast.error(updateUser.error);
      }
    }
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="card recentEstimatesCard mb-4">
      <div className="card-title incomingBar">
        <h6>Update User</h6>
      </div>

      <div className="card-body text-center">
        <div className="col-11 formDiv">
          <form id="addEstimatorForm" onSubmit={addUser}>
            <div>
              <label
                htmlFor="Name"
                className="form-label  labelCss required"
                style={{ float: "left" }}
              >
                Name
              </label>
              <input
                required={true}
                readOnly
                type="text"
                className="form-control required br10"
                id="Name"
                placeholder="User Name"
                defaultValue={username}
                onChange={(e) => validateUserName(e.target.value)}
              />
              {userNameError ? (
                <span style={{ color: "red", float: "left" }}>
                  Username only containes a-z , A-Z , 0-9, @{" "}
                </span>
              ) : null}
              <br />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="form-label labelCss required"
                style={{ float: "left" }}
              >
                Contact
              </label>
              <input
                required={true}
                type="number"
                className="form-control  br10"
                id="contact"
                placeholder="Mobile #"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="email"
                className="form-label labelCss required"
                style={{ float: "left" }}
              >
                Email ID
              </label>
              <input
                required={true}
                type="email"
                name="email"
                id="email"
                className="form-control br10"
                placeholder="abc@gmail.com"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="experience" className="form-label labelCss" style={{ float: "left" }}>
                Total Experience
              </label>
              <input
                type="number"
                min="0"
                className="form-control br10"
                id="experience"
                placeholder="No Of Months"
                defaultValue={totalExperience}
                onChange={(e) => validateExperience(e.target.value)}
              />
              {totalExperienceError ? (
                <span style={{ color: "red", float: "left" }}>
                  Experience should not be less then 0
                </span>
              ) : null}
            </div>
            <div className="mt-4">
              <label
                htmlFor="certification"
                className="form-label labelCss"
                style={{ float: "left" }}
              >
                Certifications
              </label>
              <input
                type="number"
                min="0"
                className="form-control br10"
                id="certification"
                placeholder="No Of certification"
                defaultValue={certifications}
                onChange={(e) => validateCertifications(e.target.value)}
              />
              {certificationError ? (
                <span style={{ color: "red", float: "left" }}>
                  Certification should not be less then 0
                </span>
              ) : null}
            </div>
            {/* 
            <div className="dropdown mt-2">
              <label
                htmlFor="cleaningCompany"
                className="form-label labelCss required"
                style={{ float: "left" }}
              >
                Cleaning Company
              </label>

              <Input
                disabled={authUser().role[0].role !== "Super_Admin" ? true : false}
                required={true}
                id="exampleSelect"
                name="select"
                className="br10"
                onChange={(e) => getDomainName(e.target.value)}
                type="select"
              >
                <option value={domainId}>{domainName}</option>
                {companyList.length
                  ? companyList.map((e) => {
                      return <option value={e.tenant_id}>{e.tenantDomain}</option>;
                    })
                  : null}
              </Input>
            </div> */}

            <div className="mt-2">
              <label htmlFor="roleList" className="form-label labelCss " style={{ float: "left" }}>
                Role
              </label>

              <div className="dropdown ">
                <Input
                  disabled={authUser().role[0].role !== "Super_Admin" ? true : false}
                  id="role"
                  name="select"
                  className="br10"
                  onChange={(e) => setRole(e.target.value)}
                  type="select"
                >
                  <option value={role}>{role}</option>

                  {roleList.map((e) => {
                    return <option value={e.name}>{e.name}</option>;
                  })}
                </Input>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="taxID" className="form-label labelCss" style={{ float: "left" }}>
                SSN/Tax ID
              </label>
              <input
                type="text"
                className="form-control br10"
                id="taxID"
                placeholder="Enter Social Security Number/ Tax ID"
                defaultValue={ssn}
                onChange={(e) => setSsn(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="lisence" className="form-label labelCss" style={{ float: "left" }}>
                Driver License #
              </label>
              <input
                defaultValue={license}
                // type="number"
                className="form-control br10"
                id="lisence"
                placeholder="Enter Driver License #"
                onChange={(e) => setLicense(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="paypal" className="form-label labelCss" style={{ float: "left" }}>
                Paypal ID
              </label>
              <input
                type="text"
                className="form-control br10"
                id="paypal"
                placeholder="Paypal id For Payments"
                defaultValue={paypalId}
                onChange={(e) => setPayPalID(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="form-label labelCss" style={{ float: "left" }}>
                Password
              </label>
              <br />

              <div id="password" className="mt-3 row uploadWidth br10">
                <span className="divPlaceHolder col-4">
                  <input
                    className="row justify-content-start bord"
                    onChange={(e) => {
                      passwordHandler(e);
                    }}
                    placeholder={password ? password : "Your password here"}
                    value={password ? password : ""}
                  />
                </span>
                <div className="col-5"></div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="button"
                  className="btn uploadWidthAutoGenerate col-2"
                  onClick={autoGeneratePassword}
                  defaultValue={password}
                  value="Auto Generate Password"
                />
              </div>
              {passwordError ? (
                <span className="passwordError">
                  <br />
                  Password length should be greater then 8 and should not contain space
                </span>
              ) : null}
            </div>

            <div className="mt-4">
              <label htmlFor="uploadyourpicture " className="labelCss" style={{ float: "left" }}>
                Upload Your Picture
              </label>
              <br />
              {uploadYourPictureTitle ? (
                <div className="mt-3 row uploadWidth br10">
                  <span className="divPlaceHolder col-4">
                    <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">&nbsp; {picture.name}</div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationupload === false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="upload"
                      className="btn btn-secondary uploadWidthClass col-2 "
                    >
                      Upload
                      <BiUpload className="uploadIconButton" />
                    </label>
                  ) : (
                    <div className="loaderUploadCSS col-1">
                      <LoaderAnimation size={40} />
                    </div>
                  )}
                  <input
                    id="upload"
                    style={{ display: "none" }}
                    type="file"
                    className="btn btn-secondary uploadWidthClass col-2"
                    onChange={uploadPicture}
                  />
                </div>
              ) : (
                <div className="mt-3 row uploadWidth br10 ">
                  <span className="placeholderFileName col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;{picture.name}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label
                    htmlFor="uploadDelete"
                    className="btn btn-danger uploadWidthClassDelete col-2 "
                  >
                    Delete
                    <BiTrash className="uploadIconButton" />
                  </label>
                  <input
                    id="uploadDelete"
                    style={{ display: "none" }}
                    className="btn btn-secondary uploadWidthClass col-2"
                    onClick={deletePicture}
                  />{" "}
                </div>
              )}
              <br />
            </div>

            <div className="mt-4">
              <label htmlFor="uploadphoto" className="labelCss" style={{ float: "left" }}>
                Upload Photo ID
              </label>{" "}
              <br />
              {uploadPhotoID ? (
                <div className="mt-3 row uploadWidth ">
                  <span className="divPlaceHolder col-4">
                    <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                  </span>
                  <span className="uploadItem col-4">
                    <div className="row justify-content-start">&nbsp;{photo.name}</div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {animationuploadPhoto === false ? (
                    <label
                      style={{ backgroundColor: "#ffad10", border: "none" }}
                      htmlFor="photo"
                      className="btn btn-secondary uploadWidthClass col-3 "
                    >
                      Upload
                      <BiUpload className="uploadIconButton" />
                    </label>
                  ) : (
                    <div className="loaderUploadCSS col-1">
                      <LoaderAnimation size={40} />
                    </div>
                  )}
                  <input
                    id="photo"
                    style={{ display: "none" }}
                    type="file"
                    className="btn btn-secondary uploadWidthClass col-3"
                    onChange={uploadPhoto}
                  />
                </div>
              ) : (
                <div className="mt-3 row uploadWidth ">
                  <span className="placeholderFileName col-4">
                    <div className="row justify-content-start">
                      &nbsp;&nbsp;&nbsp;
                      {photo.name}
                    </div>
                  </span>
                  <div className="col-6"></div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label htmlFor="photo" className="btn btn-danger uploadWidthClassDelete col-2 ">
                    Delete
                    <BiTrash className="uploadIconButton" />
                  </label>
                  <input
                    id="photo"
                    style={{ display: "none" }}
                    className="btn btn-secondary uploadWidthClass col-2"
                    onClick={deletePhotoID}
                  />{" "}
                </div>
              )}
              <br />
            </div>

            <div className="mt-">
              <Label htmlFor="formFileMultiple" className="labelCss" style={{ float: "left" }}>
                Upload Certificates (Multiple Uploads Available)
              </Label>{" "}
              <br />
              <div className="mt-3 row uploadWidth">
                {certList.length ? (
                  <div>
                    <div>
                      {certList.map((e, index) => (
                        <li className="row">
                          <span className="placeholderFileName col-4">
                            {e.includes("https://somecompany-images.s3.amazonaws.com/") ? (
                              <div className="row justify-content-start">
                                &nbsp;&nbsp;&nbsp;
                                {e?.split("https://somecompany-images.s3.amazonaws.com/")[1]}
                              </div>
                            ) : (
                              <div className="row justify-content-start">
                                &nbsp;&nbsp;&nbsp;
                                {e}
                              </div>
                            )}
                          </span>
                          <div className="col-6"></div>
                          &nbsp;&nbsp;&nbsp;
                          <label
                            htmlFor="formFileMultipleDel"
                            className="btn  btn-danger uploadWidthClassDelete col-2 "
                            onClick={() => deleteCertificate(index)}
                          >
                            Delete
                            <BiTrash className="uploadIconButton" />
                          </label>
                          <button
                            style={{ display: "none" }}
                            id="formFileMultipleDel"
                            className="btn btn-danger uploadWidthClassDelete col-2"
                            type="button"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </div>
                  </div>
                ) : null}
                <span className="divPlaceHolde col-4">
                  <span className="leftAlignDown">
                    <div className="row justify-content-start">JPEG, PNG & less then 2.5MB</div>
                  </span>
                </span>
                <div className="col-6"></div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {animationuploadMultiple === false ? (
                  <label
                    style={{ backgroundColor: "#ffad10", border: "none" }}
                    htmlFor="formFileMultiple"
                    className="btn btn-secondary uploadWidthClass col-2 "
                  >
                    Upload
                    <BiUpload className="uploadIconButton" />
                  </label>
                ) : (
                  <span className="multipleLoader">
                    <LoaderAnimation size={30} />
                  </span>
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="formFileMultiple"
                  multiple
                  className="btn btn-secondary uploadWidthClass col-2"
                  onChange={uploadCertificate}
                />
              </div>
              <br />
              {addUserLoader ? (
                <Button
                  value="submit"
                  type="submit"
                  id="submit"
                  className="btn buttonColor mt-2"
                  onClick={redOutline}
                >
                  Next
                </Button>
              ) : (
                <LoaderAnimation />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
