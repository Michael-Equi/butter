import { FC, ReactNode } from "react";
import { Center, Text, VStack } from "@chakra-ui/react";

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
};

export const EmptyState: FC<EmptyStateProps> = ({ title, children }) => (
  <VStack spacing={2} py={4}>
    <Center
      w={16}
      h={16}
      bg="bg-muted"
      borderRadius="full"
      color="emphasized"
      fontWeight="semibold"
    >
      :(
    </Center>
    <Text color="muted">{title}</Text>
    {children}
  </VStack>
);
