import fs from 'fs';
import readline from 'readline';
import saveTransaction from './utils/saveTransaction.js';

// 데이터베이스 연결 설정
  
export default async function convert(connection) {
  const inputFilePath = './input/A.json';
  const outputFilePath = './data/formatted_data.txt';

  await connection.query('delete FROM transactions;');
  await connection.query('delete FROM users');
  
  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(outputFilePath);
  
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  });

  var lineCount = 0;
  
  // 각 트랜잭션을 처리할 때 Promise를 수집하는 배열
  let transactionPromises = [];

  let flag = 0;
  
  rl.on('line', (line) => {
    if (lineCount < 300000 && flag === 0) {
      const data = JSON.parse(line);
      const time = data.t;
      const inputAddress = data.inputs[0].address;
      const outputAddress = data.outputs[0].address;
      const formattedLine = `${inputAddress} ${outputAddress} ${time}\n`;
      writeStream.write(formattedLine);

      if(time > 1294770625000){
        flag = 1; 
      }

      transactionPromises.push(saveTransaction(inputAddress, outputAddress, time, connection));

      lineCount++;
    } else {
      rl.close();
    }
  });
  
  rl.on('close', () => {
    console.log('파일 읽기가 완료되었습니다.');
    writeStream.end();
    console.log(lineCount);
    Promise.all(transactionPromises).then(() => {
        console.log('데이터 변환 및 저장이 완료되었습니다.');
        connection.end(); // 모든 작업이 끝나면 데이터베이스 연결 종료
      }).catch(err => console.error(err));
  });
  
}
  