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

import {
  getSelectedAdultCategories,
  getShowAdultContent,
  setGroupQuestionCategories,
} from "../../features/group/groupSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

function Register() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Status of which content categories are selected
  const selectedAdultContent = useAppSelector(getSelectedAdultCategories);

  // Status of whether to show adult content
  const showAdultContent = useAppSelector(getShowAdultContent);

  return (
    <Container>
      <Center style={{ width: "100%" }}>
        <Card mx={"xl"} withBorder>
          <Stack align={"center"}>
            <Title order={3}>New Survey</Title>
            <TextInput label="Group Name" placeholder="Enter your group name" />

            {/* Content toggles */}
            <Stack>
              <Text>
                If a player indicates that they uncomfortable with included
                content it should not be used in games
              </Text>
              <Switch
                checked={showAdultContent || false}
                onChange={(checked) => {
                  console.log("Adult Content", checked.target.checked);
                  dispatch(
                    setGroupQuestionCategories({
                      category: "graphic",
                      value: checked.target.checked,
                    })
                  );
                }}
                value="graphic"
                label="Include Graphic Content Questions"
              />
              <Text>Select topics to include in your survey</Text>
              <Divider />
              <Title order={3}>Graphic Content</Title>
              <Text size={"xs"} italic>
                Graphic content questions address depictions of extreme
                violence, bodily damage sustained in combat or by torture,
                themes of self harm, violence against animals, child
                exploitation, cannibalism, and virulent diseases.
              </Text>
              <Switch
                checked={selectedAdultContent.graphic_content}
                onChange={(checked) => {
                  console.log("Graphic Content", checked.target.checked);
                  dispatch(
                    setGroupQuestionCategories({
                      category: "graphic",
                      value: checked.target.checked,
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
                checked={selectedAdultContent.sexual_content}
                onChange={(checked) => {
                  console.log("Sexual Content", checked.target.checked);
                  dispatch(
                    setGroupQuestionCategories({
                      category: "sexual",
                      value: checked.target.checked,
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
                checked={selectedAdultContent.offensive_content}
                onChange={(checked) => {
                  console.log("Offensive Content", checked.target.checked);
                  dispatch(
                    setGroupQuestionCategories({
                      category: "offensive",
                      value: checked.target.checked,
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
                checked={selectedAdultContent.phobic_content}
                onChange={(checked) => {
                  console.log("Phobic Content", checked.target.checked);
                  dispatch(
                    setGroupQuestionCategories({
                      category: "phobic",
                      value: checked.target.checked,
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
