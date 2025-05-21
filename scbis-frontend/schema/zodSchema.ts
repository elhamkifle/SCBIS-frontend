import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().min(1, "Email or phone number is required"),
    password: z.string().min(8,"Password must be at least 8 characters long"),
})

export type AuthSchemaType = {
    email: string;
    password: string;
}