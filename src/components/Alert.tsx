import React from "react";

interface MessageProps {
  children: React.ReactNode;
  Close:() => void;
}
const Message = ({ children, Close}:MessageProps) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={Close}
      ></button>
    </div>
  );
};

export default Message;
