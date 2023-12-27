import { FC } from "react";
import { useModalState } from "./useModal";
import { Modal } from "antd";

const ModalHandler: FC = () => {
  const { open, content, close } = useModalState();

  return (
    <Modal open={open} onCancel={close}>
      {content}
    </Modal>
  );
};

export default ModalHandler;
