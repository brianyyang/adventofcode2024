import * as fs from 'fs/promises';

// debugging statements
// console.log(`Current char: ` + char);
// console.log(`Current progress: ` + progress);
// console.log(`Multiplying ${numbers[0]} and ${numbers[1]}`);
// console.log('Looking for a function, char: ' + char);
// console.log('Looking for mul, char: ' + char);
// console.log('Looking for do and dont, char: ' + char);
// console.log('Looking for dont, char: ' + char);
// console.log('Looking for do, char: ' + char);

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

// part 1
const { multiplyFunctions } = await readFileAndFindValidMults(filePath);
let sumOfProducts = 0;
multiplyFunctions.map((numbers) => {
  sumOfProducts += numbers[0] * numbers[1];
});

console.log('Total of all multiplication functions: ' + sumOfProducts);

// part 2
async function readFileAndFindValidMultsDoAndDont(
  filePath: string
): Promise<{ multiplyFunctionsDoAndDont: Array<number[]> }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const multiplyFunctionsDoAndDont: Array<number[]> = [];

    const MUL_SYMBOLS = ['m', 'u', 'l', '(', ',', ')'];
    const DO_SYMBOLS = ['d', 'o', '(', ')'];
    const DONT_SYMBOLS = ['d', 'o', 'n', "'", 't', '(', ')'];
    let lookingForMul = false;
    let lookingForDo = false;
    let lookingForDont = false;
    let shouldAddFunction = true;
    let symbolIndex = 0;
    let numberBuilder = '';
    let numberTuple: number[] = [];

    const resetProgress = () => {
      symbolIndex = 0;
      numberBuilder = '';
      numberTuple = [];
      lookingForMul = false;
      lookingForDo = false;
      lookingForDont = false;
    };

    const handleLookingForMul = (char: string) => {
      const progress = MUL_SYMBOLS[symbolIndex];
      if (progress === ',' || progress === ')') {
        if (char === ',' && numberBuilder.length > 0) {
          numberTuple.push(parseInt(numberBuilder));
          numberBuilder = '';
          symbolIndex++;
        } else if (
          char === ')' &&
          numberBuilder.length > 0 &&
          numberTuple.length === 1
        ) {
          numberTuple.push(parseInt(numberBuilder));
          multiplyFunctionsDoAndDont.push([...numberTuple]);
          resetProgress();
        } else if (!isNaN(parseInt(char)) && numberBuilder.length < 4) {
          numberBuilder += char;
        } else {
          resetProgress();
        }
      } else {
        if (char === progress) {
          symbolIndex++;
        } else {
          resetProgress();
        }
      }
    };

    const handleLookingForDoAndDont = (char: string) => {
      const doProgress = DO_SYMBOLS[symbolIndex];
      const dontProgress = DONT_SYMBOLS[symbolIndex];
      if (char !== doProgress && char !== dontProgress) {
        resetProgress();
      } else if (char !== doProgress) {
        lookingForDo = false;
      } else if (char !== dontProgress) {
        lookingForDont = false;
      }
      if (doProgress || dontProgress) {
        symbolIndex++;
      }
    };

    const handleLookingForDo = (char: string) => {
      const doProgress = DO_SYMBOLS[symbolIndex];
      if (char === doProgress) {
        if (doProgress === ')') {
          shouldAddFunction = true;
          resetProgress();
        } else {
          symbolIndex++;
        }
      } else {
        resetProgress();
      }
    };

    const handleLookingForDont = (char: string) => {
      const dontProgress = DONT_SYMBOLS[symbolIndex];
      if (char === dontProgress) {
        if (dontProgress === ')') {
          shouldAddFunction = false;
          resetProgress();
        } else {
          symbolIndex++;
        }
      } else {
        resetProgress();
      }
    };

    const lines = data.trim().split('\n');
    for (const line of lines) {
      resetProgress();
      for (const char of line) {
        // look for start of functions if not in the middle of one
        if (!lookingForMul && !lookingForDo && !lookingForDont) {
          if (char === 'm' && shouldAddFunction) {
            lookingForMul = true;
          } else if (char === 'd') {
            lookingForDo = true;
            lookingForDont = true;
          }
        }
        if (lookingForMul) {
          handleLookingForMul(char);
        } else if (lookingForDo && lookingForDont) {
          // found 'd' and/or 'o' but don't know which instruction yet
          handleLookingForDoAndDont(char);
        } else if (lookingForDo) {
          handleLookingForDo(char);
        } else if (lookingForDont) {
          handleLookingForDont(char);
        }
      }
    }

    return { multiplyFunctionsDoAndDont };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const { multiplyFunctionsDoAndDont } = await readFileAndFindValidMultsDoAndDont(
  filePath
);
let sumOfProductsDoAndDont = 0;
multiplyFunctionsDoAndDont.map((numbers) => {
  sumOfProductsDoAndDont += numbers[0] * numbers[1];
});

console.log(
  'Total of all multiplication functions with do and dont instructions: ' +
    sumOfProductsDoAndDont
);
