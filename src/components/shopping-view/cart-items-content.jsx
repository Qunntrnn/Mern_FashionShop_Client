import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  async function handleUpdateQuantity(getCartItem, typeOfAction) {
    try {
      if (typeOfAction == "plus") {
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
          const indexOfCurrentCartItem = getCartItems.findIndex(
            (item) => item.productId === getCartItem?.productId && item.size === getCartItem?.size
          );

          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
            const selectedSizeStock = productList.find(p => p._id === getCartItem?.productId)?.sizes.find(s => s.size === getCartItem?.size)?.stock || 0;
            
            if (getQuantity + 1 > selectedSizeStock) {
              toast({
                title: `Chỉ còn ${selectedSizeStock} sản phẩm cho size ${getCartItem?.size}`,
                variant: "destructive",
              });
              return;
            }
          }
        }
      }

      const newQuantity = typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1;

      const result = await dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCartItem?.productId,
          size: getCartItem?.size,
          quantity: newQuantity,
        })
      ).unwrap();

      if (result?.success) {
        // Fetch latest cart data after successful update
        await dispatch(fetchCartItems(user.id));
        toast({
          title: "Cập nhật thành công",
        });
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast({
        title: "Lỗi khi cập nhật số lượng",
        variant: "destructive",
      });
    }
  }

  async function handleCartItemDelete(getCartItem) {
    try {
      const result = await dispatch(
        deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
      ).unwrap();

      if (result?.success) {
        // Fetch latest cart data after successful deletion
        await dispatch(fetchCartItems(user.id));
        toast({
          title: "Xoá thành công",
        });
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast({
        title: "Lỗi khi xoá sản phẩm",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          {((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity).toLocaleString('vi-VN')} VND
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
