import { Box, Editable, Skeleton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BiStar } from "react-icons/bi";
import { putData } from "../../utils";
import { toaster } from "../ui/toaster";

export default function Navbar({
  board: { id, name },
  loading,
  setReloadDetailsPage,
}) {
  const [updatedName, setUpdatedName] = useState(name);

  function updateName() {
    if (updatedName.length === 0) return;

    const url = `${import.meta.env.VITE_BOARD_BASE_URL}/${id}?key=${
      import.meta.env.VITE_TRELLO_API_KEY
    }&token=${import.meta.env.VITE_TRELLO_TOKEN}&name=${updatedName}`;

    const promise = putData(url).then(() => {
      setReloadDetailsPage((prev) => !prev);
      setUpdatedName("");
    });

    toaster.promise(promise, {
      success: {
        title: "Your board name has been updated successfully!",
        description: "Looks great",
      },
      error: {
        title: "Failed to update board name!",
        description: "Something wrong with the updatation",
      },
      loading: { title: "Updating board name...", description: "Please wait" },
    });
  }

  function keyEventHandler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      updateName();
    }
  }

  return (
    <Box bgColor="#0000003d" px={20}>
      {loading ? (
        <Skeleton flex="1" height="10" variant="pulse" />
      ) : (
        <Box
          display={"inline-block"}
          position={"relative"}
          flexDirection={"row"}
          padding={"12px 0px"}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          width={"calc(100% - 23px)"}
          height={"auto"}
          gap={4}
        >
          {/* Dyanmic title */}
          <HelmetProvider>
            <Helmet>
              <title>{name} | Trello</title>
            </Helmet>
          </HelmetProvider>

          <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
            gap={4}
          >
            <Editable.Root
              onValueChange={(e) => setUpdatedName(e.value)}
              placeholder={name}
              width={"auto"}
              fontWeight={"bold"}
              fontSize={"18px"}
              onKeyDown={keyEventHandler}
            >
              <Editable.Preview />
              <Editable.Input value={updatedName} />
            </Editable.Root>

            <BiStar size={20} cursor={"pointer"} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
