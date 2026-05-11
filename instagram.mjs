import axios from 'axios';
import { writeFile } from 'fs/promises';
import { getConfig, configPath } from './config.mjs';

let cachedImages = null;
let lastFetched = null;

// Refresh the token if it's older than 30 days (tokens expire after 60 days).
// Instagram only allows refreshing tokens that are at least 24 hours old.
async function refreshTokenIfNeeded() {
    const config = await getConfig();
    const now = new Date();

    if (config.lastRefresh) {
        const lastRefresh = new Date(config.lastRefresh);
        const daysSinceRefresh = (now - lastRefresh) / (1000 * 60 * 60 * 24);

        if (daysSinceRefresh < 30) {
            console.log(`[Instagram] Token is fresh (refreshed ${Math.floor(daysSinceRefresh)} days ago). Skipping refresh.`);
            return;
        }
    }

    console.log('[Instagram] Refreshing access token...');
    try {
        const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
            params: {
                grant_type: 'ig_refresh_token',
                access_token: config.instagramAccessToken,
            },
        });

        const newToken = response.data.access_token;
        const updatedConfig = {
            ...config,
            instagramAccessToken: newToken,
            lastRefresh: now.toISOString(),
        };

        await writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
        console.log(`[Instagram] Token refreshed successfully. New expiry in ~${response.data.expires_in} seconds.`);
    } catch (err) {
        console.error('[Instagram] Failed to refresh token:', err.response?.data ?? err.message);
    }
}

// Function to fetch and display Instagram feed
async function getInstagramFeed() {
    if (isCached(60)) {
        console.log('using cache');
        return cachedImages;
    }

    const { instagramAccessToken, instagramUserId, instagramMediaFields } = await getConfig();
    let images = [];
    let nextUrl = `https://graph.instagram.com/v21.0/${instagramUserId}/media?fields=${instagramMediaFields}&access_token=${instagramAccessToken}`;
    console.log('fetching instagram feed...');

    try {
        while (nextUrl) {
            const response = await axios.get(nextUrl);
            images = images.concat(response.data.data);
            nextUrl = response.data.paging?.next;
        }
    } catch (err) {
        console.error('[Instagram] Failed to fetch feed:', err.response?.data ?? err.message);
        // Return stale cache if available, otherwise rethrow so the caller gets a proper error
        if (cachedImages !== null) {
            console.warn('[Instagram] Returning stale cache due to fetch error.');
            return cachedImages;
        }
        throw err;
    }

    console.log('instagram feed fetched successfully.');
    cachedImages = JSON.stringify(images);
    lastFetched = new Date();
    return cachedImages;
}

function isCached(diffMins) {
    if (cachedImages === null) return false;
    if (lastFetched === null) return false;

    const dateToRefresh = new Date(lastFetched.getTime() + diffMins * 60000);
    return dateToRefresh >= new Date();
}

export { getInstagramFeed, refreshTokenIfNeeded };