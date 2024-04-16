import * as fs from 'fs';
import * as path from 'path';

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

function main(): void {
  const inputFile: string = path.join(process.cwd(), 'lastpass.json');
  const inputData: InputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

  const outputData: string[] = [];

  inputData.accounts?.forEach((account: Account) => {
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

    outputData.push(url);
  });

  const outputFile: string = path.join(process.cwd(), 'uris.txt');
  fs.writeFileSync(outputFile, outputData.join('\n'));
  console.log(`Converted. Export file: ${outputFile}`);
}

main();
