const { onCall } = require("firebase-functions/v2/https");

const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({ maxInstances: 10 });

const metadata = {
    urls: {
        bitly: 'https://api-ssl.bitly.com/v4/shorten',
        shrtcode: 'https://api.shrtco.de/v2/shorten',
        tinyurl: 'https://api.tinyurl.com/create',
        rebrandly: 'https://api.rebrandly.com/v1/links',
    },
    tokens: {
        bitly: '847c5098f3df50607f3d384922d569926b614ff7',
        shrtcode: '',
        tinyurl: 'XZXAVrV0vWBndPITCkLMkUTE8hYc7xOI1YU8EPkuz01hyc4J8mgIbM6CJQBL',
        rebrandly: '61fac2e5814340b19d0c600c92fbf64e',
    },
    tokens: {
        bitly: process.env.TOKEN_BITLY,
        shrtcode: process.env.TOKEN_SHRTCODE,
        tinyurl: process.env.TOKEN_TINYURL,
        rebrandly: process.env.TOKEN_REBRANDLY,
    }
}

async function bitly(input_url) {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await fetch(metadata.urls.bitly, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${metadata.tokens.bitly}`
                },
                body: JSON.stringify({
                    long_url: input_url
                })
            }).then(res => res.json())

            resolve(json.link);
        }
        catch (err) {
            reject(err);
        }
    })
}

async function shrtcode(input_url) {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await fetch(`${metadata.urls.shrtcode}?url=${input_url}`, {
                method: 'POST'
            }).then(res => res.json())

            resolve(json.result.full_short_link);
        }
        catch (err) {
            reject(err);
        }
    })
}

async function tinyurl(input_url) {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await fetch(metadata.urls.tinyurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${metadata.tokens.tinyurl}`
                },
                body: JSON.stringify({
                    url: input_url
                })
            }).then(res => res.json())

            resolve(json.data.tiny_url);
        }
        catch (err) {
            reject(err);
        }
    })
}

async function rebrandly(input_url) {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await fetch(metadata.urls.rebrandly, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: `${metadata.tokens.rebrandly}`
                },
                body: JSON.stringify({
                    destination: input_url
                })
            }).then(res => res.json())

            resolve(`http://${json.shortUrl}`);
        }
        catch (err) {
            reject(err);
        }
    })
}

exports.shortenLink = onCall(async request => {
    const map = {
        'bitly': bitly,
        'shrtcode': shrtcode,
        'tinyurl': tinyurl,
        'rebrandly': rebrandly,
    }

    const short_url = await map[request.data.service](request.data.url);
    return short_url;
})