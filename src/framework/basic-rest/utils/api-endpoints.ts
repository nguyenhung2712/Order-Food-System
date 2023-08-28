export const API_ENDPOINTS = {
  LOGIN: '/auth/login/user',
  REGISTER: '/auth/register/user',
  VERIFY_OTP_LOGIN: '/auth/verify-otp-login',
  VERIFY_OTP_FP: '/auth/verify-otp-fp',
  SEND_OTP: '/auth/send-otp',
  CONFIRM_MAIL: '/auth/confirm-mail',
  LOGOUT: '/logout',
  FORGET_PASSWORD: '/auth/forget-password',
  CHANGE_PASSWORD: '/user/change-password',
  CUSTOMER: '/user',
  CUSTOMER_BY_GOOGLE: '/user/gmail',
  UPDATE_CUSTOMER: '/user/update',
  UPLOAD_AVATAR_CUSTOMER: '/user/upload-avatar',

  STAFFS: '/admin/all',

  CATEGORIES: '/dish-type/all',
  CATEGORY_BY_NAME: '/dish-type/by-name',
  CATEGORY: '/dish-type',
  DIETARY: '/dietary.json',
  BRANDS: '/brands.json',
  PRODUCTS: '/dish/all/available',
  ALL_PRODUCTS: '/dish/all',
  PRODUCT: '/dish',
  PRODUCT_BY_SLUG: '/dish/slug',
  UPDATE_PRODUCT: '/dish/update',
  RELATED_PRODUCTS: '/dish/type',
  /* RELATED_PRODUCTS: '/related_products.json', */
  BEST_SELLER_PRODUCTS: '/products_best_seller.json',
  BEST_SELLER_GROCERY_PRODUCTS: '/products_best_seller_grocery.json',
  POPULAR_PRODUCTS: '/products_popular.json',
  COOKIES_PRODUCTS: '/products_cookies.json',
  CHIPS_PRODUCTS: '/products_chips.json',
  POPCORN_JERKY_PRODUCTS: '/products_popcorn_jerky.json',
  FRESH_VEGETABLES_PRODUCTS: '/products_fresh_vegetables.json',

  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CREATE_CART_ITEM: '/cart/create-item',
  REMOVE_CART_ITEM: '/cart/remove-item',
  DELETE_CART_ITEM: '/cart/delete-item',
  CLEAR_CART_ITEMS: '/cart/clear-items',

  SEARCH: '/search.json',
  /* ORDERS: '/orders.json', */
  ORDERS: '/order/user',
  /* ORDER: '/order.json', */
  ORDER: '/order',
  ORDER_DETAILS: '/order-detail/order',
  ORDER_DETAIL: '/order-detail',
  ORDER_STATUS: '/order-status.json',
  CREATE_ORDER: '/order/create',
  CREATE_ORDER_DETAIL: '/order-detail/create',
  UPDATE_ORDER: '/order/update',
  EXPORT_ORDER: '/order/export',
  CHECKOUT: '/order/checkout',

  ADDRESS: '/address/user-address',
  DEFAULT_ADDRESS: '/address/default-user-address',

  ADD_ADDRESS: '/address/create',
  UPDATE_ADDRESS: '/address/update',

  ADD_ADDRESS_INFO: '/address/create-user-address',
  UPDATE_ADDRESS_INFO: '/address/update-user-address',
  DELETE_ADDRESS_INFO: '/address/delete-user-address',

  PROVINCES: '/location/provinces',
  DISTRICTS: '/location/list/district',
  WARDS: '/location/list/ward',

  PAYMENT: '/payment.json',
  CONTACT: '/contact.json',
  SHOP: '/shop.json',
  SHOPS: '/shops.json',
  WISHLIST: '/wishlist.json',

  BLOGS: '/blog/all',
  BLOGS_BY_SORT: '/blog/all/sort',
  BLOG: '/blog',
  BLOG_BY_SLUG: '/blog/slug',
  BLOGS_BY_USER: '/blog/user',
  BLOGS_BY_SORT_USER: '/blog/user/sort',
  CREATE_BLOG: '/blog/create',
  UPDATE_BLOG: '/blog/update',
  DELETE_BLOG: '/blog/delete',
  INTERACT_BLOG: '/blog/interact',

  COMMENTS: '/comment/blog',
  ADD_COMMENT: '/comment/create',
  UPDATE_COMMENT: '/comment/update',
  UPLOAD_COMMENT_IMAGE: '/comment/upload-image',
  DELETE_COMMENT: '/comment/delete',
  INTERACT_CMT: '/comment/interact',

  ADD_REPCOMMENT: '/cmtrep/create',
  UPDATE_REPCOMMENT: '/cmtrep/update',
  UPLOAD_REPCOMMENT_IMAGE: '/cmtrep/upload-image',
  DELETE_REPCOMMENT: '/cmtrep/delete',
  INTERACT_REP: '/cmtrep/interact',

  FOLLOW: '/follow/create',
  UNFOLLOW: '/follow/delete',
  FOLLOWINGS: '/follow/following',

  RATING: '/rate/create',
  DELETE_RATING: '/rate/delete',
  RATINGS_BY_PRODUCT: '/rate/dish',

  UPLOAD_MSG_IMAGE: '/message/upload-image',

  REASONS: '/reason/all',
};