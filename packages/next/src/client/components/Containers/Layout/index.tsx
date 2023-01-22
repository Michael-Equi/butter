import Footer from "../../Footer";
import Navbar from "../../Navbar";
import { Box, Flex } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box
        as="main"
        maxW="8xl"
        w="100%"
        mx="auto"
        px={4}
        h="full"
        flex={1}
        py={8}
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
