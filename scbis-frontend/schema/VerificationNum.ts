import { z } from "zod";

const verificationNumSchema = z.object({
    verificationNum: z.string().length(6, "Verification number must be 6 digits").regex(/^\d+$/, "Verification number must be of type number"),
})

export default verificationNumSchema

export type VerificationNumSchemaType = z.infer<typeof verificationNumSchema> // This will be the type of the form data