import { type ButtonHTMLAttributes } from "react";
import Spin from "./Spin";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  spinnerSize?: number;
};

const Button = ({
  className = "",
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
    w-full
    md:py-8
    md:text-2xl
    md:font-bold
    transition-all
    relative
    flex items-center justify-center
    rounded-md
    w-[95vw]
    lg:w-full
    h-[6vh]
    lg:h-[7vh]
    2xl:h-[5vh]
    text-lg 2xl:text-[2vh]
    bg-[var(--primaryColor)]
    text-[var(--textPrimary)]
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    transition
    hover:brightness-95
    group
    ${className}
  `}
      style={{ fontFamily: "Geologica", fontWeight: "normal" }}
      {...props}
    >
      <span
        className={`
      ${loading ? "invisible" : ""}
      text-[var(--textPrimary)]
      text-2xl
      transition
      group-hover:brightness-125
      group-hover:drop-shadow-[0_0_4px_var(--drop-shadow)]
    `}
      >
        {children}
      </span>

      {loading && <Spin />}
    </button>
  );
};

export default Button;
