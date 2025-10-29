import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
// services
import assetService from '../../../services/api/assetService';
import assetCategoryService from '../../../services/api/assetCategoryService';

// ----------------------------------------------------------------------

AssetNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAsset: PropTypes.object,
};

export default function AssetNewEditForm({ isEdit = false, currentAsset }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await assetCategoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const NewAssetSchema = Yup.object().shape({
    asset_name: Yup.string().required('Asset name is required'),
    asset_code: Yup.string().required('Asset code is required'),
    category_id: Yup.number().required('Category is required'),
    brand: Yup.string(),
    model: Yup.string(),
    serial_number: Yup.string(),
    purchase_date: Yup.date(),
    purchase_cost: Yup.number(),
    current_value: Yup.number(),
    warranty_expiry: Yup.date(),
    location: Yup.string(),
    status: Yup.string().required('Status is required'),
    condition: Yup.string().required('Condition is required'),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      asset_name: currentAsset?.asset_name || '',
      asset_code: currentAsset?.asset_code || '',
      category_id: currentAsset?.category_id || '',
      brand: currentAsset?.brand || '',
      model: currentAsset?.model || '',
      serial_number: currentAsset?.serial_number || '',
      purchase_date: currentAsset?.purchase_date || '',
      purchase_cost: currentAsset?.purchase_cost || '',
      current_value: currentAsset?.current_value || '',
      warranty_expiry: currentAsset?.warranty_expiry || '',
      location: currentAsset?.location || '',
      status: currentAsset?.status || 'available',
      condition: currentAsset?.condition || 'good',
      description: currentAsset?.description || '',
    }),
    [currentAsset]
  );

  const methods = useForm({
    resolver: yupResolver(NewAssetSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentAsset) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAsset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await assetService.update(currentAsset.id, data);
        enqueueSnackbar('Asset updated successfully!');
      } else {
        await assetService.create(data);
        enqueueSnackbar('Asset created successfully!');
      }
      navigate(PATH_DASHBOARD.assets.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message || 'Something went wrong!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Asset Information</Typography>
              
              <RHFTextField name="asset_name" label="Asset Name" />
              <RHFTextField name="asset_code" label="Asset Code" />
              
              <RHFSelect name="category_id" label="Category">
                <option value="" />
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </RHFSelect>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="brand" label="Brand" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="model" label="Model" />
                </Grid>
              </Grid>

              <RHFTextField name="serial_number" label="Serial Number" />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="purchase_date" label="Purchase Date" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="warranty_expiry" label="Warranty Expiry" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="purchase_cost" label="Purchase Cost" type="number" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="current_value" label="Current Value" type="number" />
                </Grid>
              </Grid>

              <RHFTextField name="location" label="Location" />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="status" label="Status">
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="condition" label="Condition">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </RHFSelect>
                </Grid>
              </Grid>

              <RHFTextField name="description" label="Description" multiline rows={4} />
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                {!isEdit ? 'Create Asset' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

