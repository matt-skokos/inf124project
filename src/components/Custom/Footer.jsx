import React from "react";

function Footer(){
    return(
        <footer className="footer text-center py-2 border-top">
            {/* <hr/>  ← you can use <hr/> instead of border-top if you prefer */}
            <small>© {new Date().getFullYear()} University of California, Irvine </small>
      </footer>
    );
}

export default Footer;