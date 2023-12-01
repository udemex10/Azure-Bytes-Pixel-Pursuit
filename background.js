// background.js

// Listens for when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Azure Bytes: Pixel Pursuit was installed.');
    } else if (details.reason === 'update') {
        console.log('Azure Bytes: Pixel Pursuit was updated.');
    }
});

// Any other background operations can go here
