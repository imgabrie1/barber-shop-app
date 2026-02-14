import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    phoneNumber: z.string().length(11, "O telefone deve ter 11 dígitos (DDD + número)"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    passwordConfirmation: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export type RegisterDTO = z.infer<typeof registerSchema>;
