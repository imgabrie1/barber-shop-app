import { type HTMLAttributes } from "react";

type Pprops = HTMLAttributes<HTMLSpanElement>;

const P = ({ className = "", children, ...props }: Pprops) => {
  return (
    <p className={`text-base font-medium ${className}`} {...props}>
      {children}
    </p>
  );
};

export default P;
