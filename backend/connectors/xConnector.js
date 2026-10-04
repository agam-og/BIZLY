function normalizeXProfile(profile) {
  if (!profile) {
    return {
      source: 'x',
      available: false,
      evidence: []
    };
  }

  const username =
    profile.username ||
    profile.handle ||
    '';

  const name =
    profile.name || '';

  const description =
    profile.description ||
    profile.bio ||
    '';

  const url =
    profile.url ||
    null;

  const posts =
    Array.isArray(profile.posts)
      ? profile.posts
      : [];

  return {
    source: 'x',

    available: true,

    profile: {
      username,
      name,
      description,
      url
    },

    posts: posts.map(post => ({
      text:
        post.text ||
        post.content ||
        '',
      publishedAt:
        post.publishedAt ||
        post.createdAt ||
        null,
      url:
        post.url || null
    })),

    evidence: [
      {
        source: 'x',
        type: 'profile',
        url:
          url ||
          (
            username
              ? `https://x.com/${username}`
              : null
          ),
        content:
          `${name} ${description}`.trim()
      },

      ...posts.map(post => ({
        source: 'x',
        type: 'post',
        url: post.url || null,
        content:
          post.text ||
          post.content ||
          ''
      }))
    ]
  };
}


async function analyzeX(profile) {
  console.log(
    '[X INTELLIGENCE] Processing authorized X data.'
  );

  /*
   * X data access depends on the API access
   * level, authentication, permissions,
   * and available account data.
   *
   * We intentionally do not implement
   * unauthorized scraping here.
   */

  return normalizeXProfile(profile);
}


module.exports = {
  analyzeX,
  normalizeXProfile
};