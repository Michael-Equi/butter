import { FC } from "react";
import { NextPage } from "next";
import { useGetTestRunQuery } from "../../../../../client/graphql/getTestRun.generated";
import { useRouter } from "next/router";
import Layout from "../../../../../client/components/Containers/Layout";
import {
  Box,
  Button,
  Code,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import UpgradeButton from "../../../../../client/components/UpgradeButton";
import Link from "next/link";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Stat } from "../../../../../client/components/Molecules/Stat";
import { BadgeIndicator } from "../../../../../client/components/Atoms/BadgeIndicator";
import { Breadcrumbs } from "../../../../../client/components/Atoms/Breadcrumbs";
import { useGetProjectQuery } from "../../../../../client/graphql/getProject.generated";

dayjs.extend(LocalizedFormat);

const testRunIdPage: NextPage = () => {
  const router = useRouter();
  const { testRunId, slug } = router.query;
  if (!testRunId) return <p>Not Found</p>;
  const [{ data: projectData }] = useGetProjectQuery({
    variables: { slug: slug as string },
  });
  const [{ data, fetching, error }] = useGetTestRunQuery({
    variables: { id: testRunId as string },
  });

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  const testRun = data?.testRun;

  if (!testRun) return <p>Not found.</p>;

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
            title: testRun?.name,
          },
        ]}
      />
      <Heading size="md" mt={2}>
        {testRun?.name}
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
          value={testRun.averageSemanticSimilarity ?? "N/A"}
          label="Average Similarity"
          delta={{
            value: "12%",
            isUpwardsTrend: true,
          }}
        />
        <Stat
          value={testRun.averageJaccardSimilarity ?? "N/A"}
          label="Average Similarity"
        />
        <Stat
          value={testRun.averageTestSentiment ?? "N/A"}
          label="Test Sentiment"
        />
        <Stat
          value={testRun.averageExpectedSentiment ?? "N/A"}
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
        <Heading size="sm">Tests</Heading>
        <Table mt={4}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Avg. Semantic Similarity</Th>
              <Th>Avg. Jaccard Similarity</Th>
              <Th>Avg. Expected Sentiment</Th>
              <Th>Avg. Test Sentiment</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testRun?.tests?.edges?.map((edge) => {
              const test = edge?.node;
              if (!test) return null;
              return (
                <Link
                  href={`/app/${slug}/run/${testRunId}/test/${test.id}`}
                  key={test.id}
                >
                  <Tr _hover={{ bg: "bg-muted" }} cursor="pointer">
                    <Td>{test.title}</Td>
                    <Td>{test.description}</Td>
                    <Td>{test.averageSemanticSimilarity}</Td>
                    <Td>{test.averageJaccardSimilarity}</Td>
                    <Td>{test.averageExpectedSentiment}</Td>
                    <Td>{test.averageTestSentiment}</Td>
                  </Tr>
                </Link>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
};

export default testRunIdPage;
