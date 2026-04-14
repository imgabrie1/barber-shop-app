import Button from "../ui/Button";
import P from "../ui/Span";
import Modal from "./Modal";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  colorConfirm: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({
  open,
  title,
  onCancel,
  onConfirm,
  colorConfirm
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <P className="text-center text-lg font-medium">{title}</P>

      <div
      style={{ marginTop: "1.875rem" }}
      className="flex justify-center gap-4">
        <Button onClick={onCancel} className="bg-gray-400 hover:brightness-90">
          Cancelar
        </Button>

        <Button
          onClick={onConfirm}
          className={`${colorConfirm} hover:brightness-90`}
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
