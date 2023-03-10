import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";
import * as React from "react";

/**
 * Used on the Login and Sign Up screens to handle authentication. Can be shared between those as Passport.js doesn't differentiate between logging in and signing up.
 */
export default function AuthenticationForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { r } = router.query;
  const redirect = r?.toString();

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        // POST a request with the users email or phone number to the server
        fetch(`/api/auth/magiclink`, {
          method: `POST`,
          body: JSON.stringify({
            redirect,
            destination: email,
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              // Add the email and security code to the query params so we can show them on the /check-mailbox page
              router.push(
                `/check-mailbox?e=${encodeURIComponent(email)}&c=${json.code}`
              );
            }
          });
      }}
    >
      <Stack spacing="4">
        <Input
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <Button variant="primary" type="submit">
          Continue with email
        </Button>
      </Stack>
    </form>
  );
}
