import fs from 'fs';
import path from 'path';


// 데이터베이스 연결 설정

export default async function getMappingData(connection)  {
    const __dirname = path.resolve();
    
    const outputFileName = process.env.output || 'output';
    // 출력 파일 설정
    const outputFile = path.join(__dirname, `./output/${outputFileName}.txt`);
    const writeStream = fs.createWriteStream(outputFile);

    console.log('데이터베이스에 연결되었습니다.');

    // 데이터베이스 쿼리 실행
    const query = 'SELECT sender_id, receiver_id, timestamp FROM transactions';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('쿼리 실행 중 오류가 발생했습니다.', err);
            return false;
        }

        // 결과 처리 및 파일 쓰기
        results.forEach(row => {
            const line = `${row.sender_id} ${row.receiver_id} ${row.timestamp}\n`;
            writeStream.write(line);
        });

        // 작업 완료 후 데이터베이스 연결 종료
        connection.end(() => {
            console.log('데이터베이스 연결이 종료되었습니다.');
            writeStream.end(() => {
                console.log('파일 쓰기가 완료되었습니다.');

                return true;
            });
        });
    });
}