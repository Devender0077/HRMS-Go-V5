import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  employees: [],
  currentEmployee: null,
  totalCount: 0,
  filters: {
    search: '',
    department: '',
    branch: '',
    designation: '',
    status: 'active',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
};

const slice = createSlice({
  name: 'employee',
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

    // GET EMPLOYEES SUCCESS
    getEmployeesSuccess(state, action) {
      state.isLoading = false;
      state.employees = action.payload.employees;
      state.totalCount = action.payload.totalCount;
    },

    // GET EMPLOYEE SUCCESS
    getEmployeeSuccess(state, action) {
      state.isLoading = false;
      state.currentEmployee = action.payload;
    },

    // CREATE EMPLOYEE SUCCESS
    createEmployeeSuccess(state, action) {
      state.isLoading = false;
      state.employees.unshift(action.payload);
      state.totalCount += 1;
    },

    // UPDATE EMPLOYEE SUCCESS
    updateEmployeeSuccess(state, action) {
      state.isLoading = false;
      const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      if (state.currentEmployee?.id === action.payload.id) {
        state.currentEmployee = action.payload;
      }
    },

    // DELETE EMPLOYEE SUCCESS
    deleteEmployeeSuccess(state, action) {
      state.isLoading = false;
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      state.totalCount -= 1;
    },

    // SET FILTERS
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // SET PAGINATION
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // CLEAR CURRENT EMPLOYEE
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },

    // RESET FILTERS
    resetFilters(state) {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getEmployeesSuccess,
  getEmployeeSuccess,
  createEmployeeSuccess,
  updateEmployeeSuccess,
  deleteEmployeeSuccess,
  setFilters,
  setPagination,
  clearCurrentEmployee,
  resetFilters,
} = slice.actions;

// ----------------------------------------------------------------------

// Selectors
export const selectEmployee = (state) => state.employee;
export const selectEmployees = (state) => state.employee.employees;
export const selectCurrentEmployee = (state) => state.employee.currentEmployee;
export const selectEmployeeLoading = (state) => state.employee.isLoading;
export const selectEmployeeFilters = (state) => state.employee.filters;
export const selectEmployeePagination = (state) => state.employee.pagination;
export const selectEmployeeTotalCount = (state) => state.employee.totalCount;

