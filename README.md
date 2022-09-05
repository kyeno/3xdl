# 3xdl (aka "Free X Downloader")
3xdl is a free, Open Source, [MIT-licensed](LICENSE) video downloader designed for [JW Player](https://www.jwplayer.com/) enabled video sites.

## The non-butthurt video downloader
3xdl was mainly built because the most popular video downloader, [youtube-dl](https://github.com/ytdl-org/youtube-dl) seems [extremely butthurt](https://github.com/ytdl-org/youtube-dl/issues/9015) about supporting sites as `txxx.com` and alike.
I myself found this extremely weird and strongly biased against X content; especially as downloading a YouTube video alone is already an act of violation of their [EULA](https://www.youtube.com/t/terms) (just search for `download` on that site).

This downloader is slow, resource hungry, imperatively written during one evening, and it could totally use some DRY as well as more defensive coding practices. Maybe one day, maybe never.

Please also mind this downloader was built **for educational and research purposes only**; just to prove a point such tool *can* exist.

### Requirements
3xdl requires 64bit GNU/Linux machine with [Node.js 16+](https://nodejs.org/en/download/) and any sane version of [GNU Wget](https://www.gnu.org/software/wget/) accessible within `$PATH`.

### Usage
1. Clone the repository, `git clone https://github.com/kyeno/3xdl.git`
2. Install dependencies, `cd 3xdl && npm ci`
3. Poke around, `./3xdl.js https://txxx.com/videos/...`

### Say thanks!
If you like the tool, and the overall idea of helping the non-biased FREEDOM, please consider donating some [PIVX](https://pivx.org) to `ps1fxv6ktsg992shxrr040mmussd49pqfa7xfh8rzdkkr3xlpz3swt3ltanqq2plav0h47yuzxzyxd`!
