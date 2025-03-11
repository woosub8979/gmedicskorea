// PlanProgress.jsx
import { Box, LinearProgress, Typography } from "@mui/material";

function PlanProgress({ plans }) {
  const total = plans.length;
  const completed = plans.filter((plan) => plan.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">
        계획 이행률: {progress}% ({completed}/{total})
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default PlanProgress;
