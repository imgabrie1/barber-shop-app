import { type HTMLAttributes } from "react";

type HeaderProps = HTMLAttributes<HTMLElement>;

const Header = ({ className = "", children, ...props }: HeaderProps) => {
  return (
    <header
      className={`bg-[var(--headerColor)] w-full ${className}`}
      {...props}
    >
      <div
        className="
          w-[95vw] md:w-[90vw] lg:w-[130vh]
          h-[5vh] lg:h-[7vh] xl:h-[4vh]
          mx-auto
          flex items-center justify-between
          text-[var(--textPrimary)]
          px-2 py-4
        "
      >
        <h1 className="text-xl font-bold 2xl:text-2xl">Barbearia Vortex</h1>

        {children}
      </div>
    </header>
  );
};

export default Header;
