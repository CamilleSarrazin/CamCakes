import axios from 'axios';
import { instagramAccessToken } from './config.mjs';

// Function to fetch and display Instagram feed
async function getInstagramFeed() {
    const response = await axios.get(`https://graph.instagram.com/v21.0/17841448618671800/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${instagramAccessToken}`)
    console.log(response.data);
    return JSON.stringify(response.data);
}

export { getInstagramFeed }