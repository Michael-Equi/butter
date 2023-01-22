import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({
  path: "../../.env.local",
});

// yarn ts-node -O '{"module":"commonjs"}' addTestRun.ts

const addTestRun = async () => {
  const prisma = new PrismaClient();

  await prisma.testRun.create({
    data: {
      name: "Test Run Example",
      configFile: "Example config file",
      testsFile: "Example tests file",
      averageSimilarity: 0.2,
      projectId: "63cc5e18d7bc85b480145932",
      tests: {
        createMany: {
          data: [
            {
              title: "Test 1",
              description: "Example Test",
              results: {
                set: [
                  {
                    input: [
                      "How do I reset my password?",
                      "This still isn't working",
                    ],
                    output: [
                      "You can reset your password by clicking on the link in the email we sent you.",
                      "You can reach out to our support team at <phoneNumber>",
                    ],
                    semanticSimilarity: 0.9,
                  },
                  {
                    input:
                      "I'm running into an issue deploying a container, it's giving the error permissions not found",
                    output:
                      "You can deploy a container by running the following command: docker run -p 80:80 -d <your username>/node-web-app",
                    semanticSimilarity: 0.3,
                  },
                ],
              },
            },
          ],
        },
      },
    },
  });
};

addTestRun().then(() => console.log("Done"));
