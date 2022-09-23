import {
  Button,
  Card,
  Center,
  Container,
  Divider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  selectAdultContent,
  selectContentCategories,
  selectGroupName,
  selectGroupPassword,
  setCategories,
  setGroupName,
  setGroupNameWarning,
  setGroupPassword,
  setPasswordProtected,
  setPasswordWarning,
} from "./registerSlice";

function Register() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Status of group name
  const { group_name, group_name_warning } = useAppSelector(selectGroupName);

  // Status of which content categories are selected
  const { graphic_content, sexual_content, phobic_content, offensive_content } =
    useAppSelector(selectContentCategories);

  // Status of whether to show adult content
  const showAdultContent = useAppSelector(selectAdultContent);

  // Status of the group password
  const { password_protected, password, password_warning } =
    useAppSelector(selectGroupPassword);

  return (
    <Container>
      <Center style={{ width: "100%" }}>
        <Card withBorder>
          <Stack>
            <Title order={2}>Group Information</Title>
            <TextInput
              label="Group Name"
              placeholder="Consent Champions"
              withAsterisk
              required
              defaultValue={group_name || ""}
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
            <>
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
            </>

            {/* Content toggles */}
            <Stack>
              {/* <Text>
                If a player indicates that they uncomfortable with included
                content it should not be used in games
              </Text> */}
              <Divider />
              <Title order={2}>Mature Content</Title>
              <Switch
                checked={showAdultContent || false}
                onChange={(e) => {
                  console.log("Adult Content", e.target.checked);
                  dispatch(
                    setCategories({
                      category: "graphic",
                      value: e.target.checked,
                    })
                  );
                }}
                value="adult"
                label="Enable Adult Content Questions"
              />
              {/* <Text>Select topics to include in your survey</Text> */}
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
                descriptions of characters, and descriptions of sexual assault.
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

              <Divider />
            </Stack>
            <Button>Create Survey</Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}

export default Register;
