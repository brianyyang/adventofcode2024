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
const sortedColumn1 = column1.sort();
const sortedColumn2 = column2.sort();
let sum = 0;

sortedColumn1.map((n, index) => {
  sum += Math.abs(n - sortedColumn2[index]);
});

console.log(sum);
