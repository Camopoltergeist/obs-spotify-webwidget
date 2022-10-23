import { getPlaybackState, init, IPlaybackState } from "./spotify";

const mainDiv = document.getElementById("mainDiv");

if(mainDiv === null){
	throw new Error("Could not find mainDiv in document!");
}

init().then(() => {
	requestAnimationFrame(updateDisplay);
});

let currentElem: HTMLSpanElement;
let nextElem: HTMLSpanElement;

function createInitialElements(){
	currentElem = createTextElement();

	currentElem.classList.remove("in");
	currentElem.classList.add("shown");

	currentElem.innerText = "Initial Element";

	nextElem = createTextElement();

	mainDiv?.append(currentElem, nextElem);
}

createInitialElements();

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
	mainDiv?.append(nextElem);
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

	if(state === null){
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

	const updatedText = `${artist} - ${title} [${progressStr}]`;

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