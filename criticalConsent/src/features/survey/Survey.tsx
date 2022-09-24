import { useEffect } from "react";

// Mantine Components
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
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
  fetchGroupByIdAsync,
  getGroupId,
  getGroupIdValid,
  getGroupStatus,
} from "../group/groupSlice";
import { setQuestionGroupId } from "./surveySlice";

// Features
import QuestionList from "./questions/QuestionList";

export default function Survey() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Get the group ID from the URL
  const { group_url_id } = useParams();

  // Select the group from the group store
  const group_id = useAppSelector(getGroupId);

  // Select if the group_id is unknown
  const group_id_valid = useAppSelector(getGroupIdValid);

  // Use Navigate
  const navigate = useNavigate();

  // Get group loading status
  const groupStatus = useAppSelector(getGroupStatus);

  let content = null;

  // Check if a group id is in the url, if it is, check if it is valid and add to store
  useEffect(() => {
    if (groupStatus === "idle" && group_url_id) {
      dispatch(fetchGroupByIdAsync(group_url_id));
    }
  }, [groupStatus, dispatch, group_url_id]);

  // If the group id is valid, add it to the question store
  // HACK: this is a hack to get the group id into the question store
  useEffect(() => {
    if (groupStatus === "succeeded" && group_id) {
      dispatch(setQuestionGroupId(group_id));
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
      <Center style={{ width: "100%", height: "60vh" }}>
        <Stack>
          <Card withBorder>
            <Stack align={"center"}>
              <Title order={3}>Survey Code</Title>

              <TextInput placeholder="dog-expressive-house" />
              {/* TODO: Add value to text area */}
              <Button component={Link} to={`/survey/${"thing"}`}>
                Begin Survey
              </Button>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack align={"center"}>
              <Title order={3}> New group survey</Title>
              <Button component={Link} to="/register">
                Create new survey
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
      content = <QuestionList />;
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

  // if (group_url_id === undefined || null) {
  //   // If the group_url_id is undefined, show a message
  //   content = (

  //   );
  // } else {
  //   // Check the group ID against the database and retrieve the group preferences
  //   useEffect(() => {
  //     if (group_url_id) {
  //       dispatch(fetchGroupByIdAsync(group_url_id)).then(() => {
  //         // Check if the group ID is valid

  //         if (group_id_valid) {

  //           // If the group ID is valid, set the group ID in the survey store
  //           dispatch(setQuestionGroupId(group_url_id));
  //         } else {
  //           // If the group ID is not valid, redirect to the survey page
  //         }
  //       });
  //     }
  //   }, [dispatch, group_url_id]);

  //   // If the group ID is unknown, show a warning and a link to enter a new survey code

  //   content = (
  //     <>
  //       {`${group_id_valid}`}
  //       <QuestionList />
  //     </>
  //   );
  // }

  return content;
}
