import { useState, useEffect } from "react";
import { TFData } from "@/types";
import {
  mockedDataFs,
  mockedDataGeneral,
} from "@/components/mockedData/mockedData";

interface EmployeeResponsibilitiesProps {
  employeeId?: number;
  position?: number;
  responsibilitiesFs?: TFData[];
  responsibilitiesGeneral?: TFData[];
}

export function EmployeeResponsibilities({
  employeeId,
  position,
  responsibilitiesFs = mockedDataFs,
  responsibilitiesGeneral = mockedDataGeneral,
}: EmployeeResponsibilitiesProps) {
  const [loading, setLoading] = useState(
    (!responsibilitiesFs || responsibilitiesFs.length === 0) &&
      (!responsibilitiesGeneral || responsibilitiesGeneral.length === 0)
  );
  const [showAllFunctional, setShowAllFunctional] = useState(false);
  const [showAllCommon, setShowAllCommon] = useState(false);
  const [functionalData, setFunctionalData] =
    useState<TFData[]>(responsibilitiesFs);
  const [generalData, setGeneralData] = useState<TFData[]>(
    responsibilitiesGeneral
  );

  const initialDisplayCount = 3;

  const currentResponsibilities = [...functionalData, ...generalData];

  useEffect(() => {
    if (
      (responsibilitiesFs && responsibilitiesFs.length > 0) ||
      (responsibilitiesGeneral && responsibilitiesGeneral.length > 0)
    ) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    setFunctionalData(responsibilitiesFs);
    setGeneralData(responsibilitiesGeneral);
  }, [responsibilitiesFs, responsibilitiesGeneral]);

  if ((position !== undefined && position !== 1) || !currentResponsibilities) {
    return null;
  }

  const functionalResponsibilities = currentResponsibilities
    .filter((tf) => tf.isMain)
    .map((tf) => ({
      id: Number(tf.tfId),
      name: tf.tfName,
      isMain: tf.isMain,
      category: "functional" as const,
    }));

  const commonResponsibilities = currentResponsibilities
    .filter((tf) => !tf.isMain)
    .map((tf) => ({
      id: Number(tf.tfId),
      name: tf.tfName,
      isMain: tf.isMain,
      category: "common" as const,
    }));

  const displayedFunctional = showAllFunctional
    ? functionalResponsibilities
    : functionalResponsibilities.slice(0, initialDisplayCount + 1);

  const displayedCommon = showAllCommon
    ? commonResponsibilities
    : commonResponsibilities.slice(0, initialDisplayCount);

  return (
    <div className="space-y-8 taskSectionStyles">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          Ваша функциональная обязанность содержит:
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
              {functionalResponsibilities.length > initialDisplayCount && (
                <button
                  onClick={() => setShowAllFunctional(!showAllFunctional)}
                  className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  {showAllFunctional
                    ? "Скрыть"
                    : `Показать все (${functionalResponsibilities.length})`}
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="space-y-2">
            {[...displayedFunctional].map((item) => (
              <div
                key={item.id}
                className="bg-gray-700 rounded-xl border border-gray-600 p-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base flex-1 min-w-0 pr-4">
                    {item.name}
                  </h3>
                  <div className="flex flex-col gap-2 min-w-[100px] sm:flex-row sm:space-x-2 sm:justify-end sm:min-w-0">
                    <span className="px-2 py-0.5 rounded-full text-center text-xs whitespace-nowrap bg-red-600 text-white">
                      Основная
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading &&
          !showAllFunctional &&
          functionalResponsibilities.length > initialDisplayCount + 1 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setShowAllFunctional(true)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Показать еще{" "}
                {functionalResponsibilities.length - (initialDisplayCount + 1)}{" "}
                обязанностей...
              </button>
            </div>
          )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Дополнительные обязанности</h2>
        <div className="flex justify-between items-center flex-col mb-4 w-full">
          {loading ? (
            [1, 2, 3].map((e) => (
              <div key={e} className="w-full animate-pulse">
                <div className="h-10 bg-red-100 rounded w-full mb-4"></div>
              </div>
            ))
          ) : (
            <div className="flex justify-between items-end flex-col w-full">
              {commonResponsibilities.length > initialDisplayCount && (
                <button
                  onClick={() => setShowAllCommon(!showAllCommon)}
                  className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  {showAllCommon
                    ? "Скрыть"
                    : `Показать все (${commonResponsibilities.length})`}
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="space-y-2">
            {displayedCommon.map((item) => (
              <div
                key={item.id}
                className="bg-slate-700 rounded-xl border border-gray-600 p-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base flex-1 min-w-0 pr-4">
                    {item.name}
                  </h3>
                  <div className="flex flex-col gap-2 min-w-[100px] sm:flex-row sm:space-x-2 sm:justify-end sm:min-w-0">
                    <span className="px-2 py-0.5 text-center rounded-full text-xs whitespace-nowrap bg-green-600 text-white">
                      Дополнительная
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading &&
          !showAllCommon &&
          commonResponsibilities.length > initialDisplayCount && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setShowAllCommon(true)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Показать еще{" "}
                {commonResponsibilities.length - initialDisplayCount}{" "}
                обязанностей...
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
