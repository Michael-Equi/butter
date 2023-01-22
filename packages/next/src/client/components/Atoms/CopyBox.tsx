import { Box, BoxProps, Code, Tooltip, useClipboard } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type CopyCodeProps = {
  value: string;
  children: ReactNode;
} & BoxProps;

export const CopyBox: FC<CopyCodeProps> = ({ value, children, ...props }) => {
  const { onCopy, hasCopied } = useClipboard(value);

  return (
    <Tooltip label={hasCopied ? "Copied" : "Copy to clipboard"} placement="top">
      <Box onClick={onCopy} cursor="pointer" {...props}>
        {children}
      </Box>
    </Tooltip>
  );
};
