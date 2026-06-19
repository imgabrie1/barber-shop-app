import { useAuth } from "@/app/providers/AuthProvider";
import H2Bold from "@/components/ui/H2Bold";
import { LuUser, LuArrowLeft } from "react-icons/lu";
import { HiPencilAlt } from "react-icons/hi";
import { FaMobileScreen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

const ClientProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const InvalidUser = {
    name: "Estranho...",
    email: "Cadê teu email?",
    phoneNumber: "cadê teu número?",
    role: "invasor",
  };

  const userOrStranger = user ?? InvalidUser;


  function capitalize(phrase: string) {
    return phrase
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-[62.5rem] mx-auto w-full">
      <div className="flex items-center gap-4 mb-[1.875rem]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <LuArrowLeft size={24} />
        </button>
        <H2Bold>Meu Perfil</H2Bold>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all group relative cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                <LuUser size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <H2Bold className="text-xl">
                  {capitalize(userOrStranger.name)}
                </H2Bold>
              </div>
            </div>
            <FaUserEdit
              size={20}
              className="text-gray-400 hover:text-amber-500 transition-colors"
            />
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all group relative cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full text-green-500 group-hover:scale-110 transition-transform">
                <FaMobileScreen size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone / WhatsApp</p>
                <H2Bold className="text-xl">
                  {userOrStranger.phoneNumber}
                </H2Bold>
              </div>
            </div>
            <HiPencilAlt  
              size={20}
              className="text-gray-400 hover:text-amber-500 transition-colors"
            />
          </div>
        </div>

    

      </div>
    </div>
  );
};

export default ClientProfilePage;
