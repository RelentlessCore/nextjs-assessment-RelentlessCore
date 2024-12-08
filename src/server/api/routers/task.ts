import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// I'm using tRPC to make type-safe API routes. This makes it easier to catch errors
// early and provides better autocomplete in the frontend.
export const taskRouter = createTRPCRouter({
  // Get all tasks sorted by creation date
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany({
      orderBy: {
        createdAt: "desc", // Newest tasks appear first for better UX
      },
    });
  }),

  // Create a new task - using zod for input validation
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
        },
      });
    }),

  // Update task title and completion status
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          completed: input.completed,
        },
      });
    }),

  // Delete a task by its ID
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),

  // Get the oldest task - useful for testing the order
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const task = await ctx.db.task.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return task ?? null;
  }),

  // Search tasks by title - added case-insensitive search for better usability
  search: publicProcedure
    .input(z.object({ searchTerm: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          title: {
            contains: input.searchTerm,
            mode: "insensitive", // Makes search more user-friendly
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
