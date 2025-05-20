          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {product?.salePrice > 0
                ? product?.salePrice.toLocaleString('vi-VN')
                : product?.price.toLocaleString('vi-VN')}{" "}
              VND
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg line-through text-gray-500">
                {product?.price.toLocaleString('vi-VN')} VND
              </span>
            )}
          </div> 