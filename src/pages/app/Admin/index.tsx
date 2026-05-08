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

  const handleNavigateShopUnits = () => {
    navigate("/app/admin/shopUnits");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <RevenueDisplay role="admin" title="Painel Administrativo" />

      <div className="grid grid-cols-2 w-full gap-5 pt-10 [&>*:last-child:nth-child(odd)]:col-span-2">
        <div
          onClick={handleNavigateUsers}
          className="
                  flex
                  items-center
                  justify-center
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
          className="
                  p-6
                  flex
                  items-center
                  justify-center
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
        <div
          onClick={handleNavigateShopUnits}
          className="
                  p-6
                  flex
                  items-center
                  justify-center
                  border
                  border-[#2c8f44]
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  hover:border-green-400
                  transition-all
                  cursor-pointer
                  group
                  "
        >
          <H2Bold>Gerenciar Unidades</H2Bold>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
