import { Wallet } from 'ethers';

export interface TestUser {
  did: string;
}

export const randomUser = async (): Promise<TestUser> => {
  const wallet = Wallet.createRandom();
  const did = `did:ethr:volta:${wallet.address}`;

  return {
    did
  };
};
