# eosjs-cluster
eosjs cluster client

### Install
`npm install --save eosjs@latest eosjs-cluster`

### Migrate from eosjs to eosjs-cluster
You can use a instance of EosCluster same way with eosjs object.

```
const eos = Eos({httpEndpoint, chainId, keyProvider});
const eos = EosCluster([httpEndpoint], {chainId, keyProvider});
// both are same.
```

### Example
```
const httpEndpoints = [
	'https://some-wrong-end-point-1.com', // Wrong Endpoint for test
	'https://some-wrong-end-point-2.com', // Wrong Endpoint for test
	'https://eos.greymass.com',
	'https://api.main-net.eosnodeone.io',
	'https://api.eosnewyork.io'
];
const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
const keyProvider = ['PrivateKey1', 'PrivateKey2'];
const account = 'accountname1';

const EosCluster = require('eosjs-cluster');

// Do not use httpEndpoint in second parameter.
// EosCluster(httpEndpoints, {httpEndpoint: 'This is wrong usage!!', chainId, keyProvider});

// EosCluster([] or null or undefined, {chainId, keyProvider});
// == Eos({chainId, keyProvider});

const eos = EosCluster(httpEndpoints, {chainId, keyProvider});

eos.getCurrencyBalance('eosio.token', 'leckoaccount', 'EOS')
.then((res) => {
	console.log(res);
})
.catch((err) => {
	console.log(err);
});
```

### Related project

[DEXEOS, EOS based Decentralized Exchange](https://dexeos.io)

[Bloks.io - EOS Block Explorer](https://bloks.io/)