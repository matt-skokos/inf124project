import React from "react"
import "./PageContainer.css";

function PageContainer({children}){
    return(
        <div className="page-container p-3">
            {children}
        </div>
    );
}

export default PageContainer