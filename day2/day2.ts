import * as fs from 'fs/promises';

async function readFileAndParseColumns(
  filePath: string
): Promise<{ inputRows: Array<number[]> }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const inputRows: Array<number[]> = [];

    const lines = data.trim().split('\n');

    for (const line of lines) {
      const row = line.trim().split(/\s+/).map(Number); // Split by whitespace and parse as numbers
      inputRows.push(row);
    }

    return { inputRows };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const filePath = process.argv[2];
const { inputRows } = await readFileAndParseColumns(filePath);

// part 1
const isRowSafe = (row: number[]): boolean => {
  let [prev, ...rest] = row;
  let isIncreasing = prev < rest[0];
  for (const n of rest) {
    // check if all increasing or decreasing
    if (isIncreasing) {
      if (prev >= n) return false;
    } else {
      if (prev <= n) return false;
    }
    // check if difference is 1, 2, or 3
    const difference = Math.abs(prev - n);
    if (difference < 1 || difference > 3) return false;
    // update previous
    prev = n;
  }
  return true;
};

let safeCount = 0;
inputRows.map((row) => {
  if (isRowSafe(row)) safeCount++;
});

console.log('Total number of safe reports is: ' + safeCount);

// part 2

console.log('Similarity score is: ');
