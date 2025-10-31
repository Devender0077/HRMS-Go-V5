import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  Stack,
  Alert,
  Box,
  LinearProgress,
  Chip,
  Divider,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import SignatureCanvas from '../../components/signature/SignatureCanvas';
import ContractDocumentViewer from '../../sections/@dashboard/contract/ContractDocumentViewer';
import ConfirmDialog from '../../components/confirm-dialog';
// services
import contractInstanceService from '../../services/api/contractInstanceService';
// utils
import { fDate, fDateTime } from '../../utils/formatTime';

// ----------------------------------------------------------------------

export default function ContractSigningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const signatureRef = useRef(null);

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [signDate, setSignDate] = useState(new Date().toISOString().split('T')[0]);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    fetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const response = await contractInstanceService.getById(id);

      if (response.success) {
        setContract(response.data);
        
        // Mark as viewed
        await contractInstanceService.markViewed(id);
      } else {
        enqueueSnackbar(response.message || 'Failed to load contract', { variant: 'error' });
        navigate('/dashboard/contracts/instances');
      }
    } catch (error) {
      console.error('❌ Error fetching contract:', error);
      enqueueSnackbar('Error loading contract', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!agreedToTerms) {
      enqueueSnackbar('Please agree to the terms and conditions', { variant: 'warning' });
      return;
    }

    if (!fullName.trim()) {
      enqueueSnackbar('Please enter your full name', { variant: 'warning' });
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      enqueueSnackbar('Please provide your signature', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);

      // Get signature data
      const signatureData = signatureRef.current?.getSignatureData();

      // For now, we'll just mark as completed
      // In production, this would call a PDF generation service
      const signedFilePath = `/uploads/signed-contracts/contract-${id}-signed.pdf`;

      const response = await contractInstanceService.complete(id, signedFilePath);

      if (response.success) {
        enqueueSnackbar('Contract signed successfully!', { variant: 'success' });
        navigate('/dashboard/onboarding'); // Redirect to onboarding checklist
      } else {
        enqueueSnackbar(response.message || 'Failed to complete contract', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Error signing contract:', error);
      enqueueSnackbar('Error signing contract', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      enqueueSnackbar('Please provide a reason for declining', { variant: 'warning' });
      return;
    }

    try {
      const response = await contractInstanceService.decline(id, declineReason);

      if (response.success) {
        enqueueSnackbar('Contract declined', { variant: 'info' });
        setOpenDeclineDialog(false);
        navigate('/dashboard/onboarding');
      } else {
        enqueueSnackbar(response.message || 'Failed to decline contract', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Error declining contract:', error);
      enqueueSnackbar('Error declining contract', { variant: 'error' });
    }
  };

  const getDaysRemaining = () => {
    if (!contract?.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(contract.expiresAt);
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleFieldChange = (fieldId, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  if (!contract) {
    return null;
  }

  const daysRemaining = getDaysRemaining();
  const disabled = contract.status === 'completed' || contract.status === 'declined';

  return (
    <>
      <Helmet>
        <title> Sign Contract | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Sign Contract"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts' },
            { name: 'Sign' },
          ]}
        />

        {/* Contract Header */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <div>
                <Typography variant="h4">{contract.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Contract #: {contract.contractNumber}
                </Typography>
              </div>
              <Chip
                label={contract.status}
                color={contract.status === 'completed' ? 'success' : 'warning'}
              />
            </Stack>

            {contract.template && (
              <Alert severity="info" icon={<Iconify icon="eva:file-text-fill" />}>
                Template: {contract.template.name} ({contract.template.category})
              </Alert>
            )}

            {daysRemaining !== null && daysRemaining > 0 && (
              <Alert severity={daysRemaining <= 2 ? 'warning' : 'info'}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:clock-fill" />
                  <Typography variant="body2">
                    This contract expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} ({fDate(contract.expiresAt)})
                  </Typography>
                </Stack>
              </Alert>
            )}

            {daysRemaining !== null && daysRemaining <= 0 && (
              <Alert severity="error">
                This contract has expired. Please contact HR for assistance.
              </Alert>
            )}
          </Stack>
        </Card>

        {/* Contract Document with Fields */}
        {contract.status !== 'completed' && contract.status !== 'declined' && contract.template && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Review Contract Document
            </Typography>
            
            <ContractDocumentViewer
              contractInstance={contract}
              templateId={contract.templateId}
              fieldValues={fieldValues}
              onFieldChange={handleFieldChange}
              disabled={disabled}
            />
          </Card>
        )}

        {/* Contract Form */}
        {contract.status !== 'completed' && contract.status !== 'declined' && (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Complete Your Signature
            </Typography>

            <Stack spacing={3}>
              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full legal name"
                disabled={disabled}
                required
                InputProps={{
                  startAdornment: <Iconify icon="eva:person-fill" sx={{ mr: 1, color: 'text.disabled' }} />,
                }}
              />

              {/* Date */}
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={signDate}
                onChange={(e) => setSignDate(e.target.value)}
                disabled={disabled}
                required
                InputLabelProps={{ shrink: true }}
              />

              <Divider />

              {/* Signature */}
              <SignatureCanvas ref={signatureRef} disabled={disabled} />

              <Divider />

              {/* Agreement Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={disabled}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the terms and conditions outlined in this contract and certify that the information provided is accurate.
                  </Typography>
                }
              />

              {/* Actions */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Iconify icon="eva:close-fill" />}
                  onClick={() => setOpenDeclineDialog(true)}
                  disabled={disabled || submitting}
                >
                  Decline
                </Button>

                <LoadingButton
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                  onClick={handleSign}
                  loading={submitting}
                  disabled={disabled || !agreedToTerms}
                >
                  Sign & Complete
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Completed Status */}
        {contract.status === 'completed' && (
          <Card sx={{ p: 3 }}>
            <Alert severity="success" icon={<Iconify icon="eva:checkmark-circle-2-fill" />}>
              <Typography variant="h6">Contract Completed</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                You signed this contract on {fDateTime(contract.completedDate)}
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="eva:eye-fill" />}
                onClick={async () => {
                  try {
                    enqueueSnackbar('Loading document...', { variant: 'info' });
                    const response = await contractInstanceService.downloadSigned(id);
                    
                    if (response.success) {
                      // Create blob URL and open in new tab
                      const blob = new Blob([response.data], { type: 'application/pdf' });
                      const url = window.URL.createObjectURL(blob);
                      window.open(url, '_blank');
                      
                      // Clean up after a delay
                      setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                      }, 100);
                    } else {
                      enqueueSnackbar(response.message || 'Failed to load document', { variant: 'error' });
                    }
                  } catch (error) {
                    console.error('View error:', error);
                    enqueueSnackbar('Error loading document', { variant: 'error' });
                  }
                }}
              >
                View Document
              </Button>

              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:download-fill" />}
                onClick={async () => {
                  try {
                    enqueueSnackbar('Downloading...', { variant: 'info' });
                    const response = await contractInstanceService.downloadSigned(id);
                    
                    if (response.success) {
                      // Create blob link to download
                      const blob = new Blob([response.data], { type: 'application/pdf' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${contract.contractNumber}_signed.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                      
                      enqueueSnackbar('Contract downloaded successfully', { variant: 'success' });
                    } else {
                      enqueueSnackbar(response.message || 'Failed to download contract', { variant: 'error' });
                    }
                  } catch (error) {
                    console.error('Download error:', error);
                    enqueueSnackbar('Error downloading contract', { variant: 'error' });
                  }
                }}
              >
                Download Signed Copy
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/contracts/my-contracts')}
              >
                Back to My Contracts
              </Button>
            </Stack>
          </Card>
        )}

        {/* Declined Status */}
        {contract.status === 'declined' && (
          <Card sx={{ p: 3 }}>
            <Alert severity="warning">
              <Typography variant="h6">Contract Declined</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                You declined this contract on {fDateTime(contract.declinedDate)}
              </Typography>
              {contract.declineReason && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Reason: {contract.declineReason}
                </Typography>
              )}
            </Alert>
          </Card>
        )}

        {/* Decline Dialog */}
        <ConfirmDialog
          open={openDeclineDialog}
          onClose={() => setOpenDeclineDialog(false)}
          title="Decline Contract"
          content={
            <Stack spacing={2} sx={{ pt: 2 }}>
              <Typography>
                Are you sure you want to decline this contract? This action cannot be undone.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Declining"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please provide a reason..."
                required
              />
            </Stack>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={handleDecline}
              disabled={!declineReason.trim()}
            >
              Decline Contract
            </Button>
          }
        />
      </Container>
    </>
  );
}

