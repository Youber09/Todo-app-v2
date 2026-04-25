import { getDeviceInfo } from 'tauri-plugin-device-info-api';
import * as util from "tweetnacl-util";
import nacl from "tweetnacl";
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

const publicKey = `AWM2bkaXaZZrb+/KA+cr9oiILhe65qzfoueQV9Cg8yA=`
const Dir_name = "Todo-app-data";

export const getHardwareID = async () => {
    const device = await getDeviceInfo()

    const hashed = await hashHardwareId(device.uuid)

    return hashed
}


async function hashHardwareId(rawId: string | undefined) {
  // 1. Convert the string (UUID) into a byte array
  const msgUint8 = new TextEncoder().encode(rawId);

  // 2. Calculate the SHA-256 hash (returns an ArrayBuffer)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);

  // 3. Convert the ArrayBuffer to a Hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

export function signLicense(payload: any, privateKeyB64: string) {
  const messageBytes = util.decodeUTF8(JSON.stringify(payload));
  const privateKeyBytes = util.decodeBase64(privateKeyB64);

  const signatureBytes = nacl.sign.detached(messageBytes, privateKeyBytes);

  return util.encodeBase64(signatureBytes);
}

export function verifyLicense(payload : any, signatureB64 : string) {
  const messageBytes = util.decodeUTF8(JSON.stringify(payload));
  const signatureBytes = util.decodeBase64(signatureB64);
  const publicKeyBytes = util.decodeBase64(publicKey);

  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes
  );
}

export const createSignatureFile = async (signature: string) => {
  const data = {signature}

  const json = JSON.stringify(data)

  await writeTextFile(Dir_name + '/License.json', json, {
  baseDir: BaseDirectory.LocalData,
});
}

export const licenseFile = async () => {
  const json = await readTextFile(Dir_name + `/License.json`, {
    baseDir: BaseDirectory.LocalData
  })

  const data = JSON.parse(json)


  return data.signature
}