import { z } from "zod";

export const registerUserSchema = z.object({
    username: z.string().max(50),
    email: z.email(),
    password: z.string().min(8).max(40)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
});

export const loginUserSchema = z.object({
    email: z.email().min(1, "Email is required!"),
    password: z.string().min(1, "Password is required")
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;