import { mutation, query } from "@/convex/_generated/server";
import { getTopUserByPodcastCount } from "@/convex/users";
import { ConvexError, v } from "convex/values";

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const createPodcast = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    voiceType: v.string(),
    voicePrompt: v.string(),
    audioUrl: v.string(),
    audioStorageId: v.id("_storage"),
    imagePrompt: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    audioDuration: v.number(),
    views: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new ConvexError("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), id.email))
      .first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    const podcast = await ctx.db.insert("podcasts", {
      ...args,
      user: user._id,
      author: user.name,
      authorId: user.clerkId,
      authorImageUrl: user.imageUrl,
    });
    return podcast;
  },
});

export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

export const getLatestPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("podcasts")
      .order("desc").take(10);
  },
})

export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});

export const getPodcastBySearch = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, { query }) => {
    if (query === "") {
      return await ctx.db.query("podcasts").order('desc').collect();
    }
    const authorSearch =
      await ctx.db.query("podcasts").withSearchIndex("by_author", q => q.search("author", query)).take(10);
    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("by_title", q => q.search("title", query))
      .take(10);
    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("by_description", q => q.search("description" || "title", query))
      .take(10);
  },
});

export const getPodcastbyId = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, { podcastId }) => {
    return await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("_id"), podcastId))
      .first();
  },
});

export const getPodcastsByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, { podcastId }) => {
    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("_id"), podcastId))
      .first();
    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), podcastId)
        )
      )
      .collect();
  },
});

export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, { podcastId, imageStorageId, audioStorageId }) => {
    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("_id"), podcastId))
      .first();
    if (!podcast) {
      throw new ConvexError("Podcast not found");
      return;
    }
    await ctx.storage.delete(imageStorageId);
    await ctx.storage.delete(audioStorageId);
    return await ctx.db.delete(podcastId);
  },
});
