import { useState, useEffect } from "react";

// If you need locale-aware formatting adjust options or locale string
const DATE_OPTIONS = { year: "numeric", month: "long", day: "numeric"};

export function useDate(locale = "en-US", options = DATE_OPTIONS){
    const [currentDate, setCurrentDate]= useState(""); 

    useEffect(()=>{
        // get the browser's current date
        const now = new Date(); 
        const formatted = now.toLocaleDateString(locale, options);
        setCurrentDate(formatted); 
    }, [locale, options])

    return currentDate; 
}