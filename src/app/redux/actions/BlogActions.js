import BlogActionTypes from "../constants/BlogActionTypes";

export const init = (blogs) => {
    return {
        type: BlogActionTypes.INIT_BLOGS,
        payload: blogs,
    };
}

export const getList = () => {
    return { type: BlogActionTypes.GET_BLOGS };
}

export const create = (blog) => {
    return {
        type: BlogActionTypes.CREATE_BLOG,
        payload: { blog },
    };
}

export const update = (blogId, newInfo) => {
    return {
        type: BlogActionTypes.UPDATE_BLOG,
        payload: { blogId, newInfo },
    };
}

export const unable =  (blogId) => {
    return { 
        type: BlogActionTypes.UNABLE_BLOG,
        payload: { blogId },
    };
}

export const recover = (blogId) => {
    return { 
        type: BlogActionTypes.RECOVER_BLOG ,
        payload: { blogId },
    };
}
 