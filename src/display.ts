import { getPlaybackState } from "./spotify";
import { doTransition, setProgressBarWidth, setProgressText, setSongText } from "./domcontroller";

export function initDisplay(){
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

	const artist = state.item.artists[0].name;
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
