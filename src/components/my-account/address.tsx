import Layout from '@components/layout/layout';
import AddressGrid from '@components/address/address-grid';
import { useAddressQuery } from '@framework/address/get_addresses';

export default function AccountDetailsPage() {
  let { data, isLoading } = useAddressQuery();
  return (
    <div className="pt-4">
      {!isLoading ? <AddressGrid address={data} /> : <div>Loading...</div>}
    </div>
  );
}

AccountDetailsPage.Layout = Layout;
