import { Button, Card, Divider, Grid, Paper, Text } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { QuestionType } from "../../../../types";
import { selectHighlightUnanswered, selectResponse } from "../../surveySlice";

function Select({
  question,
  mobileView,
}: {
  question: QuestionType;
  mobileView: boolean;
}) {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Whether to highlight unanswered questions
  const highlightUnanswered = useAppSelector(selectHighlightUnanswered);

  // Color to highlight unanswered questions
  const highlightColor = "red";

  return (
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
}

export default Select;
