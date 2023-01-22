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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { BadgeIndicator } from "../../../client/components/Atoms/BadgeIndicator";

dayjs.extend(LocalizedFormat);

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
        <Heading size="lg">{project.name}</Heading>
        <Spacer />
        {!project.paidPlan && <UpgradeButton mr={4} projectId={project.id} />}
        <Link href={`/app/${project.slug}/settings`}>
          <Button>Settings</Button>
        </Link>
      </Flex>
      <Box p={4} bg="bg-surface" mt={8} borderRadius="lg" boxShadow="sm">
        <Table>
          <Thead>
            <Tr>
              <Th>Commit</Th>
              <Th>Branch</Th>
              <Th>Name</Th>
              <Th>Ran At</Th>
              <Th>Avg Similarity</Th>
              <Th>Jaccard Similarity</Th>
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
                    <Td>
                      <Code>{testRun.branch}</Code>
                    </Td>
                    <Td>
                      <Code>{testRun.commitId}</Code>
                    </Td>
                    <Td>{testRun.name}</Td>
                    <Td>{dayjs(testRun.createdAt).format("LLL")}</Td>
                    <Td>
                      <BadgeIndicator
                        value={testRun.averageSimilarity ?? undefined}
                      />
                    </Td>
                    <Td>
                      <BadgeIndicator
                        value={testRun.jaccardSimilarity ?? undefined}
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
