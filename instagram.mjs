import axios from 'axios';
import { instagramAccessToken } from './config.mjs';

var cachedImages = null;
var lastFetched = null;

// Function to fetch and display Instagram feed
async function getInstagramFeed() {
    if (isCached(15)) {
        console.log("using cache")
        return cachedImages;
    }
    var images = [];
    var nextUrl = `https://graph.instagram.com/v21.0/17841448618671800/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${instagramAccessToken}`;
    console.log("wow")
    while (nextUrl) {
        console.log(nextUrl)
        var response = await axios.get(nextUrl)
        images = images.concat(response.data.data);
        nextUrl = response.data.paging.next;
    }
    console.log("fini")
    cachedImages = JSON.stringify(images);
    lastFetched = new Date();
    return cachedImages;
}

function isCached(diffMins) {
    if (cachedImages === null) {
        return false;
    }

    if (lastFetched === null) {
        return false;
    }

    const dateToRefresh = new Date(lastFetched.getTime() + diffMins*60000);
    if (dateToRefresh < new Date()) {
        return false;
    }

    return true;
}

export { getInstagramFeed }