import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`rounded-md bg-[var(--inputColor)] h-[6vh] 2xl:h-[5vh] lg:h-[7vh] border border-[var(--inputColor)] px-2 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
