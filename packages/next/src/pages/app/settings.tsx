import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUpdateUserMutation } from "../../client/graphql/updateUser.generated";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "../../client/graphql/getCurrentUser.generated";
import Layout from "../../client/components/Containers/Layout";
import {
  Box,
  Button,
  Heading,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Dashboard() {
  const [{ data, fetching, error }] = useGetCurrentUserQuery();
  const router = useRouter();
  const [, updateUser] = useUpdateUserMutation();
  const [name, setName] = useState<string>("");
  const currentUser = data?.currentUser;

  // Once we load the current user, default the name input to their name
  useEffect(() => {
    if (currentUser?.name) setName(currentUser.name);
  }, [currentUser]);

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!currentUser) {
    if (process.browser) router.push("/login");
    return (
      <p>
        Redirecting to <Link href="/login">/login</Link>
        ...
      </p>
    );
  }

  return (
    <Layout>
      <Heading size="lg">{currentUser.name} Settings</Heading>
      <Box
        mt={4}
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
        bg="bg-surface"
        borderRadius="lg"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Input
          value={name}
          placeholder="Arnold Schwarzenegger"
          onChange={(evt) => setName(evt.target.value)}
        />
        <Button
          disabled={!name}
          onClick={() => {
            if (!name) return;
            toast.promise(
              updateUser({
                name,
                userId: currentUser.id,
              }),
              {
                loading: `Updating settings...`,
                success: `Settings updated!`,
                error: (err) => err,
              }
            );
          }}
        >
          Save
        </Button>
      </Box>
    </Layout>
  );
}
