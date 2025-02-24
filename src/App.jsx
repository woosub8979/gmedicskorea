// App.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";

/** 한국 시간(로컬 타임존) 기준 날짜 문자열 (YYYY-MM-DD) 반환 함수 */
function formatDateLocal(date) {
  const offset = date.getTimezoneOffset() * 60000; // 분 -> 밀리초
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().split("T")[0];
}

/** 커스텀 훅: 구글 스프레드시트 데이터를 가져옴 */
function useGoogleSheetData(sheetId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const jsonString = text.substring(
          text.indexOf("{"),
          text.lastIndexOf("}") + 1
        );
        const json = JSON.parse(jsonString);
        const rows = json.table.rows.map((row) =>
          row.c.map((cell) => (cell ? cell.v : ""))
        );
        setData(rows);
      })
      .catch((err) => console.error("구글 시트 데이터 가져오기 오류:", err));
  }, [sheetId]);

  return data;
}

/** 1) 로그인 컴포넌트 (ID와 패스워드 기반 로그인) */
function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 하드코딩된 사용자 정보
  const users = [
    { id: "김춘석", name: "김춘석대표", role: "admin", password: "1234" },
    { id: "유기상", name: "유기상팀장", role: "sales", password: "1234" },
    { id: "이준영", name: "이준영사원", role: "sales", password: "1234" },
    { id: "김규례", name: "김규례사원", role: "sales", password: "1234" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find(
      (user) => user.id === userId && user.password === password
    );
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError("아이디 또는 패스워드가 올바르지 않습니다.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 3, mt: 8 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          로그인
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="ID"
            fullWidth
            required
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
            로그인
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

/** 2) 영업사원 입력 폼 컴포넌트 */
function SalesInputForm({ onSubmit }) {
  const SHEET_ID = "1LcIZSVl5s2RG5x4_Q1wG6_yhmVONNw-qk4esUXVTux8";
  const clientData = useGoogleSheetData(SHEET_ID);

  // 방문 시간 기본값: 현재 시각의 "HH:MM" (24시간 형식)
  const now = new Date();
  const defaultTime = now.toTimeString().slice(0, 5);

  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [meeting, setMeeting] = useState("");
  const [time, setTime] = useState(defaultTime);
  const [businessReg, setBusinessReg] = useState("");
  const [address, setAddress] = useState("");

  const handleClientChange = (e) => {
    const value = e.target.value;
    setClient(value);
    // 업체명(B열, index 1)
    const matchingRow = clientData.find((row) => row[1] === value);
    if (matchingRow) {
      setBusinessReg(matchingRow[0] || "");
      setPhone(matchingRow[3] || "");
      setAddress(matchingRow[13] || "");
    } else {
      setBusinessReg("");
      setPhone("");
      setAddress("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputData = {
      client,
      phone,
      meeting,
      time,
      businessReg,
      address,
    };
    onSubmit(inputData);
    // 폼 초기화
    setClient("");
    setPhone("");
    setMeeting("");
    setTime(defaultTime);
    setBusinessReg("");
    setAddress("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          영업 정보 입력
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="방문 업체"
            value={client}
            onChange={handleClientChange}
            placeholder="업체명을 입력하세요"
            required
            fullWidth
            margin="normal"
            inputProps={{ list: "clientList" }}
          />
          <datalist id="clientList">
            {clientData.map((row, index) => (
              <option key={index} value={row[1]} />
            ))}
          </datalist>
          <TextField
            label="사업자 번호"
            value={businessReg}
            InputProps={{ readOnly: true }}
            margin="normal"
            fullWidth
          />
          <TextField
            label="전화번호"
            value={phone}
            InputProps={{ readOnly: true }}
            margin="normal"
            fullWidth
          />
          <TextField
            label="주소"
            value={address}
            InputProps={{ readOnly: true }}
            margin="normal"
            fullWidth
          />
          <TextField
            label="미팅 내용"
            multiline
            rows={4}
            value={meeting}
            onChange={(e) => setMeeting(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="방문 시간"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            제출
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

/** 3) 영업 기록 상세 보기 (영업사원 전용, 수정 기능 포함) */
function SalesRecordDetail({ record, onBack, onUpdate }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRecord, setEditedRecord] = useState({ ...record });

  const handleChange = (field, value) => {
    setEditedRecord((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(editedRecord);
    setIsEditMode(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "방문 정보 수정" : "입력된 방문 정보"}
        </Typography>
        {isEditMode ? (
          <>
            <TextField
              label="방문 업체"
              fullWidth
              margin="normal"
              value={editedRecord.client}
              onChange={(e) => handleChange("client", e.target.value)}
            />
            <TextField
              label="사업자 번호"
              fullWidth
              margin="normal"
              value={editedRecord.businessReg}
              onChange={(e) => handleChange("businessReg", e.target.value)}
            />
            <TextField
              label="주소"
              fullWidth
              margin="normal"
              value={editedRecord.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <TextField
              label="전화번호"
              fullWidth
              margin="normal"
              value={editedRecord.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              label="미팅 내용"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={editedRecord.meeting}
              onChange={(e) => handleChange("meeting", e.target.value)}
            />
            <TextField
              label="방문 시간"
              type="time"
              fullWidth
              margin="normal"
              value={editedRecord.time || ""}
              onChange={(e) => handleChange("time", e.target.value)}
            />
            <Typography sx={{ mt: 2 }}>
              관리자 코멘트 (읽기 전용): {editedRecord.comment || "없음"}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
                저장
              </Button>
              <Button variant="outlined" onClick={() => setIsEditMode(false)}>
                취소
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography>날짜: {record.date}</Typography>
            <Typography>영업사원: {record.salesperson}</Typography>
            <Typography>방문 업체: {record.client}</Typography>
            <Typography>사업자 번호: {record.businessReg}</Typography>
            <Typography>주소: {record.address}</Typography>
            <Typography>전화번호: {record.phone}</Typography>
            <Typography>미팅 내용: {record.meeting}</Typography>
            <Typography>방문 시간: {record.time}</Typography>
            <Typography>
              관리자 코멘트: {record.comment || "없음"}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsEditMode(true)}
                sx={{ mr: 2 }}
              >
                수정
              </Button>
              <Button variant="outlined" onClick={onBack}>
                내 기록 확인
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

/** 4) 내 기록 목록 (영업사원 전용) */
function SalesRecordList({ records, currentUser, onSelectRecord, onBack }) {
  const myRecords = records.filter((r) => r.userId === currentUser.id);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        내 기록 목록
      </Typography>
      {myRecords.length === 0 ? (
        <Typography>기록이 없습니다.</Typography>
      ) : (
        myRecords.map((record) => (
          <Paper key={record.id} sx={{ p: 2, mb: 2 }} elevation={2}>
            <Typography>
              날짜: {record.date} - 업체: {record.client}
            </Typography>
            {/* 상세 보기 버튼 추가 */}
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => onSelectRecord(record)}
            >
              상세 보기
            </Button>
          </Paper>
        ))
      )}
      <Button variant="outlined" onClick={onBack}>
        뒤로가기
      </Button>
    </Container>
  );
}

/** 5) 관리자용 코멘트 입력 폼 */
function CommentForm({ record, onAddComment }) {
  const [comment, setComment] = useState(record.comment || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(record.id, comment);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="코멘트 입력"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        코멘트 저장
      </Button>
    </Box>
  );
}

/** 6) 관리자 달력 대시보드 */
function AdminCalendarDashboard({ records, onAddComment }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);

  const salespeople = [
    { id: "유기상", name: "유기상팀장" },
    { id: "이준영", name: "이준영사원" },
    { id: "김규례", name: "김규례사원" },
  ];

  const handleDateChange = (date) => {
    const formattedDate = formatDateLocal(date);
    setSelectedDate(formattedDate);
    setSelectedSalesperson(null);
  };

  const getRecordCountForUser = (userId) => {
    if (!selectedDate) return 0;
    const userRecords = records.filter(
      (r) => r.date === selectedDate && r.userId === userId
    );
    return Math.min(userRecords.length, 6);
  };

  const selectedUserRecords = records.filter(
    (r) => r.date === selectedDate && r.userId === selectedSalesperson
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        전체 영업 기록 - 달력 보기
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
        <Calendar onChange={handleDateChange} value={new Date()} />
      </Paper>
      {selectedDate && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedDate}의 영업사원 목록
          </Typography>
          {salespeople.map((sp) => {
            const count = getRecordCountForUser(sp.id);
            return (
              <Button
                key={sp.id}
                variant="outlined"
                sx={{ mr: 2, mb: 2 }}
                onClick={() => setSelectedSalesperson(sp.id)}
              >
                {sp.name} {count}/6
              </Button>
            );
          })}
        </Box>
      )}
      {selectedSalesperson && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            {salespeople.find((sp) => sp.id === selectedSalesperson)?.name} 의{" "}
            {selectedDate} 기록
          </Typography>
          {selectedUserRecords.length === 0 ? (
            <Typography sx={{ mt: 1 }}>기록이 없습니다.</Typography>
          ) : (
            selectedUserRecords.map((record) => (
              <Paper key={record.id} sx={{ p: 2, mt: 2 }} elevation={2}>
                <Typography>날짜: {record.date}</Typography>
                <Typography>영업사원: {record.salesperson}</Typography>
                <Typography>방문 업체: {record.client}</Typography>
                <Typography>사업자 번호: {record.businessReg}</Typography>
                <Typography>주소: {record.address}</Typography>
                <Typography>전화번호: {record.phone}</Typography>
                <Typography>미팅 내용: {record.meeting}</Typography>
                <Typography>방문 시간: {record.time}</Typography>
                <Typography>
                  코멘트: {record.comment || "없음"}
                </Typography>
                <CommentForm
                  record={record}
                  onAddComment={onAddComment}
                />
              </Paper>
            ))
          )}
        </Box>
      )}
    </Container>
  );
}

/** 7) 메인 앱 컴포넌트 */
function App() {
  const [step, setStep] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordIdCounter, setRecordIdCounter] = useState(1);

  useEffect(() => {
    const storedRecords = localStorage.getItem("records");
    const storedCounter = localStorage.getItem("recordIdCounter");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
    if (storedCounter) {
      setRecordIdCounter(Number(storedCounter));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("recordIdCounter", recordIdCounter.toString());
  }, [recordIdCounter]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      setStep("adminDashboard");
    } else {
      setStep("salesCalendar");
    }
  };

  // 날짜 선택: 기록이 있으면 목록, 없으면 입력 폼으로
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const userRecords = records.filter(
      (r) => r.date === date && r.userId === currentUser.id
    );
    if (userRecords.length > 0) {
      setStep("salesRecordList");
    } else {
      setStep("salesInput");
    }
  };

  // 입력 폼 제출
  const handleSalesInputSubmit = (data) => {
    const newRecord = {
      id: recordIdCounter,
      userId: currentUser.id,
      salesperson: currentUser.name,
      date: selectedDate,
      client: data.client,
      phone: data.phone,
      meeting: data.meeting,
      time: data.time,
      businessReg: data.businessReg,
      address: data.address,
      comment: "", // 관리자 코멘트
    };
    setRecords([...records, newRecord]);
    setRecordIdCounter(recordIdCounter + 1);
    setCurrentRecord(newRecord);
    setStep("salesRecordDetail");
  };

  // 기록 수정
  const handleUpdateRecord = (updatedRecord) => {
    const updatedRecords = records.map((record) =>
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setRecords(updatedRecords);
    setCurrentRecord(updatedRecord);
  };

  // 관리자 코멘트 추가
  const handleAddComment = (recordId, comment) => {
    const updatedRecords = records.map((record) =>
      record.id === recordId ? { ...record, comment } : record
    );
    setRecords(updatedRecords);
  };

  // 목록에서 "상세 보기" 버튼을 누르면 상세 페이지로 이동
  const handleSelectRecord = (record) => {
    setCurrentRecord(record);
    setStep("salesRecordDetail");
  };

  return (
    <Box sx={{ p: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h4" gutterBottom>
        영업부 관리 도구
      </Typography>

      {step === "login" && <Login onLogin={handleLogin} />}

      {step === "salesCalendar" &&
        currentUser &&
        currentUser.role === "sales" && (
          <Container maxWidth="sm" sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              캘린더 (영업사원용)
            </Typography>
            <Paper sx={{ p: 2 }} elevation={3}>
              <Calendar
                onChange={(date) => {
                  const formattedDate = formatDateLocal(date);
                  handleDateSelect(formattedDate);
                }}
                value={new Date()}
              />
            </Paper>
          </Container>
        )}

      {step === "salesInput" && currentUser?.role === "sales" && (
        <SalesInputForm onSubmit={handleSalesInputSubmit} />
      )}

      {step === "salesRecordDetail" &&
        currentUser?.role === "sales" &&
        currentRecord && (
          <SalesRecordDetail
            record={currentRecord}
            onBack={() => setStep("salesRecordList")}
            onUpdate={handleUpdateRecord}
          />
        )}

      {step === "salesRecordList" && currentUser?.role === "sales" && (
        <SalesRecordList
          records={records}
          currentUser={currentUser}
          onSelectRecord={handleSelectRecord} // 상세 보기로 이동
          onBack={() => setStep("salesCalendar")}
        />
      )}

      {step === "adminDashboard" && currentUser?.role === "admin" && (
        <AdminCalendarDashboard
          records={records}
          onAddComment={handleAddComment}
        />
      )}

      {step !== "login" && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setStep("login");
              setCurrentUser(null);
              setSelectedDate(null);
              setCurrentRecord(null);
            }}
          >
            로그아웃
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default App;