import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream";

const userProcedure = t.procedure.input(z.object({ userId: z.string().min(3).max(5) }));

const eventEmitter = new EventEmitter();

export const userRouter = t.router({
  get: userProcedure.query(({ input }) => {

    const { userId } = input;

    return { userId };
  }),
  update: userProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ name: z.string(), id: z.string() }))
    .mutation((req) => {
      console.log(req.ctx.isAdmin);
      console.log(`Updating user (${req.input.name})...`);

      const user = req.input;

      eventEmitter.emit("update", req.input.userId);

      return { id: user.userId, name: user.name };
    }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        eventEmitter.off("update", emit.complete);
      };
    });
  }),
});
