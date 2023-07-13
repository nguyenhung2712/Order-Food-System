const preprocess = require('./preprocessText');

async function classify(text) {
    text = preprocess.textUtilFinal(text);
}

module.exports = classify