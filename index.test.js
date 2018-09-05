// const httpEndpoints = [
// 	'https://some-wrong-end-point-1.com', // Wrong Endpoint for test
// 	'https://some-wrong-end-point-2.com', // Wrong Endpoint for test
// 	'https://eos.greymass.com',
// 	'https://api.main-net.eosnodeone.io',
// 	'https://api.eosnewyork.io'
// ];
// const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
// const keyProvider = ['PrivateKey1', 'PrivateKey2'];
// const account = 'accountname1';
// const binaryen = require('binaryen');

// const EosCluster = require('./index');

// // Do not use httpEndpoint in second parameter.
// // EosCluster(httpEndpoints, {httpEndpoint: 'This is wrong usage!!', chainId, keyProvider, binaryen});

// // EosCluster([] or null or undefined, {chainId, keyProvider, binaryen});
// // == Eos({chainId, keyProvider, binaryen});

// const eos = EosCluster(httpEndpoints, {chainId, keyProvider, binaryen});

// eos.getCurrencyBalance('eosio.token', 'leckoaccount', 'EOS')
// .then((res) => {
// 	console.log(res);
// })
// .catch((err) => {
// 	console.log(err);
// });

const EosCluster = require('./')
const httpEndpoints = [
	'https://some-wrong-end-point-1.com', // Wrong Endpoint for test
	'https://some-wrong-end-point-2.com', // Wrong Endpoint for test
	'https://eos.greymass.com',
	'https://api.main-net.eosnodeone.io',
	'https://api.eosnewyork.io'
];
const eosCluster = EosCluster(httpEndpoints, {chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'})

var i = 0;
var j = 0;
function a() {
	j++;

	eosCluster.getInfo({})
		.then(result => {
			i++;
			console.log('good', i);
		})
		.catch(err => {
			console.log(err);
		});
		
	if(j == 20) {
		return;
	}
	setTimeout(() => {
		a();
	}, 100);
}
a();