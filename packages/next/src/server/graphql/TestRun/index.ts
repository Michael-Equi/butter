import builder from "../builder";
import prisma from "../../db/prisma";

export const TestRun = builder.prismaObject("TestRun", {
  fields: (t) => ({
    id: t.exposeString("id", { nullable: false }),
    name: t.exposeString("name"),
    configFile: t.exposeString("configFile"),
    testsFile: t.exposeString("testsFile"),
    tags: t.exposeString("tags", { nullable: true }),
    averageSimilarity: t.exposeFloat("averageSimilarity"),

    project: t.relation("project"),
    tests: t.relatedConnection("tests", {
      cursor: "id",
    }),
  }),
});

builder.queryFields((t) => ({
  testRun: t.field({
    type: TestRun,
    args: {
      id: t.arg.string({ required: false }),
    },
    nullable: true,
    resolve: async (_, { id }, ctx) => {
      if (!ctx.user?.id) return null;
      if (!id) throw new Error("Please provide an ID to the testRun query");

      const testRun = await prisma.testRun.findFirst({
        where: {
          id,
        },
      });

      if (!testRun) return null;

      return testRun;
    },
  }),
}));
