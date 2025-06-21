import { z } from "zod";
import { publicProcedure, router } from "../init";
export const appRouter = router({
  hello: publicProcedure.query((opts) => {
    return {
      greeting: `hello Maaz`,
    };
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
