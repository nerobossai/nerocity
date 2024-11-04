import { Container, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

import PrimaryButton from "@/components/PrimaryButton";
import Seo from "@/components/Seo";
import Splashscreen from "@/components/Splashscreen";
import { Meta } from "@/layouts/Meta";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    document.body.classList.add("home");
  }, []);

  return (
    <>
      <Seo />

      <Splashscreen />

      <Main
        // @ts-ignore
        meta={
          <Meta title={AppConfig.title} description={AppConfig.description} />
        }
      >
        <Container
          display="flex"
          minH="83dvh"
          flexDirection="column"
          justifyContent={["center"]}
          minWidth="100%"
        >
          <Stack
            marginTop="4rem"
            alignItems="center"
            textAlign="center"
            spacing="5rem"
          >
            <Text
              fontFamily="ppeditorial"
              fontSize={["3rem", "5rem", "5.5rem"]}
              maxWidth={["90%", "70%"]}
              lineHeight={1}
            >
              Martian announces the first AI agent coin launchpad <br /> on
              Solana
            </Text>
            <PrimaryButton
              margintop="2rem"
              padding="1.5rem"
              marginbottom="2rem"
              colorbg="#fff"
              onClick={() => window.open("https://t.me/martianfun", "_blank")}
            >
              <Text
                fontFamily="system85"
                fontWeight="medium"
                fontSize="26px"
                color="black"
              >
                Join Telegram
              </Text>
            </PrimaryButton>
          </Stack>
        </Container>
      </Main>
    </>
  );
};
export default Index;
