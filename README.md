# temp-signing-service

## Signing Request to be sent:

```
curl --location 'localhost:3000/sign-meta-tx' \
--header 'Content-Type: application/json' \
--data '{
	"chainId": 80001,
	"privateKey": "${privateKey}",
	"forwarderHash": "0x06aBc1aD63b4c238E810175536A92444252E9C01",
	"txnRequest": {
		"from": "0x3E5d13845fc7704DE7974862739C70CE04151055",
		"to": "0xE2cf236999664C898c61bD40096e4A733F006C7E",
		"data": "0xa9059cbb0000000000000000000000005b5c2e0e28172c53c2ea69e0ae2686a7a07ccab7000000000000000000000000000000000000000000000001fec3ee47bd61887c",
		"value": "0",
		"nonce": "72",
		"gas": "65000"
	}
}'
```
