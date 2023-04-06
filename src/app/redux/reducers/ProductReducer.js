import ProductActionTypes from "../constants/ProductActionTypes";

const initialState = {
    productsList: []
}

const ProductReducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case ProductActionTypes.INIT_PRODUCTS: {
            return {
                ...state,
                productsList: payload
            };
        }
        case ProductActionTypes.GET_PRODUCTS: {
            return {
                ...state,
                productsList: payload
            };
        }
        case ProductActionTypes.CREATE_PRODUCT: {
            let productsList = state.productsList;
            return {
                ...state,
                productsList: [...productsList, payload.product]
            };
        }
        case ProductActionTypes.UPDATE_PRODUCT: {
            const { productId, newInfo } = payload;
            let productsList = state.productsList;
            let index = productsList.findIndex(product => product.id === productId);
            if (index > -1) {
                productsList[index] = newInfo;
            }
            return {
                ...state,
                productsList
            };
        }
        case ProductActionTypes.UNABLE_PRODUCT: {
            const { productId } = payload;
            let productsList = state.productsList;
            let index = productsList.findIndex(product => product.id === productId);
            if (index > -1) {
                productsList[index].status = 0;
            }
            return {
                ...state,
                productsList
            };
        }
        case ProductActionTypes.RECOVER_PRODUCT: {
            const { productId } = payload;
            let productsList = state.productsList;
            let index = productsList.findIndex(product => product.id === productId);
            if (index > -1) {
                productsList[index].status = 1;
            }
            return {
                ...state,
                productsList
            };
        }
        default: {
            return {...state};
        }
    }
};

export default ProductReducer;