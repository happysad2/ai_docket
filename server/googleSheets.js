const { google } = require('googleapis');
const { readFile } = require('fs/promises');
const path = require('path');

// Get the credentials path from an environment variable or use a default local path
const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH || path.resolve(__dirname, 'test-project-385522-b346666eeaf8.json');

// ID of your Google Sheet (you can find it in the URL of the sheet)
const SPREADSHEET_ID = '1Jm5kBb_Ym5BrFh9cxJc0ifD6Hsugb8nAtb1JuNPas8Q';

// Authorize and connect to the Google Sheets API using service account
async function authorize() {
  try {
    const credentials = JSON.parse(await readFile(CREDENTIALS_PATH, 'utf8'));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth.getClient();
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw error;
  }
}

// Append text data to the Google Sheet
async function appendToSheet(textData) {
  try {
    const authClient = await authorize();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const range = 'Sheet1!A1'; // Adjust this range as needed (e.g., A2, A3, etc.)
    const values = [[textData]];

    const resource = {
      values,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource,
    });

    console.log('Text data added to the sheet');
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

// Export the appendToSheet function so it can be used in other scripts
module.exports = { appendToSheet };
