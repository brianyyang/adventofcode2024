import * as fs from 'fs/promises';

async function readFileAndParseColumns(
  filePath: string
): Promise<{ column1: number[]; column2: number[] }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const column1: number[] = [];
    const column2: number[] = [];

    const lines = data.trim().split('\n');

    for (const line of lines) {
      const [col1, col2] = line.trim().split(/\s+/).map(Number); // Split by whitespace and parse as numbers
      if (!isNaN(col1) && !isNaN(col2)) {
        column1.push(col1);
        column2.push(col2);
      }
    }

    return { column1, column2 };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const filePath = process.argv[2];
const { column1, column2 } = await readFileAndParseColumns(filePath);

// part 1
const sortedColumn1 = column1.sort();
const sortedColumn2 = column2.sort();
let differenceSum = 0;

sortedColumn1.map((n, index) => {
  differenceSum += Math.abs(n - sortedColumn2[index]);
});

console.log('Total difference is: ' + differenceSum);

// part 2
const column2Map: Map<number, number> = new Map();
column2.map((n) => {
  column2Map.set(n, (column2Map.get(n) || 0) + 1);
});

let similarityScore = 0;
column1.map((n) => (similarityScore += n * (column2Map.get(n) || 0)));

console.log('Similarity score is: ' + similarityScore);
