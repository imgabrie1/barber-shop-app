import { useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import H2Bold from "@/components/ui/H2Bold";
import Button from "@/components/ui/Button";
import { maskPhone, unmaskPhone } from "@/utils/masks";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const PlatformPage = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTenantData, setNewTenantData] = useState({
    tenantName: "",
    slug: "",
    adminName: "",
    adminPhone: "",
    adminPassword: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchTenants = async () => {
    try {
      const response = await api.get("/platform/tenants");
      setTenants(response.data);
    } catch (err) {
      toast.error("Erro ao buscar tenants.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/platform/tenants/${id}`, { isActive: !currentStatus });
      toast.success(
        `Tenant ${!currentStatus ? "ativado" : "desativado"} com sucesso.`,
      );
      fetchTenants();
    } catch (err) {
      toast.error("Erro ao alterar status do tenant.");
      console.log(err);
    }
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "adminPhone") {
      setNewTenantData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else if (name === "tenantName") {
      const slugVal = generateSlug(value);
      setNewTenantData((prev) => ({
        ...prev,
        tenantName: value,
        slug: slugVal,
      }));
    } else if (name === "slug") {
      const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setNewTenantData((prev) => ({ ...prev, slug: cleanedSlug }));
    } else {
      setNewTenantData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        tenantName: newTenantData.tenantName,
        slug: newTenantData.slug,
        adminName: newTenantData.adminName,
        adminPhone: unmaskPhone(newTenantData.adminPhone),
        adminPassword: newTenantData.adminPassword,
      };
      await api.post("/platform/tenants", payload);
      toast.success("Tenant criado com sucesso!");
      setIsModalOpen(false);
      setNewTenantData({
        tenantName: "",
        slug: "",
        adminName: "",
        adminPhone: "",
        adminPassword: "",
      });
      fetchTenants();
    } catch (error: unknown) {
      toast.error("Erro ao criar tenant.");
      console.log(error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <H2Bold>Gerenciamento da Plataforma</H2Bold>
        <Button onClick={() => setIsModalOpen(true)}>Novo Tenant</Button>
      </div>

      <div className="bg-[var(--block)] rounded-xl shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Carregando tenants...
          </div>
        ) : tenants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum tenant cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Nome
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Slug
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Data de Criação
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="p-4 font-medium">{tenant.name}</td>
                    <td className="p-4 text-gray-500">{tenant.slug}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${tenant.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {tenant.isActive ? "ATIVO" : "INATIVO"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(tenant.id, tenant.isActive)
                        }
                        className={`text-xs px-3 py-1 ${tenant.isActive ? "!bg-red-600 hover:!bg-red-700" : "!bg-green-600 hover:!bg-green-700"}`}
                      >
                        {tenant.isActive ? "Desativar" : "Ativar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--block)] w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-[var(--textPrimary)] mb-6">
              Criar Novo Tenant
            </h3>

            <form onSubmit={handleCreateTenant} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Nome da Barbearia
                </label>
                <input
                  name="tenantName"
                  required
                  value={newTenantData.tenantName}
                  onChange={handleModalChange}
                  placeholder="Ex: Barbearia VIP"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--inputColor)] border border-gray-200 text-sm outline-none text-white focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Slug (URL de acesso)
                </label>
                <input
                  name="slug"
                  required
                  value={newTenantData.slug}
                  onChange={handleModalChange}
                  placeholder="barbearia-vip"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--inputColor)] border border-gray-200 text-sm outline-none text-white focus:border-primary-500"
                />
                <span className="text-[9px] text-gray-500">
                  Link de acesso: /b/{newTenantData.slug || "link"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Nome do Administrador
                </label>
                <input
                  name="adminName"
                  required
                  value={newTenantData.adminName}
                  onChange={handleModalChange}
                  placeholder="Ex: Carlos Oliveira"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--inputColor)] border border-gray-200 text-sm outline-none text-white focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Telefone do Administrador
                </label>
                <input
                  name="adminPhone"
                  type="tel"
                  required
                  value={newTenantData.adminPhone}
                  onChange={handleModalChange}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--inputColor)] border border-gray-200 text-sm outline-none text-white focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Senha do Administrador
                </label>
                <input
                  name="adminPassword"
                  type="password"
                  required
                  minLength={4}
                  value={newTenantData.adminPassword}
                  onChange={handleModalChange}
                  placeholder="Senha forte"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--inputColor)] border border-gray-200 text-sm outline-none text-white focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-50 text-gray-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <Button type="submit" loading={modalLoading}>
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformPage;
