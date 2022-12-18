import {getConfig} from "./config";

const mainDiv = document.getElementById("mainDiv");
const songTextContainer = document.getElementById("songTextContainer");
const artistTextContainer = document.getElementById("artistTextContainer");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

const dimmer = document.getElementById("dimmer");

if(mainDiv === null){
	throw new Error("Could not find mainDiv in document!");
}

if(songTextContainer === null){
	throw new Error("Could not find songTextContainer in document!");
}

if(artistTextContainer === null){
	throw new Error("Could not find artistTextContainer in document!");
}

if(progressContainer === null){
	throw new Error("Could not find progressContainer in document!");
}

if(progressBar === null){
	throw new Error("Could not find progressBar in document!");
}

if(dimmer === null){
	throw new Error("Could not find dimmer in document!");
}

let currentTitleElem: HTMLDivElement;
let currentArtistElem: HTMLDivElement;

let nextTitleElem: HTMLDivElement;
let nextArtistElem: HTMLDivElement;

function createInitialElements(){
	currentTitleElem = createTextElement();
	currentTitleElem.classList.remove("in");
	currentTitleElem.classList.add("shown");
	currentTitleElem.innerText = "Initial Title";

	currentArtistElem = createTextElement();
	currentArtistElem.classList.remove("in");
	currentArtistElem.classList.add("shown");
	currentArtistElem.innerText = "Initial Artist";

	nextTitleElem = createTextElement();
	nextArtistElem = createTextElement();

	songTextContainer?.append(currentTitleElem, nextTitleElem);
	artistTextContainer?.append(currentArtistElem, nextArtistElem);
}

createInitialElements();

let transitionTimeout: number | undefined;

export function doTransition(nextTitle?: string, nextArtist?: string, bgUrl?: string){
	const inTitleElem = nextTitleElem;
	const inArtistElem = nextArtistElem;
	const outTitleElem = currentTitleElem;
	const outArtistElem = currentArtistElem;

	inTitleElem.classList.remove("in");
	inTitleElem.classList.add("shown");

	inArtistElem.classList.remove("in");
	inArtistElem.classList.add("shown");

	if(nextTitle !== undefined){
		console.log(nextTitle);
		inTitleElem.innerText = nextTitle;
	}

	if(nextArtist !== undefined){
		inArtistElem.innerText = nextArtist;
	}

	const config = getConfig();

	if(config.bigTransition){
		dimmer?.classList.remove("dim");
		dimmer?.classList.add("bright");

		songTextContainer?.classList.add("bigTitle");
		artistTextContainer?.classList.add("bigArtist");
		clearTimeout(transitionTimeout);

		const main = mainDiv as HTMLDivElement;
		const transitionHeight = main.offsetWidth * config.bigTransitionSize;
		main.style.height = `${transitionHeight}px`;
		main.classList.add("bigPos");

		transitionTimeout = setTimeout(cancelTransition, 7000);
	}

	outTitleElem.classList.remove("shown");
	outTitleElem.classList.add("out");

	outArtistElem.classList.remove("shown");
	outArtistElem.classList.add("out");

	outTitleElem.addEventListener("transitionend", () => {
		outTitleElem.remove();
		outArtistElem.remove();
	});

	currentTitleElem = inTitleElem;
	currentArtistElem = inArtistElem;

	nextTitleElem = createTextElement();
	nextArtistElem = createTextElement();

	songTextContainer?.append(nextTitleElem);
	artistTextContainer?.append(nextArtistElem);

	if(bgUrl !== undefined){
		setBackgroundUrl(bgUrl);
	}
}

export function cancelTransition(){
	const main = mainDiv as HTMLDivElement;

	main.style.height = "";
	main.classList.remove("bigPos");
	
	songTextContainer?.classList.remove("bigTitle");
	artistTextContainer?.classList.remove("bigArtist");

	dimmer?.classList.add("dim");
	dimmer?.classList.remove("bright");
}

export function setMainWidth(width: number){
	(mainDiv as HTMLDivElement).style.width = `${width}px`;
}

export function setProgressText(progressText: string){
	(progressContainer as HTMLDivElement).innerText = progressText;
}

export function setProgressBarWidth(width: number){
	(progressBar as HTMLDivElement).style.width = `${width * 100}%`;
}

export function setSongText(songText: string){
	currentTitleElem.innerText = songText;
}

export function setArtistText(artistText: string){
	(artistTextContainer as HTMLDivElement).innerText = artistText;
}

export function setBackgroundUrl(bgUrl: string){
	(mainDiv as HTMLDivElement).style.backgroundImage = `url("${bgUrl}")`;
}

export function hide(){
	(mainDiv as HTMLDivElement).classList.add("hidden");
}

export function show(){
	(mainDiv as HTMLDivElement).classList.remove("hidden");
}

function createTextElement(){
	const textElem = document.createElement("div");

	textElem.classList.add("songText", "in");

	return textElem;
}