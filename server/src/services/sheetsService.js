const { getGoogleSheetsClient } = require('../config/googleSheets');

/**
 * Formats a Date object to "YYYY-MM-DD HH:mm" string.
 */
const formatDate = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * Appends a lead as a new row in the configured Google Sheet.
 * Column order matches PRD §9.3:
 *   A: Created Date | B: Name | C: Email | D: Phone | E: Service Type
 *   F: Message | G: AI Summary | H: Category | I: Priority | J: Status
 *
 * @param {object} lead - Mongoose Lead document
 * @returns {Promise<number|null>} The 1-based row index, or null on failure.
 */
const appendLeadToSheet = async (lead) => {
  if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.warn('[sheetsService] Google Sheets env vars not configured — skipping.');
    return null;
  }

  try {
    const { sheets, sheetId } = getGoogleSheetsClient();

    const row = [
      formatDate(lead.createdAt),
      lead.name        || '',
      lead.email       || '',
      lead.phone       || 'N/A',
      lead.serviceType || 'General Inquiry',
      lead.message     || '',
      lead.aiSummary   || '(AI unavailable)',
      lead.category    || 'General Inquiry',
      lead.priority    || 'Medium',
      lead.status      || 'new',
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range:         'Sheet1!A:J',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    // Extract the updated row number (e.g., "Sheet1!A5:J5" → 5)
    const updatedRange = response.data.updates?.updatedRange || '';
    const match = updatedRange.match(/A(\d+)/);
    const rowIndex = match ? Number(match[1]) : null;

    console.log(`[sheetsService] Lead appended to sheet — row ${rowIndex}`);
    return rowIndex;
  } catch (error) {
    console.error('[sheetsService] Failed to append lead:', error.message);
    return null; // Caller should handle null gracefully
  }
};

module.exports = { appendLeadToSheet };
