import { useEffect, useState } from "react";

// Mantine Components
import {
  Button,
  Card,
  Center,
  Container,
  Space,
  Stack,
  Text,
} from "@mantine/core";

// React Router
import { Link, useParams } from "react-router-dom";

// Features
import QuestionList from "../../features/question/QuestionList";

export default function Survey() {
  const { group_id } = useParams();

  console.debug("group_id", group_id);

  if (group_id === undefined) {
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
  } else {
    return <QuestionList />;
  }
}
