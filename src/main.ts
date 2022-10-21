import { getPlaybackState, init } from "./spotify";

const mainDiv = document.getElementById("mainDiv");

if(mainDiv === null){
	throw new Error("Could not find mainDiv in document!");
}

init().then(() => {
	requestAnimationFrame(updateDisplay);
});

function updateDisplay(time: DOMHighResTimeStamp){
	requestAnimationFrame(updateDisplay);
	const state = getPlaybackState();

	if(state === null){
		(mainDiv as HTMLDivElement).innerText = "Nobody - Nothing";
		return;
	}

	const artist = state.item.artists[0].name;
	const title = state.item.name;

	const timeSinceRefresh = time - state.localTimeStamp;
	const songProgress = Math.round(state.progress_ms as number + timeSinceRefresh);

	const progressStr = generateTimeString(songProgress);

	(mainDiv as HTMLDivElement).innerText = `${artist} - ${title} [${progressStr}]`;
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