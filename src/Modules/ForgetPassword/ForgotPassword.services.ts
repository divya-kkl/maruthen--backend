import { userModel } from "../../DB/MongoDB/User/User.js";
import { signToken, verifyToken } from "../../helpers/validation.js";
import bcrypt from "bcryptjs";

export const ForgotPasswordService = {

    async forgotPassword(email: string) {
        if (!email) throw new Error("Email is required");
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }


        const resetToken = signToken({ id: user._id, email: user.email });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        console.log(`Password reset link (send via email): ${resetLink}`);

        return "Password reset link sent to your email";
    },

    async resetPassword(token: string, password: string) {
        if (!token || !password) {
            throw new Error("Token and new password are required");
        }

        let tokenVerify: any;
        try {
            tokenVerify = verifyToken(token);
        } catch (error) {
            throw new Error("Invalid or expired reset token");
        }

        const user = await userModel.findById(tokenVerify.id);
        if (!user) {
            throw new Error("User not found");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        return "Password successfully updated";
    }
};
