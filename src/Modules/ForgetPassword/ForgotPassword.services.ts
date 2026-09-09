import { userModel } from "../../DB/MongoDB/User/User.js";
import { signToken, verifyToken } from "../../helpers/validation.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../helpers/resend.js";

export const ForgotPasswordService = {

    async forgotPassword(email: string) {
        if (!email) throw new Error("Email is required");
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }


        const resetToken = signToken({ id: user._id, email: user.email });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&id=${user._id}`;

        const emailTemplateHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .btn { display: inline-block; padding: 12px 25px; background: #4a90e2; color: #fff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        
        <a href="${resetLink}" class="btn">Reset My Password</a>
        
        <p style="margin-top: 30px; font-size: 13px; color: #888;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
</body>
</html>
`;

        await sendEmail({
            to: email,
            subject: 'Reset Your Password - Jewellery Store',
            html: emailTemplateHTML
        });

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
