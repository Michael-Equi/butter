import {
  Button,
  Container,
  Divider,
  Heading,
  Input,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import Illustration from "../client/components/Atoms/Illustration";
import AuthenticationForm from "../client/components/AuthenticationForm";

const LoginPage = () => (
  <Container maxW="md" py={{ base: "12", md: "24" }}>
    <Stack spacing="8">
      <Stack spacing="6" align="center">
        <Illustration name="LogoHorizontal" height={16} />
        <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
          Log in to your account
        </Heading>
      </Stack>
      <Stack spacing="6">
        <Divider />
        <AuthenticationForm />
      </Stack>
    </Stack>
  </Container>
);

export default LoginPage;
