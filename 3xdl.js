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
    spawn = require('await-spawn'),
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

        const errorFile = `error-${Date.now()}.png`;

        await page.screenshot({ path: errorFile });

        console.error(`ERROR: Cannot find the video player on that site, ${errorFile} has been saved`);

        await browser.close();
        process.exit();
    }

    // Verify if the playlist has contents
    if(!playlist.length || !playlist[0]) {

        console.error('ERROR: Playlist inaccessible/No videos found within the player!');

        await browser.close();
        process.exit();
    }

    // Free up some RAM
    await browser.close();

    // Loop through all of the playlist contents
    console.log('Playlist found, preparing download(s)...');
    for await (const item of playlist) {

        // Skip if there's no "file" in this loop cycle
        if(!item.file) continue;

        // Prepare vars for download
        const urlDownload = item.file.match(/^(http|https|ftp):\/\//) ? item.file : `${url.origin}/${item.file.replace(/^\//, '')}`;
        const fileExtension = urlDownload.split(/[#?]/)[0].split('.').pop().replace(/[^\w\s]/gi, '').trim();
        const fileName = item.title ? `${_.snakeCase(_.deburr(item.title))}.${fileExtension}` : `${Date.now()}.${fileExtension}`;

        // Attempt to download with wget
        console.log('Downloading...');
        try {

            const buffer = await spawn('wget', [

                `--output-document=${fileName}`,
                '--no-check-certificate',
                '--no-verbose',
                '--show-progress',
                urlDownload
            ], { stdio: 'inherit' });
        }
        catch(e) { console.error(`ERROR: ${e.stderr.toString()}`); }
    }

    // Exit gracefully
    console.log('---\nAll done!\n\nIf you like the tool,\nplease donate PIVX to ps1fxv6ktsg992shxrr040mmussd49pqfa7xfh8rzdkkr3xlpz3swt3ltanqq2plav0h47yuzxzyxd\nhttps://pivx.org\n\nThank you!');
})();
