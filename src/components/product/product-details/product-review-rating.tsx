import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import ReviewCard from '@components/cards/review-card';
import { Pagination } from '@components/common/pagination';

interface Props {
  data?: any;
}

const itemsPerPage = 5;

const ProductReviewRating: FC<Props> = ({ data }) => {
  const { t } = useTranslation('common');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="pt-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="relative me-2"
      >
        {/* <span className="absolute end-3 top-[85%] transform -translate-y-1/2 order-icon-color">
                                <BsSearch size={17} />
                            </span>
                            <Input
                                name="search"
                                type="search"
                                value={filterText}
                                onChange={handleFilter}
                                placeholder={t('text-search-blog')}
                                className="h-full"
                                inputClassName="h-full w-full placeholder-[rgba(0, 0, 0, .3)] bg-white border border-[#E3E8EC] rounded-md order-search focus:border-2 focus:outline-none focus:border-skin-primary"
                            /> */}
      </form>
      <div className="pt-3">
        {data
          .slice(
            (currentPage - 1) * itemsPerPage,
            (currentPage - 1) * itemsPerPage + itemsPerPage
          )
          .map((item: any) => (
            <ReviewCard item={item} key={`review-key-${item.id}`} />
          ))}
      </div>
      <Pagination
        totalPages={totalPages}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductReviewRating;
