import { getPlaybackState, init } from "./spotify";

init().then(async () => {
	console.log((await getPlaybackState())?.progress_ms);
});