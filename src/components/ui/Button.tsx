import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  spinnerSize?: number;
};

const Button = ({
  className = "",
  children,
  loading = false,
  spinnerSize = 20,
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        relative
        flex items-center justify-center
        rounded-md
        w-[95vw] md:w-[90vw] lg:w-full
        h-[6vh] lg:h-[7vh] 2xl:h-[5vh]
        text-lg 2xl:text-[2vh]
        bg-[var(--primaryColor)]
        text-[var(--textPrimary)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <span className={loading ? "invisible" : "visible"}>{children}</span>

      {loading && (
        <span
          className="absolute animate-spin rounded-full border-2 border-white/40 border-t-white"
          style={{ width: spinnerSize, height: spinnerSize }}
        />
      )}
    </button>
  );
};

export default Button;
