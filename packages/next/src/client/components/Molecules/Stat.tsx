import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiMoreVertical,
} from "react-icons/fi";

type Props = {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    isUpwardsTrend: boolean;
  };
};
export const Stat = ({ label, value, delta, ...boxProps }: Props) => (
  <Box
    px={{ base: "4", md: "6" }}
    py={{ base: "5", md: "6" }}
    bg="bg-surface"
    borderRadius="lg"
    boxShadow={useColorModeValue("sm", "sm-dark")}
    {...boxProps}
  >
    <Stack>
      <HStack justify="space-between">
        <Text fontSize="sm" color="muted">
          {label}
        </Text>
        <Icon as={FiMoreVertical} boxSize="5" color="muted" />
      </HStack>
      <HStack justify="space-between">
        <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
          {Math.round(value * 100) / 100}
        </Heading>
        {delta && (
          <Badge
            variant="subtle"
            colorScheme={delta.isUpwardsTrend ? "green" : "red"}
          >
            <HStack spacing="1">
              <Icon
                as={delta.isUpwardsTrend ? FiArrowUpRight : FiArrowDownRight}
              />
              <Text>{delta.value}</Text>
            </HStack>
          </Badge>
        )}
      </HStack>
    </Stack>
  </Box>
);
