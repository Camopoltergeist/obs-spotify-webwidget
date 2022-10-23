import { initSpotifyAPI } from "./spotify";
import { initDisplay } from "./display";

initSpotifyAPI().then(() => {
	initDisplay();
});
