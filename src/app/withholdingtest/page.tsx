"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs"; // exceljs 라이브러리 사용

interface IncomeRange {
  min: number;
  max: number;
  percentage: number;
  driverCount: number;
  individualAmount: number;
  isLocked: boolean;
}

const useIncomeRangeLocalStorage = (difference: number) => {
  const defaultRanges: IncomeRange[] = [
    {
      min: 800001,
      max: 900000,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    },
    {
      min: 900001,
      max: 1000000,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    },
    {
      min: 1000001,
      max: 2000000,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    },
    {
      min: 2000001,
      max: 3000000,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    },
    {
      min: 3000001,
      max: 4000000,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    },
  ];

  const [incomeRanges, setIncomeRanges] = useState<IncomeRange[]>(() => {
    if (typeof window !== "undefined") {
      const savedRanges = localStorage.getItem("incomeRanges");
      return savedRanges ? JSON.parse(savedRanges) : defaultRanges;
    } else {
      return defaultRanges; // 서버에서는 기본 값으로 설정
    }
  });

  // 백분율 고정/해제 함수
  const toggleLock = (index: number) => {
    const updatedRanges = [...incomeRanges];
    updatedRanges[index].isLocked = !updatedRanges[index].isLocked;
    setIncomeRanges(updatedRanges);
    saveIncomeRangesToLocalStorage(updatedRanges); // 필요 시 로컬 스토리지 저장
  };

  useEffect(() => {
    // 애플리케이션 시작 시 로컬스토리지에서 데이터 불러오기
    const savedRanges = localStorage.getItem("incomeRanges");
    if (savedRanges) {
      setIncomeRanges(JSON.parse(savedRanges));
    }
  }, []);

  // 소득 구간을 로컬 스토리지에 저장
  const saveIncomeRangesToLocalStorage = (ranges: IncomeRange[]) => {
    localStorage.setItem("incomeRanges", JSON.stringify(ranges));
  };

  const addIncomeRange = () => {
    const newRange: IncomeRange = {
      min: 0,
      max: 0,
      percentage: 0,
      driverCount: 0,
      individualAmount: 0,
      isLocked: false,
    };
    const updatedRanges = [...incomeRanges, newRange];
    setIncomeRanges(updatedRanges);
    saveIncomeRangesToLocalStorage(updatedRanges);
  };

  const deleteIncomeRange = (index: number) => {
    const updatedRanges = incomeRanges.filter((_, i) => i !== index);
    setIncomeRanges(updatedRanges);
    saveIncomeRangesToLocalStorage(updatedRanges);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRanges = [...incomeRanges];
    const numValue = value === "" ? 0 : parseInt(value.replace(/,/g, ""), 10);

    // 고정되지 않은 경우에만 값을 수정
    if (field === "percentage" && updatedRanges[index].isLocked) {
      return; // 고정된 백분율은 수정할 수 없음
    }

    if (field === "min") {
      updatedRanges[index].min = numValue;
    } else if (field === "max") {
      updatedRanges[index].max = numValue;
    } else if (field === "percentage") {
      updatedRanges[index].percentage = numValue; // 백분율 업데이트 추가

      // 고정된 백분율의 총합 계산
      const lockedPercentageSum = updatedRanges
        .filter((range) => range.isLocked)
        .reduce((sum, range) => sum + range.percentage, 0);

      // 남은 백분율 계산
      const remainingPercentage = 100 - lockedPercentageSum - numValue;

      // 고정되지 않은 구간들의 기사수 총합 계산
      const totalDriversWithoutModified = updatedRanges
        .filter((_, i) => i !== index && !updatedRanges[i].isLocked) // 수정된 구간과 고정된 구간 제외
        .reduce((total, range) => total + range.driverCount, 0);

      // 나머지 구간에 남은 백분율 분배 (고정되지 않은 구간만)
      updatedRanges.forEach((range, i) => {
        if (!range.isLocked && i !== index) {
          // 수정한 구간은 제외하고 고정되지 않은 구간만 조정
          const driverRatio = range.driverCount / totalDriversWithoutModified;
          range.percentage = parseFloat(
            (driverRatio * remainingPercentage).toFixed(2)
          );
        }
      });
    }

    // 각 구간의 1인 부담 금액 재계산 (고정된 값도 포함)
    updatedRanges.forEach((range) => {
      range.individualAmount =
        range.driverCount > 0
          ? Math.round(
              (difference * (range.percentage / 100)) / range.driverCount
            )
          : 0;
    });

    setIncomeRanges(updatedRanges);
    saveIncomeRangesToLocalStorage(updatedRanges);
  };

  return {
    incomeRanges,
    addIncomeRange,
    deleteIncomeRange,
    handleInputChange,
    toggleLock,
    setIncomeRanges,
  };
};

const formatNumberWithCommas = (value: number) => {
  // 숫자 형식이 아닌 경우 빈 문자열 반환
  if (isNaN(value)) return "";
  return value.toLocaleString();
};

export default function MainPage() {
  const [fileList, setFileList] = useState<File[]>([]); // 업로드된 파일 리스트 저장
  const [sheetData, setSheetData] = useState<any[][]>([]); // 배열 형태의 시트 데이터 저장
  const [headers, setHeaders] = useState<string[]>([]); // 첫 번째 행(헤더) 저장
  const [filledCellCount, setFilledCellCount] = useState<number>(0); // 값이 있는 셀의 개수 저장
  const [totalSum, setTotalSum] = useState<number>(0); // 지급총액 합계 상태
  const [requestedNetProfit, setRequestedNetProfit] = useState<number | string>(
    ""
  ); // 요청순수익
  const [difference, setDifference] = useState<number>(0);

  const {
    incomeRanges,
    addIncomeRange,
    deleteIncomeRange,
    handleInputChange,
    setIncomeRanges,
    toggleLock,
  } = useIncomeRangeLocalStorage(difference); // 소득기준 구간 관리 상태

  useEffect(() => {
    const newDifference = calculateDifference(); // 차액 계산 함수 호출
    setDifference(newDifference); // 계산된 차액을 상태에 저장
    // updateIncomeRanges();
    console.log("업데이트된 차액:", newDifference); // 콘솔에 차액 로깅
  }, [totalSum, requestedNetProfit]);

  useEffect(() => {
    updateIncomeRanges();
  }, [difference]); // 차액이 변경되면 updateIncomeRanges를 호출

  const updateIncomeRanges = () => {
    // 전체 기사수를 먼저 계산합니다.
    const totalDrivers = sheetData.reduce((total, row: any) => {
      const amount = parseFloat(row["지급총액"]);
      const remark = row["비고"];

      return incomeRanges.some(
        (range) =>
          amount >= range.min &&
          amount <= range.max &&
          !(
            typeof remark === "string" &&
            (remark.includes("전액신고") || remark.includes("전액 신고"))
          )
      )
        ? total + 1
        : total;
    }, 0);

    const updatedRanges = incomeRanges.map((range) => {
      const driversInRange = sheetData.filter((row: any) => {
        const amount = parseFloat(row["지급총액"]);
        const remark = row["비고"];
        return (
          amount >= range.min &&
          amount <= range.max &&
          !(
            typeof remark === "string" &&
            (remark.includes("전액신고") || remark.includes("전액 신고"))
          )
        );
      }).length;

      const percentages =
        totalDrivers > 0 ? (driversInRange / totalDrivers) * 100 : 0;
      const percentage = parseFloat(percentages.toFixed(2)); // 문자열을 다시 숫자로 변환
      const individualAmount =
        driversInRange > 0
          ? Math.round((difference * (percentage / 100)) / driversInRange)
          : 0;

      // 로그 출력: 각 구간별 계산된 값 확인
      console.log(
        `구간: ${range.min}-${range.max}, 기사수: ${driversInRange}, 백분율: ${percentage}%, 차액: ${percentage}, 1인 부담금액: ${individualAmount}`
      );

      return {
        ...range,
        driverCount: driversInRange,
        percentage,
        individualAmount,
      };
    });

    setIncomeRanges(updatedRanges);

    // 로컬 스토리지에 저장
    localStorage.setItem("incomeRanges", JSON.stringify(updatedRanges));
  };

  // 직접 입력해야 하는 값들
  const [monthlySales, setMonthlySales] = useState<number | string>(""); // 월 매출
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | string>(""); // 월 매입
  const [monthlyCost, setMonthlyCost] = useState<number | string>(""); // 월 경비

  const calculateDifference = (): number => {
    const netProfit = calculateNetProfit(); // 순이익
    const requestedProfit = Number(requestedNetProfit) || 0; // 요청순수익
    return netProfit - requestedProfit; // 차액 = 순이익 - 요청순수익
  };

  // 영업이익 계산 (월매출 - 월매입)
  const calculateOperatingProfit = (): number => {
    const sales = Number(monthlySales) || 0;
    const expenses = Number(monthlyExpenses) || 0;
    return sales - expenses;
  };

  const calculateNetProfit = (): number => {
    const operatingProfit = calculateOperatingProfit(); // 영업이익
    const cost = Number(monthlyCost) || 0; // 월 경비
    return operatingProfit - cost - totalSum; // 순이익 = 영업이익 - 월 경비 - 지급총액
  };

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

          // 시트 데이터를 배열로 변환 (header 옵션 제거해서 배열 형태로 출력)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          // 첫 번째 행을 헤더로 저장
          if (jsonData.length > 0) {
            if (headers.length === 0) {
              // 첫 번째 파일에서만 헤더를 설정
              setHeaders([...jsonData[0], "백분율", "수정지급총액"]);
            } else {
              // 다른 파일과 헤더가 같은지 확인
              const currentHeaders = [...jsonData[0], "백분율", "수정지급총액"];
              if (JSON.stringify(currentHeaders) !== JSON.stringify(headers)) {
                alert("모든 파일의 열 구조가 동일해야 합니다.");
                return;
              }
            }

            // 첫 번째 행(헤더)을 키로 사용하여 각 행을 객체로 변환
            const headersArray = jsonData[0]; // 첫 번째 행이 헤더
            const totalAmountIndex = headersArray.indexOf("지급총액");

            if (totalAmountIndex !== -1) {
              // 지급총액의 합계 계산
              const totalSum = jsonData.slice(1).reduce((sum, row) => {
                const amount = parseFloat(row[totalAmountIndex]) || 0;
                return sum + amount;
              }, 0);
              setTotalSum(totalSum); // 지급총액의 합계 업데이트
            }

            // 새로운 데이터를 객체로 변환 (열 이름을 키로 사용)
            const newData = jsonData.slice(1).map((row) => {
              const rowObject: any = {};
              row.forEach((value: any, index: number) => {
                rowObject[headersArray[index]] = value;
              });
              return rowObject;
            });

            const filteredNewData = newData.filter(
              (newRow) =>
                !sheetData.some(
                  (existingRow) =>
                    JSON.stringify(existingRow) === JSON.stringify(newRow)
                )
            );

            // 비어 있지 않은 행을 카운트 (각 행이 하나 이상의 값을 가지고 있는지 확인)
            const nonEmptyRowsCount = filteredNewData.filter((row) =>
              Object.values(row).some(
                (cell: any) => cell && cell.toString().trim() !== ""
              )
            ).length;
            // console.log("비어 있지 않은 행의 개수:", nonEmptyRowsCount);
            setFilledCellCount(nonEmptyRowsCount); // 비어 있지 않은 행의 개수 업데이트

            setSheetData((prevData) => [...prevData, ...filteredNewData]);
          }

          resolve(jsonData); // Promise 완료
        };

        reader.readAsBinaryString(file);
      });
    });

    Promise.all(promises).then(() => {
      const newDifference = calculateDifference(); // 차액 재계산
      setDifference(newDifference); // 차액 상태 업데이트
    });
  };

  const saveToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 열 너비 설정
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20, // 각 열의 기본 너비를 20으로 설정 (원하는 값으로 조정 가능)
      style:
        header === "지급총액" ||
        header === "수정지급총액" ||
        header === "건수" ||
        header === "배달료합"
          ? { numFmt: "#,##0" }
          : {}, // 숫자 형식 지정
    }));

    // 시트 데이터 추가
    sheetData.forEach((row: any, _rowIndex) => {
      const amount = parseFloat(row["지급총액"]);
      const remark = row["비고"];
      let percentage: string | number = row["백분율"]; // 이미 계산된 백분율 사용
      let individualAmount = 0;
      let modifiedTotalAmount = amount;

      // '전액신고', '###만원' 형식, 또는 공백이 아닌 경우에만 확인
      if (
        typeof remark === "string" &&
        remark.trim() !== "" &&
        !remark.includes("전액신고") &&
        !remark.includes("전액 신고") &&
        !/^\d+만원$/.test(remark.trim())
      ) {
        percentage = "확인필요";
        modifiedTotalAmount = 0;
      }
      // 비고에 ###만원 형식이 있는 경우
      else if (/^\d+만원$/.test(remark.trim())) {
        percentage = 100;
        const numericPart = remark.replace("만원", "").trim();
        modifiedTotalAmount = parseFloat(numericPart) * 10000; // ###0000 형식으로 변환
      }
      // 전액신고가 있는 경우
      else if (remark.includes("전액신고") || remark.includes("전액 신고")) {
        percentage = 100;
        modifiedTotalAmount = amount;
      } else {
        // 범위 내에 있는지 검사
        let isInRange = false;
        incomeRanges.forEach((range) => {
          if (amount >= range.min && amount <= range.max) {
            isInRange = true;
            percentage = range.percentage;
            individualAmount = range.individualAmount;
          }
        });
        if (isInRange) {
          modifiedTotalAmount = amount + individualAmount;
        } else {
          percentage = 100;
          modifiedTotalAmount = amount;
        }
      }

      // 백분율 값 추가
      row["백분율"] = percentage;

      // 수정지급총액 값 추가
      row["수정지급총액"] = modifiedTotalAmount;

      // 수정된 지급총액과 백분율을 포함하여 새로운 행을 추가
      worksheet.addRow({
        ...row,
        백분율: percentage,
        수정지급총액: modifiedTotalAmount, // 수정지급총액 열에 계산된 값 추가
      });
    });

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
      saveAs(blob, "원천세계산test.xlsx");
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
        <h1 className="font-bold m-3 text-xl">손익 계산서</h1>
        <table className="border-separate border border-slate-400 my-4">
          <thead>
            <tr>
              <th className="border border-slate-300 p-4">항목</th>
              <th className="border border-slate-300 p-4">총합</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-4 ">총 기사 수</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {filledCellCount ? filledCellCount : "데이터 없음"} 명
              </td>
            </tr>
            <tr>
              {/* 직접 입력할 수 있는 필드 */}
              <td className="border border-slate-300 p-4 ">월매출</td>
              <td className="border border-slate-300 p-4 text-red-500 font-semibold">
                <input
                  type="text"
                  value={formatNumberWithCommas(Number(monthlySales))} // 포맷팅된 값 표시
                  onChange={(e) => {
                    const input = e.target.value.replace(/,/g, ""); // 콤마 제거하고 숫자만 남기기
                    if (input === "") {
                      setMonthlySales(0);
                    } else {
                      const numericValue = parseFloat(input); // 숫자로 변환
                      if (!isNaN(numericValue)) {
                        setMonthlySales(numericValue); // 숫자로 변환된 값을 상태에 저장
                      }
                    }
                  }}
                  className="border px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              {/* 직접 입력할 수 있는 필드 */}
              <td className="border border-slate-300 p-4">월매입</td>
              <td className="border border-slate-300 p-4 font-semibold">
                <input
                  type="text"
                  value={formatNumberWithCommas(Number(monthlyExpenses))} // 포맷팅된 값 표시
                  onChange={(e) => {
                    const input = e.target.value.replace(/,/g, ""); // 콤마 제거
                    if (input === "") {
                      setMonthlyExpenses(0);
                    } else {
                      const numericValue = parseFloat(input);
                      if (!isNaN(numericValue)) {
                        setMonthlyExpenses(numericValue); // 숫자로 변환 후 상태 저장
                      }
                    }
                  }}
                  className="border px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">영업이익</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {formatNumberWithCommas(calculateOperatingProfit())} 원
              </td>
            </tr>
            <tr>
              {/* 직접 입력할 수 있는 필드 */}
              <td className="border border-slate-300 p-4">월경비</td>
              <td className="border border-slate-300 p-4 font-semibold">
                <input
                  type="text"
                  value={formatNumberWithCommas(Number(monthlyCost))} // 포맷된 값 표시
                  onChange={(e) => {
                    const input = e.target.value.replace(/,/g, ""); // 콤마 제거
                    if (input === "") {
                      setMonthlyCost(0);
                    } else {
                      const numericValue = parseFloat(input);
                      if (!isNaN(numericValue)) {
                        setMonthlyCost(numericValue); // 숫자로 변환 후 상태 저장
                      }
                    }
                  }}
                  className="border px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">지급총액</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {formatNumberWithCommas(totalSum)} 원
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">순이익</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {formatNumberWithCommas(calculateNetProfit())} 원
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">요청 순수익</td>
              <td className="border border-slate-300 p-4 font-semibold">
                <input
                  type="text"
                  value={formatNumberWithCommas(Number(requestedNetProfit))}
                  onChange={(e) => {
                    const input = e.target.value.replace(/,/g, ""); // 콤마 제거
                    if (input === "") {
                      setRequestedNetProfit(0); // 입력이 비어 있으면 0으로 설정
                    } else {
                      const numericValue = parseFloat(input);
                      if (!isNaN(numericValue)) {
                        setRequestedNetProfit(numericValue); // 숫자로 변환 후 상태 저장
                      }
                    }
                  }}
                  className="border px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-4">차액</td>
              <td className="border border-slate-300 p-4 font-semibold">
                {formatNumberWithCommas(calculateDifference())} 원
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            multiple
            onChange={handleFileUpload}
          />
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
            className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
            onClick={saveToExcel}
          >
            엑셀 출력하기
          </button>
        </div>
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
              <th>고정</th>
              <th>기사수</th>
              <th>1인부담금액</th>
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
                    value={formatNumberWithCommas(range.percentage)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자가 아닌 문자는 제거
                      if (value.length <= 3) {
                        // 최대 세 자리까지만 입력 허용
                        handleInputChange(index, "percentage", value); // 백분율 값 업데이트
                      } else {
                        alert(
                          "백분율은 최대 3자리 숫자까지만 입력 가능합니다."
                        ); // 경고 메시지
                      }
                    }}
                    disabled={range.isLocked}
                  />
                  <span>%</span>
                </td>
                <td>
                  <button
                    className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold px-2 max-w-xs rounded-full focus:outline-none focus:shadow-outline"
                    onClick={() => toggleLock(index)}
                  >
                    {range.isLocked ? "해제" : "고정"}
                  </button>
                </td>
                <td className="pr-4">
                  {formatNumberWithCommas(range.driverCount)} 명
                </td>
                <td className="pr-4">
                  {formatNumberWithCommas(range.individualAmount)} 원
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
