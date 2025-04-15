import React from "react";

function ContentCard({children, className}){
    return(
        <div className={className + " card"}>
            <div className="card-body d-flex justify-content-around">
                {children}
            </div>
        </div>
    );
}

export default ContentCard