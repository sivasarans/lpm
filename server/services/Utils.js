// services/Utils.js
class Utils {
    static getWeekNumberInMonth(date) {
        const dayOfMonth = date.getDate();
        return Math.ceil(dayOfMonth / 7);
    }
    static getDayName(day) {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return daysOfWeek[day];
    }
    static findNextValue(arr, prevValue) {
        const index = arr.indexOf(prevValue);
        if (index === -1) {
            return 'Not Found'; // Previous value not found   in array
        } else if (index === arr.length - 1) {
            return 'Last Value'; // it's the last element
        }
        return arr[index + 1];
    }
    static findvalue(arr, value) {
        for (let i = value; i <= 4; i++) {
            if (arr.find(element => element === i) !== undefined) {
                return i;
            }

        }
        return null;
    }
    static findMonthValue(arr, value) {
        for (let i = value; i <= 12; i++) {
            if (arr.find(element => element === i) !== undefined) {
                return i;
            }

        }
        return null;
    }
    static splitDate(date) {
        let dateArray = date.split('-');
        return dateArray;
    }
    static arrangeSubsetDays(startDay, subsetDays) {
        const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Find the index of the start day in the full week
        const startIndex = allDays.indexOf(startDay);

        // Arrange the full week days based on the start day
        const arrangedFullWeek = allDays.slice(startIndex).concat(allDays.slice(0, startIndex));

        // Filter the arranged full week to get the subset days in the correct order
        const arrangedSubset = arrangedFullWeek.filter(day => subsetDays.includes(day));

        return arrangedSubset;
    }
    // Helper function to validate each row
    static validateRow(row, rules) {
        const errors = [];
        for (const [column, rule] of Object.entries(rules)) {
            const value = row[column];
            if (rule.required && (value === undefined || value === '')) {
                errors.push(`Missing required value for ${column}`);
            }
            if (value !== undefined && typeof value !== rule.type) {
                errors.push(`Invalid type for ${column}. Expected ${rule.type}`);
            }
            if (rule.pattern && value && !rule.pattern.test(value)) {
                errors.push(`Invalid format for ${column}`);
            }
        }
        return errors;
    }
}
module.exports = Utils;
