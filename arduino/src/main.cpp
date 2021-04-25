// Includes
#include <Arduino.h>
#include <ArduinoJson.h>
#include <base64.hpp>
#include <DES.h>

// Configuration
#define BUFFER_SIZE 100
#define SERIAL_BAUD_RATE 115200
const byte key[] = {0x3b, 0x38, 0x98, 0x37, 0x15, 0x20, 0xf7, 0x5e};

// DES class
DES des;

// Globals
byte buffer[BUFFER_SIZE];
char b64buffer[2 * BUFFER_SIZE];
StaticJsonDocument<BUFFER_SIZE> doc;

/*
 * Sample method for updating buffer data
 */
void updateData()
{
  doc["sensor_id"] = "DES_EXAMPLE";
  doc["beat"] = 85;
  doc["spo2"] = 99;
  doc["temp"] = 36.5;
  serializeJsonPretty(doc, buffer);
}

/*
 * Method for encryption
 */
void encryptData(unsigned char out[2 * BUFFER_SIZE], byte in[BUFFER_SIZE])
{
  // Raw output
  byte rawOut[BUFFER_SIZE];
  // Number of white spaces needed at the end
  int n_pads = BUFFER_SIZE % 8;
  // Adds padding
  for (int i = BUFFER_SIZE - n_pads; i < BUFFER_SIZE; i++)
  {
    in[i] = 0x00;
    rawOut[i] = 0x00;
  }
  // Encrypt data in blocks
  for (int i = 0; i < (BUFFER_SIZE - n_pads); i += 8)
  {
    // Temporary arrays
    byte tempIn[8];
    byte tempOut[8];
    // Copy slice of input array into temporary array
    memcpy(tempIn, in + i * sizeof(byte), 8 * sizeof(byte));
    // Encrypt temporary array
    des.encrypt(tempOut, tempIn, key);
    // Copy temporary array contents into output array
    memcpy(rawOut + i * sizeof(byte), tempOut, 8 * sizeof(byte));
  }
  encode_base64(rawOut, BUFFER_SIZE, out);
}

/*
 * Method for decryption
 */
void decryptData(byte out[BUFFER_SIZE], unsigned char in[2 * BUFFER_SIZE])
{
  // Decode input
  byte rawIn[BUFFER_SIZE];
  decode_base64(in, rawIn);
  // Number of white spaces needed at the end
  int n_pads = BUFFER_SIZE % 8;
  // Decrypt data in blocks
  for (int i = 0; i < (BUFFER_SIZE - n_pads); i += 8)
  {
    // Temporary arrays
    byte tempIn[8];
    byte tempOut[8];
    // Copy slice of input array into temporary array
    memcpy(tempIn, rawIn + i * sizeof(byte), 8 * sizeof(byte));
    // Decrypt temporary array
    des.decrypt(tempOut, tempIn, key);
    // Copy temporary array contents into output array
    memcpy(out + i * sizeof(byte), tempOut, 8 * sizeof(byte));
  }
}

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);
  updateData();
  Serial.println("--> Testing encrypt...");
  Serial.print("Input: ");
  Serial.println((const char *)buffer);
  unsigned char out[200];
  encryptData(out, buffer);
  Serial.print("Output: ");
  Serial.println((const char *)out);
  Serial.println("--> Testing decrypt...");
  Serial.print("Input: ");
  Serial.println((const char *)out);
  decryptData(buffer, out);
  Serial.print("Output: ");
  Serial.println((const char *)buffer);
}

void loop() {}
