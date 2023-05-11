const { orderService } = require('../services');
const fs = require('fs');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const { generateLocaleDate } = require('../utils/generateDate');

const getAll = async (req, res) => {
    try {
        const response = await orderService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await orderService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByUserId = async (req, res) => {
    try {
        const response = await orderService.getByUserId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createOrder = async (req, res) => {
    try {
        const { payment, ...order } = req.body;
        const response = await orderService.createOrder(payment, { ...order });
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateOrder = async (req, res) => {
    try {
        const response = await orderService.updateOrder(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const checkout = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await orderService.checkout(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleOrder = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await orderService.deleteOrder(id)
            : await orderService.recoverOrder(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const exportOrder = async (req, res) => {
    try {
        const { id, locale } = req.params;
        const formatCurrency = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: locale === "en" ? "USD" : "VND",
        });
        const response = await orderService.getById(id);
        const data = response.payload;
        const file = fs.readFileSync('./src/utils/invoice-template.html', 'utf8');
        const template = handlebars.compile(`${file}`);
        const html = template({
            number: (locale === "en" ? "Invoice #: " : "Đơn #: ") + data.number,
            createdAt: (locale === "en" ? "Created: " : "Tạo lúc: ") + generateLocaleDate(data.createdAt, locale),
            predictDate: (locale === "en" ? "Due: " : "Giao lúc: ") + generateLocaleDate(data.predictDate, locale),
            name: data.user.firstName + " " + data.user.lastName,
            email: data.user.email,
            orderDetails: data.OrderDetails.map(detail => {
                let price = (locale === "en" ? (detail.dish.price * 43) / 1000000 : detail.dish.price);
                return {
                    name: (locale === "en" ? detail.dish.dishNameEn : detail.dish.dishName),
                    price: formatCurrency.format(price),
                    quantity: detail.quantity
                };
            }),
            total: (locale === "en" ? "Total: " : "Tổng: ") + formatCurrency.format(data.OrderDetails.reduce((accumulate, detail) => {
                let price = (locale === "en" ? (detail.dish.price * 43) / 1000000 : detail.dish.price);
                return accumulate + Number(price) * Number(detail.quantity)
            }, 0))
        });
        const browser = await puppeteer.launch({ headless: 'new' });
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        res.statusCode = 200;
        return res.send(pdf);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    createOrder,
    updateOrder,
    toggleOrder,
    exportOrder,
    checkout
}