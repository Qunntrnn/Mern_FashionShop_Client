import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import Pagination from "@/components/common/pagination";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  sizes: [],
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList, pagination } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const updateFormData = (newData) => {
    // Calculate totalStock from sizes array
    const totalStock = newData.sizes?.reduce((sum, size) => {
      const stock = Number(size.stock) || 0;
      return sum + stock;
    }, 0) || 0;

    setFormData({
      ...newData,
      totalStock: totalStock.toString(),
      price: newData.price?.toString() || "",
      salePrice: newData.salePrice?.toString() || "",
      sizes: newData.sizes?.map(size => ({
        ...size,
        stock: size.stock?.toString() || "0"
      })) || []
    });
  };

  function onSubmit(event) {
    event.preventDefault();

    // Format data before sending
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice),
      totalStock: Number(formData.totalStock),
      sizes: formData.sizes.map(size => ({
        size: size.size,
        stock: Number(size.stock)
      }))
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: {
            ...formattedData,
            image: uploadedImageUrl || formattedData.image,
          },
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts({ page: pagination.page, limit: pagination.limit }));
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImageUrl("");
          setImageFile(null);
          toast({
            title: "Sửa sản phẩm thành công",
          });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formattedData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts({ page: pagination.page, limit: pagination.limit }));
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          toast({
            title: "Thêm sản phẩm thành công",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts({ page: pagination.page, limit: pagination.limit }));
      }
    });
  }

  function isFormValid() {
    // Kiểm tra các trường bắt buộc
    const requiredFields = ['title', 'description', 'category', 'brand', 'price', 'sizes'];
    const hasRequiredFields = requiredFields.every(field => {
      if (field === 'sizes') {
        return formData[field] && formData[field].length > 0 && 
               formData[field].every(size => size.size && Number(size.stock) > 0);
      }
      return formData[field] !== "" && formData[field] !== null;
    });

    // Kiểm tra ảnh
    const hasImage = formData.image || uploadedImageUrl;

    return hasRequiredFields && hasImage;
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page]);

  const handlePageChange = (newPage) => {
    dispatch(fetchAllProducts({ page: newPage, limit: pagination.limit }));
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Thêm
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Sửa thông tin" : "Thêm sản phẩm"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={updateFormData}
              buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
