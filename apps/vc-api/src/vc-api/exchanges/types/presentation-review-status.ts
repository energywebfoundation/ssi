/**
 * The status of a presentation review
 * These statuses are NON-STANDARD
 *
 * Similar to {@link https://github.com/energywebfoundation/ssi-hub/blob/8b860e7cdae4e1b1aa75afeab8b9df7ab26befbb/src/modules/claim/claim.types.ts#L7}
 *
 * Maybe similar to Aries Issue-Credential protocol {@link https://github.com/hyperledger/aries-rfcs/blob/main/features/0453-issue-credential-v2/README.md}
 */
export enum PresentationReviewStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected'
}
