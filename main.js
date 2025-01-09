import chalk from "chalk";
import readline from "readline";

const log = console.log;
const blockedUrls = [
    "http://paruluniversity.com",
    "http://danger.com",
    "http://squidgame.com",
    "",
    "http://evil.com",
    "http://malware.com",
    "http://laxmichitfund.com",
    "http://ransomware.com",
    "http://phishing.com",
];

function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (err) {
        return false;
    }
}

function isBlockedUrl(url) {
    return blockedUrls.includes(url.toLowerCase());
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter a URL to validate: ", (inputUrl) => {
    if (!inputUrl || inputUrl.trim() === "") {
        console.error("Error: No URL provided.");
        rl.close();
        return;
    }
    const url = inputUrl.trim();
    if (!isValidUrl(inputUrl)) {
        console.error("Error: The URL is not valid.");
    } else if (isBlockedUrl(inputUrl)) {
        console.warn(chalk.red("Warning: The URL is blocked."));
    } else {
        console.log(chalk.green("Success: The URL is valid and accessible."));
        try {
            const url = new URL(inputUrl);
            const params = url.searchParams;
    
            if (params.toString() === "") {
                console.log("No parameter found in this URL.");
            } else {
                console.log(`There are parameters in this URL:`);
                params.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });
            }
        } catch (error) {
            console.error("Error: The URL is not valid.");
        }
    }


rl.close();

});