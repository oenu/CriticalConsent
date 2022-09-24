import {
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Modal,
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
  selectGroupId,
} from "../group/groupSlice";
import { clearSurvey, selectShareCode } from "../survey/surveySlice";
import QRCode from "react-qr-code";
import { selectQrModalOpen, setQrModalOpen } from "./dashboardSlice";

// Dashboard page showing the current survey, the responses, a link to the survey, a qr code

function Dashboard() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Use Navigate hook
  const navigate = useNavigate();

  // Get group information
  const group_name = useAppSelector(selectGroupName);

  // Get group id for qr code
  const group_id = useAppSelector(selectGroupId);

  // Get group categories
  const categories = useAppSelector(selectGroupCategories);

  // Whether in mobile view
  const isMobile = useMediaQuery("(max-width: 600px)");

  // Whether in wide view
  const isWide = useMediaQuery("(min-width: 1200px)");

  // Share code for the group
  const shareCode = useAppSelector(selectShareCode);

  // Monitor whether the store has reset, if so navigate to the survey page
  React.useEffect(() => {
    if (group_name === null) {
      navigate("/survey");
    }
  }, [group_name, categories, navigate]);

  // QR code modal
  const qr_modal_open = useAppSelector(selectQrModalOpen);

  const qrModal = (
    <Modal
      size="sm"
      trapFocus
      fullScreen={isMobile}
      centered
      overlayOpacity={0.9}
      overlayBlur={5}
      opened={qr_modal_open}
      onClose={() => {
        dispatch(setQrModalOpen(false));
      }}
    >
      <Stack>
        <Title align="center" order={2}>
          {group_name}
        </Title>

        <Center>
          <QRCode value={`http://127.0.0.1:5173/survey/${group_id}`} />
        </Center>
        <Title align="center" order={1}>
          OR
        </Title>
        <Title align="center" order={3}>
          http://URL HERE /survey and enter the share code:
        </Title>
        <Card>
          <Title align="center" order={2}>
            {shareCode}
          </Title>
        </Card>
      </Stack>
    </Modal>
  );

  // Indicator of how many responses have been submitted

  // Indicator of how many responses are required

  // Email link for the survey

  // Link to the survey

  let content = null;

  content = (
    <Container>
      {qrModal}
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
                  <Title order={3}>Question Categories</Title>
                  <Divider />
                  <Stack>
                    <Group>
                      <ThemeIcon variant="filled" color="green">
                        <IconQuestionMark />
                      </ThemeIcon>
                      <Title order={5}>General</Title>
                    </Group>
                    <Group>
                      <ThemeIcon
                        variant="filled"
                        color={categories["phobic"] ? "green" : "red"}
                      >
                        <IconSpider />
                      </ThemeIcon>
                      <Title order={5}>Phobic</Title>
                    </Group>
                    <Group>
                      <ThemeIcon
                        variant="filled"
                        color={categories["graphic"] ? "green" : "red"}
                      >
                        <IconTank />
                      </ThemeIcon>
                      <Title order={5}>Graphic</Title>
                    </Group>
                    <Group>
                      <ThemeIcon
                        variant="filled"
                        color={categories["sexual"] ? "green" : "red"}
                      >
                        <IconSausage />
                      </ThemeIcon>
                      <Title order={5}>Sexual</Title>
                    </Group>
                    <Group>
                      <ThemeIcon
                        variant="filled"
                        color={categories["offensive"] ? "green" : "red"}
                      >
                        <IconMoodCry />
                      </ThemeIcon>
                      <Title order={5}>Offensive</Title>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
              <Card withBorder>
                <Stack>
                  <Title order={3}>QR Code</Title>
                  <Button
                    onClick={() => {
                      dispatch(setQrModalOpen(true));
                    }}
                  />

                  <Stack>
                    <Divider />
                  </Stack>
                </Stack>
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
