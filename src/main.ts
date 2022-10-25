import { initSpotifyAPI } from "./spotify";
import { initDisplay } from "./display";

import "./style.css";

initSpotifyAPI().then(() => {
	initDisplay();
});
