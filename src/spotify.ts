import config from "./config";

const tokenURL = `https://accounts.spotify.com/api/token`;
const apiURL = `https://api.spotify.com/v1`;

const tokenAuthStr = `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`;

interface ITokenResponse{
	access_token: string,
	expires_in: string,
	scope: string,
	token_type: string
};

interface ITokenErrorResponse{
	error: string,
	error_description: string
};

async function refreshToken(){
	const res = await fetch(tokenURL, {
		method: "POST",
		headers: {
			"Authorization": tokenAuthStr,
			"Content-Type": `application/x-www-form-urlencoded`
		},
		body: `grant_type=refresh_token&refresh_token=${config.refreshToken}`
	});

	if(!res.ok){
		const body = await res.json() as ITokenErrorResponse;
		accessToken = null;
		throw new Error(`Failed to refresh token: ${body.error}: ${body.error_description}`);
	}

	const body = await res.json() as ITokenResponse;
	accessToken = body.access_token;
}

refreshToken();