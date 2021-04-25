import base64
from Crypto.Cipher import DES

BUFFER_SIZE = 100
key = bytes.fromhex("3b3898371520f75e")
des = DES.new(key, DES.MODE_ECB)

sample_text = '{\r\n  "sensor_id": "DES_EXAMPLE",\r\n  "beat": 85,\r\n  "spo2": 99,\r\n  "temp": 36.5\r\n}'
sample_cipher_text = b"3PVOhB2vmIOejkWfg+gsgywHdlNZtkinT0QnlZ5h7XtxDF5IkpkIA07Lqcw4w8hgqdNgd8sjikSOOTddviTbcMy4sbVvBeFTR5rrsX79ihFMWRqyIqqBn4Oh6BSIklPgAAAAAA=="


def decrypt(cipher_text):
    inp = base64.b64decode(cipher_text)
    i = 0
    output = ""
    while (len(inp) - i) >= 8:
        print((inp[i:i+8]).hex())
        print(des.decrypt(inp[i:i+8]).hex())
        output += des.decrypt(inp[i:i+8]).decode()
        i += 8
    return output[:output.find("\x00")]


def encrypt(text, encoding='utf-8'):
    inp = bytes(text, encoding=encoding)
    padding = BUFFER_SIZE - len(inp)
    inp += (bytes.fromhex("00") * padding)
    i = 0
    cipher_text = b""
    while (len(inp) - i) >= 8:
        cipher_text += des.encrypt(inp[i:i+8])
        i += 8
    remaining_pad = BUFFER_SIZE - len(cipher_text)
    cipher_text += (bytes.fromhex("00") * remaining_pad)
    return base64.b64encode(cipher_text)


def test():
    print("--> Testing encrypt...")
    print(f"Input: {sample_text}")
    print(f"Expected output: {sample_cipher_text}")
    print(f"Real output: {encrypt(sample_text)}")
    print(f"Matches: {sample_cipher_text == encrypt(sample_text)}")
    print("--> Testing decrypt...")
    print(f"Input: {sample_cipher_text}")
    print(f"Expected output: {sample_text}")
    print(f"Real output: {decrypt(sample_cipher_text)}")
    print(f"Matches: {sample_text == decrypt(sample_cipher_text)}")
