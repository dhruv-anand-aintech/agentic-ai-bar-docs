import {
  addToolApprovalRequest,
  consumeApprovedTool,
  createToolApprovalState,
  decideToolApproval,
} from "@ainorthstar/agentic-ai-bar/tool-runtime";

export function authorizeFictionalUpdate() {
  let state = createToolApprovalState();
  const requested = addToolApprovalRequest(state, {
    approvalId: "approval-demo-continuation",
    toolCallId: "call-demo-continuation",
    toolName: "update-record",
    input: { recordId: "record-demo-12", status: "reviewed" },
    summary: "Mark one fictional record as reviewed",
    risk: "medium",
    createdAt: "2030-01-01T10:00:00.000Z",
  });
  state = requested.state;

  state = decideToolApproval(state, {
    approvalId: requested.part.approvalId,
    decision: "approved",
    decidedAt: "2030-01-01T10:01:00.000Z",
  }).state;

  const consumed = consumeApprovedTool(
    state,
    requested.part.approvalId,
    requested.part.toolName,
    requested.part.input,
    "2030-01-01T10:01:01.000Z",
  );

  return consumed.authorization;
}
