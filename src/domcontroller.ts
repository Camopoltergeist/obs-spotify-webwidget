import {getConfig} from "./config";

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

let transitionTimeout: number | undefined;

export function doTransition(nextText: string){
	const inElem = nextElem;
	const outElem = currentElem;

	inElem.classList.remove("in");
	inElem.classList.add("shown");

	inElem.innerText = nextText;

	const config = getConfig();

	if(config.bigTransition){
		songTextContainer?.classList.add("big");
		clearTimeout(transitionTimeout);

		transitionTimeout = setTimeout(() => {
			songTextContainer?.classList.remove("big");
		}, 7000);
	}

	outElem.classList.remove("shown");
	outElem.classList.add("out");

	outElem.addEventListener("transitionend", () => {
		outElem.remove();
	});

	currentElem = inElem;
	nextElem = createTextElement();
	songTextContainer?.append(nextElem);
}

export function setProgressText(progressText: string){
	(progressContainer as HTMLDivElement).innerText = progressText;
}

export function setSongText(songText: string){
	currentElem.innerText = songText;
}

function createTextElement(){
	const textElem = document.createElement("div");

	textElem.classList.add("songText", "in");

	return textElem;
}