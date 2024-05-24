import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const comfirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "donot-reply@angelsaikia.com",
        to: email,
        subject: "Confirm your email",
        html: `
            <h1>Confirm your email</h1>
            <p>Click the link below to confirm your email</p>
            <a href="${comfirmLink}">Confirm email</a>`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    await resend.emails.send({
        from: "donot-reply@angelsaikia.com",
        to: email,
        subject: "Reset your password",
        html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password</p>
            <a href="${resetLink}">Reset password</a>`,
    });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "donot-reply@angelsaikia.com",
        to: email,
        subject: "Two-factor authentication",
        html: `
            <h1>Two-factor authentication</h1>
            <p>Your OTP is: <strong>${token}</strong></p>`,
    });
};
