import { FC } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";

type BadgeIndicatorProps = {
  value?: number | null;
} & BadgeProps;

export const BadgeIndicator: FC<BadgeIndicatorProps> = ({ value, ...props }) =>
  value ? (
    <Badge
      colorScheme={value < 0.3 ? "red" : value < 0.7 ? "orange" : "green"}
      {...props}
    >
      {Math.round(value * 100) / 100}
    </Badge>
  ) : (
    <Badge colorScheme="gray">N/A</Badge>
  );
