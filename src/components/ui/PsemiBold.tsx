import { type HTMLAttributes } from "react";

type Pprops = HTMLAttributes<HTMLParagraphElement>;

const PsemiBold = ({ className = "", children, ...props }: Pprops) => {
  return (
    <p className={`text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-semibold ${className}`} {...props}>
      {children}
    </p>
  );
};

export default PsemiBold;
