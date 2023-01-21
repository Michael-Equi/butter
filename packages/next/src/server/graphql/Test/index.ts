import builder from "../builder";
import prisma from "../../db/prisma";

export const TestResult = builder.simpleObject("TestResult", {
  fields: (t) => ({
    input: t.stringList(),
    output: t.stringList(),
    semanticSimilarity: t.float(),
  }),
});

export const Test = builder.prismaObject("Test", {
  fields: (t) => ({
    id: t.exposeString("id", { nullable: false }),
    title: t.exposeString("title"),
    description: t.exposeString("description"),
    results: t.field({ type: [TestResult], resolve: (test) => test.results }),
  }),
});

builder.queryFields((t) => ({
  test: t.field({
    type: Test,
    args: {
      id: t.arg.string({ required: false }),
    },
    nullable: true,
    resolve: async (_, { id }, ctx) => {
      if (!ctx.user?.id) return null;
      if (!id) throw new Error("Please provide an ID to the testRun query");

      const test = await prisma.test.findFirst({
        where: {
          id,
        },
      });

      if (!test) return null;

      return test;
    },
  }),
}));
