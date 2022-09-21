// Types
import { Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { QuestionType } from "../../types";

// Import question subtypes
import SelectQuestion from "./subtypes/SelectQuestion";
import ToggleQuestion from "./subtypes/ToggleQuestion";

function Question({ question }: { question: QuestionType }) {
  // Detect if the screen is small
  const mobileView = useMediaQuery("(max-width: 1200px)");

  // Render the correct type of question
  let content = null;
  switch (question.type) {
    case "select":
      content = <SelectQuestion question={question} mobileView={mobileView} />;
      break;
    case "toggle":
      content = <ToggleQuestion question={question} mobileView={mobileView} />;
      break;
    case "custom_response":
      content = <div>Custom Question Type</div>;
      break;
    default:
      content = <Text>Unspecified question type id:{question.id} </Text>;
  }
  return content;
}

export default Question;
