"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs"; // exceljs 라이브러리 사용
import { useRouter } from "next/navigation";

interface IncomeRange {
  min: number;
  max: number;
  percentage: number;
}

const useIncomeRangeLocalStorage = () => {
  const defaultRanges: IncomeRange[] = [
    { min: 0, max: 999999, percentage: 100 },
    { min: 1000000, max: 2999999, percentage: 80 },
    { min: 3000000, max: 3999999, percentage: 70 },
  ];

  const [incomeRanges, setIncomeRanges] =
    useState<IncomeRange[]>(defaultRanges);

  useEffect(() => {
    // 애플리케이션 시작 시 로컬스토리지에서 데이터 불러오기
    const savedRanges = localStorage.getItem("incomeRanges");

    if (savedRanges) {
      console.log(localStorage.getItem("incomeRanges"));

      setIncomeRanges(JSON.parse(savedRanges));
    } else {
      // 저장된 데이터가 없으면 기본값 사용
      setIncomeRanges(defaultRanges);
    }
  }, []);

  const addIncomeRange = () => {
    const newRange: IncomeRange = { min: 0, max: 0, percentage: 0 };
    const updatedRanges = [...incomeRanges, newRange];
    setIncomeRanges(updatedRanges);
    saveIncomeRanges(updatedRanges);
  };

  const deleteIncomeRange = (index: number) => {
    const updatedRanges = incomeRanges.filter((_, i) => i !== index);
    setIncomeRanges(updatedRanges);
    saveIncomeRanges(updatedRanges);
  };

  const saveIncomeRanges = (ranges: IncomeRange[]) => {
    // 소득기준구간 저장하기
    localStorage.setItem("incomeRanges", JSON.stringify(ranges));
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRanges = [...incomeRanges];
    const numValue = "" ? 0 : parseInt(value.replace(/,/g, ""), 10);

    if (field === "min") {
      updatedRanges[index].min = numValue;
    } else if (field === "max") {
      updatedRanges[index].max = numValue;
    } else if (field === "percentage") {
      updatedRanges[index].percentage = numValue > 100 ? 100 : numValue;
    }

    setIncomeRanges(updatedRanges);
    saveIncomeRanges(updatedRanges);
  };

  return { incomeRanges, addIncomeRange, deleteIncomeRange, handleInputChange };
};

const formatNumberWithCommas = (value: number) => {
  // 숫자 형식이 아닌 경우 빈 문자열 반환
  if (isNaN(value)) return "";
  return value.toLocaleString();
};

export default function MainPage() {
  const [accumulatedData, setAccumulatedData] = useState<unknown[]>([]); // 누적 데이터를 저장
  const [fileList, setFileList] = useState<File[]>([]); // 업로드된 파일 리스트 저장
  const [totalSum, setTotalSum] = useState(0); // 지급총액 합계 상태
  const [checkNeededCount, setCheckNeededCount] = useState(0); // "확인필요" 개수를 상태로 관리
  const [modifiedTotalSum, setModifiedTotalSum] = useState(0); // 수정 지급총액 합계 상태
  const [modifiedTotalNetProfitSum, setModifiedTotalNetProfitSum] = useState(0); // 수정 순이익 합계 상태
  const { incomeRanges, addIncomeRange, deleteIncomeRange, handleInputChange } =
    useIncomeRangeLocalStorage(); // 소득기준 구간 관리 상태

  // 처음화면으로 이동
  const router = useRouter();

  const loginPage = async () => {
    router.push("/login");
  };

  // 엑셀 파일을 읽는 함수
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 파일 리스트 업데이트
    setFileList(Array.from(files));

    const promises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const binaryStr = event.target?.result as string;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          // 첫 번째 시트 읽기
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          // 데이터를 누적시킴
          setAccumulatedData((prevData) => [...prevData, ...data]);

          setAccumulatedData(data);

          // 지급총액 합산 및 수정 지급총액 계산
          calculateTotalSum(data);

          resolve(data); // Promise 완료
        };

        reader.readAsBinaryString(file);
      });
    });

    Promise.all(promises).then(() => {
      // 모든 파일 처리 후 추가 작업이 필요하다면 여기에 작성
    });
  };

  // 엑셀 데이터를 계산하는 함수
  const calculateTotalSum = (data: any[]) => {
    let checkCount = 0; // "확인필요" 개수를 저장할 변수
    let modifiedSum = 0; // 수정 지급총액의 합계

    const sum = data.reduce((acc, row) => {
      const payment = row[" 지급총액 "] || 0; // 지급총액 필드값을 가져옴
      let percentage = 100; // 기본적으로 100%로 설정

      // 비고에 "전액신고"가 있으면 무조건 100% 적용하고 구간 확인 건너뜀
      if (row["비고"] && row["비고"].includes("전액신고")) {
        percentage = 100;
      } else if (
        row["비고"] &&
        row["비고"].trim() !== "" &&
        row["비고"] !== "전액신고" &&
        row["비고"] !== "전액 신고"
      ) {
        // 비고에 "전액신고"가 아닌 다른 값이 있는 경우 확인필요 처리
        checkCount++;
        row["수정지급총액"] = "확인필요";
        return acc;
      } else {
        // 소득 기준 구간에 따라 백분율 적용
        for (const range of incomeRanges) {
          if (payment >= range.min && payment <= range.max) {
            percentage = range.percentage;
            break; // 해당 구간을 찾으면 나옴
          }
        }
      }

      // 수정 지급총액 계산 (지급총액 * 퍼센티지 / 100)
      const modifiedPayment = (payment * percentage) / 100;
      modifiedSum += modifiedPayment;

      // 백분율을 행에 저장
      row["백분율"] = percentage;

      // 수정 지급총액을 행에 저장
      row["수정지급총액"] = modifiedPayment;

      return acc + payment;
    }, 0);

    // 상태 업데이트 (비동기적이므로 누적된 값은 이전 값을 고려해서 설정해야 함)
    setTotalSum((prevSum) => prevSum + sum);
    setModifiedTotalSum(Math.floor(modifiedSum)); // 수정 지급총액 합계 상태에 저장
    setCheckNeededCount((prevCount) => prevCount + checkCount); // "확인필요" 개수를 상태에 저장
    setModifiedTotalNetProfitSum(
      (prevTotalmodifiedTotalNetProfitSumum) =>
        prevTotalmodifiedTotalNetProfitSumum + sum - Math.floor(modifiedSum)
    ); // 수정 순이익총액 합계 상태에 저장
  };

  const saveToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Modified Payments");

    worksheet.columns = [
      { header: "순번", key: "순번", width: 10 },
      { header: "소속", key: "소속", width: 32 },
      { header: "기사닉네임", key: "기사닉네임", width: 15 },
      { header: "기사관리메모", key: "기사관리메모", width: 20 },
      { header: "기사실명", key: "기사실명", width: 15 },
      { header: "기사주민번호", key: "기사주민번호", width: 20 },
      { header: "건수", key: "건수", width: 10, style: { numFmt: "#,##0" } },
      {
        header: "배달료합",
        key: " 배달료합 ",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      { header: "기준일자", key: "기준일자", width: 15 },
      {
        header: "지급총액",
        key: " 지급총액 ",
        width: 15,
        style: { numFmt: "#,##0" },
      },
      { header: "비고", key: "비고", width: 25 },
      {
        header: "백분율",
        key: "백분율",
        width: 10,
      },
      {
        header: "수정 지급총액",
        key: "수정지급총액",
        width: 20,
        style: { numFmt: "#,##0" },
      },
    ];
    // 행 추가
    worksheet.addRows(accumulatedData);

    // 첫 번째 행(헤더) 스타일 설정
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true }; // 폰트 두껍게
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }; // 중앙정렬 및 텍스트 줄바꿈
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" }, // 연한 회색 배경
      };
    });

    // 첫 번째 행 고정(freeze panes)
    worksheet.views = [{ state: "frozen", ySplit: 1 }]; // 1행 고정

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "ModifiedPayments.xlsx");
    });
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

        <input
          type="file"
          accept=".xlsx, .xls"
          multiple
          onChange={handleFileUpload}
        />

        <table className="border-separate border border-slate-400 my-4">
          <thead>
            <tr>
              <th className="border border-slate-300 p-4">항목</th>
              <th className="border border-slate-300 p-4">총합</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-4 ">확인필요 개수</td>
              <td className="border border-slate-300 p-4 text-red-500 font-semibold">
                {checkNeededCount} 건
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">지급총액</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {totalSum.toLocaleString()} 원
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">수정 지급총액</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {modifiedTotalSum.toLocaleString()} 원
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">수정 순이익총액</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {modifiedTotalNetProfitSum.toLocaleString()} 원
              </td>
            </tr>
          </tbody>
        </table>
        {/* 업로드된 파일 목록 표시 */}
        {fileList.length > 0 && (
          <div className="my-4">
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
        <button
          onClick={saveToExcel}
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline"
        >
          지급총액 합산 엑셀로 저장
        </button>
      </div>

      {/* 소득기준구간 산정하는 구문 */}
      <div className="relative overflow-x-auto">
        <h1 className="font-bold m-3 text-xl">소득기준구간 설정</h1>
        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
          onClick={addIncomeRange}
        >
          구간 추가
        </button>
        <table>
          <thead>
            <tr>
              <th>구간</th>
              <th>최소값</th>
              <th>최대값</th>
              <th>백분율</th>
            </tr>
          </thead>
          <tbody>
            {incomeRanges.map((range, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <input
                    className="text-center"
                    type="text"
                    value={formatNumberWithCommas(range.min)}
                    onChange={(e) =>
                      handleInputChange(index, "min", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="text-center"
                    type="text"
                    value={formatNumberWithCommas(range.max)}
                    onChange={(e) =>
                      handleInputChange(index, "max", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="text-center"
                    type="text"
                    value={formatNumberWithCommas(range.percentage) + "%"}
                    onChange={(e) =>
                      handleInputChange(index, "percentage", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
                    onClick={() => deleteIncomeRange(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
