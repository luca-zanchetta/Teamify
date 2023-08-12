import React from "react";
import { useState } from "react";
import "../Css/Alert.css";

interface Props {
  children: ReactNode;
  onClick: () => void;
}

function Alert({ children, onClick }: Props) {
  const [visible, visibleState] = useState(true);

  if (visible)
    return (
      <div className="row h-50">
        <div class="alert alert-success mb-0 mt-0" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x custom-icon"
            viewBox="0 0 16 16"
            key={children}
            onClick={() => {
              visibleState(false);
              onClick();
            }}
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
          {children}
        </div>
      </div>
    );
}

export default Alert;
