# Formats

## DID 
The framework supports two types of DIDs:
- ethr with secp256k1 type signatures
- key with signatures of type ed25519
The attached DID documents give an example of formatting.
TODO ADD did document

## VC/VP
The framework fully supports JSON-LD. JWT is not currently supported.
The exchange can be done using a QR code which is formatted as follows TODO
The deeplinks offered by the framework are of type didcomm://<yourlink>
Currently, the framework does not support creating new VCs from template, it is necessary to implement a specific function in the framework to create these new types of VCs. 


