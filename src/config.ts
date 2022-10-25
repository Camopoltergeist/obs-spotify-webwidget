interface IConfig{
	spotify: {
		clientId: string;
		clientSecret: string;
		refreshToken: string;
	},
	bigTransition: boolean
}

function getConfig(){
	const configElement = document.getElementById("config");

	if(configElement === null){
		throw new Error(`Missing config element from document!`);
	}

	const parsedConfig = JSON.parse(configElement.innerText) as Partial<IConfig>;

	if(typeof parsedConfig?.spotify?.clientId !== "string"){
		throw new Error(`Missing required config field: clientId`);
	}

	if(typeof parsedConfig?.spotify?.clientSecret !== "string"){
		throw new Error(`Missing required config field: clientSecret`);
	}

	if(typeof parsedConfig?.spotify?.refreshToken !== "string"){
		throw new Error(`Missing required config field: refreshToken`);
	}

	parsedConfig.bigTransition = parsedConfig.bigTransition ?? true;

	return parsedConfig as IConfig;
}

const config = getConfig();

export default config;