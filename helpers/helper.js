const crypto = require("crypto");

const CTX = require('../config/constants')
const db = require('../config/database');

const sample = require('../config/constants');


exports.replaceFirstLastSpace = (value) => {
    if (this.checkNullQueryAll(value)) {
        return value
    } else {
        if (value === '0' || value === '""') {
            return '-'
        } else {
            let valueSplit = value.split('')
            let pattern = /\s/;
            let firstIndex = 0
            let lastIndex = 0
        
            while(pattern.test(valueSplit[firstIndex])) {
                firstIndex = firstIndex+1
            }
        
            valueSplit = valueSplit.slice(firstIndex, valueSplit.length)
        
            while(pattern.test(valueSplit[(valueSplit.length - 1) - lastIndex])) {
                lastIndex = lastIndex+1
            }
            valueSplit = valueSplit.slice(0, valueSplit.length - lastIndex)
            valueSplit = valueSplit.join('')
            return valueSplit
        }
    }
}

exports.replaceNonWord = (input) => {
    input = input.toString()
    input = input.replace(/[^\w\s@.]/gmi, '')
    return input
}

exports.inputEncrypt = (input) => {
    return this.secEncryptV3(process.env.KEY_INPUT_ENCRYPTER, process.env.IV_INPUT_ENCRYPTER, input)
}

exports.inputDencrypt = (input) => {
    return this.secDecryptV3(process.env.KEY_INPUT_ENCRYPTER, process.env.IV_INPUT_ENCRYPTER, input)
}

exports.secEncrypt = (key, data) => {
    // V1
    // var encoded = JSON.stringify(data);
    // encoded = new Buffer(encoded).toString('base64');
    // var cipher = crypto.createCipher('aes-256-cbc', key);
    // var crypted = cipher.update(encoded, 'utf-8', 'hex');
    // crypted += cipher.final('hex');

    var encoded = JSON.stringify(data);
    encoded = new Buffer.from(encoded).toString('base64');
    var cipher = crypto.createCipheriv('aes-256-cbc', key, config.loginiv);
    var crypted = cipher.update(encoded, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
};

exports.secDecrypt = (key, data) => {
    // V1
    // var decipher = crypto.createDecipher('aes-256-cbc', key);
    // var decrypted = decipher.update(data, 'hex', 'utf-8');
    // try {
    //     decrypted += decipher.final('utf-8');
    //     decrypted = new Buffer(decrypted, 'base64').toString('ascii')
    //     decrypted = JSON.parse(decrypted);
    // } catch (error) {
    //     decrypted = null;
    // }

    var decipher = crypto.createDecipheriv('aes-256-cbc', key, config.loginiv);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    try {
        decrypted += decipher.final('utf-8');
        decrypted = new Buffer.from(decrypted, 'base64').toString('ascii')
        decrypted = JSON.parse(decrypted);
    } catch (error) {
        decrypted = null;
    }

    return decrypted;
};

exports.secEncryptV3 = (key, iv, data) => {
    let encoded = JSON.stringify(data);
    encoded = new Buffer.from(encoded).toString('base64');
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(encoded, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
};

exports.secDecryptV3 = (key, iv, data) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    try {
        decrypted += decipher.final('utf-8');
        decrypted = new Buffer.from(decrypted, 'base64').toString('ascii')
        decrypted = JSON.parse(decrypted);
    } catch (error) {
        decrypted = null;
    }

    return decrypted;
};

exports.uniqArrObj = (array, obj1, obj2) => {
    return array = array.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t[obj1] === thing[obj1] && t[obj2] === t[obj2]
        ))
    )
}

exports.uniqArrObjS = (array, obj1) => {
    return array = array.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t[obj1] === thing[obj1]
        ))
    )
}

exports.randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


exports.genStringInt = (length) => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.uniq = (a) => {
    return Array.from(new Set(a));
}

exports.checkNullQuery = (object) => {
    if (object[0] == undefined || object[0].length == 0) {
        return true;
    };
    return false;
}

exports.checkNullQueryAll = (object) => {
    if (object == undefined || object == '' || object == ' ' || (Array.isArray(object) && object.length == 0)) {
        return true;
    };
    return false;
}

exports.checkNullQueryAllExtended = (object, rule) => {
    if (!Array.isArray(object)) {
        return this.checkNullQueryAll(object)
    } else {
        if (this.checkNullQueryAll(object)) {
            return true
        } else {
            let result = []
            for (let index = 0; index < object.length; index++) {
                const obj = object[index];
                if (this.checkNullQueryAll(obj)) {
                    result.push('true')
                } else {
                    result.push('false')
                }
                if (index + 1 == object.length) {
                    if (rule == "AND" || rule == "&&" || rule == "and" || rule == "And") {
                        let counter = 0
                        for (let index = 0; index < result.length; index++) {
                            const rs = result[index];
                            if (rs == 'true') {
                                counter = counter + 1
                            }
                            if (index + 1 == result.length) {
                                if (counter == result.length) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        }
                    } else {
                        if (result.includes('true')) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            }
        }
    }
}

exports.alphabetically = (ascending) => {

    return function(a, b) {

        // equal items sort equally
        if (a === b) {
            return 0;
        }
        // nulls sort after anything else
        else if (a === null) {
            return 1;
        } else if (b === null) {
            return -1;
        }
        // otherwise, if we're ascending, lowest sorts first
        else if (ascending) {
            return a < b ? -1 : 1;
        }
        // if descending, highest sorts first
        else {
            return a < b ? 1 : -1;
        }

    };

}

exports.uploadFileToGCS = (file, prefix) => new Promise((resolve, reject) => {
    const { originalname, buffer, mimetype } = file
    prefix = prefix ? `${prefix}-` : ``
    var unlockUpload = false
    if (mimetype == 'application/vnd.ms-excel') {
        unlockUpload = true;
    } else if (mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        unlockUpload = true;
    } else {
        unlockUpload = false;
    }
    if (!unlockUpload) {
        resolve({
            status: sample.oldVersion.CODE.BADREQUEST,
            success: sample.oldVersion.STATUS.false,
            msg: 'invalid-file',
        });
    }

    const dir = "probach-assets/documents/"

    //wrapping file name
    // this.genStringInt(10) = Generate Random String
    // path.parse(originalname.replace(/ /g, "_")).ext = get extension file
    let filename = `${dir}${prefix}${this.genStringInt(10)}${path.parse(originalname.replace(/ /g, "_")).ext}`;

    const blob = bucket.file(filename)

    const blobStream = blob.createWriteStream({
        resumable: false
    })
    blobStream.on('finish', () => {
            const d = new Date()
                // Set expired date  +200 years from right now
            const date = new Date(d.setFullYear(d.getFullYear() + 200)).toString()

            blob.getSignedUrl({
                action: 'read',
                expires: date
            }).then(signedUrls => {
                resolve({
                    status: sample.oldVersion.CODE.OK,
                    success: sample.oldVersion.STATUS.true,
                    msg: sample.oldVersion.SUCCESS.OK,
                    data: {
                        link_url: signedUrls[0],
                        file: filename
                    }
                });
            }).catch(error => {
                resolve({
                    status: sample.oldVersion.CODE.BADREQUEST,
                    success: sample.oldVersion.STATUS.false,
                    msg: 'system_error',
                    error
                });
            });
        })
        .on('error', (error) => {
            resolve({
                status: sample.oldVersion.CODE.BADREQUEST,
                success: sample.oldVersion.STATUS.false,
                msg: 'system_error',
                error
            });
        })
        .end(buffer)
})

exports.uploadImagesToGCS = (file, prefix) => new Promise((resolve, reject) => {
    const { originalname, buffer, mimetype } = file
    var unlockUpload = false
    if (mimetype == 'image/jpeg') {
        unlockUpload = true;
    } else if (mimetype == 'image/png') {
        unlockUpload = true;
    } else if (mimetype == 'image/gif') {
        unlockUpload = true;
    } else {
        unlockUpload = false;
    }


    if (!unlockUpload) {
        resolve({
            status: sample.oldVersion.CODE.BADREQUEST,
            success: sample.oldVersion.STATUS.false,
            msg: 'invalid-file',
        });
    }

    const dir = "probach-assets/images/"

    //wrapping file name
    // this.genStringInt(10) = Generate Random String
    // path.parse(originalname.replace(/ /g, "_")).ext = get extension file
    let filename = `${dir}${prefix}${this.genStringInt(10)}${path.parse(originalname.replace(/ /g, "_")).ext}`;

    const blob = bucket.file(filename)
    const blobStream = blob.createWriteStream({
        resumable: false
    })
    blobStream.on('finish', () => {
            const d = new Date()
                // Set expired date  +200 years from right now
            const date = new Date(d.setFullYear(d.getFullYear() + 200)).toString()

            blob.getSignedUrl({
                action: 'read',
                expires: date
            }).then(signedUrls => {
                resolve({
                    status: sample.oldVersion.CODE.OK,
                    success: sample.oldVersion.STATUS.true,
                    msg: sample.oldVersion.SUCCESS.OK,
                    data: {
                        link_url: signedUrls[0],
                        file: filename
                    }
                });
            }).catch(error => {
                resolve({
                    status: sample.oldVersion.CODE.BADREQUEST,
                    success: sample.oldVersion.STATUS.false,
                    msg: 'system_error',
                    error
                });
            });
        })
        .on('error', (error) => {
            resolve({
                status: sample.oldVersion.CODE.BADREQUEST,
                success: sample.oldVersion.STATUS.false,
                msg: 'system_error',
                error
            });
        })
        .end(buffer)
})

exports.getFileGCS = async(object) => {
    // using in controller
    // await h.getFileGCS('properinsta-assets/documents\screen_Shot_2020-04-22_at_03.04.11.png');
    try {
        const blob = bucket.file(object)
        const [files] = await bucket.getFiles({ prefix: object });

        let data = files[0] ? true : false;

        if (data) {
            const d = new Date()
                // Set expired date  +200 years from right now
            const date = new Date(d.setFullYear(d.getFullYear() + 200)).toString()

            await blob.getSignedUrl({
                action: 'read',
                expires: date
            }).then(signedUrls => {
                data = {
                    link_url: signedUrls[0],
                    file: object
                }
            }).catch(error => {
                throw error;
            })
        }

        return ({
            status: sample.oldVersion.CODE.OK,
            success: sample.oldVersion.STATUS.true,
            msg: this.checkNullQueryAll(data) ? 'empty' : sample.oldVersion.SUCCESS.OK,
            data: this.checkNullQueryAll(data) ? undefined : data,
        });

    } catch (error) {
        return ({
            status: sample.oldVersion.CODE.BADREQUEST,
            success: sample.oldVersion.STATUS.false,
            msg: 'system_error',
            error
        });
    }
}

exports.countSameValueArray = (array) => {
    return array.reduce(function(prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
    }, {});
}