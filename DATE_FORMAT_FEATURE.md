# Date Format Feature - Implementation Plan

## Current Status
Currently, dates are displayed using the default format from `src/utils/formatTime.js`.

## Requested Feature
The date format should be controlled from General Settings (`/dashboard/settings/general/localization`), and whatever format is selected should be applied throughout the entire project.

## Implementation Plan

### 1. Database Setup
Add date format settings to `general_settings` table:
```sql
INSERT INTO general_settings (category, setting_key, setting_value, setting_type, display_name) VALUES
('localization', 'date_format', 'MM/DD/YYYY', 'select', 'Date Format'),
('localization', 'time_format', '12', 'select', 'Time Format'),
('localization', 'datetime_format', 'MM/DD/YYYY hh:mm A', 'text', 'DateTime Format');
```

### 2. General Settings UI
Add date format dropdown in Localization tab with options:
- `MM/DD/YYYY` (US Format)
- `DD/MM/YYYY` (European Format)
- `YYYY-MM-DD` (ISO Format)
- `DD-MMM-YYYY` (Abbreviated Month)

### 3. Frontend Implementation

#### Create Date Format Context
```javascript
// src/contexts/DateFormatContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import generalSettingsService from '../services/api/generalSettingsService';

const DateFormatContext = createContext();

export function DateFormatProvider({ children }) {
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');

  useEffect(() => {
    // Fetch from general settings
    const fetchFormats = async () => {
      const settings = await generalSettingsService.getSettings('localization');
      const dateFormatSetting = settings.find(s => s.setting_key === 'date_format');
      const timeFormatSetting = settings.find(s => s.setting_key === 'time_format');
      
      if (dateFormatSetting) setDateFormat(dateFormatSetting.setting_value);
      if (timeFormatSetting) setTimeFormat(timeFormatSetting.setting_value);
    };
    
    fetchFormats();
  }, []);

  return (
    <DateFormatContext.Provider value={{ dateFormat, timeFormat, setDateFormat, setTimeFormat }}>
      {children}
    </DateFormatContext.Provider>
  );
}

export const useDateFormat = () => useContext(DateFormatContext);
```

#### Update formatTime Utility
```javascript
// src/utils/formatTime.js
import { format, formatDistanceToNow } from 'date-fns';

export function fDate(date, formatStr) {
  // If formatStr not provided, use global setting from context
  const globalFormat = localStorage.getItem('dateFormat') || 'MM/dd/yyyy';
  return format(new Date(date), formatStr || globalFormat);
}

export function fDateTime(date, formatStr) {
  const globalFormat = localStorage.getItem('datetimeFormat') || 'MM/dd/yyyy hh:mm a';
  return format(new Date(date), formatStr || globalFormat);
}
```

#### Wrap App with Provider
```javascript
// src/App.js
import { DateFormatProvider } from './contexts/DateFormatContext';

function App() {
  return (
    <DateFormatProvider>
      {/* existing app content */}
    </DateFormatProvider>
  );
}
```

### 4. Apply Globally

Update all date displays to use the utility:
- Employee Details: Date of Birth, Joining Date
- Attendance Records: Date
- Leave Applications: Start Date, End Date
- Documents: Upload Date
- Payroll: Pay Period
- Calendar Events: Event Date

### 5. Testing Checklist
- [ ] Change date format in General Settings
- [ ] Verify Employee Details page uses new format
- [ ] Verify Attendance page uses new format
- [ ] Verify Leave page uses new format
- [ ] Verify Calendar uses new format
- [ ] Verify Reports use new format
- [ ] Verify date inputs still work (always use YYYY-MM-DD internally)

## Benefits
1. **User Preference**: Users can choose their preferred date format
2. **Internationalization**: Support for different regions
3. **Consistency**: Single source of truth for date formatting
4. **Flexibility**: Easy to add new formats

## Notes
- Date **inputs** always use `YYYY-MM-DD` (HTML standard)
- Date **displays** use the selected format
- Backend always stores dates as `YYYY-MM-DD` or ISO format
- Frontend converts for display only

## Estimated Effort
- Database & Settings UI: 2 hours
- Context & Utility Updates: 3 hours
- Update All Components: 5 hours
- Testing: 2 hours
- **Total: ~12 hours**

## Priority
Medium - Nice to have feature for better UX and internationalization

