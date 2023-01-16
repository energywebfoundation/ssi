# Credential Metadata

In a SSI credentials ecosystem, there is various metadata that is useful for effectively using the data in the credentials.

## Data Semantics 

Data semantics refers to the meaning of the data.
This includes semantic disambugation (know precisely what a term is refering to)
as well as data descriptions and relationships.

[Linked Data](https://www.w3.org/standards/semanticweb/data) provides semantic disbiguation by requiring that terms be IRIs.

### Linked Data Contexts
[Linked Data context](https://www.w3.org/TR/json-ld/#the-context) maps terms to IRIs.
This allows JSON-LD documents to be written in more concise, readable manner, without sacrificing accuracy.

The VC Implementation Guide also has [instructions on how to create new contexts](https://www.w3.org/TR/vc-imp-guide/#creating-new-credential-types) for verifiable credentials.

### Linked Data Vocabulary/Ontologies

Linked Data can also be used to provide further information about the semantics of a term.
This is provided in a data vocabulary or ontology.

For example, the [RDF Schema comment](https://www.w3.org/TR/rdf-schema/#ch_comment) property can be used to provide further description of a resource.

Note that vocabularies can be used to infer data validation but this is non-standard and violates the open-world assumption of W3C ontology languages.

This point is made in [SHACL and OWL Compared](https://spinrdf.org/shacl-and-owl.html)
> Although data validation is an important practical use case for the RDF stack, until SHACL came around, there was no W3C standard mechanism for defining data constraints. Over time, people became creative in working around this limitation. Many tools simply decided that for all practical purposes, the open-world and non-unique-name assumptions should simply be ignored. OWL-aware tools including TopBraid and Protégé, for example, provide data entry forms that restrict users from entering more than one value if there is a corresponding owl:maxCardinality 1 restriction, or require the selection of a specific instance of ex:Person if that class is the rdfs:range of the property.

The [GAIA-X FAQ](https://www.gxfs.eu/faq/) makes a similar point
> SHACL shapes are not an ontological models. They    serve a different purpose. Ontologies describe concepts and help in inferring additional knowledge. Firstly, the W3C ontology languages follow the Open World Assumption, secondly SHACL follows the Closed World Assumption. If a self-description is missing an attribute, it is an error in the shape validation (and that’s how it should be!). From the ontology’s point of view, the attribute could be defined somewhere else in the WWW, if not in the JSON-LD file at hand (but this extremely decentralised view is not compatible with Gaia-X’s trust-building approach).

## Data Structure Validation

Data structure validation is used to validate that data, for example, contains specific properties or that properties have specific values.

There does not seem to be a single way of describing data structures in the Verifiable Credentials ecosystem as different methods have different tradeoffs.

For verifiable credentials, the schema of a credential can optionally be linked using the [credentialSchema property](https://www.w3.org/TR/vc-data-model/#data-schemas).

### JSON Schema

JSON Schema can be used to describe the precise shape required by the a credential.

The JsonSchemaValidator2018 `credentialSchema` `type` is defined in the [Verifiable Credentials Vocabulary](w3.org/2018/credentials/#JsonSchemaValidator2018)

### Open API Schema

### SHACL

SHACL is the W3C standard for validating RDF graphs. 

SHACL is being [used by GAIA-X for their self-descriptions](https://gaia-x.eu/wp-content/uploads/2022/08/SSI_Self_Description_EN_V3.pdf).
> To check
whether the claims in a Self-Description follow all constraints, such as including all mandatory attributes, the
claims are validated against a shape. Technically, these shapes follow the W3C Shapes Constraint Language
(SHACL). The claims themselves are represented as an RDF graph, serialised in the W3C JSON-LD format,
where JSON is a data interchange format widely supported by programming languages, and JSON-LD (LD =
“linked data”) makes it compatible with RDF. 

### JSON-LD Schema

[JSON-LD Schema](https://github.com/mulesoft-labs/json-ld-schema) is a pre-alpha project that attempts to reconcile the trade-offs of JSON Schema and SHACL.

It notes:
> JSON-LD documents can be seen from two points of view: as regular JSON documents following certain conventions or as RDF graphs encoded using JSON syntax. Validation mechanisms indeed exist for both ways of looking at the information in a JSON-LD document, but each of them has important drawbacks when working with JSON-LD:
> - JSON-Schema can be used to validate JSON-LD as plain JSON documents. However, the information in a JSON-LD document can be encoded through multiple, syntactically different, documents, so it is hard to write a generic JSON-Schema validation without going through a normalisation step, and even if the validation is written for a normalised JSON-LD document, the description of the validation becomes verbose and complex to write, relying, for example, on the usage fo fully expanded URIs. There is also the issue of the implications for the validity of the RDF information encoded in the document when we are just validating the JSON syntax.
> - SHACL can be used to validate the RDF graph encoded in the JSON-LD document. SHACL is powerful and expressive but difficult to write and learn, especially for users that do not want to work with JSON-LD as an RDF format. Additionally, the performance of SHACL validators is far from the performance of syntactical JSON-Schema validators

## Data Display

The [Wallet Rendering](https://identity.foundation/wallet-rendering/) specification describes how a credential can be displayed.
