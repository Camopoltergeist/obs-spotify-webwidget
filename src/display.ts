import { getPlaybackState, IArtist } from "./spotify";
import { doTransition, setMainWidth, setProgressBarWidth, setProgressText, setSongText } from "./domcontroller";
import { getConfig } from "./config";

export function initDisplay(){
	setMainWidth(getConfig().width);
	requestAnimationFrame(updateDisplay);
}

let lastId: string | null = null;

function updateDisplay(time: DOMHighResTimeStamp){
	requestAnimationFrame(updateDisplay);
	const state = getPlaybackState();

	// Handle undocumented edge case with Spotify's API where it returns a null item, a field which should never be null.
	if(state === null || state.item === null){
		if(lastId !== null){
			doTransition("Nothing", "Nobody", "");
		}

		lastId = null;
		return;
	}

	const artist = generateArtistString(state.item.artists);
	const title = state.item.name;

	// Determine the progress of the song
	const timeSinceRefresh = time - state.localTimeStamp;
	const songProgress = state.is_playing ? Math.round(state.progress_ms as number + timeSinceRefresh) : Math.round(state.progress_ms as number);
	const progressPercent = songProgress / state.item.duration_ms;

	const progressStr = generateTimeString(songProgress);

	setProgressText(progressStr);
	setProgressBarWidth(progressPercent);

	if(state.item.id !== lastId){
		doTransition(title, artist, state.item.album.images[0].url);
		lastId = state.item.id;

		return;
	}
}

function generateArtistString(artistList: IArtist[]){
	let artistStr = artistList[0].name;

	for(let i = 1; i < artistList.length - 1; i++){
		artistStr += `, ${artistList[i].name}`;
	}

	if(artistList.length > 1){
		artistStr += ` & ${artistList[artistList.length - 1].name}`;
	}

	return artistStr;
}

function generateTimeString(timeMS: number): string{
	let minutes = String(Math.floor(timeMS / 60000));
	let seconds = String(Math.floor(timeMS % 60000 / 1000));

	if(minutes.length < 2){
		minutes = "0" + minutes;
	}

	if(seconds.length < 2){
		seconds = "0" + seconds;
	}

	return `${minutes} : ${seconds}`;
}
