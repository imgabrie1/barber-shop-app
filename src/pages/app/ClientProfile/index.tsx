import { useAuth } from "@/app/providers/AuthProvider";
import H2Bold from "@/components/ui/H2Bold";
import { LuUser, LuArrowLeft } from "react-icons/lu";
import { FaMobileScreen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import CreateUserForm from "@/components/common/CreateUserForm";
import { usePatchUser } from "@/features/users/hooks/usePatchUser";
import type { UpdateUserDTO } from "@/schemas/register.schemas";

const ClientProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: patchUser } = usePatchUser();
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditSubmit = async (data: UpdateUserDTO) => {
    if (user?.id) {
      const response = await patchUser({ id: user.id, data });
      const updatedUser = response?.data;
      if (updatedUser) {
        updateUser(updatedUser);
      } else {
        updateUser(data);
      }
      setIsEditing(false);
    }
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

      <div className={`p-6 border border-gray-200 rounded-2xl shadow-sm transition-all relative ${!isEditing ? "hover:shadow-md" : ""}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Dados Pessoais</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-500 transition-colors"
          >
            <FaUserEdit size={20} />
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div className="mt-4">
            <CreateUserForm
              isEdit={true}
              defaultValues={{
                name: userOrStranger.name,
                phoneNumber: userOrStranger.phoneNumber,
              }}
              onSuccess={handleEditSubmit}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                  <LuUser size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <H2Bold className="text-xl">
                    {capitalize(userOrStranger.name)}
                  </H2Bold>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between group">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfilePage;
