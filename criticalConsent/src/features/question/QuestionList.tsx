// Components
import Question from "./Question";
import { Center, Container, Stack } from "@mantine/core";

// Types
import { QuestionType } from "../../types";

// Redux
import { selectAllQuestions, getQuestionsStatus } from "./questionSlice";
import { useAppSelector } from "../../redux/hooks";

function QuestionList() {
  const questions = useAppSelector(selectAllQuestions);
  const questionsStatus = useAppSelector(getQuestionsStatus);

  const questionList = Object.values(questions);

  let content: JSX.Element[] | JSX.Element | null = null;
  if (questionsStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (questionsStatus === "succeeded") {
    if (questions === null) {
      content = <div>No questions found</div>;
    } else {
      content = (
        <Stack style={{ minWidth: "80vw" }}>
          {questionList.map((question) => {
            if (question !== null) {
              return <Question key={question.id} question={question} />;
            }
          })}
        </Stack>
      );
    }
  } else if (questionsStatus === "failed") {
    content = (
      <div data-testid="errorMessage">
        Something went wrong, please contact me on{" "}
        <a href="https://twitter.com/_a_nb">twitter</a> or try again later.
      </div>
    );
  } else {
    content = <div>No Question Status Provided</div>;
  }

  return <Center>{content}</Center>;
}

export default QuestionList;
