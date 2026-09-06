/**
 * Google Apps Script entry point for the prototype.
 * The interface currently uses sample browser data; Google Sheets persistence
 * is the next development milestone.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Uzbegim Warehouse')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
