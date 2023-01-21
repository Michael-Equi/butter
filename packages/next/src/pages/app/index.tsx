import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCreateProjectMutation } from "../../client/graphql/createProject.generated";
import {
  GetCurrentUserWithProjectsQueryVariables,
  useGetCurrentUserWithProjectsQuery,
} from "../../client/graphql/getCurrentUserWithProjects.generated";
import { Button, Input } from "@chakra-ui/react";

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
    <>
      <h1>Hello {data.currentUser.name}!</h1>
      <ul>
        {projects?.edges?.map((edge) => {
          const project = edge?.node;
          if (!project) return null;
          return (
            <li key={project.slug}>
              <Link href={`/app/${project.slug}`}>{project.name}</Link>
            </li>
          );
        })}
      </ul>
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
      <div>
        <Input
          placeholder="Hooli Inc."
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <Button
          disabled={!name}
          onClick={() => {
            createProject({
              name,
            }).then((result) => {
              const slug = result.data?.createProject?.slug;
              if (slug) router.push(`/app/${slug}`);
            });
          }}
        >
          Create project
        </Button>
        <Link href="/app/settings">
          <Button>Settings</Button>
        </Link>
        <Link href="/api/auth/logout">
          <Button>Logout</Button>
        </Link>
      </div>
    </>
  );
}
