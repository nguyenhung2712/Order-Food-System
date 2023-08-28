const { i18n } = require('./next-i18next.config');
const runtimeCaching = require('next-pwa/cache');

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching,
});

module.exports = withPWA({
    reactStrictMode: true,
    i18n,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: [
            'res.cloudinary.com',
            'scontent.fdad3-1.fna.fbcdn.net',
            'lh3.googleusercontent.com',
        ],
    },
});
