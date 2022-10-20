import { getPlaybackState, init } from "./spotify";

init().then(async () => {
	console.log((await getPlaybackState())?.item.name);
});