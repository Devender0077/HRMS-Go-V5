// @mui
import { RadioGroup, Stack, Typography } from '@mui/material';
//
import { useSettingsContext } from '../SettingsContext';
import { StyledCard, StyledWrap, MaskControl } from '../styles';
import Iconify from '../../iconify';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'small', label: 'Small', icon: 'mdi:format-font-size-decrease' },
  { value: 'medium', label: 'Medium', icon: 'mdi:format-size' },
  { value: 'large', label: 'Large', icon: 'mdi:format-font-size-increase' },
];

export default function FontSizeOptions() {
  const { themeFontSize, onChangeFontSize } = useSettingsContext();

  return (
    <RadioGroup name="themeFontSize" value={themeFontSize} onChange={onChangeFontSize}>
      <StyledWrap sx={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {OPTIONS.map((option) => (
          <StyledCard 
            key={option.value} 
            selected={themeFontSize === option.value}
            sx={{ p: 1.5, height: 64, flexDirection: 'column' }}
          >
            <Stack alignItems="center" spacing={0.5}>
              <Iconify icon={option.icon} width={24} />
              <Typography variant="caption">{option.label}</Typography>
            </Stack>

            <MaskControl value={option.value} />
          </StyledCard>
        ))}
      </StyledWrap>
    </RadioGroup>
  );
}

