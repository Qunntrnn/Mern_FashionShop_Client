import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isCOD = location.state?.paymentMethod === "cod";

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">
          {isCOD ? "Đặt hàng thành công" : "Thanh toán thành công"}
        </CardTitle>
        <CardDescription className="text-lg mt-4">
          {isCOD 
            ? "Đơn hàng của bạn đã được đặt thành công. Vui lòng thanh toán khi nhận hàng."
            : "Đơn hàng của bạn đã được thanh toán thành công."}
        </CardDescription>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        Xem đơn hàng
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
