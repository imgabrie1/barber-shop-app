import { type HTMLAttributes } from "react";

type H2Props = HTMLAttributes<HTMLHeadingElement>;

const H2Bold = ({ className = "", children, ...props }: H2Props) => {
  return (
    <h2
      className={`text-2xl font-bold ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export default H2Bold;
