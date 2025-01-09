import * as fs from 'fs/promises';

async function readFileAndParse(
  filePath: string
): Promise<{ rulesMap: Map<number, number[]>; pageUpdates: Array<number[]> }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const rulesMap: Map<number, number[]> = new Map();
    const pageUpdates: Array<number[]> = [];

    const lines = data.trim().split('\n');

    for (const line of lines) {
      // read rules
      if (line.includes('|')) {
        const rule = line.split('|').map(Number);
        rulesMap.set(rule[0], [...(rulesMap.get(rule[0]) || []), rule[1]]);
      }
      // read page updates
      if (line.includes(',')) {
        const update = line.split(',').map(Number);
        pageUpdates.push(update);
      }
    }

    return { rulesMap, pageUpdates };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

const filePath = process.argv[2];
const { rulesMap, pageUpdates } = await readFileAndParse(filePath);
const incorrectUpdates: number[][] = [];

// part 1
let validUpdateMiddleSum = 0;
for (const update of pageUpdates) {
  let isValid = true;
  const seenNumbers: number[] = [];
  for (const page of update) {
    seenNumbers.map((n) => {
      if ((rulesMap.get(page) || []).includes(n)) {
        isValid = false;
      }
    });
    seenNumbers.push(page);
    if (!isValid) continue;
  }
  if (isValid) {
    validUpdateMiddleSum += update[Math.floor(update.length / 2)];
  } else {
    incorrectUpdates.push([...update]);
  }
}
console.log(
  'The sum of middle numbers from the valid updates are: ' +
    validUpdateMiddleSum
);

// part 2
let fixedUpdateMiddleSum = 0;
for (const update of incorrectUpdates) {
  let isValid = false;
  const mutatedList: number[] = [...update];
  let index = 0;
  while (!isValid) {
    let fixed = false;
    if (index === mutatedList.length) {
      isValid = true;
      continue;
    }
    const page = mutatedList[index];
    for (let i = 0; i < index; i++) {
      const number = mutatedList[i];
      if ((rulesMap.get(page) || []).includes(number)) {
        mutatedList.splice(index, 1);
        mutatedList.splice(i, 0, page);
        fixed = true;
        index = i + 1;
        break;
      }
    }
    if (!fixed) {
      index++;
    }
  }
  fixedUpdateMiddleSum += mutatedList[Math.floor(mutatedList.length / 2)];
}

console.log(
  'The sum of middle numbers from the fixed updates are: ' +
    fixedUpdateMiddleSum
);
