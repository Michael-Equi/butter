import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCreateProjectMutation } from "../../client/graphql/createProject.generated";
import {
  GetCurrentUserWithProjectsQueryVariables,
  useGetCurrentUserWithProjectsQuery,
} from "../../client/graphql/getCurrentUserWithProjects.generated";
import {
  Button,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Flex,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import Layout from "../../client/components/Containers/Layout";
import { CreateProjectModal } from "../../client/components/Organisms/Modals/CreateProjectModal";
import { EmptyState } from "../../client/components/Molecules/EmptyState";

export default function Dashboard() {
  const router = useRouter();

  const [variables, setVariables] =
    useState<GetCurrentUserWithProjectsQueryVariables>({
      projectsFirst: 10,
    });
  const [{ data, fetching, error }] = useGetCurrentUserWithProjectsQuery({
    variables,
  });

  const hasBeenFetchedOnce = Boolean(data || error);
  const initialFetching = fetching && !hasBeenFetchedOnce;
  const additionalFetching = fetching && hasBeenFetchedOnce;

  const [, createProject] = useCreateProjectMutation();
  const [name, setName] = useState("");

  if (initialFetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.currentUser) {
    if (process.browser) router.push("/login");
    return (
      <p>
        Redirecting to <Link href="/login">/login</Link>
        ...
      </p>
    );
  }

  const { projects } = data.currentUser;

  const pageInfo = projects?.pageInfo;
  const endCursor = pageInfo?.endCursor;
  const hasNextPage = Boolean(pageInfo?.hasNextPage);

  return (
    <Layout>
      <Flex>
        <Heading size="sm">Projects</Heading>
        <Spacer />
        <CreateProjectModal />
      </Flex>

      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {projects?.edges?.map((edge) => {
            const project = edge?.node;
            if (!project) return null;
            return (
              <Tr key={project.slug}>
                <Td>{project.id}</Td>
                <Td>
                  <Link href={`/app/${project.slug}`}>{project.name}</Link>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {projects?.edges?.length === 0 && (
        <EmptyState title="No pages created yet">
          <CreateProjectModal />
        </EmptyState>
      )}

      {hasNextPage && (
        <Button
          isLoading={additionalFetching}
          variant="primary"
          onClick={() => {
            setVariables((prevVariables) => ({
              ...prevVariables,
              projectsAfter: endCursor,
            }));
          }}
        >
          Load More Projects
        </Button>
      )}
    </Layout>
  );
}
