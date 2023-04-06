import BlogActionTypes from "../constants/BlogActionTypes";

const initialState = {
    blogsList: []
}

const BlogReducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case BlogActionTypes.INIT_PRODUCTS: {
            return {
                ...state,
                blogsList: payload
            };
        }
        case BlogActionTypes.GET_PRODUCTS: {
            return {
                ...state,
                blogsList: payload
            };
        }
        case BlogActionTypes.CREATE_PRODUCT: {
            let blogsList = state.blogsList;
            return {
                ...state,
                blogsList: [...blogsList, payload.blog]
            };
        }
        case BlogActionTypes.UPDATE_PRODUCT: {
            const { blogId, newInfo } = payload;
            let blogsList = state.blogsList;
            let index = blogsList.findIndex(blog => blog.id === blogId);
            if (index > -1) {
                blogsList[index] = newInfo;
            }
            return {
                ...state,
                blogsList
            };
        }
        case BlogActionTypes.UNABLE_PRODUCT: {
            const { blogId } = payload;
            let blogsList = state.blogsList;
            let index = blogsList.findIndex(blog => blog.id === blogId);
            if (index > -1) {
                blogsList[index].status = 0;
            }
            return {
                ...state,
                blogsList
            };
        }
        case BlogActionTypes.RECOVER_PRODUCT: {
            const { blogId } = payload;
            let blogsList = state.blogsList;
            let index = blogsList.findIndex(blog => blog.id === blogId);
            if (index > -1) {
                blogsList[index].status = 1;
            }
            return {
                ...state,
                blogsList
            };
        }
        default: {
            return {...state};
        }
    }
};

export default BlogReducer;