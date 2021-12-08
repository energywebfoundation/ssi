# Internal DID management 
We are talking about the DIDs belonging to your company. They are used to identify you as a company and to provide evidence to your customers and partners.

## Generate a new DID
You can generate a DID based on the following methods:
- secp256k1
- ed25519

You can make a POST request to `/did` where the body MUST contain a `method` field.
`method` can take the value `ethr` or `key`. If no method is passed, the API will return an error.

The freshly created DID will be stored in the database and the API will return the DID document in the following format
### DID document for ethr example
TODO
### DID document for key example
TODO

## Retrieve DID document
To resolve the DID document linked to a DID, you can make a GET call to the  `/did/<did>` endpoint where `your_did` is your did address for ethr and your XXX for key.

## Retrieve verification method
By using the database id of the key, you can retrieve the verification method type by making a GET call to the `/did/verification-method/<id>`. This will return one of the following values:
- ethr
- key

## Update the DID label
To facilitate the use of DIDs, it is possible to apply labels to DIDs to identify them more clearly. For example, it could be interesting to identify a DID by its use, where a DID used to certify the validity of authorizations to an energy market could be called: EnergyMarketCertificationDID.
Adding or modifying a label is done using a POST request to the endpoint `/did/label/<did>` by passing the following parameters in the body:
The label, the description of the DID usage.
TODO example

# External DID management
External DIDs are the DIDs of your customers or partners that you identify as trusted. You will therefore accept evidence from these trusted contacts. We will see below how to define a scope for the trust of a contact. Because it is clear that you will trust a manufacturer to issue a material specification but not to issue any type of proof they might issue.

## Add a contact to your whitelist
Adding a contact is like accepting a DID as trusted. It is therefore necessary for you to perform proper KYC to accept only those partners and customers who are trusted by your company.
Adding a new contact is done by calling a POST request to the endpoint `/did-contact/<new_did>`

## Update the purpose of a DID
In order to define a scope for which you trust a partner or customer, we introduce the concept of purpose. By adding the type of Verifiable Credential that can be issued by a contact you limit the trust given to this contact only for issuing a specific type of proof. It is of course possible to add several purposes to a contact.
Adding a new purpose is done through a POST request to the `/did-purpose/<did>` endpoint by passing the following parameters in the body:
- purpose
To update a purpose, it is necessary to make a PUT TODO request
To delete a purpose, a DELETE TODO request
