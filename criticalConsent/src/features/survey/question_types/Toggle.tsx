import {
  Card,
  Center,
  Grid,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { QuestionType } from "../../../types";
import { setOptIn } from "../surveySlice";

function Toggle({
  question,
  mobileView,
}: {
  question: QuestionType;
  mobileView: boolean;
}) {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Importer for mantine theme
  const theme = useMantineTheme();

  return (
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
                            color={theme.colors.teal[theme.fn.primaryShade()]}
                            stroke={3}
                          />
                        ) : (
                          <IconX
                            size={12}
                            color={theme.colors.red[theme.fn.primaryShade()]}
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
                    />
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
                            color={theme.colors.teal[theme.fn.primaryShade()]}
                            stroke={3}
                          />
                        ) : (
                          <IconX
                            size={12}
                            color={theme.colors.red[theme.fn.primaryShade()]}
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
                    />
                  </Center>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
}

export default Toggle;
