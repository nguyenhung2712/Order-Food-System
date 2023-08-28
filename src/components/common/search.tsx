import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useSearchQuery } from '@framework/product/use-search';
import SearchBox from '@components/common/search-box';
import SearchProduct from '@components/common/search-product';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import useFreezeBodyScroll from '@utils/use-freeze-body-scroll';
import Scrollbar from '@components/ui/scrollbar';
import { useUI } from '@contexts/ui.context';
import { useProductsQuery } from '@framework/product/get-all-products';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

type Props = {
    className?: string;
    searchId?: string;
    variant?: 'border' | 'fill';
};

const Search = React.forwardRef<HTMLDivElement, Props>(
    (
        {
            className = 'md:w-[730px] 2xl:w-[800px]',
            searchId = 'search',
            variant = 'border',
        },
        ref
    ) => {
        const { locale } = useRouter();
        const {
            displayMobileSearch,
            closeMobileSearch,
            displaySearch,
            closeSearch,
        } = useUI();
        const { t } = useTranslation('common');
        const [searchText, setSearchText] = useState('');
        const [inputFocus, setInputFocus] = useState<boolean>(false);
        const [isProduct, setIsProduct] = useState<boolean>(true);
        const [filteredRes, setFilteredRes] = useState<any>();
        /* const { data, isLoading } = useSearchQuery({
                    text: searchText,
                }); */
        /* const { data, isLoading } = useProductsQuery();
        useFreezeBodyScroll(
          inputFocus === true || displaySearch || displayMobileSearch
        );
        console.log(data);
        useEffect(() => {
          if (data) {
            let filtered = data.filter(
              (product: any) =>
                // product.status === 1 &&
                product.dishName
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) > -1 ||
                // || product.dishNameEn.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                product.slug
                  .split('-')
                  .join(' ')
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) > -1
            );
            setFilteredRes(filtered);
          }
        }, [data, searchText]); */
        function handleSearch(e: React.SyntheticEvent) {
            e.preventDefault();
        }
        function handleAutoSearch(e: React.FormEvent<HTMLInputElement>) {
            setSearchText(e.currentTarget.value);
        }
        function clear() {
            setSearchText('');
            setInputFocus(false);
            closeMobileSearch();
            closeSearch();
        }
        function enableInputFocus() {
            setInputFocus(true);
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'w-full transition-all duration-200 ease-in-out',
                    className
                )}
            >
                <div
                    className={cn('overlay cursor-pointer', {
                        open: displayMobileSearch,
                        'input-focus-overlay-open': inputFocus === true,
                        'open-search-overlay': displaySearch,
                    })}
                    onClick={() => clear()}
                />
                {/* End of overlay */}

                <div className="w-full flex flex-col justify-center flex-shrink-0 relative z-30">
                    <div className="flex flex-col mx-auto w-full">
                        <SearchBox
                            searchId={searchId}
                            name="search"
                            value={searchText}
                            onSubmit={handleSearch}
                            onChange={handleAutoSearch}
                            onClear={clear}
                            onFocus={() => enableInputFocus()}
                            variant={variant}
                        />
                    </div>
                    {/* End of searchbox */}

                    {searchText && (
                        <div className="w-full absolute top-[56px] start-0 py-2.5 bg-skin-fill rounded-md flex flex-col overflow-hidden shadow-dropDown z-30">
                            <Scrollbar className="os-host-flexbox">
                                <div className="w-full h-fit">
                                    {/*  {isLoading
                    ? Array.from({ length: 15 }).map((_, idx) => (
                        <div
                          key={`search-result-loader-key-${idx}`}
                          className="py-2.5 ps-5 pe-10 scroll-snap-align-start"
                        >
                          <SearchResultLoader
                            key={idx}
                            uniqueKey={`top-search-${idx}`}
                          />
                        </div>
                      ))
                    : filteredRes?.map((item: any, index: any) => (
                        <div
                          key={`search-result-key-${index}`}
                          className="py-2.5 ps-5 pe-10 scroll-snap-align-start transition-colors duration-200 hover:bg-skin-two"
                          onClick={clear}
                        >
                          <SearchProduct item={item} key={index} />
                        </div>
                      ))} */}
                                </div>
                            </Scrollbar>
                        </div>
                    )}
                    {/* End of search result */}
                </div>
            </div>
        );
    }
);

Search.displayName = 'Search';

export default Search;
