import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import PsemiBold from "@/components/ui/PsemiBold";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <H2Bold>Alguma frase impactante.</H2Bold>
        <PsemiBold>Entre para poder marcar um horário.</PsemiBold>
      </div>
      <Button type="button" onClick={() => navigate("/login")}>
        Entrar
      </Button>
    </section>
  );
};
