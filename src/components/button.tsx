import React, { Children } from "react";

interface ButtonProps {
  children: string;
  onClick?: () => void;
  color?: string;
}
const B = ({ children,onClick,color ="success" }: ButtonProps) => {
  return (
    <button type="button" className={"btn btn-"+color} onClick={onClick}>
      {children}
    </button>
  );
};

export default B;
