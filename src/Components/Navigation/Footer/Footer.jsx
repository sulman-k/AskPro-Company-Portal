import React from "react";
import PropTypes from "prop-types";
import "./Footer.css";

function Footer(props) {
  return (
    <div className="footercss">
      <footer className="">
        <div className="text-center p-3  footer-dark footer_color">
          <p className="footerFont">© 2022 Clenzio. All Rights Reserved.</p>
          <p className="text-light ">Version 4.38</p>
        </div>
      </footer>
    </div>
  );
}

Footer.propTypes = {};

export default Footer;
