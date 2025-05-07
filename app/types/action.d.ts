// interface CreateQuestionParams {
//     title: string;
//     content: string;
//     tags: string[];
//   }
  
//   interface EditQuestionParams extends CreateQuestionParams {
//     questionId: string;
//   }
  
//   interface GetQuestionParams {
//     questionId: string;
//   }
  
//   interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
//     tagId: string;
//   }


  interface GetProjectParams {
    projectId: string;
  }
  
  interface GetProjectParams extends Omit<PaginatedSearchParams, "filter"> {
    projectId: string;
  }
