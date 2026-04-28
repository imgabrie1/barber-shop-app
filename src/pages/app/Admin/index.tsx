import { useNavigate } from "react-router-dom";
import RevenueDisplay from "@/components/common/RevenueDisplay";
import H2Bold from "@/components/ui/H2Bold";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleNavigateUsers = () => {
    navigate("/app/admin/users");
  };
  const handleNavigateServices = () => {
    navigate("/app/admin/services");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <RevenueDisplay admin={true} title="Painel Administrativo" />

      <div
        className="gap-6"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          paddingTop: "20px",
        }}
      >
        <div
          onClick={handleNavigateUsers}
          style={{ padding: "24px" }}
          className="
                  border
                  border-[#2c448f]
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  hover:border-blue-400
                  transition-all
                  cursor-pointer
                  group
                  "
        >
          <H2Bold>Gerenciar Usuários</H2Bold>
        </div>

        <div
          onClick={handleNavigateServices}
          style={{ padding: "24px" }}
          className="
                  border
                  border-[#8f882c]
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  hover:border-amber-400
                  transition-all
                  cursor-pointer
                  group
                  "
        >
          <H2Bold>Gerenciar Serviços</H2Bold>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
