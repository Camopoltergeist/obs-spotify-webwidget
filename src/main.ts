function getConfig(){
	const configElement = document.getElementById("config");

	return configElement !== null ? JSON.parse(configElement.innerText) : {};
}

console.log(getConfig());