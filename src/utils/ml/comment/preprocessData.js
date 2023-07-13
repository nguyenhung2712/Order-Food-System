const fs = require('fs');
const readline = require('readline');

const loadRawData = async (path) => {
    let a = [], b = [];
    let regex = "train_";
    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        console: false
    });
    await new Promise((resolve, reject) => {
        readInterface.on('line', function (line) {
            if (line.includes(regex)) {
                if (a.length > 0) {
                    b.push(a);
                }
                a = [line];
            } else if (line.trim() !== '') {
                a.push(line);
            }
        });
        readInterface.on('close', function () {
            b.push(a);
            resolve(b.slice(1));
        })
    });
    return b.slice(1);
}

const createRow = (sample) => {
    const d = {};
    d['id'] = sample[0].replace('\n', '');
    let review = "";
    for (let i = 1; i < sample.length - 1; i++) {
        review += sample[i].replace('\n', '').trim();
    }
    d['label'] = parseInt(sample[sample.length - 1].replace('\n', ''));
    d['review'] = review;
    return d;
}

const loadData = async () => {
    const rawData = await loadRawData('./src/utils/ml/data/train.crash');
    const list = [];
    for (const data of rawData) {
        list.push(createRow(data));
    }
    return list;
}

module.exports = {
    loadData
}