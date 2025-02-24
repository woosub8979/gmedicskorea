// SalesInputForm.jsx
import { useState } from "react";
import useGoogleSheetData from "./useGoogleSheetData"; // 커스텀 훅

function SalesInputForm({ onSubmit }) {
  const SHEET_ID = "1LcIZSVl5s2RG5x4_Q1wG6_yhmVONNw-qk4esUXVTux8";
  const clientData = useGoogleSheetData(SHEET_ID);

  // 현재 시각을 기본값으로 설정 (HH:MM)
  const now = new Date();
  const defaultTime = now.toTimeString().slice(0, 5);

  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [meeting, setMeeting] = useState("");
  const [time, setTime] = useState(defaultTime); // 기본값을 현재 시각으로
  const [businessReg, setBusinessReg] = useState("");
  const [address, setAddress] = useState("");

  const handleClientChange = (e) => {
    const value = e.target.value;
    setClient(value);
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
    // "HH:MM" 형태로 time이 들어있어야 함
    const inputData = { client, phone, meeting, time, businessReg, address };
    onSubmit(inputData);

    // 폼 초기화 (time도 다시 기본값으로)
    setClient("");
    setPhone("");
    setMeeting("");
    setTime(defaultTime);
    setBusinessReg("");
    setAddress("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <div>
        <label>방문 업체:</label>
        <input
          type="text"
          list="clientList"
          value={client}
          onChange={handleClientChange}
          placeholder="업체명을 입력하세요"
          required
        />
        <datalist id="clientList">
          {clientData.map((row, index) => (
            <option key={index} value={row[1]} />
          ))}
        </datalist>
      </div>
      <div>
        <label>사업자 번호:</label>
        <input
          type="text"
          value={businessReg}
          readOnly
          placeholder="자동완성"
        />
      </div>
      <div>
        <label>전화번호:</label>
        <input
          type="tel"
          value={phone}
          readOnly
          placeholder="자동완성"
        />
      </div>
      <div>
        <label>주소:</label>
        <input
          type="text"
          value={address}
          readOnly
          placeholder="자동완성"
        />
      </div>
      <div>
        <label>미팅 내용:</label>
        <textarea
          value={meeting}
          onChange={(e) => setMeeting(e.target.value)}
          placeholder="미팅 내용을 입력하세요"
          required
        />
      </div>
      <div>
        <label>방문 시간:</label>
        <input
          type="time"
          value={time || ""}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">제출</button>
    </form>
  );
}

export default SalesInputForm;