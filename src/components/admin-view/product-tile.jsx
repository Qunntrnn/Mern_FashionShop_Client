import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg line-through text-gray-500">
              {product?.price.toLocaleString('vi-VN')} VND
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">
                {product?.salePrice.toLocaleString('vi-VN')} VND
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Sửa
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Xoá</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
