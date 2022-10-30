import {getConfig} from "./config";

const mainDiv = document.getElementById("mainDiv");
const songTextContainer = document.getElementById("songTextContainer");
const artistTextContainer = document.getElementById("artistTextContainer");
const progressContainer = document.getElementById("progressContainer");

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

export function doTransition(nextTitle: string, nextArtist: string, bgUrl: string){
	const inTitleElem = nextTitleElem;
	const inArtistElem = nextArtistElem;
	const outTitleElem = currentTitleElem;
	const outArtistElem = currentArtistElem;

	inTitleElem.classList.remove("in");
	inTitleElem.classList.add("shown");

	inArtistElem.classList.remove("in");
	inArtistElem.classList.add("shown");

	inTitleElem.innerText = nextTitle;
	inArtistElem.innerText = nextArtist;

	const config = getConfig();

	if(config.bigTransition){
		songTextContainer?.classList.add("bigTitle");
		artistTextContainer?.classList.add("bigArtist")
		clearTimeout(transitionTimeout);

		transitionTimeout = setTimeout(() => {
			songTextContainer?.classList.remove("bigTitle");
			artistTextContainer?.classList.remove("bigArtist")
		}, 7000);
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

	setBackgroundUrl(bgUrl);
}

export function setProgressText(progressText: string){
	(progressContainer as HTMLDivElement).innerText = progressText;
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

function createTextElement(){
	const textElem = document.createElement("div");

	textElem.classList.add("songText", "in");

	return textElem;
}