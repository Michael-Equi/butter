import Link from "next/link";
import { useRouter } from "next/router";
import UpgradeButton from "../../../client/components/UpgradeButton";
import { useGetProjectQuery } from "../../../client/graphql/getProject.generated";
import Layout from "../../../client/components/Containers/Layout";
import {
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Box,
  Th,
  Thead,
  Tr,
  Td,
  Code,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { BadgeIndicator } from "../../../client/components/Atoms/BadgeIndicator";
import { CopyBox } from "../../../client/components/Atoms/CopyBox";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

dayjs.extend(LocalizedFormat);

Chart.register(ArcElement, Tooltip, Legend)

const donutData : ChartData<"doughnut", number[], string> = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Project() {
  const router = useRouter();
  const { slug } = router.query;
  const [{ data, fetching, error }] = useGetProjectQuery({
    variables: {
      slug: String(slug),
    },
  });

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.project || typeof slug !== "string") return <p>Not found.</p>;

  const { project } = data;

  return (
    <Layout>
      <Flex alignItems="center">
        <Heading size="sm">{project.name}</Heading>
        <Flex ml={4} fontWeight="semibold" color="muted">
          ID:
          {project.id && (
            <CopyBox ml={2} value={project.id}>
              <Code>{project?.id}</Code>
            </CopyBox>
          )}
        </Flex>
        <Spacer />
        {!project.paidPlan && <UpgradeButton mr={4} projectId={project.id} />}
        <Link href={`/app/${project.slug}/settings`}>
          <Button>Settings</Button>
        </Link>
      </Flex>
      <Box>
      <Doughnut data={donutData} />
      </Box>
      <Box p={4} bg="bg-surface" mt={8} borderRadius="lg" boxShadow="sm">
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Branch</Th>
              <Th>Commit</Th>
              <Th>Ran At</Th>
              <Th>Avg. Semantic Similarity</Th>
              <Th>Avg. Jaccard Similarity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {project?.testRuns?.edges?.map((edge) => {
              const testRun = edge?.node;
              if (!testRun) return null;
              return (
                <Link
                  href={`/app/${project.slug}/run/${testRun.id}`}
                  key={testRun.id}
                >
                  <Tr _hover={{ bg: "bg-muted" }} cursor="pointer">
                    <Td>{testRun.name}</Td>

                    <Td>
                      <Code>{testRun.branch}</Code>
                    </Td>
                    <Td>
                      <Code>{testRun.commitId}</Code>
                    </Td>
                    <Td>{dayjs(testRun.createdAt).format("LLL")}</Td>
                    <Td>
                      <BadgeIndicator
                        value={testRun.averageTestSentiment ?? undefined}
                      />
                    </Td>
                    <Td>
                      <BadgeIndicator
                        value={testRun.averageJaccardSimilarity ?? undefined}
                      />
                    </Td>
                  </Tr>
                </Link>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
}

export default Project;
