/**
 * CSV Parser utility for DigggerDB.csv
 */

export class CSVParser {
  static async loadCSV(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      const text = await response.text();
      return this.parseCSV(text);
    } catch (error) {
      console.error('Error loading CSV:', error);
      throw error;
    }
  }

  static parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = this.parseCSVLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          let value = values[index];
          
          // Convert specific fields to appropriate types
          if (header === 'hasSleeve') {
            value = value.toLowerCase() === 'true';
          } else if (header === 'year') {
            value = parseInt(value, 10);
          }
          
          record[header] = value;
        });
        records.push(record);
      }
    }

    return records;
  }

  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i += 2;
          continue;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
        i++;
        continue;
      } else {
        current += char;
      }
      i++;
    }

    // Add the last field
    result.push(current);

    return result;
  }
}