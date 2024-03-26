import fs from 'fs/promises';

async function readLastLine(filename) {
  try {
    const stat = await fs.stat(filename);
    let fileSize = stat.size;
    let lastLine = '';
    let currentPosition = fileSize - 1;
    let buffer = Buffer.alloc(1);

    const fd = await fs.open(filename, 'r');

    while (currentPosition >= 0) {
      await fd.read(buffer, 0, 1, currentPosition);
      const char = buffer.toString('utf8');
      
      if (char === '\n') {
        if (currentPosition !== fileSize - 1) { // Avoid returning empty string if file ends with newline
          break;
        }
      } else {
        lastLine = char + lastLine;
      }

      currentPosition--;
    }

    await fd.close();
    return lastLine;
  } catch (err) {
    console.error('An error occurred:', err);
    throw err; // Re-throw the error if needed
  }
}

export default async function getLastLine(fileName){
  const line = await readLastLine('./input/' + fileName);
  return line;
}