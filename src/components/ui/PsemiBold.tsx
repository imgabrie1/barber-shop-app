import { type HTMLAttributes } from "react";

type Pprops = HTMLAttributes<HTMLParagraphElement>;

const PsemiBold = ({ className = "", children, ...props }: Pprops) => {
  return (
    <p className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </p>
  );
};

export default PsemiBold;
