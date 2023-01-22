import NextLink from "next/link";
import { Box, HStack, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" bg="bg-muted">
      <HStack
        spacing={4}
        px={4}
        py={8}
        maxW="8xl"
        w="full"
        mx="auto"
        alignItems="center"
      >
        © {new Date().getFullYear()}
        <Link as={NextLink} href="/privacy" color="gray.500">
          Privacy policy
        </Link>
        <Link as={NextLink} href="/terms" color="gray.500">
          Terms of Service
        </Link>
      </HStack>
    </Box>
  );
}
