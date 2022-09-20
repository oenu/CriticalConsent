// Components
import Question from "./Question";
import { Alert, Button, Center, Container, Stack } from "@mantine/core";

// Redux
import {
  selectAllQuestions,
  getQuestionsStatus,
  uploadResponse,
  getHighlightUnanswered,
} from "./questionSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

function QuestionList() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Status of the retrieval of questions from the Database
  const questionsStatus = useAppSelector(getQuestionsStatus);

  // List of questions from the Database
  const questions = useAppSelector(selectAllQuestions);

  // Whether to highlight unanswered questions and show a warning
  const highlightUnanswered = useAppSelector(getHighlightUnanswered);

  // A list of questions in array form
  const questionList = Object.values(questions);

  // Warning Message if not all questions are answered
  const warningMessage = (
    <Alert title="Oops!" color="red" hidden={!highlightUnanswered}>
      Looks like you haven't answered all the questions yet. Please answer all
      of them before continuing.
    </Alert>
  );

  // Type definition for the question list content
  let content: JSX.Element[] | JSX.Element | null = null;

  switch (questionsStatus) {
    // If the questions are loading, show a loading message
    case "loading":
      content = <div>Loading...</div>;
      break;

    // If there are no questions, show a message
    case "succeeded":
      if (questionList.length === 0) {
        content = <div>There are no questions to show.</div>;
      } else {
        // If there are questions, show them
        content = (
          <Stack style={{ minWidth: "80vw" }}>
            {questionList.map((question) => {
              if (question !== null) {
                return <Question key={question.id} question={question} />;
              }
            })}
            <Center>{warningMessage}</Center>
            {/* Submit Button */}
            <Center>
              <Button
                onClick={() => {
                  dispatch(uploadResponse());
                }}
                type="submit"
              >
                Submit
              </Button>
            </Center>
          </Stack>
        );
      }
      break;

    // If there is an error, show a message
    case "failed":
      content = (
        <div data-testid="errorMessage">
          Something went wrong, please contact me on{" "}
          <a href="https://twitter.com/_a_nb">twitter</a> or try again later.
        </div>
      );
      break;

    // If something else happens, show a message
    default:
      content = (
        <div>Something went wrong in a way that wasn't planned for</div>
      );
  }

  return <Center>{content}</Center>;
}

export default QuestionList;
