TODO: Approve User API mapping (temporary hardcode)

- Endpoint: `POST /auth/approveUser`
- Payload example:

```json
{
  "user_id": 0,
  "role_id": 6,
  "role_code": "AGENT"
}
```

- Current status: Hardcoded `role_id` = 6 and `role_code` = "AGENT".
- Where used: `src/features/role-manager/pages/Agentdetailpage.tsx` uses `useApproveUserMutation`.
- Next: Replace hardcoded mapping with master-data-driven mapping from roles service.
