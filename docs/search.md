# Search in the database
For many use cases, it will be necessary to search the database for VCs that have been issued by your company or that have been verified.
The search is done using the endpoint /search via GET methods.

## Recherche de VC émis
The search result returns an id or a list of ids if more than one is available. If the value "null" is returned, there is no record satisfying the search criteria.

### Via un type
It is possible to filter the search by adding the "vc_type" field in the query body. The "vc_type" will be the value of the type of Verifiable Credential searched. 
EXAMPLE

### Via un DID
Use the field "issued_to" with the value of the DID searched or a list of DIDs.
EXAMPLE

### Par date d'issuance

### Par date d'expiration


