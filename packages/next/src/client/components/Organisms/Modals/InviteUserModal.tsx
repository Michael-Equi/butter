import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { useCreateProjectMutation } from "../../../graphql/createProject.generated";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useInviteToProjectMutation } from "../../../graphql/inviteToProject.generated";

type InviteUserData = {
  email: string;
};

const inviteUserModalSchema = z.object({
  email: z.string().email(),
});

type InviteUserModalProps = {
  projectId: string;
};

export const InviteUserModal: FC<InviteUserModalProps> = ({ projectId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<InviteUserData>({
    resolver: zodResolver(inviteUserModalSchema),
  });

  const [{ fetching }, inviteToProject] = useInviteToProjectMutation();

  const onSubmit = async ({ email }: InviteUserData) => {
    const result = await inviteToProject({
      email,
      projectId,
    });
    if (result.data?.inviteToProject) {
      toast({
        variant: "success",
        title: "User invited",
      });
    } else if (result.error) {
      toast({
        variant: "error",
        title: "Error inviting user",
        description: result.error.message.toString(),
      });
    }
  };
  return (
    <>
      <Button onClick={onOpen} variant="primary">
        Invite User
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="gavin@hooli.io" {...register("email")} />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={fetching}
              onClick={handleSubmit(onSubmit)}
              isDisabled={Object.keys(errors).length !== 0 || !isDirty}
            >
              Invite user
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
