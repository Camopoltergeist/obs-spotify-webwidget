import config from "./config";

const tokenURL = `https://accounts.spotify.com/api/token`;
const apiURL = `https://api.spotify.com/v1`;

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export async function init(){
	await refreshToken();
}

interface IPlaybackState{
	progress_ms: number | null;
};

export async function getPlaybackState(retry: boolean = true): Promise<IPlaybackState | null>{
	if(accessToken === null){
		if(refreshPromise === null){
			throw new Error(`Failed to get playback state: invalid access token!`);
		}

		await refreshPromise;
	}

	const endPoint = `${apiURL}/me/player`;

	const res = await fetch(endPoint, {
		headers: {
			"Authorization": `Bearer ${accessToken}`
		}
	});

	if(!res.ok){
		throw new Error(`Failed to get playback state: api returned ${res.status} ${res.statusText}`);
	}

	if(res.status === 204){
		return null;
	}

	return await res.json() as IPlaybackState;
}

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
	if(refreshPromise !== null){
		return refreshPromise;
	}

	refreshPromise = new Promise<void>(async (resolve, reject) => {
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

		resolve();
		refreshPromise = null;
	});

	return refreshPromise;
}

refreshToken();