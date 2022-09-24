import {
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Overlay,
  Stack,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconMoodCry,
  IconQuestionMark,
  IconSausage,
  IconSpider,
  IconTank,
} from "@tabler/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  clearGroup,
  selectGroupCategories,
  selectGroupName,
} from "../group/groupSlice";
import { clearSurvey } from "../survey/surveySlice";

// Dashboard page showing the current survey, the responses, a link to the survey, a qr code

function Dashboard() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Use Navigate hook
  const navigate = useNavigate();

  // Get group information
  const group_name = useAppSelector(selectGroupName);

  // Get group categories
  const categories = useAppSelector(selectGroupCategories);

  // Whether in mobile view
  const isMobile = useMediaQuery("(max-width: 600px)");

  // Whether in wide view
  const isWide = useMediaQuery("(min-width: 1200px)");

  // Indicator of how many responses have been submitted

  // Indicator of how many responses are required

  // QR code for the survey

  // Email link for the survey

  // Link to the survey

  let content = null;

  content = (
    <Container>
      <Stack style={isWide ? { maxWidth: 1200 } : {}}>
        <Group align={"center"}>
          <Title order={2}>{group_name}</Title>
          <Button
            variant="light"
            size="xs"
            onClick={() => {
              dispatch(clearGroup());
              dispatch(clearSurvey());
              navigate("/survey");
            }}
          >
            Log Out
          </Button>
        </Group>
        <Grid>
          <Grid.Col span={isMobile ? 12 : 8}>
            <Card withBorder>temp</Card>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 4}>
            <Stack>
              <Card withBorder>
                <Stack>
                  <Title order={3}>Categories</Title>
                  <Divider />
                  <Stack>
                    <Group>
                      <ThemeIcon variant="filled" color="green">
                        <IconQuestionMark />
                      </ThemeIcon>
                      <Title order={5}>General</Title>
                    </Group>
                    <Group>
                      <ThemeIcon variant="filled" color="red">
                        <IconSpider />
                      </ThemeIcon>
                      <Title order={5}>Phobic</Title>
                    </Group>
                    <Group>
                      <ThemeIcon variant="filled" color="orange">
                        <IconTank />
                      </ThemeIcon>
                      <Title order={5}>Graphic</Title>
                    </Group>
                    <Group>
                      <ThemeIcon variant="filled" color="orange">
                        <IconSausage />
                      </ThemeIcon>
                      <Title order={5}>Sexual</Title>
                    </Group>
                    <Group>
                      <ThemeIcon variant="filled" color="green">
                        <IconMoodCry />
                      </ThemeIcon>
                      <Title order={5}>Offensive</Title>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
              <Card withBorder>
                <CardSection>
                  <Title order={3} m="md">
                    QR Code
                  </Title>
                </CardSection>
                <CardSection></CardSection>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        <Card withBorder>
          <Overlay />
          <Title order={3}> Responses </Title>
          <Title order={5}> 2 more responses required </Title>
        </Card>
      </Stack>
    </Container>
  );

  return content;
}

export default Dashboard;
