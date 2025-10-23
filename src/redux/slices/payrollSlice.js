import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  payrollRuns: [],
  currentPayrollRun: null,
  payrollEntries: [],
  payslips: [],
  salaryComponents: [],
  employeeSalaries: [],
  filters: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'all',
  },
};

const slice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PAYROLL RUNS SUCCESS
    getPayrollRunsSuccess(state, action) {
      state.isLoading = false;
      state.payrollRuns = action.payload;
    },

    // GET PAYROLL RUN SUCCESS
    getPayrollRunSuccess(state, action) {
      state.isLoading = false;
      state.currentPayrollRun = action.payload;
    },

    // CREATE PAYROLL RUN SUCCESS
    createPayrollRunSuccess(state, action) {
      state.isLoading = false;
      state.payrollRuns.unshift(action.payload);
      state.currentPayrollRun = action.payload;
    },

    // UPDATE PAYROLL RUN SUCCESS
    updatePayrollRunSuccess(state, action) {
      state.isLoading = false;
      const index = state.payrollRuns.findIndex((run) => run.id === action.payload.id);
      if (index !== -1) {
        state.payrollRuns[index] = action.payload;
      }
      if (state.currentPayrollRun?.id === action.payload.id) {
        state.currentPayrollRun = action.payload;
      }
    },

    // PROCESS PAYROLL SUCCESS
    processPayrollSuccess(state, action) {
      state.isLoading = false;
      const index = state.payrollRuns.findIndex((run) => run.id === action.payload.id);
      if (index !== -1) {
        state.payrollRuns[index] = { ...state.payrollRuns[index], status: 'completed' };
      }
      state.payrollEntries = action.payload.entries;
    },

    // GET PAYROLL ENTRIES SUCCESS
    getPayrollEntriesSuccess(state, action) {
      state.isLoading = false;
      state.payrollEntries = action.payload;
    },

    // GET PAYSLIPS SUCCESS
    getPayslipsSuccess(state, action) {
      state.isLoading = false;
      state.payslips = action.payload;
    },

    // GENERATE PAYSLIPS SUCCESS
    generatePayslipsSuccess(state, action) {
      state.isLoading = false;
      state.payslips = action.payload;
    },

    // GET SALARY COMPONENTS SUCCESS
    getSalaryComponentsSuccess(state, action) {
      state.isLoading = false;
      state.salaryComponents = action.payload;
    },

    // GET EMPLOYEE SALARIES SUCCESS
    getEmployeeSalariesSuccess(state, action) {
      state.isLoading = false;
      state.employeeSalaries = action.payload;
    },

    // CREATE SALARY COMPONENT SUCCESS
    createSalaryComponentSuccess(state, action) {
      state.isLoading = false;
      state.salaryComponents.push(action.payload);
    },

    // UPDATE SALARY COMPONENT SUCCESS
    updateSalaryComponentSuccess(state, action) {
      state.isLoading = false;
      const index = state.salaryComponents.findIndex((comp) => comp.id === action.payload.id);
      if (index !== -1) {
        state.salaryComponents[index] = action.payload;
      }
    },

    // DELETE SALARY COMPONENT SUCCESS
    deleteSalaryComponentSuccess(state, action) {
      state.isLoading = false;
      state.salaryComponents = state.salaryComponents.filter((comp) => comp.id !== action.payload);
    },

    // SET FILTERS
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // CLEAR CURRENT PAYROLL RUN
    clearCurrentPayrollRun(state) {
      state.currentPayrollRun = null;
      state.payrollEntries = [];
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getPayrollRunsSuccess,
  getPayrollRunSuccess,
  createPayrollRunSuccess,
  updatePayrollRunSuccess,
  processPayrollSuccess,
  getPayrollEntriesSuccess,
  getPayslipsSuccess,
  generatePayslipsSuccess,
  getSalaryComponentsSuccess,
  getEmployeeSalariesSuccess,
  createSalaryComponentSuccess,
  updateSalaryComponentSuccess,
  deleteSalaryComponentSuccess,
  setFilters,
  clearCurrentPayrollRun,
} = slice.actions;

// Selectors
export const selectPayroll = (state) => state.payroll;
export const selectPayrollRuns = (state) => state.payroll.payrollRuns;
export const selectCurrentPayrollRun = (state) => state.payroll.currentPayrollRun;
export const selectPayrollEntries = (state) => state.payroll.payrollEntries;
export const selectPayslips = (state) => state.payroll.payslips;
export const selectSalaryComponents = (state) => state.payroll.salaryComponents;
export const selectEmployeeSalaries = (state) => state.payroll.employeeSalaries;
export const selectPayrollFilters = (state) => state.payroll.filters;

