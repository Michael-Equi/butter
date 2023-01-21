import Link from "next/link";
import { useGetCurrentUserQuery } from "../../graphql/getCurrentUser.generated";
import { Button, Flex, HStack, Spacer } from "@chakra-ui/react";
import Illustration from "../Atoms/Illustration";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { NavButton } from "../Atoms/NavButton";

function Navbar() {
  const [{ data }] = useGetCurrentUserQuery();
  const isAuthenticated = !!data?.currentUser;

  return (
    <Flex px={4} py={8} maxW="8xl" w="full" mx="auto" alignItems="center">
      <Illustration h={16} name="LogoHorizontal" />
      {isAuthenticated && (
        <HStack spacing={4} ml={8}>
          <NavButton
            href={`/app`}
            label="Dashboard"
            icon={BsFillLightningChargeFill}
          />
          <NavButton
            href={`/app/settings`}
            label="Settings"
            icon={IoIosSettings}
          />
        </HStack>
      )}
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
        </>
      )}
    </Flex>
  );
}

export default Navbar;
