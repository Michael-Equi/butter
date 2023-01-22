import builder from "../builder";
import prisma from "../../db/prisma";

export const TestResult = builder.simpleObject("TestResult", {
  fields: (t) => ({
    inputs: t.stringList(),
    outputs: t.stringList(),
    expected: t.string(),
    semanticSimilarity: t.float({ nullable: true }),
    jaccardSimilarity: t.float({ nullable: true }),
    testSentiment: t.float({ nullable: true }),
    expectedSentiment: t.float({ nullable: true }),
  }),
});

export const Test = builder.prismaObject("Test", {
  fields: (t) => ({
    id: t.exposeString("id", { nullable: false }),
    title: t.exposeString("title"),
    description: t.exposeString("description"),
    semanticSimilarity: t.exposeFloat("semanticSimilarity", {
      nullable: true,
    }),
    jaccardSimilarity: t.exposeFloat("jaccardSimilarity", {
      nullable: true,
    }),
    expectedSentiment: t.exposeFloat("expectedSentiment", {
      nullable: true,
    }),
    testSentiment: t.exposeFloat("testSentiment", {
      nullable: true,
    }),
    cases: t.field({ type: [TestResult], resolve: (test) => test.cases }),
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
