interface APIResponse {
  status: "success" | "fail";
  code?: string;
  message: string;
  data?: {
    llm_feedback?: string;
    compile_output?: string
  };
}

export type { APIResponse };
