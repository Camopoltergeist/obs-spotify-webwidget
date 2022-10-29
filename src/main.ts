import { initConfig } from "./config";
import { initSpotifyAPI } from "./spotify";
import { initDisplay } from "./display";

import "./style.css";

async function init(){
	await initConfig();
	await initSpotifyAPI();
	initDisplay();
}

init();
