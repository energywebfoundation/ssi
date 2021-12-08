# Key features

We have designed the functionality of this framework to meet the needs of complete use cases, so the implementation is opiniated and may not match the standards of your IT department but we have also designed the code to be easy to maintain and modify.

## API and standard
All functionalities are accessible through a series of REST requests to the API. The server contains two types of APIs : a first low-level layer that respects the VC-API specifications and a second layer that aims to abstract the complexity of using Verifiable Credentials and DIDs for your company and your developers. We chose this approach after identifying that using these technologies requires a detailed understanding of the specifications and the training costs for your teams could become significant.

## Stockage
Each call to the API will result in storing a result in the database. We have chosen to use a SQLite database. This can be easily modified by following the documentation : Change database.

## DID
It is currently possible to generate DID keys via the following methods: 
- secp256k1
- ed25519
For simple use cases we recommend to use the "TBD" method.
It is likely that an issuer is trusted to issue proofs in a certain scope but not in others. For example, we would trust a battery manufacturer to issue a specification of the batteries produced, but we would not accept evidence from that issuer about whether a user can participate in a specific energy market. We have therefore introduced a concept of purpose that is linked to a DID. 
We accept a DID as an issuer if it is added to your contact list and only for certain types of VCs listed in the purpose list.
And finally, for ease of use, each DID has a label allowing to find the corresponding DID.

## Verifiable credentials
It is possible to issue a VC by specifying the DID to be used. This can be done by using the DID ID or the DID label. 
You can check the validity of a Verifiable credential according to the following criteria:
- The signature is valid
- The DID is considered as trusted
- The VC respects the schema
- The VC has not expired
- The DID has not expired
- CHECK by John

Concerning the issuance of a Verifiable credential, we have chosen to use the WACI flow which is represented in the figure below:
FIGURE WACI

## Verifiable presentation
Todo

# Roadmap

