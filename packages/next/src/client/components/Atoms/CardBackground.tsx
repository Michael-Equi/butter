import {Box, BoxProps, useColorModeValue} from "@chakra-ui/react";
import {FC} from "react";

type CardBackgroundProps = BoxProps

export const CardBackground: FC<CardBackgroundProps> = (props) => (
    <Box
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
        bg="bg-surface"
        borderRadius="lg"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        {...props}
    />
)