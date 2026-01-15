import React from "react";
import "./Loading.scss";

const Loading = () => {
  const text = "Loading...";

  return (
    <div className="loading-container">
      <p className="loading-text">
        {text.split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.15}s` }}>
            {char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Loading;
