import { useEffect } from "react";

// Mantine Components
import { Button, Card, Center, Container, Stack, Text } from "@mantine/core";

// React Router
import { Link, useParams } from "react-router-dom";

// Redux
import { useAppDispatch } from "../../redux/hooks";
import { fetchGroupByIdAsync } from "../group/groupSlice";
import { setQuestionGroupId } from "./surveySlice";

// Features
import QuestionList from "./questions/QuestionList";

export default function Survey() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Get the group ID from the URL
  const { group_id } = useParams();
  console.debug("group_id", group_id);

  if (group_id !== undefined) {
    // Check the group ID against the database and retrieve the group preferences
    useEffect(() => {
      dispatch(fetchGroupByIdAsync(parseInt(group_id))).then((res) => {
        //HACK: This is a hack to get the group ID to update
        dispatch(setQuestionGroupId(parseInt(group_id)));
      });
    }, [dispatch, group_id]);
    return <QuestionList />;
  } else {
    return (
      <Container>
        <Center style={{ width: "100%", height: "60vh" }}>
          <Card>
            <Stack align={"center"}>
              <Text>No Survey found</Text>
              <Button component={Link} to="/register">
                Create new survey
              </Button>
            </Stack>
          </Card>
        </Center>
      </Container>
    );
  }
}
