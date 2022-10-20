import { getPlaybackState, init } from "./spotify";

const mainDiv = document.getElementById("mainDiv");

if(mainDiv === null){
	throw new Error("Could not find mainDiv in document!");
}

init().then(() => {
	requestAnimationFrame(updateDisplay);
});

function updateDisplay(){
	requestAnimationFrame(updateDisplay);
	const state = getPlaybackState();

	if(state === null){
		(mainDiv as HTMLDivElement).innerText = "Nobody - Nothing";
		return;
	}

	const artist = state.item.artists[0].name;
	const title = state.item.name;

	(mainDiv as HTMLDivElement).innerText = `${artist} - ${title}`;
}