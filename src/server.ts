// server/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Route to handle node data export
app.post('/export', (req: Request, res: Response) => {
    const data = req.body;
    // Here you can process the data if needed, or save it to a database/file.
    res.json({ success: true, data });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
