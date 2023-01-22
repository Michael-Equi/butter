import { NextPage } from "next";
import { useGetTestQuery } from "../../../../../../client/graphql/getTestQuery.generated";
import { useRouter } from "next/router";
import {
  Box,
  Code,
  Heading,
  HStack,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetProjectQuery } from "../../../../../../client/graphql/getProject.generated";
import { useGetTestRunQuery } from "../../../../../../client/graphql/getTestRun.generated";
import { Breadcrumbs } from "../../../../../../client/components/Atoms/Breadcrumbs";
import Layout from "../../../../../../client/components/Containers/Layout";
import dayjs from "dayjs";
import testRunIdPage from "../index";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Link from "next/link";
import { BadgeIndicator } from "../../../../../../client/components/Atoms/BadgeIndicator";
import { Stat } from "../../../../../../client/components/Molecules/Stat";

dayjs.extend(LocalizedFormat);

const Test: NextPage = () => {
  const router = useRouter();
  const { testId, slug, testRunId } = router.query;
  const [{ data: projectData }] = useGetProjectQuery({
    variables: { slug: slug as string },
  });
  const [{ data: testRunData, fetching: testRunFetching }] = useGetTestRunQuery(
    {
      variables: { id: testRunId as string },
    }
  );
  const [{ data, fetching, error }] = useGetTestQuery({
    variables: { id: testId as string },
  });

  if (fetching || testRunFetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  const test = data?.test;
  const testRun = testRunData?.testRun;

  if (!test || !testRun) return <p>Not found.</p>;

  return (
    <Layout>
      <Breadcrumbs
        links={[
          {
            href: `/app/${slug}`,
            title: projectData?.project?.name ?? "Project",
          },
          {
            href: `/app/${slug}/run/${testRunId}`,
            title: testRunData?.testRun?.name ?? "Test Run",
          },
          {
            href: `/app/${slug}/run/${testRunId}/test/${testId}`,
            title: test?.title,
          },
        ]}
      />
      <Heading mt={2} size="md">
        {test?.title}
      </Heading>
      <HStack spacing={4} mt={4} alignItems="center">
        <Text color="muted">{dayjs(testRun.createdAt).format("LLL")}</Text>
        <Text color="muted">
          Branch:
          <Code ml={2}>{testRun.branch}</Code>
        </Text>
        <Text color="muted">
          Commit:
          <Code ml={2}>{testRun.commitId}</Code>
        </Text>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 4 }} gap={5} mt={5}>
        <Stat
          value={test.semanticSimilarity ?? "N/A"}
          label="Average Semantic Similarity"
          delta={{
            value: "12%",
            isUpwardsTrend: true,
          }}
        />
        <Stat
          value={test.jaccardSimilarity ?? "N/A"}
          label="Average Jaccard Similarity"
        />
        <Stat value={test.testSentiment ?? "N/A"} label="Test Sentiment" />
        <Stat
          value={test.expectedSentiment ?? "N/A"}
          label="Expected Sentiment"
        />
      </SimpleGrid>
      <Box
        mt={4}
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
        bg="bg-surface"
        borderRadius="lg"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Heading size="sm">Cases</Heading>
        <Table mt={4} wordBreak="break-word" whiteSpace="normal">
          <Thead>
            <Tr>
              <Th>Input</Th>
              <Th>Output</Th>
              <Th>Expected Output</Th>
              <Th>Jaccard Similarity</Th>
              <Th>Semantic Similarity</Th>
              <Th>Avg. Expected Sentiment</Th>
              <Th>Avg. Test Sentiment</Th>
            </Tr>
          </Thead>
          <Tbody>
            {test?.cases?.map((testCase) => (
              <Tr _hover={{ bg: "bg-muted" }} cursor="pointer">
                <Td>{testCase.inputs[testCase.inputs.length - 1]}</Td>
                <Td>{testCase.outputs[testCase.outputs.length - 1]}</Td>
                <Td>{testCase.expected}</Td>
                <Td>
                  <BadgeIndicator
                    value={testCase.jaccardSimilarity ?? undefined}
                  />
                </Td>
                <Td>
                  <BadgeIndicator
                    value={testCase.semanticSimilarity ?? undefined}
                  />
                </Td>
                <Td>
                  <BadgeIndicator
                    value={testCase.expectedSentiment ?? undefined}
                  />
                </Td>
                <Td>
                  <BadgeIndicator value={testCase.testSentiment ?? undefined} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
};

export default Test;
