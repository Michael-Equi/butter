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
} from "@chakra-ui/react";

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
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Ran At</Th>
              <Th>Average Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {project?.testRuns?.edges?.map((edge) => {
              const testRun = edge?.node;
              if (!testRun) return null;
              return (
                <Link
                  href={`/app/${project.slug}/testRun/${testRun.id}`}
                  key={testRun.id}
                >
                  <Tr _hover={{ bg: "bg-muted" }} cursor="pointer">
                    <Td>{testRun.id}</Td>
                    <Td>{testRun.name}</Td>
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
