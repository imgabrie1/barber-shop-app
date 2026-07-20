import { useNavigate, useParams } from "react-router-dom";
import RevenueDisplay from "@/components/common/RevenueDisplay";
import H2Bold from "@/components/ui/H2Bold";

const AdminPage = () => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  const handleNavigateUsers = () => {
    navigate(`/t/${tenantSlug}/app/admin/users`);
  };
  const handleNavigateServices = () => {
    navigate(`/t/${tenantSlug}/app/admin/services`);
  };

  const handleNavigateShopUnits = () => {
    navigate(`/t/${tenantSlug}/app/admin/shopUnits`);
  };

  const handleNavigateWhatsapp = () => {
    navigate(`/t/${tenantSlug}/app/admin/whatsapp`);
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

      <div className="grid grid-cols-2 w-full gap-5 pt-10">
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
                  min-h-[100px]
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
                  min-h-[100px]
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
                  min-h-[100px]
                  "
        >
          <H2Bold>Gerenciar Unidades</H2Bold>
        </div>
        <div
          onClick={handleNavigateWhatsapp}
          className="
                  p-6
                  flex
                  items-center
                  justify-center
                  border
                  border-emerald-600
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  hover:border-emerald-400
                  transition-all
                  cursor-pointer
                  group
                  min-h-[100px]
                  "
        >
          <H2Bold>Conexão WhatsApp</H2Bold>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
