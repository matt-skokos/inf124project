import React from "react"
import "./PageContainer.css";

function PageContainer({children, className}){
    return(
        <div className={className + "page-container p-2"}>
            {children}
        </div>
    );
}

export default PageContainer