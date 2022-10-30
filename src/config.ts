interface IConfig{
	spotify: {
		clientId: string;
		clientSecret: string;
		refreshToken: string;
	};
	bigTransition: boolean;
}

const defaultConfig: IConfig = {
	spotify: {
		clientId: "",
		clientSecret: "",
		refreshToken: ""
	},
	bigTransition: true,
};

function validateConfig(configObj: Partial<IConfig>){
	validateTypes(configObj, defaultConfig);

	const typedConfig = configObj as IConfig;

	if(typedConfig.spotify.clientId === ""){
		throw new Error("Failed to validate config: spotify.clientId is missing!");
	}

	if(typedConfig.spotify.clientSecret === ""){
		throw new Error("Failed to validate config: spotify.clientSecret is missing!");
	}

	if(typedConfig.spotify.refreshToken === ""){
		throw new Error("Failed to validate config: spotify.refreshToken is missing!");
	}
}

function validateTypes(obj: any, model: any, pathStr = ""){
	for(const key in model){
		const target = obj[key];
		const comp = model[key];

		if(typeof target !== typeof comp){
			throw new Error(`Failed to validate config: ${pathStr}${key} has type of "${typeof target}" when expected type was "${typeof comp}"!`);
		}

		if(typeof target === "object"){
			validateTypes(target, comp, `${pathStr}${key}.`);
		}
	}
}

let config = defaultConfig;

export async function initConfig(){
	const parsedConfig = await (await fetch("./config.json")).json() as Partial<IConfig>;
	const combinedConfig = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), parsedConfig) as IConfig;
	
	validateConfig(combinedConfig);

	config = combinedConfig;

	return config;
}

export function getConfig(){
	return config;
}