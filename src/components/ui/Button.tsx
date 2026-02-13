import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className = "", children, ...props }: ButtonProps) => {
  return (
    <button
      className={`rounded-md w-[95vw] 2xl:h-[5vh] text-lg 2xl:text-[2vh] md:w-[90vw] lg:w-[100%] lg:h-[7vh] h-[6vh] bg-[var(--primaryColor)] text-[var(--textPrimary)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
