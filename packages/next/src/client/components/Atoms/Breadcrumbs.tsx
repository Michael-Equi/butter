import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import NextLink from "next/link";

type BreadcrumbsProps = {
  links: { title: string; href: string }[];
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => (
  <Breadcrumb spacing="8px" separator="/" color="gray.500">
    {links.map(({ href, title }, i) => (
      <BreadcrumbItem isCurrentPage={i + 1 === links.length} key={href + title}>
        <BreadcrumbLink>
          <NextLink href={href}>{title}</NextLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
    ))}
  </Breadcrumb>
);
