/* const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopwordContent = fs.readFileSync('./src/utils/files/vietnamese.txt', 'utf-8');
const stopword = stopwordContent.split('\n');

function textUtilFinal(text, locale) {
    text = text.replace(/[^a-zA-Zà-ỹẠ-Ỵ0-9]/g, " ");
    text = text.toLowerCase();


    let words;
    if (locale === 'en') {
        const tokenizer = new natural.WordTokenizer();
        words = tokenizer.tokenize(text);
    } else if (locale === 'vi') {
        words = text.split(' ');
    }


    let filteredWords;
    if (locale === 'en') {
        const stopwords = natural.stopwords;
        filteredWords = words.filter(word => !stopwords.includes(word));
    } else if (locale === 'vi') {
        const stopwords = stopword;
        filteredWords = words.filter(word => !stopwords.includes(word));
    }


    let stemmedWords;
    if (locale === 'en') {
        const stemmer = natural.PorterStemmer;
        stemmedWords = filteredWords.map(word => stemmer.stem(word));
    } else if (locale === 'vi') {
        const stemmer = require('stemmer');
        stemmedWords = filteredWords.map(word => stemmer(word));
    }

    text = stemmedWords.join(" ");

    return text;
} */

var tcode = [["ship", "vận chuyển"], ["shop", "cửa hàng"], ["m", "mình"], ["mik", "mình"], ["ko", "không"], ["k", "không"], ["kh", "không"], ["khong", "không"], ["kg", "không"], ["khg", "không"], ["tl", "trả lời"],
["rep", "trả lời"], ["r", "rồi"], ["fb", "facebook"], ["face", "faceook"], ["thanks", "cảm ơn"], ["thank", "cảm ơn"], ["tks", "cảm ơn"], ["tk", "cảm ơn"], ["ok", "tốt"], ["oki", "tốt"], ["okie", "tốt"], ["sp", "sản phẩm"],
["dc", "được"], ["vs", "với"], ["đt", "điện thoại"], ["thjk", "thích"], ["thik", "thích"], ["qá", "quá"], ["trể", "trễ"], ["bgjo", "bao giờ"], ["h", "giờ"], ["qa", "quá"], ["dep", "đẹp"], ["xau", "xấu"], ["ib", "nhắn tin"],
["cute", "dễ thương"], ["sz", "size"], ["good", "tốt"], ["god", "tốt"], ["bt", "bình thường"]];

const remove = (text) => {
    text = text.replace(/([A-Z])\1+/gi, function (m) { return m.charAt(0).toUpperCase(); });
    return text;
}

const utilsData = (text) => {
    var textArr = text.split(" ");
    for (var i = 0; i < textArr.length; i++) {
        for (var j = 0; j < tcode.length; j++) {
            if (textArr[i] == tcode[j][0]) {
                textArr[i] = tcode[j][1];
                break;
            }
        }
    }
    text = textArr.join(" ");
    return text;
}

const textUtilFinal = (text) => {
    text = remove(text);
    text = text.toLowerCase();
    text = utilsData(text);
    return text;
};

module.exports = {
    textUtilFinal
}