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
                    return res.status(404).json({
                        status: "error",
                        message: "Doesn't Exist!"
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
                    return res.status(404).json({
                        status: "error",
                        message: "Followed Users Doesn't Exist!"
                    });
                }
                await User.findOne({ 
                    where: { id: followingId }
                })
                    .then(async (following) => {
                        if (!following) {
                            return res.status(404).json({
                                status: "error",
                                message: "Following Users Doesn't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Order Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Order item Doesn't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedDish = async (req, res, next) => {
    const dishId = req.body.dishId ? req.body.dishId : req.params.id;
    await Dish.findOne({ 
        where: { id: dishId }
    })
        .then(dish => {
            if (!dish) {
                return res.status(404).json({
                    status: "error",
                    message: "Dish Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

const isExistedDishType = async (req, res, next) => {
    const { id } = req.params;
    await DishType.findOne({ 
        where: { id }
    })
        .then(type => {
            if (!type) {
                return res.status(404).json({
                    status: "error",
                    message: "Type Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedDishTypes = async (req, res, next) => {
    await DishType.findAll()
        .then(types => {
            if (!types || types.length === 0){
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Payment Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Rate Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Cart Doesn't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Item Doesn't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Item Doesn't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Blog Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Comment Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Comment Reply Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Comment Reply Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Follow Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
            return res.status(404).json({
                status: "error",
                message: "Location Does't Exist!"
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
                    return res.status(404).json({
                        status: "error",
                        message: "Province Don't Exist!"
                    });
                }
                await District.findOne({ 
                    where: { id: districtId }
                })
                    .then(async (district) => {
                        if (!district) {
                            return res.status(404).json({
                                status: "error",
                                message: "District Don't Exist!"
                            });
                        }
                        await Ward.findOne({ 
                            where: { id: wardId }
                        })
                            .then(async (ward) => {
                                if (!ward) {
                                    return res.status(404).json({
                                        status: "error",
                                        message: "Ward Don't Exist!"
                                    });
                                }
                                next();
                            });
                    });
            });
    }
}
//areexistedlocations

const isExistedAddress = async (req, res, next) => {
    const { id } = req.params.id;
    await Address.findOne({ 
        where: { id }
    })
        .then(address => {
            if (!address) {
                return res.status(404).json({
                    status: "error",
                    message: "Address Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

const isExistedPermiss = async (req, res, next) => {
    const { id } = req.params.id;
    await Permission.findOne({ 
        where: { id }
    })
        .then(permiss => {
            if (!permiss) {
                return res.status(404).json({
                    status: "error",
                    message: "Permission Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedPermiss = async (req, res, next) => {
    await Permission.findAll()
        .then(permiss => {
            if (!permiss) {
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedRole = async (req, res, next) => {
    const { id } = req.params.id;
    await Role.findOne({ 
        where: { id }
    })
        .then(role => {
            if (!role) {
                return res.status(404).json({
                    status: "error",
                    message: "Role Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedRoles = async (req, res, next) => {
    await Role.findAll()
        .then(roles => {
            if (!roles) {
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Staff Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedStaffs = async (req, res, next) => {
    await AdminStaff.findAll()
        .then(staffs => {
            if (!staffs) {
                return res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Conversation Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
                return res.status(404).json({
                    status: "error",
                    message: "Message Doesn't Exist!"
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
        return res.status(404).json({
            status: "error",
            message: "Don't Exist!"
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
    isExistedAddress,
    areExistedAddresses,

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

