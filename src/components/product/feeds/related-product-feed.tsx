import ProductsCarousel from '@components/product/products-carousel';
import { useRelatedProductsQuery } from '@framework/product/get-related-product';
import { LIMITS } from '@framework/utils/limits';

interface RelatedProductsProps {
  carouselBreakpoint?: {} | any;
  className?: string;
  uniqueKey?: string;
  type?: any;
}

const RelatedProductFeed: React.FC<RelatedProductsProps> = ({
  carouselBreakpoint,
  className,
  uniqueKey = 'related-product-popup',
  type,
}) => {
  const { data, isLoading, error } = useRelatedProductsQuery({
    limit: LIMITS.RELATED_PRODUCTS_LIMITS,
    type: type.id,
  });
  return (
    <ProductsCarousel
      sectionHeading="text-related-products"
      categorySlug={`/products?category=${type.slug}`}
      className={className}
      products={data}
      loading={isLoading}
      error={error?.message}
      limit={LIMITS.RELATED_PRODUCTS_LIMITS}
      uniqueKey={uniqueKey}
      carouselBreakpoint={carouselBreakpoint}
    />
  );
};

export default RelatedProductFeed;
