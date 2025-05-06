import { useState } from "react";

export default function HeartSpot({ color = "red", size = 40 }) {
  // Track "hearted" state locally
  const [hearted, setHearted] = useState(false);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setHearted((prev) => !prev);
  };

  return (
    <span
      className="heart-icon"
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleHeartClick}
    >
      {hearted ? (
        // Filled heart SVG
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={color}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ) : (
        // Outline heart SVG
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
    </span>
  );
}
