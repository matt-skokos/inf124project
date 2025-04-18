import React from "react";

function ContentCard({children, className}){
    return(
        <div className={className + " content-card card"}>
            <div className="card-body justify-content-around">
                {children}
            </div>
        </div>
    );
}

export default ContentCard