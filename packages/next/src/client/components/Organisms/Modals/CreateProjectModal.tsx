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
} from "@chakra-ui/react";
import { useCreateProjectMutation } from "../../../graphql/createProject.generated";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

type CreateProjectModalData = {
  name: string;
};

const createProjectModalSchema = z.object({
  name: z.string(),
});

export const CreateProjectModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ fetching }, createProject] = useCreateProjectMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateProjectModalData>({
    resolver: zodResolver(createProjectModalSchema),
  });

  const onSubmit = async ({ name }: CreateProjectModalData) => {
    const result = await createProject({
      name,
    });
    const slug = result.data?.createProject?.slug;
    if (slug) router.push(`/app/${slug}`);
  };
  return (
    <>
      <Button onClick={onOpen}>New Project</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Hooli Inc." {...register("name")} />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={fetching}
              onClick={handleSubmit(onSubmit)}
              isDisabled={Object.keys(errors).length !== 0 || !isDirty}
            >
              Create project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
