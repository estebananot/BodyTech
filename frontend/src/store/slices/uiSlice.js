import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: {
      show: false,
      message: '',
      type: 'info'
    },
    modal: {
      isOpen: false,
      type: null
    }
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null
      };
    }
  }
});

export const { showToast, hideToast, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
