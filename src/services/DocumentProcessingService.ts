// Partial update to fix the date-fns-tz import
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Function to check if a document is due soon
export const isDocumentDueSoon = (expiryDate: string, reminderDays: number = 3): boolean => {
  try {
    const expiry = parseISO(expiryDate);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const timeZoneFormattedNow = formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
    const today = parseISO(timeZoneFormattedNow);
    const diffInDays = differenceInDays(expiry, today);
    return diffInDays <= reminderDays && diffInDays >= 0;
  } catch (error) {
    console.error("Error processing expiry date:", error);
    return false;
  }
};

// Function to format the expiry date
export const formatExpiryDate = (expiryDate: string): string => {
  try {
    return format(parseISO(expiryDate), 'MMMM dd, yyyy');
  } catch (error) {
    console.error("Error formatting expiry date:", error);
    return 'Invalid Date';
  }
};

// Function to calculate the days remaining until expiry
export const getDaysUntilExpiry = (expiryDate: string): number => {
  try {
    const expiry = parseISO(expiryDate);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const timeZoneFormattedNow = formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
    const today = parseISO(timeZoneFormattedNow);
    return differenceInDays(expiry, today);
  } catch (error) {
    console.error("Error calculating days until expiry:", error);
    return -1;
  }
};

// Function to add a specified number of days to a date
export const addDaysToDate = (startDate: string, daysToAdd: number): string => {
  try {
    const parsedDate = parseISO(startDate);
    const newDate = addDays(parsedDate, daysToAdd);
    return format(newDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error adding days to date:", error);
    return 'Invalid Date';
  }
};
