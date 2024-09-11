const { google } = require('googleapis');
const { readFile } = require('fs/promises');

// Use your Google API key from environment variables or config
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA6zFcyJC7iYv3SwA9CLIVJd2VNCoRVqg8';

// ID of your Google Sheet (you can find it in the URL of the sheet)
const SPREADSHEET_ID = '1Jm5kBb_Ym5BrFh9cxJc0ifD6Hsugb8nAtb1JuNPas8Q';

// Function to authorize and connect to the Google Sheets API
async function authorize() {
  const credentials = JSON.parse(await readFile(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Function to append text data to the Google Sheet
async function appendToSheet(textData) {
  const authClient = await authorize();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const range = 'Sheet1!A1'; // Adjust the range as needed (starting cell)
  const values = [[textData]]; // This is where your text data goes

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
