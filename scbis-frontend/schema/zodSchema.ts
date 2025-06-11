import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().min(1, "Email or phone number is required"),
    password: z.string().min(8,"Password must be at least 8 characters long"),
})

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    Phone:z.string().min(10,"Phone number must be 10 digits long")
})




export const ResetPasswordSchema = z.object({
    password: z.string().min(8,"Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8,"Password must be at least 8 characters long"),
})




export type AuthSchemaType = z.infer<typeof AuthSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
