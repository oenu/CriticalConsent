import { useEffect } from "react";

// Mantine Components
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

// React Router
import { Link, useNavigate, useParams } from "react-router-dom";

// Redux
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  clearGroup,
  fetchGroupAsync,
  selectGroupId,
  selectGroupStatus,
} from "../group/groupSlice";
import {
  clearSurvey,
  selectWordCode,
  setQuestionGroupId,
  setWordCode,
} from "./surveySlice";

// Features
import QuestionList from "./questions/QuestionList";

export default function Survey() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Get the group ID from the URL
  const { group_url_id } = useParams();

  // Select the group from the group store
  const group_id = useAppSelector(selectGroupId);

  // Use Navigate
  const navigate = useNavigate();

  // Get group loading status
  const groupStatus = useAppSelector(selectGroupStatus);

  // Get word code
  const word_code = useAppSelector(selectWordCode);

  let content = null;

  // Check if a group id is in the url, if it is, check if it is valid and add to store
  useEffect(() => {
    if (groupStatus === "idle" && group_url_id) {
      dispatch(fetchGroupAsync({ group_id: group_url_id }));
    }
  }, [groupStatus, dispatch, group_url_id]);

  // If the group id is valid, add it to the question store
  // HACK: this is a hack to get the group id into the question store
  useEffect(() => {
    if (groupStatus === "succeeded" && group_id) {
      dispatch(setQuestionGroupId(group_id));
      navigate(`/survey/${group_id}`);
    }
  }, [groupStatus, dispatch, group_id]);

  // // If the group id is invalid redirect to survey page
  useEffect(() => {
    if (groupStatus === "not_found") {
      navigate("/survey");
    }
  }, [groupStatus, navigate]);

  // Components to show if the group is not specified or is invalid
  const survey_prompt = (
    <Container>
      {groupStatus === "not_found" ? (
        <Alert title={"Unknown Group Link"} color="orange">
          Detected an unknown survey code. Please enter a valid survey code or
          create a new survey.
        </Alert>
      ) : null}
      {groupStatus === "failed" ? (
        <Alert title={"Something went wrong"} color="orange">
          Something went wrong. Please try again.
        </Alert>
      ) : null}
      <Center style={{ width: "100%", height: "60vh" }}>
        <Stack>
          <Card withBorder>
            <Stack align={"center"}>
              <Title order={3}>Survey Code</Title>
              <TextInput
                placeholder="dog-expressive-house"
                onBlur={(e) => {
                  dispatch(setWordCode(e.target.value));
                }}
              />
              {/* TODO: Add value to text area */}
              <Button
                onClick={() => {
                  if (word_code) {
                    dispatch(fetchGroupAsync({ word_code }));
                  }
                }}
              >
                Begin Survey
              </Button>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack align={"center"}>
              <Title order={3}>New Survey</Title>
              <Button component={Link} to="/register">
                Create New Survey
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Center>
    </Container>
  );

  switch (groupStatus) {
    case "loading":
      content = (
        <Center>
          <Text>Loading...</Text>
        </Center>
      );
      break;
    case "succeeded":
      content = (
        <Box mt={"md"}>
          <QuestionList />
        </Box>
      );
      break;
    case "failed":
      content = (
        <Center>
          <Text>Failed to load group</Text>
        </Center>
      );
      break;
    case "not_found":
      content = survey_prompt;
      break;
    default:
      content = survey_prompt;
  }

  return content;
}
