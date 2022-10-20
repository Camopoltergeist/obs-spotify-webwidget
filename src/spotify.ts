import config from "./config";

const tokenURL = `https://accounts.spotify.com/api/token`;
const apiURL = `https://api.spotify.com/v1`;

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export async function init(){
	await refreshToken();
}

interface IPlaybackState{
	device: any;
	repeat_state: string;
	shuffle_state: string;
	context: any | null;
	timestamp: number;
	progress_ms: number | null;
	is_playing: boolean;
	item: IPlaybackItem;
	currently_playing_type: string;
	actions: any;
};

interface IPlaybackItem{
	album: any;
	artists: IArtist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
		ean: string;
		upc: string;
	};
	external_urls: {
		spotify: string;
	}
	href: string;
	id: string;
	is_playable?: boolean;
	linked_from?: any;
	restrictions: any;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
	is_local: string;
}

interface IArtist{
	external_urls: any;
	followers: any;
	genres: string[];
	href: string;
	id: string;
	images: ISpotifyImage[];
	name: string;
	popularity: number;
	type: string;
	uri: string;
}

interface ISpotifyImage{
	url: string;
	height: number;
	width: number;
}

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