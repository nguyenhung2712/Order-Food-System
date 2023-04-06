import ProductActionTypes from "../constants/ProductActionTypes";

export const init = (products) => {
    return {
        type: ProductActionTypes.INIT_PRODUCTS,
        payload: products,
    };
}

export const getList = () => {
    return { type: ProductActionTypes.GET_PRODUCTS };
}

export const create = (product) => {
    return {
        type: ProductActionTypes.CREATE_PRODUCT,
        payload: { product },
    };
}

export const update = (productId, newInfo) => {
    return {
        type: ProductActionTypes.UPDATE_PRODUCT,
        payload: { productId, newInfo },
    };
}

export const unable = (productId) => {
    return { 
        type: ProductActionTypes.UNABLE_PRODUCT,
        payload: { productId },
    };
}

export const recover = (productId) => {
    return { 
        type: ProductActionTypes.RECOVER_PRODUCT ,
        payload: { productId },
    };
}
 