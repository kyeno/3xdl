#!/usr/bin/env node
'use strict';

/**
 * 3xdl (aka "Free X Downloader")
 *   the non-butthurt video downloader
 *
 * For educational / research purposes!
 *
 * MIT License
 * (c) 2022 Ratan M. Kyeno
 */

// Base libraries and arguments
const
    _ = require('lodash'),
    puppeteer = require('puppeteer'),
    spawn = require('child_process').spawn,
    args = process.argv.slice(2)
;

// Demand one argument
if(!args[0]) {

    console.error('Usage: 3xdl.js <url>');
    process.exit();
}

// Validate the URL
let url = '';
try { url = new URL(_.trim(args[0])); }
catch(e) {

    console.error(`ERROR: ${e}`);
    process.exit();
}

// Start async processing
console.log(`Analyzing "${url.href}"...`);
(async() => {

    // Prepare Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

    // Try loading the page
    await page.goto(url.href);

    // Validate if JW Player is there and is operational and steal it's playlist
    let playlist = [];
    try { playlist = await page.evaluate(() => { return jw_player.getPlaylist()}); }
    catch(e) {

        await page.screenshot({ path: 'error.png' });

        console.error('ERROR: Cannot find the video player on that site, error.png has been saved');

        await browser.close();
        process.exit();
    }

    // Verify if the playlist has contents
    if(!playlist.length || !playlist[0]) {

        console.error('ERROR: No videos found within the player');

        await browser.close();
        process.exit();
    }

    console.log('Video found, preparing download...');

    // ** L8R: Consider looping through all of the playlist
    const item = playlist[0];

    // Prepare vars for download
    // ** TODO: Be more defensive here; check if it worked, check if the file exists and may need fixing, etc
    const urlDownload = item.file.match(/^(http|https|ftp):\/\//) ? item.file : `${url.origin}/${item.file.replace(/^\//, '')}`;
    const fileName = `${_.snakeCase(_.deburr(item.title))}.${urlDownload.split(/[#?]/)[0].split('.').pop().replace(/[^\w\s]/gi, '').trim()}`;

    // Attempt download with wget
    console.log('Downloading...');
    console.log('If you like the tool, consider donating PIVX to ps1fxv6ktsg992shxrr040mmussd49pqfa7xfh8rzdkkr3xlpz3swt3ltanqq2plav0h47yuzxzyxd\nhttps://pivx.org\nThank you!');
    let child = spawn('wget', [

        `--output-document=${fileName}`,
        '--no-check-certificate',
        '--no-verbose',
        '--show-progress',
        urlDownload
    ], { stdio: 'inherit' });

    // Exit gracefully
    await browser.close();
})();
