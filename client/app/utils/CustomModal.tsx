import React from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
};

const CustomModal: React.FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-[#0F172A] p-4 rounded-[8px] shadow outline-none">
        <Component setRoute={setRoute} setOpen={setOpen} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
