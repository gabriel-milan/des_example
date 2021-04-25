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
  const inp = Buffer.from(text, 'utf-8');
  padding = BUFFER_SIZE - inp.length
  // TODO.
}

console.log(decrypt(sample_cipher_text));