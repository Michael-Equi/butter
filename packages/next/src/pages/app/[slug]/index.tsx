import Link from "next/link";
import { useState } from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { BadgeIndicator } from "../../../client/components/Atoms/BadgeIndicator";
import { CopyBox } from "../../../client/components/Atoms/CopyBox";
import { Line } from "react-chartjs-2";
import { theme } from "../../../client/theme";
import { CardBackground } from "../../../client/components/Atoms/CardBackground";

dayjs.extend(LocalizedFormat);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "",
    },
  },
};

function extractAndNormalize(object: any, key: string): number[] {
  const data = object.map((item: any) => item[key]);
  if (!data) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const normalized = (data as number[]).map((value) => {
    return (value - min) / range;
  });
  console.log(normalized);
  return normalized;
}

function Project() {
  const router = useRouter();
  const { slug } = router.query;
  const [{ data, fetching, error }] = useGetProjectQuery({
    variables: {
      slug: String(slug),
    },
  });

  const [branch, setBranch] = useState("all");

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.project || typeof slug !== "string") return <p>Not found.</p>;

  const { project } = data;

  const allTestRuns = (() => {
    return project?.testRuns?.edges
      ?.map((edge) => {
        const testRun = edge?.node;
        if (!testRun) return null;
        return testRun;
      })
      .filter((testRun) => Boolean(testRun));
  })();

  const branches = allTestRuns
    .map((testRun) => testRun?.branch)
    .filter(
      (branch, index, self) => self.indexOf(branch) === index
    ) as string[];

  const testRuns = allTestRuns.filter((testRun) => {
    return testRun?.branch === branch || branch === "all";
  });

  const chartData = (() => {
    const labels = Array.from(testRuns.keys()).map((x) => `${x + 1}`);
    const datasets = [
      {
        label: "Average Test Sentiment",
        data: extractAndNormalize(testRuns, "averageTestSentiment"),
        borderColor: theme.colors.blue[300],
      },
      {
        label: "Average Semantic Similarity",
        data: extractAndNormalize(testRuns, "averageSemanticSimilarity"),
        borderColor: theme.colors.green[300],
      },
      {
        label: "Average Expected Sentiment",
        data: extractAndNormalize(testRuns, "averageExpectedSentiment"),
        borderColor: theme.colors.orange[300],
      },
      {
        label: "Average Jaccard Similarity",
        data: extractAndNormalize(testRuns, "averageJaccardSimilarity"),
        borderColor: theme.colors.red[300],
      },
    ];
    return {
      labels,
      datasets,
    };
  })();

  return (
    <Layout>
      <Flex alignItems="center">
        <Heading size="sm">{project.name}</Heading>
        <Box ml={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {branch == "all" ? "Filter by branch" : branch}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setBranch("all")}>All</MenuItem>
              {branches.map((b) => (
                <MenuItem onClick={() => setBranch(b as string)}>
                  <Code>{b}</Code>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
        <Spacer />
        {!project.paidPlan && <UpgradeButton mr={4} projectId={project.id} />}
        <Link href={`/app/${project.slug}/settings`}>
          <Button>Settings</Button>
        </Link>
      </Flex>
      <SimpleGrid columns={1} mt={8}>
        <CardBackground>
          <Heading size="xs" mb={4}>
            Model Performance
          </Heading>
          <Line options={lineOptions} data={chartData} />
        </CardBackground>
      </SimpleGrid>
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
            {testRuns.map((testRun) => {
              if (testRun == null) return null;
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
                        value={testRun.averageSemanticSimilarity ?? undefined}
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
