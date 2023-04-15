import Layout from "../client/components/Containers/Layout";
import {
  Box,
  Button,
  Circle,
  Heading,
  Img,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { NextPage } from "next";

const Homepage: NextPage = () => (
  <Layout>
    <Box>
      <Box
        as="section"
        bg="gray.800"
        color="white"
        py="7.5rem"
        borderRadius="lg"
      >
        <Box
          maxW={{ base: "xl", md: "5xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <Box textAlign="center">
            <Heading
              as="h1"
              size="lg"
              fontWeight="extrabold"
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              Benchmark and track performance of your AI models in your CI/CD
              pipeline
            </Heading>
            <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
              Monitor the performance of your AI models with the testing
              framework built for AI.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  </Layout>
);

export default Homepage;
