// Types
import {
  Stack,
  Grid,
  Card,
  Text,
  Divider,
  Button,
  UnstyledButton,
  SimpleGrid,
  Container,
  Paper,
  Center,
  Group,
  Switch,
  Checkbox,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import { QuestionType } from "../../types";

import {
  getHighlightUnanswered,
  selectResponse,
  setOptIn,
} from "./questionSlice";

function Question({ question }: { question: QuestionType }) {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Whether to highlight unanswered questions
  const highlightUnanswered = useAppSelector(getHighlightUnanswered);

  // Detect if the screen is small
  const mobileView = useMediaQuery("(max-width: 1200px)");

  // Color to highlight unanswered questions
  const highlightColor = "red";

  // Importer for mantine theme
  const theme = useMantineTheme();

  let content = null;

  // Render the correct type of question
  switch (question.type) {
    case "select":
      content = (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Card.Section p={"lg"}>
            <Text size="lg">{question.title}</Text>
            <Text italic>{question.description}</Text>
            <Divider my="sm" />

            {/* Desktop View */}
            <div hidden={mobileView}>
              {/* Written Examples */}
              <Grid>
                <Grid.Col lg={4}>
                  <Text>{question.example_low}</Text>
                </Grid.Col>
                <Grid.Col lg={4}>
                  <Text>{question.example_mid}</Text>
                </Grid.Col>
                <Grid.Col lg={4}>
                  <Text>{question.example_high}</Text>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col lg={4}>
                  <Button
                    fullWidth
                    color={
                      highlightUnanswered && !question.answered
                        ? highlightColor
                        : ""
                    }
                    variant={question.select_low ? "filled" : "outline"}
                    onClick={() => {
                      console.debug(question.id, "low");
                      dispatch(
                        selectResponse({ id: question.id, selection: "low" })
                      );
                    }}
                  >
                    Select
                  </Button>
                </Grid.Col>
                <Grid.Col lg={4}>
                  <Button
                    fullWidth
                    color={
                      highlightUnanswered && !question.answered
                        ? highlightColor
                        : ""
                    }
                    variant={question.select_mid ? "filled" : "outline"}
                    onClick={() => {
                      console.debug(question.id, "mid");
                      dispatch(
                        selectResponse({ id: question.id, selection: "mid" })
                      );
                    }}
                  >
                    Select
                  </Button>
                </Grid.Col>
                <Grid.Col lg={4}>
                  <Button
                    fullWidth
                    color={
                      highlightUnanswered && !question.answered
                        ? highlightColor
                        : ""
                    }
                    variant={question.select_high ? "filled" : "outline"}
                    onClick={() => {
                      console.debug(question.id, "high");
                      dispatch(
                        selectResponse({ id: question.id, selection: "high" })
                      );
                    }}
                  >
                    Select
                  </Button>
                </Grid.Col>
              </Grid>
            </div>

            {/* Mobile View */}
            <div hidden={!mobileView}>
              <Grid>
                <Grid.Col sm={12}>
                  <Paper withBorder p={"sm"}>
                    <Text>{question.example_low}</Text>

                    <Button
                      fullWidth
                      mt={"sm"}
                      color={
                        highlightUnanswered && !question.answered
                          ? highlightColor
                          : ""
                      }
                      variant={question.select_low ? "filled" : "outline"}
                      onClick={() => {
                        console.debug(question.id, "low");
                        dispatch(
                          selectResponse({ id: question.id, selection: "low" })
                        );
                      }}
                    >
                      Select
                    </Button>
                  </Paper>
                </Grid.Col>
                <Grid.Col sm={12}>
                  <Paper withBorder p={"sm"}>
                    <Text>{question.example_mid}</Text>
                    <Button
                      fullWidth
                      mt={"sm"}
                      color={
                        highlightUnanswered && !question.answered
                          ? highlightColor
                          : ""
                      }
                      variant={question.select_mid ? "filled" : "outline"}
                      onClick={() => {
                        console.debug(question.id, "mid");
                        dispatch(
                          selectResponse({ id: question.id, selection: "mid" })
                        );
                      }}
                    >
                      Select
                    </Button>{" "}
                  </Paper>
                </Grid.Col>
                <Grid.Col sm={12}>
                  <Paper withBorder p={"sm"}>
                    <Text>{question.example_high}</Text>

                    <Button
                      fullWidth
                      mt={"sm"}
                      color={
                        highlightUnanswered && !question.answered
                          ? highlightColor
                          : ""
                      }
                      variant={question.select_high ? "filled" : "outline"}
                      onClick={() => {
                        console.debug(question.id, "high");
                        dispatch(
                          selectResponse({ id: question.id, selection: "high" })
                        );
                      }}
                    >
                      Select
                    </Button>
                  </Paper>
                </Grid.Col>
              </Grid>
            </div>
          </Card.Section>
        </Card>
      );
      break;
    case "toggle":
      content = (
        <>
          {/* Desktop View */}
          <div hidden={mobileView}>
            <Grid justify={"center"}>
              <Grid.Col span={5}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Grid align={"center"}>
                    <Grid.Col span={9}>
                      <Text size="lg">{question.title}</Text>
                      <Text italic>{question.description}</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Center>
                        <Switch
                          checked={question.opt_in}
                          thumbIcon={
                            question.opt_in ? (
                              <IconCheck
                                size={12}
                                color={
                                  theme.colors.teal[theme.fn.primaryShade()]
                                }
                                stroke={3}
                              />
                            ) : (
                              <IconX
                                size={12}
                                color={
                                  theme.colors.red[theme.fn.primaryShade()]
                                }
                                stroke={3}
                              />
                            )
                          }
                          onChange={() => {
                            console.debug(question.id);
                            dispatch(
                              setOptIn({
                                id: question.id,
                                opt_in: !question.opt_in,
                              })
                            );
                          }}
                        ></Switch>
                      </Center>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
          </div>

          {/* Mobile View */}
          <div hidden={!mobileView}>
            <Grid justify={"center"}>
              <Grid.Col span={12}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Grid align={"center"}>
                    <Grid.Col span={9}>
                      <Text size="lg">{question.title}</Text>
                      <Text italic>{question.description}</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Center>
                        <Switch
                          size={"lg"}
                          checked={question.opt_in}
                          thumbIcon={
                            question.opt_in ? (
                              <IconCheck
                                size={12}
                                color={
                                  theme.colors.teal[theme.fn.primaryShade()]
                                }
                                stroke={3}
                              />
                            ) : (
                              <IconX
                                size={12}
                                color={
                                  theme.colors.red[theme.fn.primaryShade()]
                                }
                                stroke={3}
                              />
                            )
                          }
                          onChange={() => {
                            console.debug(question.id);
                            dispatch(
                              setOptIn({
                                id: question.id,
                                opt_in: !question.opt_in,
                              })
                            );
                          }}
                        ></Switch>
                      </Center>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
          </div>
        </>
      );

      break;
    case "custom_response":
      content = <div>Custom Question Type</div>;
      break;
    default:
      content = <Text>Unspecified question type id:{question.id} </Text>;
  }
  return content;
}

export default Question;
