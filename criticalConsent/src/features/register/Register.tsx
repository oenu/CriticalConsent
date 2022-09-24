import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Divider,
  List,
  Loader,
  Modal,
  Overlay,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  selectMatureContent,
  selectContentCategories,
  selectGroupName,
  selectGroupPassword,
  setCategories,
  setGroupName,
  setGroupNameWarning,
  setGroupPassword,
  setPasswordProtected,
  setPasswordWarning,
  setMatureContent,
  selectDisclaimers,
  setDisclaimerModalShown,
  setDisclaimersAccepted,
  uploadRegistrationAsync,
  selectUploadContentValid,
  selectUploadStatus,
  validateRegistration,
  clearRegistration,
} from "./registerSlice";

function Register() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Whether the app is being viewed on a mobile device
  const mobileView = useMediaQuery("(max-width: 600px)");

  // ---- Input Fields ----
  // Status of group name
  const { group_name, group_name_warning } = useAppSelector(selectGroupName);

  // Status of which content categories are selected
  const { graphic_content, sexual_content, phobic_content, offensive_content } =
    useAppSelector(selectContentCategories);

  // Status of whether to show mature content
  const showMatureContent = useAppSelector(selectMatureContent);

  // Status of the group password
  const { password_protected, password, password_warning } =
    useAppSelector(selectGroupPassword);

  // Status of content disclaimers
  const { disclaimer_modal, disclaimer_warning, disclaimers_accepted } =
    useAppSelector(selectDisclaimers);

  // ---- Upload Logic ----
  // If the content has been formatted and validated
  const contentValidated = useAppSelector(selectUploadContentValid);
  // If the content is valid, upload it to the server
  useEffect(() => {
    if (contentValidated) {
      dispatch(uploadRegistrationAsync());
    }
  }, [contentValidated, dispatch]);

  // Status of the upload process
  const uploadStatus = useAppSelector(selectUploadStatus);

  // ---- Content ----
  // Modal for content disclaimers
  const disclaimerModal = (
    <Modal
      title={<Title order={1}>Code of Conduct</Title>}
      size="md"
      fullScreen={mobileView}
      trapFocus
      centered
      overlayOpacity={0.9}
      overlayBlur={5}
      withCloseButton={mobileView}
      opened={disclaimer_modal}
      onClose={() => {
        dispatch(setDisclaimerModalShown(false));
      }}
    >
      <Stack>
        <Divider />
        <Title order={4}>
          Before creating a survey you must agree to the following:
        </Title>

        <Stack>
          <Alert>
            Players are not bound to their responses. They have the right to
            change what they consent to at any time without having to explain
            why.
          </Alert>
          <Alert>
            If you are in any doubt about whether content is appropriate,
            regardless of player responses to this survey, you must talk with
            your players about it before continuing.
          </Alert>

          <Alert>
            If a player ignores the boundaries set by the group, you must
            intervene and talk with them about it. If they continue to ignore
            the boundaries, you must remove them from the group.
          </Alert>
          <Alert color={"yellow"}>
            These are still in beta, this is not representative of the final
            code of conduct
          </Alert>
        </Stack>
        <Center>
          <Switch
            data-autofocus
            checked={disclaimers_accepted}
            onChange={(e) => {
              console.log("Disclaimer Toggle", e.target.checked);
              dispatch(setDisclaimersAccepted(e.target.checked));
            }}
            value="graphic"
            label="I agree to the Critical Consent Code of Conduct"
          />
        </Center>
        <Button
          disabled={!disclaimers_accepted}
          onClick={() => {
            dispatch(validateRegistration());
          }}
        >
          Create Survey
        </Button>
      </Stack>
    </Modal>
  );

  let content = null;

  switch (uploadStatus) {
    case "idle":
      content = (
        <>
          {disclaimerModal}
          <Card withBorder style={{ width: "100%" }} mb={"md"}>
            <Stack>
              <Title order={2}>Group Information</Title>
              <Divider />
              <TextInput
                label="Group Name"
                placeholder="Consent Champions"
                withAsterisk
                required
                onBlur={(e) => {
                  dispatch(setGroupName(e.currentTarget.value));
                  if (e.currentTarget.value === "") {
                    dispatch(setGroupNameWarning(true));
                  } else {
                    dispatch(setGroupNameWarning(false));
                  }
                }}
                error={group_name_warning ? "Please enter a name" : ""}
              />
              <TextInput
                label="Group Passcode"
                placeholder="password123"
                disabled={!password_protected}
                withAsterisk={password_protected}
                required={password_protected}
                onBlur={(e) => {
                  dispatch(setGroupPassword(e.currentTarget.value));
                  if (password_protected && e.currentTarget.value === "") {
                    dispatch(setPasswordWarning(true));
                  } else {
                    dispatch(setPasswordWarning(false));
                  }
                }}
                error={password_warning ? "Please enter a passcode" : ""}
              />
              <Switch
                label="Require Passcode"
                checked={password_protected}
                onChange={(e) => {
                  dispatch(setPasswordProtected(e.currentTarget.checked));
                  if (!e.currentTarget.checked && password_warning) {
                    dispatch(setPasswordWarning(false));
                  }
                }}
              />
            </Stack>
          </Card>
          <Card withBorder style={{ width: "100%" }} my="md">
            {/* Card to explain mature content and enable it */}
            <Stack>
              <Title order={2}>Mature Content</Title>
              <Divider />
              <Text italic>
                By default, mature content is disabled for surveys. This means
                that players wont be asked whether they are comfortable with
                topics below. If you wish to include these themes in your game
                you can enable Mature Content questions for each category, but
                be aware that this may make your surveys less accessible to some
                players.
              </Text>
              <Alert title="Remember" color={"orange"}>
                You must respect your player's responses. Anything excluded by a
                player must be excluded from the game.
              </Alert>
              <Switch
                checked={showMatureContent || false}
                onChange={(e) => {
                  console.log("Mature Content", e.target.checked);
                  dispatch(setMatureContent(e.target.checked));
                }}
                value="mature"
                label="Enable Mature Content Questions"
              />
            </Stack>
          </Card>
          <Card withBorder my="md">
            {/* Disable section if mature content is not allowed */}
            {showMatureContent ? null : <Overlay zIndex={5} />}
            <Stack>
              {/* Content toggles */}
              <Stack>
                <Title order={3}>Graphic Content</Title>
                <Text size={"xs"} italic>
                  Graphic content questions address depictions of extreme
                  violence, bodily damage sustained in combat or by torture,
                  themes of self harm, violence against animals, child
                  exploitation, cannibalism, and virulent diseases.
                </Text>
                <Switch
                  checked={graphic_content}
                  onChange={(e) => {
                    console.log("Graphic Content", e.target.checked);
                    dispatch(
                      setCategories({
                        category: "graphic",
                        value: e.target.checked,
                      })
                    );
                  }}
                  value="graphic"
                  label="Include Graphic Content Questions"
                />
                <Divider />
                <Title order={3}>Sexual Content</Title>
                <Text size={"xs"} italic>
                  Sexual content questions address depictions of sexual
                  intercourse, nudity, prostitution/sex work, sexualized
                  descriptions of characters, and descriptions of sexual
                  assault.
                </Text>

                <Switch
                  checked={sexual_content}
                  onChange={(e) => {
                    console.log("Sexual Content", e.target.checked);
                    dispatch(
                      setCategories({
                        category: "sexual",
                        value: e.target.checked,
                      })
                    );
                  }}
                  value="sexual"
                  label="Include Sexual Content Questions"
                />
                <Divider />
                <Title order={3}>Potentially Offensive Content</Title>
                <Text size={"xs"} italic>
                  Potentially Offensive content questions address depictions of
                  racism, homophobia, transphobia, misogyny, extreme poverty,
                  slavery. The questions offer distinctions between wider themes
                  in a fantasy world and content directed at/from players.
                </Text>
                <Switch
                  checked={offensive_content}
                  onChange={(e) => {
                    console.log("Offensive Content", e.target.checked);
                    dispatch(
                      setCategories({
                        category: "offensive",
                        value: e.target.checked,
                      })
                    );
                  }}
                  value="offensive"
                  label="Include Potentially Offensive Content Questions"
                />

                <Divider />
                <Title order={3}>Common Phobic Content</Title>
                <Text size={"xs"} italic>
                  Common Phobic Content questions address depictions of spiders,
                  snakes, heights, and other common phobias.
                </Text>

                <Switch
                  checked={phobic_content}
                  onChange={(e) => {
                    console.log("Phobic Content", e.target.checked);
                    dispatch(
                      setCategories({
                        category: "phobic",
                        value: e.target.checked,
                      })
                    );
                  }}
                  value="phobic"
                  label="Include Common Phobic Content Questions"
                />
              </Stack>
            </Stack>
          </Card>
          <Center>
            <Button
              disabled={
                group_name_warning ||
                password_warning ||
                !group_name ||
                (password_protected && !password)
              }
              onClick={() => {
                dispatch(setDisclaimerModalShown(true));
                dispatch(setDisclaimersAccepted(false));
              }}
            >
              Create Survey
            </Button>
          </Center>
        </>
      );
      break;
    case "loading":
      return (
        <Center>
          <Loader />
        </Center>
      );
      break;
    case "failed":
      return (
        <Center>
          <Text>There was an error creating your survey.</Text>
          <Button onClick={() => dispatch(clearRegistration())}>
            Try Again
          </Button>
        </Center>
      );
      break;
    case "success":
      return (
        <Center>
          <Alert>Survey Created!</Alert>
        </Center>
      );
      break;
    default:
      return (
        <Center>
          <Alert>There was an error creating your survey.</Alert>
          <Button onClick={() => dispatch(clearRegistration())}>
            Try Again
          </Button>
        </Center>
      );
  }
  return content;
}

export default Register;
