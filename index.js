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
					return fn(...args).catch((err) => {
						if (err) {
							if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
								if(endpoints.length > 1 && (_EndpointIndex + 1) % endpoints.length !== EndpointIndex) {
									NextEndpoint();
								}
								const newEosObject = CreateEosObject();
								for (var key2 in EosObject) {
									if (typeof EosObject[key2] === 'function' && key2 !== 'fc' && key2 !== 'modules' && key2 !== 'config') {
										EosObject[key2] = newEosObject[key2];
									}
								}

								return newEosObject[fn_key](...args);
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

module.exports = EosCluster;