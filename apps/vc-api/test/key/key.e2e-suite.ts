/**
 * Copyright 2021, 2022 Energy Web Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { walletClient } from '../app.e2e-spec';

export const keySuite = () => {
  it('should export keypair for generated did:key', async () => {
    const didDoc = await walletClient.createDID('key');
    const keyId = didDoc.verificationMethod[0].publicKeyJwk.kid;
    const exportedKey = await walletClient.exportKey(keyId);
    expect(exportedKey).toBeDefined();
  });

  xit('should import and export a key', async () => {
    await walletClient.createDID('key');
  });
};
