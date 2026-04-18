import { type HTMLAttributes } from "react";

type HeaderProps = HTMLAttributes<HTMLElement>;

const Header = ({ className = "", children, ...props }: HeaderProps) => {
  return (
    <header
      className={`bg-[var(--headerColor)] w-full text-[var(--textPrimary)] shadow-md ${className}`}
      {...props}
    >
      <div 
        className="w-full max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-col justify-center gap-4"
        style={{ padding: "1rem" }}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
