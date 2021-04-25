# DES example

Very short examples of encryption and decryption using DES. This is meant to be compatible with Arduino, Node.js and Python in order to fit most of IoT projects.

## Arduino

On the `arduino/` directory, you'll find a PlatformIO project with the amazing [ArduinoDES](https://github.com/Octoate/ArduinoDES) library and other dependencies described on the `platformio.ini` file (`bblanchon/ArduinoJson@^6.17.3` and `densaugeo/base64@^1.2.0`). The main source file is at `src/main.cpp`.

## Node.js

On the `node/` directory there's a very simple `main.js` file containing both `encrypt` and `decrypt` methods. In order to execute it:

- Install dependencies

```
npm install
```

- Execute

```
npm start
```

## Python

On the `python/` directory there's a simple `main.py` file containing both `encrypt` and `decrypt` methods. In order to execute it:

- Install dependencies

```
python3 -m pip install -r requirements.txt
```

- Execute

```
python3 main.py
```