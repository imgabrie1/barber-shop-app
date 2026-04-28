import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{ paddingLeft: "0.6rem" }}
        className={`
          rounded-md
          bg-[var(--inputColor)]
          h-[6vh]
          2xl:h-[5vh]
          lg:h-[7vh]
          border border-[var(--inputColor)]
          md:py-8
          md:text-2xl
          md:font-bold
          ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
