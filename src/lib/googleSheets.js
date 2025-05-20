import { google } from 'googleapis';
import { PRESET_COST_ITEMS } from './constants';

// Generate column headers for the sheet
const generateHeaders = () => {
  const headers = [
    'Address',
    'Job Number',
    'Maximizer ID',
    'Maximizer AB ID'
  ];
  
  // Add column for each preset item and its vendor
  PRESET_COST_ITEMS.forEach(item => {
    headers.push(item);
    headers.push(`Vendor-${item}`);
  });
  
  // Add timestamp column
  headers.push('Timestamp');
  
  return headers;
};

// Check if headers exist and add them if needed
async function ensureHeadersExist(sheets, spreadsheetId) {
  try {
    // Check the first row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:Z1',
    });
    
    const rows = response.data.values;
    
    // If no rows exist or first row is empty, add headers
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      // Generate and add headers
      const headers = generateHeaders();
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [headers]
        },
      });
      
      // Add some basic formatting (bold headers)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0, // Assumes Sheet1 has ID 0
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: headers.length
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true
                    }
                  }
                },
                fields: 'userEnteredFormat.textFormat.bold'
              }
            }
          ]
        }
      });
      
      return true; // Headers were added
    }
    
    return false; // Headers already existed
  } catch (error) {
    console.error('Error checking/adding headers:', error);
    return false;
  }
}

// Initialize the sheets API
const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

// Create a map to find values for each cost item type
const createCostItemMap = (costItems) => {
  const itemMap = {};
  const vendorMap = {};
  
  // Initialize with empty values for all preset items
  PRESET_COST_ITEMS.forEach(item => {
    itemMap[item] = "";
    vendorMap[`Vendor-${item}`] = "";
  });
  
  // Fill in actual values where they exist
  costItems.forEach(item => {
    if (item.item) {
      itemMap[item.item] = item.value;
      vendorMap[`Vendor-${item.item}`] = item.vendor;
    }
  });
  
  return { itemMap, vendorMap };
};

export async function appendToSheet(jobCostData) {
  try {
    const sheets = getGoogleSheetsClient();
    
    // First, ensure headers exist
    await ensureHeadersExist(sheets, process.env.GOOGLE_SHEET_ID);
    
    // Create structured data for each item type in its own column
    const { itemMap, vendorMap } = createCostItemMap(jobCostData.costItems);
    
    // Start with main job details
    const rowData = [
      jobCostData.address,
      jobCostData.jobNumber,
      jobCostData.maximizerId,
      jobCostData.maximizerAbId
    ];
    
    // Add value for each preset cost item
    PRESET_COST_ITEMS.forEach(item => {
      rowData.push(itemMap[item]);
      rowData.push(vendorMap[`Vendor-${item}`]);
    });
    
    // Add timestamp
    rowData.push(new Date().toISOString());
    
    // Format data as a row
    const values = [rowData];
    
    // Use a fixed range that covers all possible columns
    
    // Append row to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:Z', // Fixed range that's wide enough for all our columns
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });
    
    // Explicitly set normal text formatting for the newly added row
    // This ensures data isn't bold like the headers
    try {
      // Get the row index of the newly added row (row after the last row before our append)
      const lastRowIndex = response.data.updates.updatedRange.split('!')[1].split(':')[0];
      const rowIndex = parseInt(lastRowIndex.replace(/[A-Z]/g, '')) - 1; // Convert A2 to 1 (zero-based)
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0, // Assumes Sheet1 has ID 0
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 0,
                  endColumnIndex: values[0].length
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: false
                    }
                  }
                },
                fields: 'userEnteredFormat.textFormat.bold'
              }
            }
          ]
        }
      });
    } catch (formatError) {
      console.error('Error setting normal formatting for data row:', formatError);
      // Don't fail the operation if just the formatting fails
    }
    
    return { success: true, updatedRows: response.data.updates.updatedRows };
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return { success: false, error: error.message };
  }
}