import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BankInfoModal = ({
  showBankModal,
  setShowBankModal,
  handleConfirmOrder,
}) => {
  const { order } = useSelector((store) => store);

  return (
    <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thông tin ngân hàng</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            <strong>Số tài khoản:</strong> {order.bank?.numberAccount}
          </p>
          <p>
            <strong>Ngân hàng:</strong> {order.bank?.nameBank}
          </p>
          <p>
            <strong>Chủ tài khoản:</strong> {order.bank?.nameAccount}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirmOrder}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CreateBankInfoModal = ({
  showCreateBankModal,
  setShowCreateBankModal,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={showCreateBankModal} onOpenChange={setShowCreateBankModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chưa có thông tin ngân hàng</DialogTitle>
        </DialogHeader>
        <p>Bạn cần cập nhật thông tin ngân hàng trước khi đặt lệnh.</p>
        <DialogFooter>
          <Button onClick={() => navigate("/account-bank")}>
            Cập nhật ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BankInfoModal, CreateBankInfoModal };
