/**
 * Export Logs Utility
 * Functions for exporting logs to CSV
 */

import { CheckInOutLog } from '../types';
import { getChildById } from '../services/database/childService';
import { formatDate, formatTime } from './helpers';

/**
 * Convert logs to CSV format
 */
export const exportLogsToCSV = async (
  logs: CheckInOutLog[]
): Promise<string> => {
  const header = 'Dato,Tid,Barn,Handling,Notater\n';

  const rows = await Promise.all(
    logs.map(async log => {
      const child = await getChildById(log.childId);
      const childName = child
        ? `${child.firstName} ${child.lastName}`
        : 'Ukjent';
      const date = formatDate(log.timestamp);
      const time = formatTime(log.timestamp);
      const action = log.action === 'check_in' ? 'Innkryssing' : 'Utkryssing';
      const notes = log.notes || '';

      return `"${date}","${time}","${childName}","${action}","${notes}"`;
    })
  );

  return header + rows.join('\n');
};

/**
 * Download CSV file (for web) or share (for mobile)
 */
export const downloadLogs = async (logs: CheckInOutLog[]): Promise<void> => {
  await exportLogsToCSV(logs);

  // For React Native, you would use a library like react-native-fs
  // or react-native-share to save/share the file
  // This is a placeholder implementation

  // CSV data generated
  // In a real implementation, you would:
  // 1. Save to file system (mobile)
  // 2. Trigger download (web)
  // 3. Share via native share dialog (mobile)
};
