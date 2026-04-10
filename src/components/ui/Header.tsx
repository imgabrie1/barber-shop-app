import { type HTMLAttributes } from "react";

type HeaderProps = HTMLAttributes<HTMLElement>;

const Header = ({ className = "", children, ...props }: HeaderProps) => {
  return (
    <header
      className={`bg-[var(--headerColor)] w-full text-[var(--textPrimary)] shadow-md ${className}`}
      {...props}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col justify-center px-4 py-4 md:px-6 md:py-5 gap-4">
        {children}
      </div>
    </header>
  );
};

export default Header;
