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
  Td,
  Th,
  Thead,
  Tr,
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
      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>Test Run Name</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody></Tbody>
      </Table>
    </Layout>
  );
}

export default Project;
