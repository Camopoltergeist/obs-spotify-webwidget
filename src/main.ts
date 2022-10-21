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
	const songTime = Math.round(state.progress_ms as number + timeSinceRefresh);

	(mainDiv as HTMLDivElement).innerText = `${artist} - ${title} [${songTime}]`;
}