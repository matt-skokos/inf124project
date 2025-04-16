import React from "react";
import ContentCard from "./ContentCard";

function ConditionItem({icon, condition, value}){
    return(
        <div className="condition-item text-center">
            <div className="condition-icon mb-2">
                {/* TODO: Replace with swell icon from figma */}
                <p>{icon}</p>
            </div>
            <h6 className="condition-label card-subtitle mb-1 text-muted">{condition}</h6>
            <div className="condition-value card-text">{value}</div>
        </div>
    );
}

function ConditionCard({ swell, wind, tide}){
    return(
        <ContentCard className="condition-card">
                {/* swell */}
                <ConditionItem
                    icon="swell icon"
                    condition="Swell"
                    value={swell + " ft"}
                />


                {/* wind */}
                <ConditionItem
                    icon="wind icon"
                    condition="Wind"
                    value={wind + " mph"}
                />

                {/* tide */}
                <ConditionItem
                    icon="tide icon"
                    condition="Tide"
                    value={tide}
                />
        </ContentCard>
    );
}

export default ConditionCard