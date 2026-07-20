import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import H2Bold from "@/components/ui/H2Bold";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { maskPhone, unmaskPhone } from "@/utils/masks";

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

export const RegisterTenantPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: "",
    slug: "",
    adminName: "",
    adminPhone: "",
    adminPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "adminPhone") {
      setFormData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else if (name === "tenantName") {
      const slugVal = generateSlug(value);
      setFormData((prev) => ({ ...prev, tenantName: value, slug: slugVal }));
    } else if (name === "slug") {
      const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug: cleanedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tenantName: formData.tenantName,
        slug: formData.slug,
        adminName: formData.adminName,
        adminPhone: unmaskPhone(formData.adminPhone),
        adminPassword: formData.adminPassword,
      };

      const res = await api.post("/tenant/register", payload);

      toast.success("Barbearia cadastrada com sucesso! Redirecionando...");

      setTimeout(() => {
        navigate(`/t/${res.data.slug}/login`);
      }, 2000);
    } catch (err: unknown) {
      toast.error("Erro ao cadastrar barbearia.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex justify-center text-center">
          <H2Bold>CADASTRAR BARBEARIA</H2Bold>
        </div>

        <form
          className="bg-[var(--block)] p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Nome da Barbearia
              </label>
              <Input
                name="tenantName"
                placeholder="Ex: Barbearia do João"
                required
                value={formData.tenantName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Slug (URL de acesso)
              </label>
              <Input
                name="slug"
                placeholder="barbearia-do-joao"
                required
                value={formData.slug}
                onChange={handleChange}
              />
              <span className="text-[10px] text-gray-500">
                Seu link de acesso será: /t/{formData.slug || "link"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Seu Nome (Administrador)
              </label>
              <Input
                name="adminName"
                placeholder="Ex: João Silva"
                required
                value={formData.adminName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Seu Telefone
              </label>
              <Input
                name="adminPhone"
                type="tel"
                placeholder="(00) 00000-0000"
                required
                value={formData.adminPhone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Senha do Administrador
              </label>
              <Input
                name="adminPassword"
                type="password"
                placeholder="Crie uma senha"
                required
                minLength={6}
                value={formData.adminPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Criar Minha Barbearia
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Já tem uma conta?</span>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-bold underline cursor-pointer hover:text-gray-500 text-gray-300"
          >
            Faça login
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegisterTenantPage;
