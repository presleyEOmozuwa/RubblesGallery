import { sendRefreshToken } from './token-service'

export const tokenRenewalHandler = async (navigate, getToken, setToken, toast) => {
    const { entryToken, renewToken, isVerified, bug } = await sendRefreshToken("/api/refresh-token/payload", getToken("refresh_token"));

    if (isVerified) {
        setToken("access_token", entryToken);
        setToken("refresh_token", renewToken);
    }

    if (bug === "refresh token expired") {
        toast.info("Session expired, Login to continue", { autoClose: 4000 });
        setTimeout(() => {
            navigate('/login');
        }, 4000)
    }
}