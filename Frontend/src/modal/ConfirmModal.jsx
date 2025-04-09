import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ConfirmModal = ({ open, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-[1000]">
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md bg-[#1F2937] text-white"
        style={{ zIndex: 1001 }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-red-400 text-lg">
            Xác nhận hủy lệnh
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          Bạn có chắc chắn muốn hủy lệnh không? Hành động này không thể hoàn
          tác.
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
          >
            Không
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
          >
            Có, hủy lệnh
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

export default ConfirmModal;
