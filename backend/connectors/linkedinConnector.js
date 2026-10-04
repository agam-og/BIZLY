function normalizeLinkedInProfile(profile) {
  if (!profile) {
    return {
      source: 'linkedin',
      available: false,
      evidence: []
    };
  }

  const name =
    profile.name ||
    profile.localizedName ||
    '';

  const headline =
    profile.headline ||
    '';

  const about =
    profile.about ||
    profile.summary ||
    '';

  const posts =
    Array.isArray(profile.posts)
      ? profile.posts
      : [];

  return {
    source: 'linkedin',

    available: true,

    profile: {
      name,
      headline,
      about,
      url:
        profile.url || null
    },

    posts: posts.map(post => ({
      text:
        post.text ||
        post.commentary ||
        '',
      publishedAt:
        post.publishedAt ||
        null,
      url:
        post.url ||
        null
    })),

    evidence: [
      {
        source: 'linkedin',
        type: 'profile',
        url: profile.url || null,
        content:
          `${name} ${headline} ${about}`.trim()
      },

      ...posts.map(post => ({
        source: 'linkedin',
        type: 'post',
        url: post.url || null,
        content:
          post.text ||
          post.commentary ||
          ''
      }))
    ]
  };
}


async function analyzeLinkedIn(profile) {
  console.log(
    '[LINKEDIN INTELLIGENCE] Processing authorized LinkedIn data.'
  );

  /*
   * LinkedIn access depends on the application's
   * approved API permissions and the type of
   * LinkedIn account/data being accessed.
   *
   * We intentionally do not scrape LinkedIn here.
   */

  return normalizeLinkedInProfile(profile);
}


module.exports = {
  analyzeLinkedIn,
  normalizeLinkedInProfile
};