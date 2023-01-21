import Link from "next/link";
import { useGetCurrentUserQuery } from "../../graphql/getCurrentUser.generated";
import { Button, Flex, Spacer } from "@chakra-ui/react";
import Illustration from "../Atoms/Illustration";

function Navbar() {
  const [{ data }] = useGetCurrentUserQuery();
  const isAuthenticated = !!data?.currentUser;

  return (
    <Flex px={4} py={8} maxW="5xl" w="full" mx="auto" alignItems="center">
      <Illustration h={16} name="LogoHorizontal" />
      <Spacer />
      {!isAuthenticated ? (
        <>
          <Link href="/get-started">
            <Button variant="outline" mr={3}>
              Login
            </Button>
          </Link>
          <Link href="/get-started">
            <Button variant="primary">Get started</Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/api/auth/logout">
            <Button variant="outline" mr={3}>
              Logout
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="primary">Dashboard</Button>
          </Link>
        </>
      )}
    </Flex>
  );
}

export default Navbar;
