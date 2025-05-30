
import { ROUTES } from "@/constants/routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};



export const EMPTY_PROJECTS = {
  title: "No Projects Found",
  message:
    "The project board is empty. Make it rain with your brilliant project.",
  button: {
    text: "Create Project",
    href: ROUTES.HOME,
  },
};

export const EMPTY_TOOLS = {
  title: "No Tools Found",
  message:
    "The tool board is empty. Make it rain with your brilliant tool.",
};
export const EMPTY_CONVERSATIONS = {
  title: "No Conversations Found",
  message:
    "No Conversations Found",
};

export const EMPTY_CONVERSATION = {
  title: "No Conversation Found",
  message:
    "No Conversation Found",
};

