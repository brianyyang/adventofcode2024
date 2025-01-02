import * as fs from 'fs/promises';

// debugging statements
// console.log(`Current char: ` + char);
// console.log(`Current progress: ` + progress);
// console.log(`Multiplying ${numbers[0]} and ${numbers[1]}`);

async function readFileAndFindValidMults(
  filePath: string
): Promise<{ multiplyFunctions: Array<number[]> }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const multiplyFunctions: Array<number[]> = [];

    const MUL_SYMBOLS = ['m', 'u', 'l', '(', ',', ')'];
    let mulSymbolIndex = 0;
    let numberBuilder = '';
    let numberTuple: number[] = [];

    const resetProgress = () => {
      mulSymbolIndex = 0;
      numberBuilder = '';
      numberTuple = [];
    };

    const lines = data.trim().split('\n');
    for (const line of lines) {
      resetProgress();
      for (const char of line) {
        const progress = MUL_SYMBOLS[mulSymbolIndex];
        if (progress === ',' || progress === ')') {
          if (char === ',' && numberBuilder.length > 0) {
            numberTuple.push(parseInt(numberBuilder));
            numberBuilder = '';
            mulSymbolIndex++;
          } else if (
            char === ')' &&
            numberBuilder.length > 0 &&
            numberTuple.length === 1
          ) {
            numberTuple.push(parseInt(numberBuilder));
            multiplyFunctions.push([...numberTuple]);
            resetProgress();
          } else if (!isNaN(parseInt(char)) && numberBuilder.length < 4) {
            numberBuilder += char;
          } else {
            resetProgress();
          }
        } else {
          if (char === progress) {
            mulSymbolIndex++;
          } else {
            resetProgress();
          }
        }
      }
    }

    return { multiplyFunctions };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const filePath = process.argv[2];
const { multiplyFunctions } = await readFileAndFindValidMults(filePath);
let sumOfProducts = 0;
multiplyFunctions.map((numbers) => {
  sumOfProducts += numbers[0] * numbers[1];
});

console.log('Total of all multiplication functions: ' + sumOfProducts);
