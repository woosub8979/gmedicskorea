// PlanForm.jsx
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

function PlanForm({ onAddPlan, onSavePlan }) {
  const [planText, setPlanText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (planText.trim()) {
      onAddPlan({ text: planText, completed: false });
      setPlanText("");
      // 계획이 입력될 때마다 자동 저장 API 호출 (옵션)
      if(onSavePlan) onSavePlan({ text: planText, completed: false });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">오늘의 계획 작성</Typography>
      <TextField
        label="계획 내용"
        value={planText}
        onChange={(e) => setPlanText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        계획 추가
      </Button>
    </Box>
  );
}

export default PlanForm;
