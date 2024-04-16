# Convert Your LastPass Authenticator Export File to Aegis Authenticator/QR Codes/TXT

## Requirements

- [Node.js](https://nodejs.org/en/download)

## Usage

1. Export your data from LastPass Authenticator to a file. Place this file in the root folder and rename it to `lastpass.json`.

2. From the command line, run `npm install` to install dependencies.

3. Run `npx ts-node .\generate_aegis.ts` to generate a JSON file for Aegis Authenticator.

4. Run `npx ts-node .\generate_qr.ts` to generate PNG files with QR codes in the `qr_codes` folder.

5. Run `npx ts-node .\generate_uri.ts` to generate a TXT file with TOTP URIs.

6. Scan the QR codes or import the JSON/TXT files into any new Authenticator.
