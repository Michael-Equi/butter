import Link from "next/link";
import { useRouter } from "next/router";
import UpgradeButton from "../../../client/components/UpgradeButton";
import {
  GetProjectWithUsersQueryVariables,
  useGetProjectWithUsersQuery,
} from "../../../client/graphql/getProjectWithUsers.generated";
import { useCreateStripeCheckoutBillingPortalUrlMutation } from "../../../client/graphql/createStripeCheckoutBillingPortalUrl.generated";
import { FiChevronLeft } from "react-icons/fi";
import React, { useState } from "react";
import { useInviteToProjectMutation } from "../../../client/graphql/inviteToProject.generated";
import toast from "react-hot-toast";
import { useRemoveUserFromProjectMutation } from "../../../client/graphql/removeUserFromProject.generated";
import { useGetCurrentUserQuery } from "../../../client/graphql/getCurrentUser.generated";
import Layout from "../../../client/components/Containers/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { InviteUserModal } from "../../../client/components/Organisms/Modals/InviteUserModal";

function ProjectSettings() {
  const { isReady, query } = useRouter();
  const { slug } = query;
  const [{ data: currentUserData }] = useGetCurrentUserQuery();

  const [variables, setVariables] = useState<GetProjectWithUsersQueryVariables>(
    { usersFirst: 10 }
  );
  const [{ data, fetching, error }] = useGetProjectWithUsersQuery({
    pause: !isReady,
    variables: { ...variables, slug: String(slug) },
  });

  const hasBeenFetchedOnce = Boolean(data || error);
  const initialFetching = fetching && !hasBeenFetchedOnce;
  const additionalFetching = fetching && hasBeenFetchedOnce;

  const [, createStripeCheckoutBillingPortalUrl] =
    useCreateStripeCheckoutBillingPortalUrlMutation();

  const [, removeUserFromProject] = useRemoveUserFromProjectMutation();

  if (!isReady || initialFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data?.project) return <p>Not found.</p>;
  if (!currentUserData?.currentUser) return null;

  const { currentUser } = currentUserData;
  const { project } = data;
  const { users } = project;

  const pageInfo = users?.pageInfo;
  const endCursor = pageInfo?.endCursor;
  const hasNextPage = Boolean(pageInfo?.hasNextPage);

  return (
    <Layout>
      <Flex alignItems="center">
        <Link href={`/app/${project.slug}`}>
          <IconButton
            cursor="pointer"
            aria-label="Back"
            variant="ghost"
            size="sm"
            as={FiChevronLeft}
          />
        </Link>

        <Heading size="sm">{project.name} Settings</Heading>

        <Spacer />

        <HStack spacing={3}>
          {!project.paidPlan ? (
            <UpgradeButton projectId={project.id} />
          ) : (
            <button
              onClick={() => {
                createStripeCheckoutBillingPortalUrl({
                  projectId: project.id,
                }).then((result) => {
                  const url = result.data?.createStripeCheckoutBillingPortalUrl;
                  if (url) window.location.href = url;
                });
              }}
            >
              Manage billing
            </button>
          )}

          <InviteUserModal projectId={project.id} />
        </HStack>
      </Flex>
      <Box
        mt={4}
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
        bg="bg-surface"
        borderRadius="lg"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Heading size="xs">Users</Heading>
        <Table mt={4}>
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.edges?.map((edge) => {
              const user = edge?.node;
              if (!user) return null;
              return (
                <Tr key={user.id}>
                  <Td>{user.name || user.email}</Td>
                  <Td>
                    {user.id !== currentUser.id && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to remove ${
                                user.email
                              } from ${project.name || "this project"}?`
                            )
                          ) {
                            toast.promise(
                              removeUserFromProject({
                                projectId: project.id,
                                userId: user.id,
                              }),
                              {
                                loading: `Removing ${user.email}...`,
                                success: `Removed ${user.email}!`,
                                error: (err) => err,
                              }
                            );
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      {hasNextPage && (
        <button
          disabled={additionalFetching}
          onClick={() => {
            setVariables((prevVariables) => ({
              ...prevVariables,
              usersAfter: endCursor,
            }));
          }}
        >
          {additionalFetching ? "Fetching..." : "Load more users"}
        </button>
      )}
    </Layout>
  );
}

export default ProjectSettings;
