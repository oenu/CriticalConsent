import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Container,
} from "@mantine/core";

import QuestionList from "./features/question/QuestionList";

// Redux
import {
  getQuestionsStatus,
  fetchQuestionsAsync,
} from "./features/question/questionSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const dispatch = useAppDispatch();
  const questionStatus = useAppSelector(getQuestionsStatus);
  useEffect(() => {
    if (questionStatus === "idle") {
      dispatch(fetchQuestionsAsync());
    }
  }, [questionStatus, dispatch]);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section>thing1</Navbar.Section>
          <Navbar.Section>thing2</Navbar.Section>
          <Navbar.Section>thing3</Navbar.Section>
          <Navbar.Section grow mt="md">
            Links
          </Navbar.Section>
          <Navbar.Section> Footer section </Navbar.Section>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Footer
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Critical Consent</Text>
          </div>
        </Header>
      }
    >
      <Container>
        <QuestionList></QuestionList>
      </Container>
    </AppShell>
  );
}
