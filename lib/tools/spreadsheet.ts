import * as XLSX from "xlsx";

/**
 * Reads a spreadsheet file and returns the names of all sheets present inside it.
 */
export function getSheetNames(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        resolve(workbook.SheetNames);
      } catch (err) {
        reject(new Error("Failed to parse spreadsheet sheets. Make sure it is a valid Excel file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read spreadsheet file."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Converts a specific sheet of an Excel XLSX workbook to a CSV Blob and URL.
 */
export function xlsxToCsv(file: File, sheetName: string): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject(new Error(`Sheet "${sheetName}" not found in workbook.`));
          return;
        }

        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      } catch (err) {
        reject(new Error("Failed to convert Excel sheet to CSV."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read Excel file."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Converts a CSV file to an Excel XLSX workbook Blob and URL.
 */
export function csvToXlsx(file: File): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        
        // SheetJS parses CSV automatically
        const workbook = XLSX.read(csvContent, { type: "string", raw: true });
        
        // Write as XLSX array buffer
        const xlsxBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        
        const blob = new Blob([xlsxBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      } catch (err) {
        reject(new Error("Failed to parse CSV and construct Excel sheet."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read CSV file."));
    reader.readAsText(file);
  });
}
