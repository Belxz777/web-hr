"use client";

import { Deputy } from "@/types";
import { useState, useEffect } from "react";


interface EmployeeResponsibilitiesProps {
  responsibilitiesFs?: Deputy[];
  position?: number;
}

export function EmployeeResponsibilities({
  responsibilitiesFs = [],
  position,
}: EmployeeResponsibilitiesProps) {
  const [loading, setLoading] = useState(
    !responsibilitiesFs || responsibilitiesFs.length === 0
  );
  const [showAllFunctional, setShowAllFunctional] = useState(false);
  const [functionalData, setFunctionalData] =
    useState<Deputy[]>(responsibilitiesFs);

  const initialDisplayCount = 3;

  useEffect(() => {
    if (responsibilitiesFs && responsibilitiesFs.length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    setFunctionalData(responsibilitiesFs);
  }, [responsibilitiesFs]);

  if (!functionalData) {
    return null;
  }

  const displayedFunctional = showAllFunctional
    ? functionalData
    : functionalData.slice(0, initialDisplayCount + 1);

  return (
    <div className="space-y-8 taskSectionStyles">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          {"Ваша функциональная обязанность и необязательные обязанности:"}
        </h2>
        <div className="flex justify-between items-center flex-col mb-4 w-full">
          {loading ? (
            [1, 2, 3, 4, 5].map((e) => (
              <div key={e} className="w-full animate-pulse">
                <div className="h-10 bg-red-100 rounded w-full mb-4"></div>
              </div>
            ))
          ) : (
            <div className="flex justify-between items-end flex-col w-full">
              {functionalData.length > initialDisplayCount && (
                <button
                  onClick={() => setShowAllFunctional(!showAllFunctional)}
                  className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  {showAllFunctional
                    ? "Скрыть"
                    : `Показать все (${functionalData.length})`}
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="space-y-2">
            {displayedFunctional.map((item) => (
              <div
                key={item.deputyId}
                className={`${item.compulsory ? "bg-gray-700" : "bg-gray-700/40"} rounded-xl border border-gray-600 p-3`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base flex-1 min-w-0 pr-4">
                    {item.deputyName}
                  </h3>
                  <div className="flex flex-col gap-2 min-w-[100px] sm:flex-row sm:space-x-2 sm:justify-end sm:min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-center text-xs whitespace-nowrap ${item.compulsory ? "bg-red-600 text-white" : "bg-green-600 text-gray-300"}`} >
                      {item.compulsory ? "Обязательная" : "Необязательная"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading &&
          !showAllFunctional &&
          functionalData.length > initialDisplayCount + 1 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setShowAllFunctional(true)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Показать еще {functionalData.length - (initialDisplayCount + 1)}{" "}
                обязанностей...
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
