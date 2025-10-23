import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  records: [],
  currentRecord: null,
  shifts: [],
  policies: [],
  regularizations: [],
  clockedIn: false,
  currentClockInTime: null,
  todayHours: 0,
  filters: {
    startDate: null,
    endDate: null,
    employee: '',
    status: 'all',
  },
};

const slice = createSlice({
  name: 'attendance',
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

    // GET RECORDS SUCCESS
    getRecordsSuccess(state, action) {
      state.isLoading = false;
      state.records = action.payload;
    },

    // CLOCK IN SUCCESS
    clockInSuccess(state, action) {
      state.isLoading = false;
      state.clockedIn = true;
      state.currentClockInTime = action.payload.clockInTime;
      state.currentRecord = action.payload;
    },

    // CLOCK OUT SUCCESS
    clockOutSuccess(state, action) {
      state.isLoading = false;
      state.clockedIn = false;
      state.currentClockInTime = null;
      state.todayHours = action.payload.totalHours;
      state.currentRecord = action.payload;
    },

    // GET SHIFTS SUCCESS
    getShiftsSuccess(state, action) {
      state.isLoading = false;
      state.shifts = action.payload;
    },

    // GET POLICIES SUCCESS
    getPoliciesSuccess(state, action) {
      state.isLoading = false;
      state.policies = action.payload;
    },

    // GET REGULARIZATIONS SUCCESS
    getRegularizationsSuccess(state, action) {
      state.isLoading = false;
      state.regularizations = action.payload;
    },

    // CREATE REGULARIZATION SUCCESS
    createRegularizationSuccess(state, action) {
      state.isLoading = false;
      state.regularizations.unshift(action.payload);
    },

    // SET FILTERS
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // UPDATE TODAY HOURS
    updateTodayHours(state, action) {
      state.todayHours = action.payload;
    },

    // RESET STATE
    resetAttendance(state) {
      state.clockedIn = false;
      state.currentClockInTime = null;
      state.todayHours = 0;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getRecordsSuccess,
  clockInSuccess,
  clockOutSuccess,
  getShiftsSuccess,
  getPoliciesSuccess,
  getRegularizationsSuccess,
  createRegularizationSuccess,
  setFilters,
  updateTodayHours,
  resetAttendance,
} = slice.actions;

// Selectors
export const selectAttendance = (state) => state.attendance;
export const selectClockedIn = (state) => state.attendance.clockedIn;
export const selectCurrentClockInTime = (state) => state.attendance.currentClockInTime;
export const selectTodayHours = (state) => state.attendance.todayHours;
export const selectAttendanceRecords = (state) => state.attendance.records;
export const selectShifts = (state) => state.attendance.shifts;
export const selectPolicies = (state) => state.attendance.policies;

