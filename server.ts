import express from "express";
import { ethers } from "ethers";
import bodyParser from "body-parser";
import { signTypedMessage } from "eth-sig-util";
import _ from 'lodash';
const app = express();

// Parse JSON request body
app.use(bodyParser.json());

// POST endpoint for signing meta transactions
app.post("/sign-meta-tx", async (req: any, res: any) => {
  try {
    const { chainId, privateKey, forwarderHash, txnRequest } = req.body;

    const eip712Transaction = await unsignedEip712Creator(
      txnRequest.from,
      txnRequest.to,
      txnRequest.data,
      txnRequest.value,
      txnRequest.nonce,
      txnRequest.gas,
      forwarderHash,
      chainId
    );
    const transaction = JSON.stringify(eip712Transaction);
    const privateKeyBuffer = Buffer.from(
      ethers.utils.arrayify(privateKey).buffer
    );
    const signature = signTypedMessage(privateKeyBuffer, {
      data: JSON.parse(transaction),
    });
    res.send({
      signedTxn: signature,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

export const FORWARDER_DOMAIN = {
  name: "MinimalForwarder",
  version: "0.0.1",
  chainId: 0,
  verifyingContract: "",
};

export const EIP_712_DOMAIN = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

export const FORWARDER_TYPES = {
  EIP712Domain: EIP_712_DOMAIN,
  ForwardRequest: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
  ],
};

export async function unsignedEip712Creator(
  from: string,
  to: string,
  data: string,
  value: string,
  nonce: string,
  gas: string,
  forwarderHash: string,
  chainId: number
) {
  let request = {
    from: from,
    to: to,
    data: data,
    value: value,
    nonce: nonce,
    gas: gas,
  };

  let targetDomain = _.cloneDeep(FORWARDER_DOMAIN);
  targetDomain["verifyingContract"] = forwarderHash;
  targetDomain["chainId"] = chainId;

  return {
    types: FORWARDER_TYPES,
    domain: targetDomain,
    primaryType: "ForwardRequest",
    message: request,
  };
}
