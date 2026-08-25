/**
 * WOJOD Early Access Waitlist — Google Apps Script backend.
 *
 * Receives POSTed JSON from the landing page and appends a row to the
 * "Waitlist" sheet. Deduplicates by email (case-insensitive).
 *
 * Sheet columns (must match row 1 headers):
 * Lead ID | Submitted At | Full Name | Email | Phone | Business Type |
 * Services Interested In | Language | Session Duration | UTM Source |
 * UTM Campaign | Referrer
 *
 * Deploy: Extensions > Apps Script in your Google Sheet, paste this file,
 * then Deploy > New deployment > Web app:
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Copy the /exec URL into the site's VITE_WAITLIST_ENDPOINT.
 */

var SHEET_NAME = 'Waitlist';

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Lead ID', 'Submitted At', 'Full Name', 'Email', 'Phone',
      'Business Type', 'Services Interested In', 'Language',
      'Session Duration', 'UTM Source', 'UTM Campaign', 'Referrer',
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);

    var email = String(data.email || '').trim().toLowerCase();
    var fullName = String(data.fullName || '').trim();
    if (!email || !fullName) {
      return jsonResponse_({ status: 'error', message: 'missing required fields' });
    }

    var sheet = getSheet_();

    // Dedupe by email (column D).
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var emails = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).trim().toLowerCase() === email) {
          return jsonResponse_({ status: 'duplicate' });
        }
      }
    }

    var leadId = 'WJ-' + Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyMMdd') +
      '-' + Utilities.getUuid().slice(0, 6).toUpperCase();

    sheet.appendRow([
      leadId,
      Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm:ss'),
      fullName,
      email,
      String(data.phone || ''),
      String(data.businessType || ''),
      String(data.services || ''),
      String(data.language || ''),
      String(data.sessionDuration || ''),
      String(data.utmSource || ''),
      String(data.utmCampaign || ''),
      String(data.referrer || ''),
    ]);

    return jsonResponse_({ status: 'success', leadId: leadId });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Health check so opening the /exec URL in a browser shows the API is live.
function doGet() {
  return jsonResponse_({ status: 'ok', service: 'wojod-waitlist' });
}
