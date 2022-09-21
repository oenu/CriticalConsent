import {
  Container,
  Center,
  Card,
  Stack,
  Text,
  TextInput,
  Switch,
  Button,
  Title,
  Checkbox,
  Box,
  Paper,
  Divider,
  Alert,
} from "@mantine/core";
import React from "react";
import {
  selectAcceptAdultDisclaimer,
  selectShowAdultContent,
} from "../../features/app/appSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

function Register() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Status of whether adult content is allowed
  const allowAdultContent = useAppSelector(selectShowAdultContent);

  // Status of whether the user has accepted the adult content disclaimer
  const acceptAdultDisclaimer = useAppSelector(selectAcceptAdultDisclaimer);

  return (
    <Container>
      <Center style={{ width: "100%" }}>
        <Card mx={"xl"} withBorder>
          <Stack align={"center"}>
            <Title order={3}>Create Survey</Title>
            <Text align={"center"}>
              This survey will offer multiple versions of common DND scenarios
              at different levels of intensity. Players are able to anonymously
              select the level of intensity they are comfortable with which will
              be combined to provide a inclusive experience for all players.
            </Text>

            <TextInput
              placeholder="Bold Adventurers"
              label="Group Name"
              required
            />

            <Text align={"center"}>
              Oneshots and Adventurers League are meant to be played as fun and
              casual events. Adult themes are not appropriate for these settings
              and as such should not be used. If you are using this tool for a
              home game you may want to include the option for players to opt in
              to adult content.
            </Text>
            <Text>Include Adult Content?</Text>
            <Switch label="Show adult content" radius="sm" size="sm" />
            <Alert p="md" color={"red"} variant={"outline"}>
              <Text weight={700} align={"center"}>
                If you offer this option and a player opts in, you are
                responsible for ensuring that the content is appropriate for the
                player. If a player later chooses to opt out, you are
                responsible for ensuring that the content is removed.
              </Text>
              <Center>
                <Checkbox
                  mt={"lg"}
                  label="I understand and agree"
                  radius="sm"
                  size="sm"
                />
              </Center>
            </Alert>
            <Button>Create Survey</Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}

export default Register;
