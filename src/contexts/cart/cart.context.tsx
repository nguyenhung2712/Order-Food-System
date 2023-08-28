import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { getItem /* , inStock */ } from './cart.utils';
import { useLocalStorage } from '@utils/use-local-storage';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import Cookies from 'js-cookie';
import { useCartItemsQuery } from '@framework/cart/get-cart-items';
import { CartItem } from '@framework/types';
import { useUI } from '@contexts/ui.context';

interface CartProviderState extends State {
    addItemToCart: (item: CartItem, quantity: number) => void;
    removeItemFromCart: (productId: string, cartId: string) => void;
    clearItemFromCart: (productId: string, cartId: string) => void;
    getItemFromCart: (id: CartItem['id']) => any | undefined;
    isInCart: (id: CartItem['id']) => boolean;
    /* isInStock: (id: Item['id']) => boolean; */
    resetCart: () => void;
    tempCart: () => void;
    setSelectedAddress: (address: any) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
    undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
    const context = React.useContext(cartContext);
    if (context === undefined) {
        throw new Error(`useCart must be used within a CartProvider`);
    }
    return context;
};

export const CartProvider: React.FC = (props) => {
    /* const { data, refetch } = useCartItemsQuery(); */
    const { isAuthorized } = useUI();
    const [state, dispatch] = React.useReducer(cartReducer, initialState);

    /*  React.useEffect(() => {
       refetch();
       (async () => {
         if (data) {
           await initItems(data);
         }
       })();
     }, [isAuthorized, data, refetch]); */

    const initItems = async (items: CartItem[]) => {
        dispatch({ type: 'INIT_ITEMS', items });
    };

    const addItemToCart = async (item: CartItem, quantity: number) => {
        let { cart, product, ...tempItem } = item;
        await http1.post(`${API_ENDPOINTS.CREATE_CART_ITEM}/${item.cart?.id!}`, {
            ...tempItem,
            quantity: quantity,
            cartId: cart.id,
            dishId: product.id,
        });
        dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
    };
    const removeItemFromCart = async (productId: string, cartId: string) => {
        await http1.put(`${API_ENDPOINTS.REMOVE_CART_ITEM}/${productId}/${cartId}`);
        dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id: productId });
    };

    const clearItemFromCart = async (productId: string, cartId: string) => {
        await http1.delete(
            `${API_ENDPOINTS.DELETE_CART_ITEM}/${productId}/${cartId}`
        );
        dispatch({ type: 'REMOVE_ITEM', id: productId });
    };

    const isInCart = useCallback(
        (id: CartItem['id']) =>
            !!getItem(state.items, id) /* !!getItem(state.items, id) */,
        [state.items]
    );
    const getItemFromCart = useCallback(
        (id: CartItem['id']) => {
            return getItem(state.items, id);
        },
        [state.items]
    );
    /* const isInStock = useCallback(
              (id: Item['id']) => inStock(state.items, id),
              [state.items]
          ); */
    const resetCart = async () => {
        const cart = JSON.parse(Cookies.get('cart') as string);
        await http1.delete(`${API_ENDPOINTS.CLEAR_CART_ITEMS}/${cart.id}`);
        dispatch({ type: 'RESET_CART' });
    };
    const tempCart = () => {
        dispatch({ type: 'TEMP_CART' });
    };
    const setSelectedAddress = (address: any) => {
        dispatch({ type: 'SET_SELECTED_ADDRESS', address });
    };

    const value = React.useMemo(
        () => ({
            ...state,
            addItemToCart,
            removeItemFromCart,
            clearItemFromCart,
            getItemFromCart,
            isInCart,
            /* isInStock, */
            resetCart,
            tempCart,
            setSelectedAddress,
        }),
        [getItemFromCart, isInCart /* isInStock,  */, , state]
    );
    return <cartContext.Provider value={value} {...props} />;
};
