import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { connectDB, File } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;

  try {
    await connectDB();

    // Find the file in the database
    const file = await File.findOne({ filename });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Send the parsed data as JSON
    res.status(200).json(records);
  } catch (error) {
    console.error('Error processing CSV file:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
}