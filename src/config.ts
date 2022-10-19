interface IConfig{
	clientId: string;
	clientSecret: string;
	refreshToken: string;
}

function getConfig(){
	const configElement = document.getElementById("config");

	if(configElement === null){
		throw new Error(`Missing config element from document!`);
	}

	const parsedConfig = JSON.parse(configElement.innerText) as Partial<IConfig>;

	if(typeof parsedConfig.clientId !== "string"){
		throw new Error(`Missing required config field: clientId`);
	}

	if(typeof parsedConfig.clientSecret !== "string"){
		throw new Error(`Missing required config field: clientSecret`);
	}

	if(typeof parsedConfig.refreshToken !== "string"){
		throw new Error(`Missing required config field: refreshToken`);
	}

	return parsedConfig as IConfig;
}

const config = getConfig();

export default config;