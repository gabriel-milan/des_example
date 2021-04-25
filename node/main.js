const CryptoJS = require('crypto-js');
const key = CryptoJS.enc.Hex.parse("3b3898371520f75e");
const BUFFER_SIZE = 100;

let sample_text = '{\r\n  "sensor_id": "DES_EXAMPLE",\r\n  "beat": 85,\r\n  "spo2": 99,\r\n  "temp": 36.5\r\n}'
let sample_cipher_text = "3PVOhB2vmIOejkWfg+gsgywHdlNZtkinT0QnlZ5h7XtxDF5IkpkIA07Lqcw4w8hgqdNgd8sjikSOOTddviTbcMy4sbVvBeFTR5rrsX79ihFMWRqyIqqBn4Oh6BSIklPgAAAAAA=="

function decrypt(cipher_text) {
  const inp = Buffer.from(cipher_text, 'base64');
  let i = 0;
  let output = "";
  while ((inp.length - i) >= 8) {
    output += CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(inp.slice(i, i + 8).toString('hex')) }, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    }).toString(CryptoJS.enc.Utf8);
    i += 8;
  }
  return output;
}

function encrypt(text) {
  let inp = Buffer.alloc(BUFFER_SIZE);
  inp.fill(0);
  let textBuffer = Buffer.from(text, 'utf-8');
  for (let i = 0; i < textBuffer.length; i++) {
    inp[i] = textBuffer[i];
  }
  let i = 0;
  let cipher_text = Buffer.alloc(BUFFER_SIZE);
  cipher_text.fill(0);
  while ((inp.length - i) >= 8) {
    let cipher = Buffer.from(CryptoJS.DES.encrypt(CryptoJS.enc.Hex.parse(inp.slice(i, i + 8).toString('hex')), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    }).ciphertext.toString(CryptoJS.enc.Hex), 'hex');
    for (let j = i; j < i + 8; j++) {
      cipher_text[j] = cipher[j - i];
    }
    i += 8;
  }
  return cipher_text.toString('base64');
}

console.log("--> Testing encrypt...")
console.log("Input: " + sample_text)
console.log("Expected output: " + sample_cipher_text)
console.log("Real output: " + encrypt(sample_text))
console.log("--> Testing decrypt...")
console.log("Input: " + sample_cipher_text)
console.log("Expected output: " + sample_text)
console.log("Real output: " + decrypt(sample_cipher_text))