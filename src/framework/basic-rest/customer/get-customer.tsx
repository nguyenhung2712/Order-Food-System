import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { Customer } from '@framework/types';
import { http1 } from '@framework/utils/http';

const fetchCustomers = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.CUSTOMER}/${_id}`);
  return data.payload;
};

const useCustomersQuery = (id: string) => {
  return useQuery<Customer, Error>([API_ENDPOINTS.CUSTOMER, id], () =>
    fetchCustomers(id)
  );
};

export { useCustomersQuery, fetchCustomers };
