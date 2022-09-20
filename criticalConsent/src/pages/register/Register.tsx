import { Container, Center, Card, Stack, Button, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

function Register() {
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

export default Register;
