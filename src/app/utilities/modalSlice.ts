import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isModalOpen: boolean;
  activeModal: "logIn" | "signUp" | "passwordReset";
}

const initialState: ModalState = {
  isModalOpen: false,
  activeModal: "logIn",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setModal: (state, action: PayloadAction<"logIn" | "signUp" | "passwordReset">) => {
      state.activeModal = action.payload;
      state.isModalOpen = true;
    },
  },
});

export const { toggleModal, setModal } = modalSlice.actions;
export default modalSlice.reducer;