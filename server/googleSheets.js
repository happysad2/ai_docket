const { google } = require('googleapis');
const { readFile } = require('fs/promises');

// Path to your Google service account credentials file (JSON)
const CREDENTIALS_PATH = '/Users/jackperry/Documents/GitHub/Invoice_AI/pdf-ocr-app/server/test-project-385522-b346666eeaf8.json'; // Update this to point to your service account key

// ID of your Google Sheet (you can find it in the URL of the sheet)
const SPREADSHEET_ID = '1Jm5kBb_Ym5BrFh9cxJc0ifD6Hsugb8nAtb1JuNPas8Q';

// Authorize and connect to the Google Sheets API using service account
async function authorize() {
  const credentials = JSON.parse(await readFile(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Append text data to the Google Sheet
async function appendToSheet(textData) {
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
}

// Export the appendToSheet function so it can be used in other scripts
module.exports = { appendToSheet };
