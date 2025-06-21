import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./trpc/router/_app";

export type TRPCInputTypes = inferRouterInputs<AppRouter>;

export type TRPCOutputTypes = inferRouterOutputs<AppRouter>;
