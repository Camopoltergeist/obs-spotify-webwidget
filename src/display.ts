import { getPlaybackState } from "./spotify";

const mainDiv = document.getElementById("mainDiv");
const songTextContainer = document.getElementById("songTextContainer");
const progressContainer = document.getElementById("progressContainer");

if(mainDiv === null){
	throw new Error("Could not find mainDiv in document!");
}

if(songTextContainer === null){
	throw new Error("Could not find songTextContainer in document!");
}

if(progressContainer === null){
	throw new Error("Could not find progressContainer in document!");
}

let currentElem: HTMLSpanElement;
let nextElem: HTMLSpanElement;

function createInitialElements(){
	currentElem = createTextElement();

	currentElem.classList.remove("in");
	currentElem.classList.add("shown");

	currentElem.innerText = "Initial Element";

	nextElem = createTextElement();

	songTextContainer?.append(currentElem, nextElem);
}

createInitialElements();

export function initDisplay(){
	requestAnimationFrame(updateDisplay);
}

function doTransition(nextText: string){
	const inElem = nextElem;
	const outElem = currentElem;

	inElem.classList.remove("in");
	inElem.classList.add("shown");

	inElem.innerText = nextText;

	outElem.classList.remove("shown");
	outElem.classList.add("out");

	outElem.addEventListener("transitionend", () => {
		outElem.remove();
	});

	currentElem = inElem;
	nextElem = createTextElement();
	songTextContainer?.append(nextElem);
}

function createTextElement(){
	const textElem = document.createElement("span");

	textElem.classList.add("songText", "in");

	return textElem;
}

let lastId: string | null = null;

function updateDisplay(time: DOMHighResTimeStamp){
	requestAnimationFrame(updateDisplay);
	const state = getPlaybackState();

	// Handle undocumented edge case with Spotify's API where it returns a null item, a field which should never be null.
	if(state === null || state.item === null){
		if(lastId !== null){
			doTransition("Nobody - Nothing");
		}

		lastId = null;
		return;
	}

	const artist = state.item.artists[0].name;
	const title = state.item.name;

	const timeSinceRefresh = time - state.localTimeStamp;
	const songProgress = state.is_playing ? Math.round(state.progress_ms as number + timeSinceRefresh) : Math.round(state.progress_ms as number);

	const progressStr = generateTimeString(songProgress);

	const updatedText = `${artist} - ${title}`;

	(progressContainer as HTMLDivElement).innerText = progressStr;

	if(state.item.id === lastId){
		currentElem.innerText = updatedText;
	}
	else{
		doTransition(updatedText);
	}

	lastId = state.item.id;
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
