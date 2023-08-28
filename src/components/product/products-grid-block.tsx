import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-cards/product-card';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import { Product, Product1 } from '@framework/types';
import Alert from '@components/ui/alert';
import { PaginatedProduct } from '@framework/product/get-all-available-products';
import { InfiniteData } from 'react-query';

interface ProductsProps {
  sectionHeading: string;
  sectionSubHeading?: string;
  headingPosition?: 'left' | 'center';
  className?: string;
  products?: InfiniteData<PaginatedProduct>;
  loading: boolean;
  error?: string;
  limit?: number;
  uniqueKey?: string;
}

const ProductsGridBlock: React.FC<ProductsProps> = ({
  sectionHeading,
  sectionSubHeading,
  headingPosition = 'center',
  className = 'mb-12 lg:mb-14 xl:mb-16',
  products,
  loading,
  error,
  limit,
  uniqueKey,
}) => {
  return (
    <div className={`${className}`}>
      <SectionHeader
        sectionHeading={sectionHeading}
        sectionSubHeading={sectionSubHeading}
        headingPosition={headingPosition}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5">
        {error ? (
          <Alert message={error} className="col-span-full" />
        ) : loading && !products?.pages.length ? (
          Array.from({ length: limit! }).map((_, idx) => (
            <ProductCardLoader
              key={`${uniqueKey}-${idx}`}
              uniqueKey={`${uniqueKey}-${idx}`}
            />
          ))
        ) : (
          products?.pages?.map((page: any) => {
            return page?.data?.map((product: Product1) => (
              <ProductCard
                key={`${uniqueKey}-${product.id}`}
                product={product}
              />
            ));
          })

          /*  products?.pages.map((product: any) => (
                         <ProductCard key={`${uniqueKey}-${product.id}`} product={product} />
                     )) */
        )}
      </div>
    </div>
  );
};

export default ProductsGridBlock;
