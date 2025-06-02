import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { orderList } = useSelector((state) => state.adminOrder);

  // Calculate revenue statistics
  const totalRevenue = orderList
    .filter(order => order.orderStatus !== "rejected")
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const totalOrders = orderList.filter(order => order.orderStatus !== "rejected").length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate monthly revenue
  const monthlyRevenue = orderList
    .filter(order => order.orderStatus !== "rejected")
    .reduce((acc, order) => {
      const month = new Date(order.orderDate).toLocaleString('vi-VN', { month: 'long' });
      acc[month] = (acc[month] || 0) + order.totalAmount;
      return acc;
    }, {});

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id));
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getAllOrdersForAdmin({ page: 1, limit: 1000 })); // Get all orders for statistics
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Revenue Statistics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')} VND</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị đơn hàng trung bình</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOrderValue.toLocaleString('vi-VN')} VND</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu theo tháng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                <div key={month} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{month}</span>
                  <span className="font-medium">{revenue.toLocaleString('vi-VN')} VND</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Images Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý ảnh banner</h2>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
          Tải ảnh lên
        </Button>
        <div className="flex flex-col gap-4 mt-5">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem) => (
                <div key={featureImgItem._id} className="relative">
                  <img
                    src={featureImgItem.image}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
