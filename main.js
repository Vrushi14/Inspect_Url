const readline = require('readline');
const url = require('url');


const blockedUrls = [
    'https://blockedexample.com',
    'https://malicioussite.com',
    'https://phishingsite.com',
    'https://youtube.com',
    'https://www.instagram.com/'
];


function parseAndValidateUrl(inputUrl) {
    try {
        const parsedUrl = new URL(inputUrl);


        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error('Invalid protocol. Only HTTP and HTTPS are allowed.');
        }

        
        if (!parsedUrl.hostname) {
            throw new Error('Invalid URL: Missing domain.');
        }

        return parsedUrl.href;
    } catch (error) {
        throw new Error('Invalid URL format or missing domain.');
    }
}


function isBlockedUrl(inputUrl) {
    return blockedUrls.includes(inputUrl);
}


function handleUrlInput(inputUrl) {
    try {
        
        const validUrl = parseAndValidateUrl(inputUrl);

        
        if (isBlockedUrl(validUrl)) {
            console.log('The URL is blocked.');
        } else {
            console.log('The URL is valid and accessible.');
        }
    } catch (error) {
        
        console.error('Error:', error.message);
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Enter a URL: ', (inputUrl) => {
    handleUrlInput(inputUrl);
    rl.close();
});
