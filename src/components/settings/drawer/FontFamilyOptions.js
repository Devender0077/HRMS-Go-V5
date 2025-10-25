// @mui
import { RadioGroup, Stack, Typography } from '@mui/material';
//
import { useSettingsContext } from '../SettingsContext';
import { StyledCard, StyledWrap, MaskControl } from '../styles';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'Public Sans', label: 'Public Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
];

export default function FontFamilyOptions() {
  const { themeFontFamily, onChangeFontFamily } = useSettingsContext();

  return (
    <RadioGroup name="themeFontFamily" value={themeFontFamily} onChange={onChangeFontFamily}>
      <StyledWrap sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
        {OPTIONS.map((option) => (
          <StyledCard 
            key={option.value} 
            selected={themeFontFamily === option.value}
            sx={{ 
              p: 1.5, 
              height: 56,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: option.value,
                fontWeight: 500,
              }}
            >
              {option.label}
            </Typography>

            <MaskControl value={option.value} />
          </StyledCard>
        ))}
      </StyledWrap>
    </RadioGroup>
  );
}

