// PlanList.jsx
import { Box, Button, Checkbox, Typography, Paper } from "@mui/material";

function PlanList({ plans, onToggleComplete, onDeletePlan }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">작성된 계획</Typography>
      {plans.length === 0 ? (
        <Typography>아직 작성된 계획이 없습니다.</Typography>
      ) : (
        plans.map((plan, i) => (
          <Paper key={i} sx={{ p: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={plan.completed}
                onChange={() => onToggleComplete(i)}
              />
              <Typography
                variant="body1"
                sx={{ textDecoration: plan.completed ? "line-through" : "none" }}
              >
                {plan.text}
              </Typography>
              <Button onClick={() => onDeletePlan(i)} sx={{ ml: "auto" }}>
                삭제
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default PlanList;
