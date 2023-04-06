const { 
    User, AdminStaff,
    OrderDetail, Order, Payment,
    DishType, Dish, Rate,
    Cart, CartItem,
    Blog, Comment, CommentRep,
    Notification, Follow,
    Province, District, Ward, Address, 
    Role, Permission,
    Conversation, Message
} = require("../models");

const isExistedUser = async (req, res, next) => {
    const userId = req.body.userId ? req.body.userId : req.params.id;
    const { followedId, followingId } = req.body;
    if (userId) {
        await User.findOne({ 
            where: { id: userId }
        })
            .then(user => {
                if (!user) {
                    return res.json({
                        status: "error",
                        message: "Không tồn tại"
                    });
                }
                next();
            });
    }
    if (followedId && followingId) {
        await User.findOne({ 
            where: { id: followedId }
        })
            .then(async (followed) => {
                if (!followed) {
                    return res.json({
                        status: "error",
                        message: "Followed Users Không tồn tại"
                    });
                }
                await User.findOne({ 
                    where: { id: followingId }
                })
                    .then(async (following) => {
                        if (!following) {
                            return res.json({
                                status: "error",
                                message: "Người dùng đang theo dõi không tồn tại"
                            });
                        }
                        next();
                    });
            });
    }
}

const areExistedUsers = async (req, res, next) => {
    await User.findAll()
        .then(users => {
            if (!users || users.length === 0) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedOrder = async (req, res, next) => {
    const orderId = req.body.orderId ? req.body.orderId : req.params.id;
    await Order.findOne({ 
        where: { id: orderId }
    })
        .then(order => {
            if (!order) {
                return res.json({
                    status: "error",
                    message: "Đơn hàng hhông tồn tại"
                });
            }
            next();
        });
}

const areExistedOrders = async (req, res, next) => {
    const userId = req.body.userId ? req.body.userId : req.params.id;
    let orders;
    if (userId) {
        orders = await Order.findAll({
            where: { userId }
        });
    } else {
        orders = await Order.findAll();
    }

    if (!orders || !orders.length === 0){
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedOrderDetail = async (req, res, next) => {
    const { id } = req.params;
    await OrderDetail.findOne({ 
        where: { id }
    })
        .then(detail => {
            if (!detail) {
                return res.json({
                    status: "error",
                    message: "Chi tiết đơn không tồn tại"
                });
            }
            next();
        });
}

const areExistedOrderDetails = async (req, res, next) => {
    const orderId = req.body.orderId ? req.body.orderId : req.params.id;
    await OrderDetail.findAll({ 
        where: { orderId }
    })
        .then(details => {
            if (!details || details.length === 0) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedDish = async (req, res, next) => {
    const dishId = req.body.dishId 
        ? req.body.dishId 
        : req.params.id;
    await Dish.findOne({ 
        where: { id: dishId }
    })
        .then(dish => {
            if (!dish) {
                return res.json({
                    status: "error",
                    message: "Sản phẩm Không tồn tại"
                });
            }
            next();
        });
}

const areExistedDishes = async (req, res, next) => {
    const typeId = req.body.typeId ? req.body.typeId : req.params.id;
    const dishes = typeId
        ? await Dish.findAll({
            where: { typeId }
        })
        : await Dish.findAll();

    if (!dishes || dishes.length === 0) { 
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedDishType = async (req, res, next) => {
    const typeId = req.body.typeId ? req.body.typeId : req.params.id;
    await DishType.findOne({ 
        where: { id: typeId }
    })
        .then(type => {
            if (!type) {
                return res.json({
                    status: "error",
                    message: "Loại sản phẩm không tồn tại"
                });
            }
            next();
        });
}

const areExistedDishTypes = async (req, res, next) => {
    await DishType.findAll()
        .then(types => {
            if (!types || types.length === 0){
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedPayment = async (req, res, next) => {
    const paymentId = req.body.paymentId ? req.body.paymentId : req.params.id;
    await Payment.findOne({ 
        where: { id: paymentId }
    })
        .then(payment => {
            if (!payment) {
                return res.json({
                    status: "error",
                    message: "Hóa đơn không tồn tại"
                });
            }
            next();
        });
}

const areExistedPayments = async (req, res, next) => {
    const orderId = req.body.orderId ? req.body.orderId : req.params.id;
    let payments;
    if (orderId) {
        payments = await Payment.findAll({
            where: { orderId }
        });
    } else {
        payments = await Payment.findAll();
    }
    if (!payments || payments.length === 0){
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedRate = async (req, res, next) => {
    const { id } = req.params;
    await Rate.findOne({ 
        where: { id }
    })
        .then(rate => {
            if (!rate) {
                return res.json({
                    status: "error",
                    message: "Đánh giá đơn không tồn tại"
                });
            }
            next();
        });
}

const areExistedRates = async (req, res, next) => {
    const { type, id } = req.params;
    const rates = type === "user"
        ? await Rate.findAll({ 
            where: { userId: id }
        })
        : await Rate.findAll({
            where: { dishId: id }
        });
    if (!rates) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedCart = async (req, res, next) => {
    const { id } = req.params;
    await Cart.findOne({ 
        where: { id }
    })
        .then(cart => {
            if (!cart) {
                return res.json({
                    status: "error",
                    message: "Giỏ hàng không tồn tại"
                });
            }
            next();
        });
}

const isExistedCartItem = async (req, res, next) => {
    const { id } = req.params;
    await CartItem.findOne({ 
        where: { id }
    })
        .then(item => {
            if (!item) {
                return res.json({
                    status: "error",
                    message: "Sản phẩm giỏ hàng không tồn tại"
                });
            }
            next();
        });
}

const areExistedCartItems = async (req, res, next) => {
    const { id } = req.params;
    await CartItem.findAll({ 
        where: { cartId: id }
    })
        .then(item => {
            if (!item) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedBlog = async (req, res, next) => {
    let blogId = req.body.blogId ? req.body.blogId : req.params.id;
    await Blog.findOne({ 
        where: { id: blogId }
    })
        .then(blog => {
            if (!blog) {
                return res.json({
                    status: "error",
                    message: "Blog Không tồn tại"
                });
            }
            next();
        });
}

const areExistedBlogs = async (req, res, next) => {
    let userId = req.body.userId ? req.body.userId : req.params.id;
    let blogs;
    if (userId) {
        blogs = await Blog.findAll({
            where: { userId }
        });
    } else {
        blogs = await Blog.findAll();
    }
    if (!blogs || blogs.length === 0){
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedComment = async (req, res, next) => {
    let commentId = req.body.commentId ? req.body.commentId : req.params.id;
    await Comment.findOne({ 
        where: { id: commentId }
    })
        .then(comment => {
            if (!comment) {
                return res.json({
                    status: "error",
                    message: "Bình luận không tồn tại"
                });
            }
            next();
        });
}

const areExistedComments = async (req, res, next) => {
    const { type, id } = req.params;
    const comments = type === "user"
        ? await Comment.findAll({ 
            where: { userId: id }
        })
        : await Comment.findAll({
            where: { blogId: id }
        });
    if (!comments || comments.length === 0) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedCommentRep = async (req, res, next) => {
    let repId = req.body.repId ? req.body.repId : req.params.id;
    await CommentRep.findOne({ 
        where: { id: repId }
    })
        .then(rep => {
            if (!rep) {
                return res.json({
                    status: "error",
                    message: "Bình luận không tồn tại"
                });
            }
            next();
        });
}

const areExistedCommentReps = async (req, res, next) => {
    const { type, id } = req.params;
    const reps = type === "user"
        ? await CommentRep.findAll({ 
            where: { userId: id }
        })
        : await CommentRep.findAll({
            where: { commentId: id }
        });
    if (!reps || reps.length === 0) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedNotif = async (req, res, next) => {
    let notifyId = req.body.notifyId ? req.body.notifyId : req.params.id;
    await Notification.findOne({ 
        where: { id: notifyId }
    })
        .then(rep => {
            if (!rep) {
                return res.json({
                    status: "error",
                    message: "Thông báo không tồn tại"
                });
            }
            next();
        });
}

const areExistedNotifs = async (req, res, next) => {
    const { id } = req.params;
    let notifs;
    if (id) {
        notifs = await Notification.findAll({ 
            where: { receiverId: id }
        });
    } else {
        notifs = await Notification.findAll();
    }
    if (!notifs || notifs.length === 0) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedFollow = async (req, res, next) => {
    const { id } = req.params.id;
    await Follow.findOne({ 
        where: { id }
    })
        .then(follow => {
            if (!follow) {
                return res.json({
                    status: "error",
                    message: "Lượt theo dõi không tồn tại"
                });
            }
            next();
        });
}

const areExistedFollows = async (req, res, next) => {
    const { type, id } = req.params;
    const follows = type === "followed"
        ? await Follow.findAll({ 
            where: { followedId: id }
        })
        : await Follow.findAll({ 
            where: { followingId: id }
        });
    if (!follows || follows.length === 0) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedLocation = async (req, res, next) => {
    if (req.params) {
        const { type, id } = req.params;
        const response = type === "ward"
            ? await Ward.findOne({ 
                where: { id }
            })
            : type === "ward"
                ? await District.findOne({ 
                    where: { id }
                })
                : await Province.findOne({ 
                    where: { id }
                });
        if (!response) {
            return res.json({
                status: "error",
                message: "Địa điểm không tồn tại"
            });
        }
        next();
    } else if (req.body) {
        const { districtId, provinceId, wardId } = req.body;
        await Province.findOne({ 
            where: { id: provinceId }
        }) 
            .then(async (province) => {
                if (!province) {
                    return res.json({
                        status: "error",
                        message: "Tỉnh không tồn tại"
                    });
                }
                await District.findOne({ 
                    where: { id: districtId }
                })
                    .then(async (district) => {
                        if (!district) {
                            return res.json({
                                status: "error",
                                message: "Huyện không tồn tại"
                            });
                        }
                        await Ward.findOne({ 
                            where: { id: wardId }
                        })
                            .then(async (ward) => {
                                if (!ward) {
                                    return res.json({
                                        status: "error",
                                        message: "Quận không tồn tại"
                                    });
                                }
                                next();
                            });
                    });
            });
    }
}

const areExistedLocations = async (req, res, next) => {
    const { type, id } = req.params;
    const response = type === "wards"
        ? await Ward.findAll({ 
            where: { districtId: id }
        })
        : await District.findAll({ 
            where: { provinceId: id }
        });
    if (!response) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedAddress = async (req, res, next) => {
    let addressId = req.body.addressId ? req.body.addressId : req.params.id;
    await Address.findOne({ 
        where: { id: addressId }
    })
        .then(address => {
            if (!address) {
                return res.json({
                    status: "error",
                    message: "Địa chỉ Không tồn tại"
                });
            }
            next();
        });
}

const isExistedAddressByL = async (req, res, next) => {
    const { districtId, provinceId, wardId } = req.body;
    await Address.findOne({ 
        where: { districtId, provinceId, wardId }
    })
        .then(address => {
            if (address) {
                return res.json({
                    status: "error",
                    message: "Địa chỉ đã tồn tại"
                });
            }
            next();
        });
}

const areExistedAddresses = async (req, res, next) => {
    const { type, id } = req.params;
    let addresses;
    switch (type) {
        case "province": addresses = await Address.findAll({ where: { provinceId: id } }); break;
        case "district": addresses = await Address.findAll({ where: { district: id } }); break;
        case "ward": addresses = await Address.findAll({ where: { ward: id } }); break;
        default: addresses = await Address.findAll(); break;
    }
    if (!addresses || addresses.length === 0) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedPermiss = async (req, res, next) => {
    let permissId = req.body.permissId ? req.body.permissId : req.params.id;
    await Permission.findOne({ 
        where: { id: permissId }
    })
        .then(permiss => {
            if (!permiss) {
                return res.json({
                    status: "error",
                    message: "Quyền truy cập không tồn tại"
                });
            }
            next();
        });
}

const areExistedPermiss = async (req, res, next) => {
    await Permission.findAll()
        .then(permiss => {
            if (!permiss) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedRole = async (req, res, next) => {
    const roleId = req.body.roleId ? req.body.roleId : req.params.id;
    await Role.findOne({ 
        where: { id: roleId }
    })
        .then(role => {
            if (!role) {
                return res.json({
                    status: "error",
                    message: "Quyền không tồn tại"
                });
            }
            next();
        });
}

const areExistedRoles = async (req, res, next) => {
    await Role.findAll()
        .then(roles => {
            if (!roles) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedStaff = async (req, res, next) => {
    let adminId = req.body.adminId ? req.body.adminId : req.params.id;
    await AdminStaff.findOne({ 
        where: { id: adminId }
    })
        .then(staff => {
            if (!staff) {
                return res.json({
                    status: "error",
                    message: "Nhân viên không tồn tại"
                });
            }
            next();
        });
}

const areExistedStaffs = async (req, res, next) => {
    await AdminStaff.findAll()
        .then(staffs => {
            if (!staffs) {
                return res.json({
                    status: "error",
                    message: "Không tồn tại"
                });
            }
            next();
        });
}

const isExistedConver = async (req, res, next) => {
    let converId = req.body.converId ? req.body.converId : req.params.id;
    await Conversation.findOne({ 
        where: { id: converId }
    })
        .then(conver => {
            if (!conver) {
                return res.json({
                    status: "error",
                    message: "Cuộc thoại không tồn tại"
                });
            }
            next();
        });
}

const areExistedConvers = async (req, res, next) => {
    const adminId = req.params.id;
    const convers = adminId
        ? await Conversation.findAll({
            where: { adminId }
        })
        : await Conversation.findAll();
    if (!convers) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

const isExistedMessage = async (req, res, next) => {
    await Message.findOne({ 
        where: { id: req.params.id }
    })
        .then(message => {
            if (!message) {
                return res.json({
                    status: "error",
                    message: "Tin nhắn không tồn tại"
                });
            }
            next();
        });
}

const areExistedMessages = async (req, res, next) => {
    const { converId } = req.params.id;
    const messages = await Message.findAll({
            where: { converId }
        })
    if (!messages) {
        return res.json({
            status: "error",
            message: "Không tồn tại"
        });
    }
    next();
}

module.exports = { 
    isExistedUser,
    areExistedUsers,
    
    isExistedOrder,
    areExistedOrders,

    isExistedOrderDetail,
    areExistedOrderDetails,

    isExistedDish,
    areExistedDishes,

    isExistedDishType,
    areExistedDishTypes,

    isExistedPayment,
    areExistedPayments,

    isExistedRate,
    areExistedRates,

    isExistedCart,
    isExistedCartItem,
    areExistedCartItems,

    isExistedBlog,
    areExistedBlogs,

    isExistedComment,
    areExistedComments,

    isExistedCommentRep,
    areExistedCommentReps,

    isExistedNotif,
    areExistedNotifs,

    isExistedFollow,
    areExistedFollows,

    isExistedLocation,
    areExistedLocations,
    isExistedAddress,
    areExistedAddresses,
    isExistedAddressByL,

    isExistedPermiss,
    areExistedPermiss,

    isExistedRole,
    areExistedRoles,

    isExistedStaff,
    areExistedStaffs,
    
    isExistedConver,
    areExistedConvers,

    isExistedMessage,
    areExistedMessages
}

