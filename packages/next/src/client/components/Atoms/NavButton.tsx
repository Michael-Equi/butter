import React from "react";
import { As, Button, ButtonProps, HStack, Icon, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface NavButtonProps extends ButtonProps {
  icon?: As;
  label: string;
  href?: string;
}

export const NavButton = (props: NavButtonProps) => {
  const router = useRouter();

  const { icon, label, href, ...buttonProps } = props;

  const button = (
    <Button
      variant="ghost"
      justifyContent="start"
      w="100%"
      {...buttonProps}
      leftIcon={icon ? <Icon as={icon} color="subtle" /> : undefined}
      pr={7}
      aria-current={router.asPath === href ? "page" : undefined}
    >
      <HStack spacing="3">
        <Text>{label}</Text>
      </HStack>
    </Button>
  );

  return href ? <NextLink href={href}>{button}</NextLink> : button;
};
