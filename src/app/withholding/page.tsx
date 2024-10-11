"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs"; // exceljs 라이브러리 사용

export default function WithHoldingTaxPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 선택한 월 저장
  const [fileList, setFileList] = useState<File[]>([]); // 업로드된 파일 리스트 저장
  const [allData, setAllData] = useState<any[]>([]); // 모든 파일의 데이터를 저장
  const [fileName, setFileNames] = useState<string[]>([]); // 파일 이름 저장

  // 월 선택 핸들러
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value, 10)); // 선택된 월을 상태에 저장
  };

  // 엑셀 파일을 처리하는 함수
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 파일 리스트 업데이트
    const fileArray = Array.from(files);
    setFileList(fileArray);
    setFileNames(fileArray.map((file) => file.name.split(".")[0]));

    // 각 파일 처리
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result as string;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // 첫 번째 시트 읽기
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 엑셀 데이터를 JSON 형식으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 기존 데이터에 추가
        setAllData((prevData) => [...prevData, ...jsonData]);
      };
      reader.readAsBinaryString(file);
    });
  };

  // "업무일자"에서 "일"을 추출하고 "라이더 닉네임"을 포함한 새로운 엑셀 생성
  const createNewExcelWithDayAndName = () => {
    if (selectedMonth === null) {
      alert("월을 선택해주세요.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("업무일자");

    // 첫 번째 행에 "성명"과 날짜(1~31) 추가
    const headerRow = [
      "보험구분",
      "성명",
      "주민(외국인)등록번호",
      "신고월\n(근로년월)",
      "직종코드",
      ...Array.from({ length: 31 }, (_, i) => `${i + 1}일`),
      "근로일수",
      "일평균\n근로시간",
      "보수지급\n기초일수",
      "보수총액\n(과세소득)",
      "임금총액",
      "이직사유코드",
      "보험료부과구분\n부호",
      "보험료부과구분\n사유",
      "국세청\n일용근로소득\n신고여부",
      "지급월",
      "총지급액\n(과세소득)",
      "비과세소득",
      "소득세",
      "지방소득세",
    ];
    const row = worksheet.addRow(headerRow);

    // 스타일 설정
    row.eachCell((cell) => {
      cell.font = { bold: true }; // 폰트 두껍게
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }; // 중앙정렬
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" }, // 연한 회색 배경
      };
    });

    // 열의 넓이 조정
    worksheet.columns = headerRow.map(() => ({ width: 15 })); // 열의 넓이를 15로 설정 (원하는 값으로 조정 가능)

    // 행의 높이 조정 (1번 행에 적용)
    worksheet.getRow(1).height = 50; // 행 높이를 25로 설정 (원하는 값으로 조정 가능)

    // 첫 번째 행 고정
    worksheet.views = [
      { state: "frozen", ySplit: 1, xSplit: 4 }, // 1행을 고정
    ];

    // 라이더 닉네임별로 데이터를 그룹화할 객체 생성
    const riderDataMap: { [key: string]: (number | "")[] } = {};
    const 신고월Map: { [key: string]: string } = {};

    // 데이터를 순회하며 처리
    for (let i = 0; i < allData.length - 1; i++) {
      const 업무일자셀 = allData[i].find(
        (cell: any) => typeof cell === "string" && cell.startsWith("업무일자:")
      );
      const 닉네임셀 = allData[i + 1][allData[0].indexOf("라이더 닉네임")];

      if (업무일자셀 && 닉네임셀) {
        const 업무일자 = 업무일자셀.split("업무일자:")[1]?.trim();
        const yearMonth = 업무일자.slice(0, 6); // YYYYMM 형식으로 추출
        const month = parseInt(업무일자.slice(4, 6), 10); // 업무일자에서 월 추출
        const day = parseInt(업무일자.slice(-2), 10); // 업무일자에서 마지막 두 자리 추출

        // 선택한 월에 해당하는 데이터만 처리
        if (
          !isNaN(month) &&
          month === selectedMonth &&
          !isNaN(day) &&
          day >= 1 &&
          day <= 31
        ) {
          if (!riderDataMap[닉네임셀]) {
            riderDataMap[닉네임셀] = new Array(31).fill(""); // 1일부터 31일까지의 빈 배열 생성
            신고월Map[닉네임셀] = yearMonth;
          }
          riderDataMap[닉네임셀][day - 1] = 1; // 해당 날짜에 1 기록
        }
      }
    }

    // riderDataMap의 데이터를 엑셀 시트에 추가
    Object.keys(riderDataMap).forEach((riderName, index) => {
      const 신고월 = 신고월Map[riderName]; // 해당 라이더의 신고월 가져오기
      const newRow = worksheet.addRow([
        "", // 보험구분 칸 비우기
        fileName[index], // 성명에 라이더 닉네임 출력
        "",
        신고월,
        "", // 주민등록번호, 신고월, 직종코드 칸 비우기
        ...riderDataMap[riderName],
      ]);

      // 각 셀에 대해 텍스트 중앙정렬 설정
      newRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" }; // 중앙정렬
      });
    });

    // 엑셀 파일을 Blob으로 저장
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    });
  };

  const loginPage = async () => {
    router.push("/login");
  };

  return (
    <div className="p-4 flex justify-between">
      <div>
        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
          onClick={loginPage}
        >
          메인 페이지
        </button>
        <h1 className="font-bold m-3 text-xl">엑셀 파일 업로드 데이터 조회</h1>

        {/* 월 선택을 위한 드롭다운 */}
        <select
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
          value={selectedMonth || ""}
          onChange={handleMonthChange}
        >
          <option value="">월 선택</option>
          <option value="1">1월</option>
          <option value="2">2월</option>
          <option value="3">3월</option>
          <option value="4">4월</option>
          <option value="5">5월</option>
          <option value="6">6월</option>
          <option value="7">7월</option>
          <option value="8">8월</option>
          <option value="9">9월</option>
          <option value="10">10월</option>
          <option value="11">11월</option>
          <option value="12">12월</option>
        </select>

        {/* 여러 파일 업로드 가능 */}
        <input type="file" accept=".xlsx, .xls" multiple onChange={handleFileUpload} />

        <button
          className="bg-[#ffd29a] hover:bg-[#ffa027] text-[#fff0dd] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline mt-4"
          onClick={createNewExcelWithDayAndName}
        >
          엑셀 생성
        </button>

        {/* 업로드된 파일 목록 표시 */}
        {fileList.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold text-lg">업로드된 파일 목록:</h2>
            <ul className="list-disc pl-5">
              {fileList.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
