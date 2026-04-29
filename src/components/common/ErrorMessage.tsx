import H2Bold from "../ui/H2Bold";
import P from "../ui/Span";

interface ErrorMessageProps {
  isMissing: string;
}

export const ErrorMessage = ({ isMissing }: ErrorMessageProps) => {
  return (
    <div className="mt-8 pb-8 flex flex-col gap-4 items-center justify-center">
      <H2Bold className="text-gray-700" role="alert">
        Erro ao buscar {isMissing}!
      </H2Bold>
      <P
        className="text-gray-300 border-b cursor-pointer hover:text-gray-500 transition-colors"
        onClick={() => window.location.reload()}
      >
        Clique para tentar novamente
      </P>
    </div>
  );
};
