import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  jobPostings: [],
  currentJobPosting: null,
  candidates: [],
  currentCandidate: null,
  interviews: [],
  offers: [],
  onboardingProcesses: [],
  filters: {
    status: 'all',
    category: '',
    location: '',
  },
};

const slice = createSlice({
  name: 'recruitment',
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

    // GET JOB POSTINGS SUCCESS
    getJobPostingsSuccess(state, action) {
      state.isLoading = false;
      state.jobPostings = action.payload;
    },

    // GET JOB POSTING SUCCESS
    getJobPostingSuccess(state, action) {
      state.isLoading = false;
      state.currentJobPosting = action.payload;
    },

    // CREATE JOB POSTING SUCCESS
    createJobPostingSuccess(state, action) {
      state.isLoading = false;
      state.jobPostings.unshift(action.payload);
    },

    // UPDATE JOB POSTING SUCCESS
    updateJobPostingSuccess(state, action) {
      state.isLoading = false;
      const index = state.jobPostings.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobPostings[index] = action.payload;
      }
    },

    // DELETE JOB POSTING SUCCESS
    deleteJobPostingSuccess(state, action) {
      state.isLoading = false;
      state.jobPostings = state.jobPostings.filter((job) => job.id !== action.payload);
    },

    // GET CANDIDATES SUCCESS
    getCandidatesSuccess(state, action) {
      state.isLoading = false;
      state.candidates = action.payload;
    },

    // GET CANDIDATE SUCCESS
    getCandidateSuccess(state, action) {
      state.isLoading = false;
      state.currentCandidate = action.payload;
    },

    // CREATE CANDIDATE SUCCESS
    createCandidateSuccess(state, action) {
      state.isLoading = false;
      state.candidates.unshift(action.payload);
    },

    // UPDATE CANDIDATE SUCCESS
    updateCandidateSuccess(state, action) {
      state.isLoading = false;
      const index = state.candidates.findIndex((cand) => cand.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },

    // UPDATE CANDIDATE STATUS SUCCESS
    updateCandidateStatusSuccess(state, action) {
      state.isLoading = false;
      const index = state.candidates.findIndex((cand) => cand.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index].status = action.payload.status;
      }
    },

    // GET INTERVIEWS SUCCESS
    getInterviewsSuccess(state, action) {
      state.isLoading = false;
      state.interviews = action.payload;
    },

    // SCHEDULE INTERVIEW SUCCESS
    scheduleInterviewSuccess(state, action) {
      state.isLoading = false;
      state.interviews.unshift(action.payload);
    },

    // UPDATE INTERVIEW SUCCESS
    updateInterviewSuccess(state, action) {
      state.isLoading = false;
      const index = state.interviews.findIndex((int) => int.id === action.payload.id);
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    },

    // GET OFFERS SUCCESS
    getOffersSuccess(state, action) {
      state.isLoading = false;
      state.offers = action.payload;
    },

    // CREATE OFFER SUCCESS
    createOfferSuccess(state, action) {
      state.isLoading = false;
      state.offers.unshift(action.payload);
    },

    // UPDATE OFFER SUCCESS
    updateOfferSuccess(state, action) {
      state.isLoading = false;
      const index = state.offers.findIndex((offer) => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
    },

    // GET ONBOARDING PROCESSES SUCCESS
    getOnboardingProcessesSuccess(state, action) {
      state.isLoading = false;
      state.onboardingProcesses = action.payload;
    },

    // CREATE ONBOARDING PROCESS SUCCESS
    createOnboardingProcessSuccess(state, action) {
      state.isLoading = false;
      state.onboardingProcesses.unshift(action.payload);
    },

    // UPDATE ONBOARDING PROCESS SUCCESS
    updateOnboardingProcessSuccess(state, action) {
      state.isLoading = false;
      const index = state.onboardingProcesses.findIndex((proc) => proc.id === action.payload.id);
      if (index !== -1) {
        state.onboardingProcesses[index] = action.payload;
      }
    },

    // SET FILTERS
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // CLEAR CURRENT JOB POSTING
    clearCurrentJobPosting(state) {
      state.currentJobPosting = null;
    },

    // CLEAR CURRENT CANDIDATE
    clearCurrentCandidate(state) {
      state.currentCandidate = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getJobPostingsSuccess,
  getJobPostingSuccess,
  createJobPostingSuccess,
  updateJobPostingSuccess,
  deleteJobPostingSuccess,
  getCandidatesSuccess,
  getCandidateSuccess,
  createCandidateSuccess,
  updateCandidateSuccess,
  updateCandidateStatusSuccess,
  getInterviewsSuccess,
  scheduleInterviewSuccess,
  updateInterviewSuccess,
  getOffersSuccess,
  createOfferSuccess,
  updateOfferSuccess,
  getOnboardingProcessesSuccess,
  createOnboardingProcessSuccess,
  updateOnboardingProcessSuccess,
  setFilters,
  clearCurrentJobPosting,
  clearCurrentCandidate,
} = slice.actions;

// Selectors
export const selectRecruitment = (state) => state.recruitment;
export const selectJobPostings = (state) => state.recruitment.jobPostings;
export const selectCurrentJobPosting = (state) => state.recruitment.currentJobPosting;
export const selectCandidates = (state) => state.recruitment.candidates;
export const selectCurrentCandidate = (state) => state.recruitment.currentCandidate;
export const selectInterviews = (state) => state.recruitment.interviews;
export const selectOffers = (state) => state.recruitment.offers;
export const selectOnboardingProcesses = (state) => state.recruitment.onboardingProcesses;
export const selectRecruitmentFilters = (state) => state.recruitment.filters;

