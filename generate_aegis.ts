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

interface AegisEntry {
  type: string;
  uuid: string;
  name: string;
  issuer: string;
  note: null;
  favorite: boolean;
  icon: null;
  info: {
    secret: string;
    algo?: string;
    digits?: number;
    period?: number;
  };
}

interface OutputData {
  version: number;
  header: {
    slots: null;
    params: null;
  };
  db: {
    version: number;
    entries: AegisEntry[];
  };
}

function main(): void {
  const inputFile: string = path.join(process.cwd(), 'lastpass.json');
  const inputData: InputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

  const inputEntries: AegisEntry[] = [];

  const outputData: OutputData = {
    version: 1,
    header: { slots: null, params: null },
    db: { version: 2, entries: inputEntries },
  };

  inputData.accounts?.forEach((account: Account) => {
    let {
      accountID,
      userName,
      originalUserName,
      originalIssuerName,
      issuerName,
      secret,
      algorithm = 'SHA1',
      digits = 6,
      timeStep = 30,
      isFavorite,
    } = account;

    const entry: AegisEntry = {
      type: 'totp',
      uuid: accountID,
      name: userName ?? originalUserName ?? 'UnknownUser',
      issuer: issuerName ?? originalIssuerName ?? 'UnknownIssuer',
      note: null,
      favorite: isFavorite ?? false,
      icon: null,
      info: {
        secret: secret.replace(/\s/g, ''),
        algo: algorithm,
        digits: digits,
        period: timeStep,
      },
    };

    inputEntries.push(entry);
  });

  const outputFile: string = path.join(process.cwd(), `aegis.json`);
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  console.log(`Converted. Export file: ${outputFile}`);
}

main();
