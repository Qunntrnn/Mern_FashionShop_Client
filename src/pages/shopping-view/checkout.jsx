import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();



  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Vui lòng chọn địa chỉ",
        variant: "destructive",
      });
      return;
    }

    // Calculate total amount
    const totalCartAmount = cartItems.items.reduce(
      (sum, currentItem) =>
        sum +
        (currentItem?.salePrice > 0
          ? currentItem?.salePrice
          : currentItem?.price) *
          currentItem?.quantity,
      0
    );

    console.log("Cart items:", cartItems.items);
    console.log("Total amount:", totalCartAmount);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => {
        const price = singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price;
        console.log(`Item ${singleCartItem?.title} - Price: ${price}, Quantity: ${singleCartItem?.quantity}`);
        return {
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price: price,
          quantity: singleCartItem?.quantity,
          size: singleCartItem?.size
        };
      }),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log("Creating order with data:", orderData);

    dispatch(createNewOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          setIsPaymemntStart(true);
          if (data?.payload?.approvalURL) {
            window.location.href = data.payload.approvalURL;
          } else {
            navigate("/shop/payment-success", { state: { paymentMethod: "paypal" } });
          }
        } else {
          toast({
            title: data?.payload?.message || "Lỗi khi tạo đơn hàng",
            variant: "destructive",
          });
          setIsPaymemntStart(false);
        }
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        toast({
          title: "Lỗi khi tạo đơn hàng",
          variant: "destructive",
        });
        setIsPaymemntStart(false);
      });
  }

  function handleInitiateCODPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Vui lòng chọn địa chỉ",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => {
        const price = singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price;
        return {
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price: price,
          quantity: singleCartItem?.quantity,
          size: singleCartItem?.size
        };
      }),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log("Creating order with data:", orderData);
    console.log("Cart ID:", cartItems?._id);

    dispatch(createNewOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Đặt hàng thành công",
            description: "Vui lòng thanh toán khi nhận hàng",
          });
          navigate("/shop/payment-success", { state: { paymentMethod: "cod" } });
        } else {
          toast({
            title: data?.payload?.message || "Lỗi khi tạo đơn hàng",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        toast({
          title: "Lỗi khi tạo đơn hàng",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Tổng</span>
              <span className="font-bold">{totalCartAmount.toLocaleString('vi-VN')} VND</span>
            </div>
          </div>
          <div className="mt-4 w-full space-y-4">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Đang thanh toán..."
                : "Thanh toán bằng Paypal"}
            </Button>
            <Button onClick={handleInitiateCODPayment} className="w-full" variant="outline">
              Thanh toán khi nhận hàng (COD)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
