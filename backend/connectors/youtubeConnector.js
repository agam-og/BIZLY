const https = require('https');

function youtubeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent':
            'BIZLY-Brand-Intelligence'
        }
      },
      response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const parsed =
              JSON.parse(data);

            if (response.statusCode >= 400) {
              reject(
                new Error(
                  parsed.error?.message ||
                  `YouTube API ${response.statusCode}`
                )
              );

              return;
            }

            resolve(parsed);
          } catch {
            reject(
              new Error(
                'Invalid YouTube API response.'
              )
            );
          }
        });
      }
    ).on('error', reject);
  });
}


function extractChannelId(input) {
  if (!input) return null;

  const match =
    input.match(
      /youtube\.com\/channel\/([^/?]+)/i
    );

  return match
    ? match[1]
    : null;
}


async function analyzeYouTube(input) {
  const apiKey =
    process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      source: 'youtube',
      available: false,
      reason:
        'YOUTUBE_API_KEY is not configured.',
      evidence: []
    };
  }

  const channelId =
    extractChannelId(input);

  if (!channelId) {
    return {
      source: 'youtube',
      available: false,
      reason:
        'A YouTube channel URL is required for this connector.',
      evidence: []
    };
  }

  console.log(
    `[YOUTUBE INTELLIGENCE] Analyzing ${channelId}`
  );

  const channelUrl =
    'https://www.googleapis.com/youtube/v3/channels' +
    `?part=snippet,statistics,contentDetails` +
    `&id=${encodeURIComponent(channelId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const channelData =
    await youtubeRequest(channelUrl);

  const channel =
    channelData.items?.[0];

  if (!channel) {
    throw new Error(
      'YouTube channel not found.'
    );
  }

  const uploadsPlaylist =
    channel.contentDetails
      ?.relatedPlaylists
      ?.uploads;

  let videos = [];

  if (uploadsPlaylist) {
    const videosUrl =
      'https://www.googleapis.com/youtube/v3/playlistItems' +
      `?part=snippet,contentDetails` +
      `&playlistId=${encodeURIComponent(uploadsPlaylist)}` +
      `&maxResults=20` +
      `&key=${encodeURIComponent(apiKey)}`;

    const videoData =
      await youtubeRequest(videosUrl);

    videos =
      (videoData.items || []).map(item => ({
        title:
          item.snippet?.title || '',

        description:
          item.snippet?.description || '',

        publishedAt:
          item.snippet?.publishedAt || '',

        videoId:
          item.contentDetails?.videoId || ''
      }));
  }

  const snippet =
    channel.snippet || {};

  return {
    source: 'youtube',

    available: true,

    channel: {
      id: channel.id,
      title: snippet.title || '',
      description:
        snippet.description || '',
      publishedAt:
        snippet.publishedAt || '',
      country:
        snippet.country || null
    },

    statistics: {
      subscribers:
        channel.statistics?.subscriberCount || null,

      views:
        channel.statistics?.viewCount || null,

      videos:
        channel.statistics?.videoCount || null
    },

    videos,

    evidence: [
      {
        source: 'youtube',
        type: 'channel',
        url:
          `https://www.youtube.com/channel/${channel.id}`,
        content:
          `${snippet.title || ''} ${snippet.description || ''}`
      },

      ...videos.map(video => ({
        source: 'youtube',
        type: 'video',
        url:
          `https://www.youtube.com/watch?v=${video.videoId}`,
        content:
          `${video.title} ${video.description}`
      }))
    ]
  };
}


module.exports = {
  analyzeYouTube,
  extractChannelId
};