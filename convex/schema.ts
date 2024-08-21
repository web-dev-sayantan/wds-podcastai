import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    audioStorageId: v.optional(v.id("_storage")),
    user: v.id("users"),
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    audioUrl: v.optional(v.string()),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    authorImageStorageId: v.optional(v.id("_storage")),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex("by_author", {
      searchField: "author",
      filterFields: ["authorId"],
    })
    .searchIndex("by_title", {
      searchField: "title",
    })
    .searchIndex("by_description", {
      searchField: "description",
    }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
  }),
});
