import config from "./config";

const tokenURL = `https://accounts.spotify.com/api/token`;
const apiURL = `https://api.spotify.com/v1`;

const tokenAuthStr = `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`;

let accessToken = null;

async function refreshToken(){
	const res = await fetch(tokenURL, {
		method: "POST",
		headers: {
			"Authorization": tokenAuthStr,
			"Content-Type": `application/x-www-form-urlencoded`
		},
		body: `grant_type=refresh_token&refresh_token=${config.refreshToken}`
	});

	const body = await res.json();

	if(!res.ok){
		throw new Error(`Failed to refresh token: ${body.error}: ${body.error_description}`);
	}

	accessToken = body.access_token;
}

refreshToken();