import express from 'express';
import connect from './db.js';
import getMappingData from './get.js';
import getLastLine from './last.js';
import convert from './convert.js';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        success: true,
    });
});

app.get('/mapping', async(req, res) => {
    const connection = await connect();
    try{
        await getMappingData(connection);

        return res.json({
            status: 200
        })
    }catch(e){
        console.log(e);
        return res.json({
            status: 501
        })
    }
});

app.post('/convert', async(req, res) => {
    const connection = await connect();
    await convert(connection);
})

app.post('/reverse', async(req, res) => {
    
})

app.get('/last', async(req, res) => {
    const response = await getLastLine('A.JSON');

    res.json({
        status: 200,
        data: response
    })
})


app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

