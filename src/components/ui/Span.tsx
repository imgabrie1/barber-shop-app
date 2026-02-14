import { type HTMLAttributes } from "react";

type Pprops = HTMLAttributes<HTMLSpanElement>;

const P = ({ className = "", children, ...props }: Pprops) => {
  return (
    <p className={`text-base font-medium lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl ${className}`} {...props}>
      {children}
    </p>
  );
};

export default P;
