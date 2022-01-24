import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';

/**
 * Trying to caculate the CID for a document
 * https://discuss.ipfs.io/t/generate-file-hash-locally-on-browser/10607
 * https://discuss.ipfs.io/t/manually-calculate-the-ipfs-cid-v2/11671
 * @param document
 * @returns CID v1
 */
export const calculateCID = async (document: Record<string, any>) => {
  const bytes = json.encode({ hello: 'world' });
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, json.code, hash);
  return cid.toString();
};
