import axios from 'axios';
import { instagramAccessToken } from './config.mjs';

// Function to fetch and display Instagram feed
async function getInstagramFeed() {
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
    console.log(images)
    return JSON.stringify(images);
}

export { getInstagramFeed }