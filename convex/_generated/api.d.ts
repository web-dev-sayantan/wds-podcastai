/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as elevenlabs from "../elevenlabs.js";
import type * as files from "../files.js";
import type * as freepik from "../freepik.js";
import type * as http from "../http.js";
import type * as openai from "../openai.js";
import type * as podcasts from "../podcasts.js";
import type * as razorpay from "../razorpay.js";
import type * as sdxl from "../sdxl.js";
import type * as unreal from "../unreal.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  elevenlabs: typeof elevenlabs;
  files: typeof files;
  freepik: typeof freepik;
  http: typeof http;
  openai: typeof openai;
  podcasts: typeof podcasts;
  razorpay: typeof razorpay;
  sdxl: typeof sdxl;
  unreal: typeof unreal;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
