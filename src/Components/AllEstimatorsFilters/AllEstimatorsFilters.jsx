import React, { useState } from 'react';
import './AllEstimatorsFilters.css';

export default function AllEstimatorsFilters(props, { size, color }) {
  const [wareHouseCountHook, setwareHouseCountHook] = useState(0);
  const [SchoolCountHook, setSchoolCountHook] = useState(0);
  const [GymnasiumCountHook, setGymnasiumCountHook] = useState(0);
  const [VendorCountHook, setVendorCountHook] = useState(0);
  const [BankCountHook, setBankCountHook] = useState(0);
  const [MallsCountHook, setMallsCountHook] = useState(0);
  const [GymsCountHook, setGymsCountHook] = useState(0);
  const [LawFirmsCountHook, setLawFirmsCountHook] = useState(0);
  const [LibraryCountHook, setLibraryCountHook] = useState(0);
  const [Vendor2CountHook, setVendor2CountHook] = useState(0);
  const [Bank2CountHook, setBank2CountHook] = useState(0);
  const [Malls2CountHook, setMalls2CountHook] = useState(0);

  var wareHouseCount = 0;
  var SchoolCount = 0;
  var GymnasiumCount = 0;
  var VendorCount = 0;
  var BankCount = 0;
  var MallsCount = 0;
  var GymsCount = 0;
  var LawFirmsCount = 0;
  var LibraryCount = 0;
  var Vendor2Count = 0;
  var Bank2Count = 0;
  var Malls2Count = 0;

  let filterData = {
    wareHouseCountHook: wareHouseCountHook,
    SchoolCountHook: SchoolCountHook,
    GymnasiumCountHook: GymnasiumCountHook,
    VendorCountHook: VendorCountHook,
    BankCountHook: BankCountHook,
    MallsCountHook: MallsCountHook,
    GymsCountHook: GymsCountHook,
    LawFirmsCountHook: LawFirmsCountHook,
    LibraryCountHook: LibraryCountHook,
    Vendor2CountHook: Vendor2CountHook,
    Bank2CountHook: Bank2CountHook,
    Malls2CountHook: Malls2CountHook,
  };

  function hello() {
    //this on click function triggers and when a user click a button. the color is changed
    if (props.title === 'Ware House') {
      wareHouseCount = wareHouseCount + 1;
      if (props.title === 'Ware House' && wareHouseCount % 2 === 0) {
        document.getElementById('WareHouseID').style.backgroundColor =
          'rgb(255,255,255)';
        setwareHouseCountHook(0);
      }
      if (props.title === 'Ware House' && wareHouseCount % 2 !== 0) {
        document.getElementById('WareHouseID').style.backgroundColor =
          'rgb(217,229,241)';
        setwareHouseCountHook(1);
      }
    }
    if (props.title === 'School') {
      SchoolCount = SchoolCount + 1;
      if (props.title === 'School' && SchoolCount % 2 === 0) {
        document.getElementById('SchoolID').style.backgroundColor =
          'rgb(255,255,255)';
        setSchoolCountHook(0);
      }
      if (props.title === 'School' && SchoolCount % 2 !== 0) {
        document.getElementById('SchoolID').style.backgroundColor =
          'rgb(217,229,241)';
        setSchoolCountHook(1);
      }
    }
    if (props.title === 'Gymnasium') {
      GymnasiumCount = GymnasiumCount + 1;
      if (props.title === 'Gymnasium' && GymnasiumCount % 2 === 0) {
        document.getElementById('GymnasiumID').style.backgroundColor =
          'rgb(255,255,255)';
        setGymnasiumCountHook(0);
      }
      if (props.title === 'Gymnasium' && GymnasiumCount % 2 !== 0) {
        document.getElementById('GymnasiumID').style.backgroundColor =
          'rgb(217,229,241)';
        setGymnasiumCountHook(1);
      }
    }
    if (props.title === 'Vendor' && props.id === 'VendorID') {
      VendorCount = VendorCount + 1;
      if (props.title === 'Vendor' && VendorCount % 2 === 0) {
        document.getElementById('VendorID').style.backgroundColor =
          'rgb(255,255,255)';
        setVendorCountHook(0);
      }
      if (props.title === 'Vendor' && VendorCount % 2 !== 0) {
        document.getElementById('VendorID').style.backgroundColor =
          'rgb(217,229,241)';
        setVendorCountHook(1);
      }
    }
    if (props.title === 'Bank' && props.id === 'BankID') {
      BankCount = BankCount + 1;
      if (props.title === 'Bank' && BankCount % 2 === 0) {
        document.getElementById('BankID').style.backgroundColor =
          'rgb(255,255,255)';
        setBankCountHook(0);
      }
      if (props.title === 'Bank' && BankCount % 2 !== 0) {
        document.getElementById('BankID').style.backgroundColor =
          'rgb(217,229,241)';
        setBankCountHook(1);
      }
    }
    if (props.title === 'Malls' && props.id === 'MallsID') {
      MallsCount = MallsCount + 1;
      if (props.title === 'Malls' && MallsCount % 2 === 0) {
        document.getElementById('MallsID').style.backgroundColor =
          'rgb(255,255,255)';
        setMallsCountHook(0);
      }
      if (props.title === 'Malls' && MallsCount % 2 !== 0) {
        document.getElementById('MallsID').style.backgroundColor =
          'rgb(217,229,241)';
        setMallsCountHook(1);
      }
    }
    if (props.title === 'Gyms') {
      GymsCount = GymsCount + 1;
      if (props.title === 'Gyms' && GymsCount % 2 === 0) {
        document.getElementById('GymsID').style.backgroundColor =
          'rgb(255,255,255)';
        setGymsCountHook(0);
      }
      if (props.title === 'Gyms' && GymsCount % 2 !== 0) {
        document.getElementById('GymsID').style.backgroundColor =
          'rgb(217,229,241)';
        setGymsCountHook(1);
      }
    }
    if (props.title === 'Law Firms') {
      LawFirmsCount = LawFirmsCount + 1;
      if (props.title === 'Law Firms' && LawFirmsCount % 2 === 0) {
        document.getElementById('LawFirmsID').style.backgroundColor =
          'rgb(255,255,255)';
        setLawFirmsCountHook(0);
      }
      if (props.title === 'Law Firms' && LawFirmsCount % 2 !== 0) {
        document.getElementById('LawFirmsID').style.backgroundColor =
          'rgb(217,229,241)';
        setLawFirmsCountHook(1);
      }
    }
    if (props.title === 'Library') {
      LibraryCount = LibraryCount + 1;
      if (props.title === 'Library' && LibraryCount % 2 === 0) {
        document.getElementById('LibraryID').style.backgroundColor =
          'rgb(255,255,255)';
        setLibraryCountHook(0);
      }
      if (props.title === 'Library' && LibraryCount % 2 !== 0) {
        document.getElementById('LibraryID').style.backgroundColor =
          'rgb(217,229,241)';
        setLibraryCountHook(1);
      }
    }
    if (props.title === 'Vendor' && props.id === 'Vendor2ID') {
      Vendor2Count = Vendor2Count + 1;
      if (props.title === 'Vendor' && Vendor2Count % 2 === 0) {
        document.getElementById('Vendor2ID').style.backgroundColor =
          'rgb(255,255,255)';
        setVendor2CountHook(0);
      }
      if (props.title === 'Vendor' && Vendor2Count % 2 !== 0) {
        document.getElementById('Vendor2ID').style.backgroundColor =
          'rgb(217,229,241)';
        setVendor2CountHook(1);
      }
    }
    if (props.title === 'Bank' && props.id === 'Bank2ID') {
      Bank2Count = Bank2Count + 1;
      if (props.title === 'Bank' && Bank2Count % 2 === 0) {
        document.getElementById('Bank2ID').style.backgroundColor =
          'rgb(255,255,255)';
        setBank2CountHook(0);
      }
      if (props.title === 'Bank' && Bank2Count % 2 !== 0) {
        document.getElementById('Bank2ID').style.backgroundColor =
          'rgb(217,229,241)';
        setBank2CountHook(1);
      }
    }
    if (props.title === 'Malls' && props.id === 'Malls2ID') {
      Malls2Count = Malls2Count + 1;
      if (props.title === 'Malls' && Malls2Count % 2 === 0) {
        document.getElementById('Malls2ID').style.backgroundColor =
          'rgb(255,255,255)';
        setMalls2CountHook(0);
      }
      if (props.title === 'Malls' && Malls2Count % 2 !== 0) {
        document.getElementById('Malls2ID').style.backgroundColor =
          'rgb(217,229,241)';
        setMalls2CountHook(1);
      }
    }
  }
  return (
    <>
      <div className="card">
        <button
          id={props.id}
          name="WareHouse"
          onClick={hello}
          className="btn btn_color">
          <div className="row justify-content-center">
            <div className=" mt-1">
              <div size={size} fill={color}>
                <img
                  class="responsiveImg"
                  src={props.icon}
                  height={props.height}
                  width={props.width}
                  alt=""
                />
              </div>
            </div>
          </div>
        </button>
      </div>
      <div className="row justify-content-center mt-1">
        <div className="">
          <font size="2" className="font-size:10vw card-text mb-2">
            <h6>{props.title}</h6>
          </font>
        </div>
      </div>
    </>
  );
}
