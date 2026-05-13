const { google } = require('googleapis');

/**
 * Creates and returns an authenticated Google Sheets API client.
 * Uses service account credentials from environment variables.
 */
const getGoogleSheetsClient = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey   = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId      = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error(
      'Google Sheets config missing. Set GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY in .env'
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key:   privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, sheetId };
};

module.exports = { getGoogleSheetsClient };
