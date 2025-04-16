import React from "react";
import ContentCard from "./ContentCard";
import './DateLocationCard'

function DateLocationCard({date, location}){
    return(
        <ContentCard className="">
            <h2>{date}</h2>
            <p>{location}</p>
        </ContentCard>
    );
}

export default DateLocationCard