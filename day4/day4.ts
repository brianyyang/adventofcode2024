import * as fs from 'fs/promises';

async function readFileAndParseIntoNestedArray(
  filePath: string
): Promise<{ inputRows: Array<string[]> }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const inputRows: Array<string[]> = [];

    const lines = data.trim().split('\n');

    for (const line of lines) {
      const row: string[] = [];
      for (const char of line) {
        row.push(char);
      }
      inputRows.push([...row]);
    }

    return { inputRows };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const filePath = process.argv[2];
const { inputRows } = await readFileAndParseIntoNestedArray(filePath);
const rowLength = inputRows.length;
const colLength = inputRows[0].length;

const countXmas = (
  row: number,
  col: number,
  firstLetter: string,
  secondLetter: string,
  thirdLetter: string,
  fourthLetter: string
) => {
  let count = 0;
  if (col < colLength - 3) {
    // check right
    if (
      inputRows[row][col] === firstLetter &&
      inputRows[row][col + 1] === secondLetter &&
      inputRows[row][col + 2] === thirdLetter &&
      inputRows[row][col + 3] === fourthLetter
    ) {
      count++;
    }
    // check down right
    if (
      row < rowLength - 3 &&
      inputRows[row][col] === firstLetter &&
      inputRows[row + 1][col + 1] === secondLetter &&
      inputRows[row + 2][col + 2] === thirdLetter &&
      inputRows[row + 3][col + 3] === fourthLetter
    ) {
      count++;
    }
  }
  if (row < rowLength - 3) {
    // check down
    if (
      inputRows[row][col] === firstLetter &&
      inputRows[row + 1][col] === secondLetter &&
      inputRows[row + 2][col] === thirdLetter &&
      inputRows[row + 3][col] === fourthLetter
    ) {
      count++;
    }
    // check down left
    if (
      col >= 3 &&
      inputRows[row][col] === firstLetter &&
      inputRows[row + 1][col - 1] === secondLetter &&
      inputRows[row + 2][col - 2] === thirdLetter &&
      inputRows[row + 3][col - 3] === fourthLetter
    ) {
      count++;
    }
  }
  return count;
};

// part 1
let xmasCount = 0;
for (let row = 0; row < rowLength; row++) {
  for (let col = 0; col < colLength; col++) {
    const currentLetter = inputRows[row][col];
    if (currentLetter === 'X') {
      xmasCount += countXmas(row, col, 'X', 'M', 'A', 'S');
    } else if (currentLetter === 'S') {
      xmasCount += countXmas(row, col, 'S', 'A', 'M', 'X');
    }
  }
}
console.log('XMAS count: ' + xmasCount);

const countXMas = (
  row: number,
  col: number,
  firstLetter: string,
  secondLetter: string,
  thirdLetter: string
) => {
  let count = 0;
  if (col < colLength - 2 && row < rowLength - 2) {
    if (
      // check middle === A
      inputRows[row + 1][col + 1] === secondLetter &&
      // check right diagonal
      ((inputRows[row][col] === firstLetter &&
        inputRows[row + 2][col + 2] === thirdLetter) ||
        (inputRows[row][col] === thirdLetter &&
          inputRows[row + 2][col + 2] === firstLetter)) &&
      // check left diagonal
      ((inputRows[row][col + 2] === firstLetter &&
        inputRows[row + 2][col] === thirdLetter) ||
        (inputRows[row][col + 2] === thirdLetter &&
          inputRows[row + 2][col] === firstLetter))
    ) {
      count++;
    }
  }
  return count;
};

// part 2
let xMasCount = 0;
for (let row = 0; row < rowLength; row++) {
  for (let col = 0; col < colLength; col++) {
    const currentLetter = inputRows[row][col];
    if (currentLetter === 'M') {
      xMasCount += countXMas(row, col, 'M', 'A', 'S');
    } else if (currentLetter === 'S') {
      xMasCount += countXMas(row, col, 'S', 'A', 'M');
    }
  }
}

console.log('X-MAS count: ' + xMasCount);
