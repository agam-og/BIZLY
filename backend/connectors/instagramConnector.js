function normalizeInstagramProfile(profile) {
  if (!profile) {
    return {
      source: 'instagram',
      available: false,
      evidence: []
    };
  }

  const username =
    profile.username || '';

  const name =
    profile.name || '';

  const biography =
    profile.biography ||
    profile.bio ||
    '';

  const website =
    profile.website ||
    null;

  const posts =
    Array.isArray(profile.posts)
      ? profile.posts
      : [];

  return {
    source: 'instagram',

    available: true,

    profile: {
      username,
      name,
      biography,
      website
    },

    posts: posts.map(post => ({
      caption:
        post.caption || '',
      publishedAt:
        post.publishedAt ||
        post.timestamp ||
        null,
      url:
        post.url || null,
      mediaType:
        post.mediaType ||
        post.type ||
        null
    })),

    evidence: [
      {
        source: 'instagram',
        type: 'profile',
        url:
          profile.url ||
          `https://www.instagram.com/${username}`,
        content:
          `${name} ${biography}`.trim()
      },

      ...posts.map(post => ({
        source: 'instagram',
        type: 'post',
        url: post.url || null,
        content:
          post.caption || ''
      }))
    ]
  };
}


async function analyzeInstagram(profile) {
  console.log(
    '[INSTAGRAM INTELLIGENCE] Processing authorized Instagram data.'
  );

  /*
   * Instagram data access depends on Meta's
   * approved APIs, permissions, account type,
   * and authorization.
   *
   * We intentionally do not implement
   * unauthorized scraping here.
   */

  return normalizeInstagramProfile(profile);
}


module.exports = {
  analyzeInstagram,
  normalizeInstagramProfile
};