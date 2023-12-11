import { adminProcedure, t } from "../trpc";
import { userRouter } from "./users";

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "Hi";
  }),
  logToServer: t.procedure
    .input((v) => {
      if (typeof v === "string") return v;

      throw new Error("Expected string");
    })
    .mutation((req) => {
      console.log(`Client Says: ${req.input}`);

      return true;
    }),
  users: userRouter,
  secretData: adminProcedure.query(({ ctx }) => {
    console.log(ctx.user);

    return "Secret Data";
  }),
});
