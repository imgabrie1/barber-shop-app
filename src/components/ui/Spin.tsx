import { type ButtonHTMLAttributes } from "react";

type SpinProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  spinnerSize?: number;
};

const Spin = ({ className = "", spinnerSize = 25 }: SpinProps) => {
  return (
    <span
      className={`absolute animate-spin rounded-full border-3 border-white/40 border-t-white ${className}`}
      style={{ width: spinnerSize, height: spinnerSize }}
    />
  );
};

export default Spin;
