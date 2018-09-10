'use strict';

const Eos = require('eosjs');

function EosCluster() {
	const endpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	const config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var EndpointIndex = -1;

	function NextEndpoint() {
		if (endpoints.length > 0) {
			EndpointIndex++;
			config.httpEndpoint = endpoints[EndpointIndex];
			EndpointIndex %= endpoints.length;
		}
	}

	function CreateEosObject() {
		const EosObject = Eos(config);
		for (var key in EosObject) {
			if (typeof EosObject[key] === 'function' && key !== 'fc' && key !== 'modules' && key !== 'config') {
				const fn_key = key;
				const fn = EosObject[fn_key];
				EosObject[fn_key] = function() {
					const args = arguments;
					const _EndpointIndex = EndpointIndex;
					return fn.apply(null, args).catch((err) => {
						// console.log('ERRRRR', err.code, err.name);
						if (err) {
							if (err.status == 404 || err.status == 429 || (err.name === 'TypeError' && err.message === 'Failed to fetch') || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ECONNREFUSED') {
								if(endpoints.length > 1 && _EndpointIndex === EndpointIndex) {
									NextEndpoint(_EndpointIndex);
								}
								const newEosObject = CreateEosObject();
								for (var key2 in EosObject) {
									if (typeof EosObject[key2] === 'function' && key2 !== 'fc' && key2 !== 'modules' && key2 !== 'config') {
										EosObject[key2] = newEosObject[key2];
									}
								}

								return newEosObject[fn_key].apply(null, args);
							}
						}

						throw Error(err);
					});
				}
			}
		}

		return EosObject;
	}

	NextEndpoint();

	return CreateEosObject();
}

function EosClusterV2() {
	var endpoints = [];
	const config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	if (!config.httpEndpoint) {
	} else if(typeof config.httpEndpoint === 'string') {
		endpoints.push(config.httpEndpoint);
		delete config.httpEndpoint;
	} else {
		endpoints = config.httpEndpoint;
		delete config.httpEndpoint;
	}

	return EosCluster(endpoints, config);
}

function EosClusterScatter() {
	const endpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	return function() {
		const config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		config.httpEndpoint = endpoints;
		return EosClusterV2(config);
	}
}

module.exports = { EosCluster, EosClusterV2, EosClusterScatter };
if(typeof window !== 'undefined') {
	window.EosCluster = EosCluster;
	window.EosClusterV2 = EosClusterV2;
	window.EosClusterScatter = EosClusterScatter;
}