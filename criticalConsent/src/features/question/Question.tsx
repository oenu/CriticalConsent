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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useAppDispatch } from "../../redux/hooks";
import { QuestionType } from "../../types";

import { selectResponse } from "./questionSlice";

function Question({ question }: { question: QuestionType }) {
  const dispatch = useAppDispatch();

  const mobileView = useMediaQuery("(max-width: 1200px)");
  console.log(mobileView);
  return (
    <Card shadow="sm" p="lg" radius="md" mx="md" withBorder>
      <Card.Section p={"lg"}>
        <Text>{question.description}</Text>
        <Divider my="sm" />

        {/* Text descriptions of the options, including buttons for mobile view*/}
        <Grid>
          <Grid.Col sm={12} lg={4}>
            <Text>{question.example_low}</Text>
            <div hidden={!mobileView}>
              <Button
                fullWidth
                variant={question.select_low ? "filled" : "outline"}
                onClick={() => {
                  console.log("low");
                  dispatch(
                    selectResponse({ id: question.id, selection: "low" })
                  );
                }}
              >
                Select
              </Button>
            </div>
          </Grid.Col>
          <Grid.Col sm={12} lg={4}>
            <Text>{question.example_mid}</Text>
            <div hidden={!mobileView}>
              <Button
                fullWidth
                variant={question.select_mid ? "filled" : "outline"}
                onClick={() => {
                  console.log("mid");
                  dispatch(
                    selectResponse({ id: question.id, selection: "mid" })
                  );
                }}
              >
                Select
              </Button>
            </div>
          </Grid.Col>
          <Grid.Col sm={12} lg={4}>
            <Text>{question.example_high}</Text>
            <div hidden={!mobileView}>
              <Button
                fullWidth
                variant={question.select_high ? "filled" : "outline"}
                onClick={() => {
                  console.log("high");
                  dispatch(
                    selectResponse({ id: question.id, selection: "high" })
                  );
                }}
              >
                Select
              </Button>
            </div>
          </Grid.Col>
        </Grid>

        {/* Buttons for the options in desktop view */}
        <div hidden={mobileView}>
          <Grid>
            <Grid.Col sm={12} lg={4}>
              <Button
                fullWidth
                variant={question.select_low ? "filled" : "outline"}
                onClick={() => {
                  console.log("low");
                  dispatch(
                    selectResponse({ id: question.id, selection: "low" })
                  );
                }}
              >
                Select
              </Button>
            </Grid.Col>
            <Grid.Col sm={12} lg={4}>
              <Button
                fullWidth
                variant={question.select_mid ? "filled" : "outline"}
                onClick={() => {
                  console.log("mid");
                  dispatch(
                    selectResponse({ id: question.id, selection: "mid" })
                  );
                }}
              >
                Select
              </Button>
            </Grid.Col>
            <Grid.Col sm={12} lg={4}>
              <Button
                fullWidth
                variant={question.select_high ? "filled" : "outline"}
                onClick={() => {
                  console.log("high");
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
      </Card.Section>
    </Card>
  );
}

export default Question;
