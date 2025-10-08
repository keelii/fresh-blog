import { crypto } from "jsr:@std/crypto/crypto";

export function uint8ToBase64(u8Arr: Uint8Array) {
  let result = "";
  const chunkSize = 0x8000; // 32KB per chunk
  for (let i = 0; i < u8Arr.length; i += chunkSize) {
    const chunk = u8Arr.subarray(i, i + chunkSize);
    result += String.fromCharCode(...chunk);
  }
  return btoa(result);
}
export function base64ToUint8(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const u8Arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8Arr[i] = binary.charCodeAt(i);
  }
  return u8Arr;
}

async function generateKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function exportKey() {
  const key = await generateKey();
  const raw = await crypto.subtle.exportKey("raw", key);
  return uint8ToBase64(new Uint8Array(raw));
}

async function importKey(b64: string) {
  const raw = base64ToUint8(b64)
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}
async function importKeyBase64(b64: string) {
  return importKey(base64ToUint8(b64));
}

async function encryptText(key: CryptoKey, text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return { iv: uint8ToBase64(iv), ciphertext: uint8ToBase64(new Uint8Array(encrypted)) };
}

async function decryptText(key: CryptoKey, ivB64: string, ciphertextB64: string) {
  const iv = base64ToUint8(ivB64);
  const ciphertext = base64ToUint8(ciphertextB64);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}


let exportedKey = ""
if (!Deno.env.has("ENCRYPT_KEY")) {
  console.warn("ENCRYPT_KEY not set, generating a new one.");
  const exportedKey = await exportKey();
  console.log(exportedKey);
  Deno.exit(1)
} else {
  exportedKey = Deno.env.get("ENCRYPT_KEY")
}

const importedKey = await importKey(exportedKey);
// const { iv, ciphertext } = await encryptText(importedKey, "这是一个大段文本，可以很长很长...");
//
// const decrypted = await decryptText(importedKey, iv, ciphertext);
// console.log("解密后的文本:", decrypted);

export async function encryptString(text: string) {
  return await encryptText(importedKey, text)
}
export async function decryptString(iv: string, ciphertext: string) {
  return await decryptText(importedKey, iv, ciphertext)
}
