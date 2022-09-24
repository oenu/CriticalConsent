// Components
import { Alert, Button, Center, Divider, Stack, Title } from "@mantine/core";
import Question from "./Question";

// Redux
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchQuestionsAsync,
  getHighlightUnanswered,
  getQuestionsStatus,
  selectAllQuestions,
  uploadResponse,
} from "../surveySlice";

// Types
import { useEffect } from "react";
import { QuestionType } from "../../../types";
import { getGroupCategories, getGroupName } from "../../group/groupSlice";

function QuestionList() {
  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Status of the retrieval of questions from the Database
  const questionsStatus = useAppSelector(getQuestionsStatus);

  // List of questions from the Database
  const questions = useAppSelector(selectAllQuestions);

  // Whether to highlight unanswered questions and show a warning
  const highlightUnanswered = useAppSelector(getHighlightUnanswered);

  // Group name of the current survey
  const group_name = useAppSelector(getGroupName);

  // A list of questions in array form
  const questionList = Object.values(questions);

  // Array of strings corresponding to the categories the group wants to see
  const groupCategories = useAppSelector(getGroupCategories);

  // Warning Message if not all questions are answered
  const warningMessage = (
    <Alert title="Oops!" color="red" hidden={!highlightUnanswered}>
      Looks like you haven't answered all the questions yet. Please answer all
      of them before continuing.
    </Alert>
  );

  useEffect(() => {
    if (questionsStatus === "idle") {
      dispatch(fetchQuestionsAsync());
    }
  }, [questionsStatus, dispatch]);

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
        // Break down the list of questions into groups based on the question category
        const categorizedQuestions = questionList.reduce(
          (groups: any, question) => {
            const category = question?.category;

            if (category === undefined) {
              return groups;
            }

            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(question);
            return groups;
          },
          {}
        );

        content = (
          <Stack style={{ minWidth: "80vw" }}>
            <Title>{group_name}</Title>
            {categorizedQuestions["general"].map((question: QuestionType) => {
              if (question !== null) {
                return <Question key={question.id} question={question} />;
              }
            })}

            {/* For each sub category, show the category name and the list of questions */}
            {Object.keys(categorizedQuestions).map((category) => {
              // Ignore the general category from the list of sub categories
              console.debug("category", category);
              if (category !== "general") {
                if (categorizedQuestions[category].length > 0) {
                  console.debug(
                    "categorizedQuestions",
                    categorizedQuestions[category]
                  );

                  console.debug(Object.keys(groupCategories));
                  if (Object.keys(groupCategories).includes(category)) {
                    return (
                      <div key={category}>
                        <Divider mt={"xs"} mb={"md"} />
                        <Title mb={"sm"} transform="capitalize">
                          {category}
                        </Title>
                        {categorizedQuestions[category].map(
                          (question: QuestionType) => {
                            if (question !== null) {
                              return (
                                <Question
                                  key={question.id}
                                  question={question}
                                />
                              );
                            }
                          }
                        )}
                      </div>
                    );
                  }
                }
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
