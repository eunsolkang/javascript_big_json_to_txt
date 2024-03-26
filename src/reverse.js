import fs from 'fs';
import reverseLineReader from 'reverse-line-reader'
import saveTransaction from './utils/saveTransaction';

export default function reverse(connection){
  const inputFilePath = './input/A.json';
  const outputFilePath = './output/formatted_data.txt';
  const writeStream = fs.createWriteStream(outputFilePath);

  var lineCount = 0;
  let transactionPromises = [];

  reverseLineReader.eachLine(inputFilePath, (line) => {
    if (lineCount < 100000 && lineCount !== 0) {
      try {
        const data = JSON.parse(line);
        const time = data.t;
        const inputAddress = data.inputs[0].address;
        const outputAddress = data.outputs[0].address;
        const formattedLine = `${inputAddress} ${outputAddress} ${time}\n`;
        writeStream.write(formattedLine);
  
        const transactionPromise = saveTransaction(inputAddress, outputAddress, time, connection);
        transactionPromises.push(transactionPromise);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }
  
      lineCount++;
    } else if (lineCount === 0) {
      lineCount++;
    }
  }).then(() => {
    console.log('파일 역순 읽기가 완료되었습니다.');
    writeStream.end();
    console.log(lineCount);
    Promise.all(transactionPromises).then(() => {
      console.log('데이터 변환 및 저장이 완료되었습니다.');
      connection.end();
    }).catch(err => console.error(err));
  });
}