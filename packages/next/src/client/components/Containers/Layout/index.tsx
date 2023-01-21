import Footer from "../../Footer";
import Navbar from "../../Navbar";
import { Box } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <Box as="main" maxW="8xl" mx="auto" px={4} w="full" py={8}>
        {children}
      </Box>
      <Footer />
    </>
  );
}
