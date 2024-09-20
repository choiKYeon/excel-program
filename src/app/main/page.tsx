"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs"; // exceljs 라이브러리 사용
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [accumulatedData, setAccumulatedData] = useState<unknown[]>([]); // 누적 데이터를 저장
  const [totalSum, setTotalSum] = useState(0); // 지급총액 합계 상태
  const [checkNeededCount, setCheckNeededCount] = useState(0); // "확인필요" 개수를 상태로 관리
  const [modifiedTotalSum, setModifiedTotalSum] = useState(0); // 수정 지급총액 합계 상태
  const [modifiedTotalNetProfitSum, setModifiedTotalNetProfitSum] = useState(0); // 수정 순이익 합계 상태

  // 소득 기준 구간 상태 (추가)
  const [incomeRange, setIncomeRange] = useState({
    first: 0,
    second: 0,
    third: 0,
    four: 0,
  });

  const router = useRouter();

  const loginPage = async () => {
    router.push("/login");
  };

  // 엑셀 파일을 읽는 함수
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // 첫 번째 시트 읽기
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // console.log(data); // 엑셀 데이터를 콘솔에 출력 (확인용)
      // 데이터를 누적시킴
      setAccumulatedData((prevData) => [...prevData, ...data]);

      // 지급총액 합산 및 수정 지급총액 계산
      calculateTotalSum(data);
    };

    reader.readAsBinaryString(file);
  };

  // 엑셀 데이터를 계산하는 함수
  const calculateTotalSum = (data: any[]) => {
    let checkCount = 0; // "확인필요" 개수를 저장할 변수
    let modifiedSum = 0; // 수정 지급총액의 합계

    const sum = data.reduce((acc, row) => {
      const payment = row[" 지급총액 "] || 0; // 지급총액 필드값을 가져옴
      let percentage = 100; // 기본적으로 100%로 설정

      // __EMPTY 필드가 "확인필요"인 경우 개수 증가
      if (row["__EMPTY"] === "확인필요") {
        checkCount++;
      } else if (
        typeof row["__EMPTY"] === "string" &&
        row["__EMPTY"].includes("%")
      ) {
        // __EMPTY 필드에 퍼센티지 값이 있을 때
        percentage = parseFloat(row["__EMPTY"].replace("%", "")) || 100;
      }

      // 수정 지급총액 계산 (지급총액 * 퍼센티지 / 100)
      const modifiedPayment = (payment * percentage) / 100;
      modifiedSum += modifiedPayment;

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

  // 지급총액 합산만 엑셀 파일로 저장하는 함수
  const saveToExcel = async () => {
    if (totalSum === 0) return; // 지급총액 합산이 없으면 리턴

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Summary");

    // 지급총액 합산 데이터를 추가
    worksheet.addRow([
      "확인필요",
      "지급총액",
      "수정 지급총액",
      "수정 순이익총액",
    ]);

    worksheet.addRow([
      checkNeededCount,
      totalSum.toLocaleString(),
      modifiedTotalSum.toLocaleString(),
      modifiedTotalNetProfitSum.toLocaleString(),
    ]);

    // 열 너비 설정
    worksheet.columns = [
      { width: 50 },
      { width: 50 },
      { width: 50 },
      { width: 50 },
    ]; // 첫 번째 열의 너비 설정

    // 첫 번째 행 스타일 설정
    worksheet.getCell("A1").font = {
      name: "Arial", // 폰트 종류
      size: 20, // 폰트 크기
      bold: true, // 두께 설정
    };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 첫 번째 행의 배경색을 연한 주황색으로 설정
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0B2" }, // 연한 주황색 (ARGB 코드)
    };

    // 두 번째 열 스타일 설정
    worksheet.getCell("B1").font = {
      name: "Arial", // 폰트 종류
      size: 20, // 폰트 크기
      bold: true, // 두께 설정
    };
    worksheet.getCell("B1").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 두 번째 열의 배경색을 연한 주황색으로 설정
    worksheet.getCell("B1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0B2" }, // 연한 주황색 (ARGB 코드)
    };

    // 세 번째 열 스타일 설정
    worksheet.getCell("C1").font = {
      name: "Arial", // 폰트 종류
      size: 20, // 폰트 크기
      bold: true, // 두께 설정
    };

    worksheet.getCell("C1").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 세 번째 열의 배경색을 연한 주황색으로 설정
    worksheet.getCell("C1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0B2" }, // 연한 주황색 (ARGB 코드)
    };

    // 네 번째 열 스타일 설정
    worksheet.getCell("D1").font = {
      name: "Arial", // 폰트 종류
      size: 20, // 폰트 크기
      bold: true, // 두께 설정
    };

    worksheet.getCell("D1").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 네 번째 열의 배경색을 연한 주황색으로 설정
    worksheet.getCell("D1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0B2" }, // 연한 주황색 (ARGB 코드)
    };

    // 첫 번째 행,열 스타일 설정
    worksheet.getCell("A2").font = {
      name: "Arial", // 폰트 종류
      size: 25, // 폰트 크기
      bold: true, // 두께 설정
      color: { argb: "FFFF0000" }, // 글씨 색상 빨간색 (ARGB 코드)
    };

    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 두 번째 행,열 스타일 설정
    worksheet.getCell("B2").font = {
      name: "Arial", // 폰트 종류
      size: 25, // 폰트 크기
      bold: true, // 두께 설정
    };

    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 세 번째 행,열 스타일 설정
    worksheet.getCell("C2").font = {
      name: "Arial", // 폰트 종류
      size: 25, // 폰트 크기
      bold: true, // 두께 설정
      color: { argb: "FFFF0000" }, // 글씨 색상 빨간색 (ARGB 코드)
    };

    worksheet.getCell("C2").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 네 번째 행,열 스타일 설정
    worksheet.getCell("D2").font = {
      name: "Arial", // 폰트 종류
      size: 25, // 폰트 크기
      bold: true, // 두께 설정
      color: { argb: "FFFF0000" }, // 글씨 색상 빨간색 (ARGB 코드)
    };

    worksheet.getCell("D2").alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // 가운데 정렬

    // 행 높이 설정
    worksheet.getRow(1).height = 30; // 첫 번째 행의 높이를 30으로 설정
    worksheet.getRow(2).height = 40; // 두 번째 행의 높이를 40으로 설정

    // 엑셀 파일을 Blob으로 저장
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "total-sum.xlsx"); // 엑셀 파일 다운로드
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
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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
        <button
          onClick={saveToExcel}
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline"
        >
          지급총액 합산 엑셀로 저장
        </button>
      </div>
      {/* 소득기준구간 산정하는 구문 */}
      <div className="relative overflow-x-auto">
        <h1 className="font-bold m-3 text-xl">소득기준구간</h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody>
            <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 border font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                1
              </th>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="px-6">~</td>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  max={100} // 최대값 100 설정
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target as HTMLInputElement;
                    let value = parseInt(input.value, 10);

                    if (value > 100) {
                      input.value = "100"; // 100을 초과하면 100으로 제한
                    } else if (input.value.length > 3) {
                      input.value = input.value.slice(0, 3); // 입력값이 3자리를 초과하면 잘라냄
                    }
                  }}
                />
                %
              </td>
            </tr>
            <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 border font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="px-6">~</td>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  max={100} // 최대값 100 설정
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target as HTMLInputElement;
                    let value = parseInt(input.value, 10);

                    if (value > 100) {
                      input.value = "100"; // 100을 초과하면 100으로 제한
                    } else if (input.value.length > 3) {
                      input.value = input.value.slice(0, 3); // 입력값이 3자리를 초과하면 잘라냄
                    }
                  }}
                />
                %
              </td>
            </tr>
            <tr className="bg-white border dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 border font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                3
              </th>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="px-6">~</td>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  max={100} // 최대값 100 설정
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target as HTMLInputElement;
                    let value = parseInt(input.value, 10);

                    if (value > 100) {
                      input.value = "100"; // 100을 초과하면 100으로 제한
                    } else if (input.value.length > 3) {
                      input.value = input.value.slice(0, 3); // 입력값이 3자리를 초과하면 잘라냄
                    }
                  }}
                />
                %
              </td>
            </tr>
            <tr className="bg-white border dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 border font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                4
              </th>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="px-6">~</td>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  max={100} // 최대값 100 설정
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target as HTMLInputElement;
                    let value = parseInt(input.value, 10);

                    if (value > 100) {
                      input.value = "100"; // 100을 초과하면 100으로 제한
                    } else if (input.value.length > 3) {
                      input.value = input.value.slice(0, 3); // 입력값이 3자리를 초과하면 잘라냄
                    }
                  }}
                />
                %
              </td>
            </tr>
            <tr className="bg-white border dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 border font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                5
              </th>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="px-6">~</td>
              <td className="">
                <input className="text-center" type="number" />
              </td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  max={100} // 최대값 100 설정
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target as HTMLInputElement;
                    let value = parseInt(input.value, 10);

                    if (value > 100) {
                      input.value = "100"; // 100을 초과하면 100으로 제한
                    } else if (input.value.length > 3) {
                      input.value = input.value.slice(0, 3); // 입력값이 3자리를 초과하면 잘라냄
                    }
                  }}
                />
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
