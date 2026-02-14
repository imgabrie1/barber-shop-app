import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().min(8, "Telefone inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 5 caracteres"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
