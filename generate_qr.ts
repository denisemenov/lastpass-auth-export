import * as fs from 'fs';
import * as path from 'path';
import * as qrcode from 'qrcode';

interface Account {
  accountID: string;
  originalUserName?: string;
  userName?: string;
  originalIssuerName?: string;
  issuerName?: string;
  isFavorite?: boolean;
  secret: string;
  algorithm?: string;
  digits?: number;
  timeStep?: number;
}

interface InputData {
  accounts?: Account[];
}

async function generateQR(account: Account, index: number): Promise<void> {
  let {
    userName,
    originalUserName,
    originalIssuerName,
    issuerName,
    secret,
    algorithm = 'SHA1',
    digits = 6,
    timeStep = 30,
  } = account;

  const encodedName = encodeURIComponent(userName ?? originalUserName ?? 'UnknownUser');
  const encodedIssuer = encodeURIComponent(issuerName ?? originalIssuerName ?? 'UnknownIssuer');
  secret = secret.replace(/\s/g, '');

  const url = `otpauth://totp/${encodedIssuer}:${encodedName}?secret=${secret}&algorithm=${algorithm}&digits=${digits}&period=${timeStep}`;

  const qrCodeData = await qrcode.toFileStream(
    fs.createWriteStream(`qr_codes/qr_${index}_${encodedIssuer}_${encodedName}.png`),
    url
  );
}

async function main(): Promise<void> {
  const inputFile: string = path.join(process.cwd(), 'lastpass.json');
  const inputData: InputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

  if (inputData.accounts) {
    const qrCodesDir = path.join(process.cwd(), 'qr_codes');
    if (!fs.existsSync(qrCodesDir)) {
      fs.mkdirSync(qrCodesDir);
    }

    for (let i = 0; i < inputData.accounts.length; i++) {
      await generateQR(inputData.accounts[i], i);
    }
    console.log(`QR codes generated.`);
  } else {
    console.error(`No accounts found.`);
  }
}

main().catch((error) => console.error('Error:', error));
