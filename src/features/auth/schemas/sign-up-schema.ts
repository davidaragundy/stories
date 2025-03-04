import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }).max(50, {
        message: "Name must be at most 50 characters long",
    }),
    email: z.string().email({
        message: "Email must be a valid email address",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }).max(50, {
        message: "Password must be at most 50 characters long",
    }),
})