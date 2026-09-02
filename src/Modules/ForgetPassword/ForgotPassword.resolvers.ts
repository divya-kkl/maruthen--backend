import { ForgotPasswordService } from "./ForgotPassword.services.js";

export const ForgotPasswordResolver = {
    Mutation: {
        forgotPassword: async (_: any, { email }: any, context: any) => {
            return ForgotPasswordService.forgotPassword(email);
        },
        resetPassword: async (_: any, { token, password }: any, context: any) => {
            return ForgotPasswordService.resetPassword(token, password);
        }
    }
};
