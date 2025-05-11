import React from "react"
import "./PageContainer.css";

function PageContainer({children, className="", title, hideTitle = false}){
    return(
        <div className={`${className} page-container p-2`}>
            {title && (
                <h1 className={`${hideTitle ? "visually-hidden" : ""} page-title`}>
                    {title}
                </h1>
            )}
            {children}
        </div>
    );
}

export default PageContainer