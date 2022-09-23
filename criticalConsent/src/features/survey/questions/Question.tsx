// Types
import { Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { QuestionType } from "../../../types";

// Import question subtypes
import Select from "./question_types/Select";
import Toggle from "./question_types/Toggle";
import CustomResponse from "./question_types/CustomResponse";

function Question({ question }: { question: QuestionType }) {
  // Detect if the screen is small
  const mobileView = useMediaQuery("(max-width: 1200px)");

  // Render the correct type of question
  let content = null;
  switch (question.type) {
    case "select":
      content = <Select question={question} mobileView={mobileView} />;
      break;
    case "toggle":
      content = <Toggle question={question} mobileView={mobileView} />;
      break;
    case "custom_response":
      content = <CustomResponse question={question} mobileView={mobileView} />;

      break;
    default:
      content = <Text>Unspecified question type id:{question.id} </Text>;
  }
  return content;
}

export default Question;
