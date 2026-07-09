import { useState, useMemo, useRef, useEffect } from "react";
import { LuSlidersHorizontal, LuStore } from "react-icons/lu";
import { formatCurrency } from "@/utils/masks";
import Span from "@/components/ui/Span";
import H2Bold from "@/components/ui/H2Bold";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { useRevenue } from "@/features/Admin/hooks/useRevenue";
import { ErrorMessage } from "./ErrorMessage";

interface RevenueDisplayProps {
  role: "admin" | "manager" | "barber";
  title: string;
}

const RevenueDisplay = ({ role, title }: RevenueDisplayProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [tempType, setTempType] = useState<"day" | "month" | "quarter">(
    "month",
  );

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isBarber = role === "barber";

  const [filterType, setFilterType] = useState<
    "day" | "month" | "quarter" | undefined
  >();
  const [filterValue, setFilterValue] = useState<string | undefined>();

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const {
    data: revenue,
    isLoading,
    error,
  } = useRevenue(isAdmin || isManager, {
    filterType,
    filterValue,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleApplyFilter = () => {
    setFilterType(tempType);
    setFilterValue(tempValue);
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterType(undefined);
    setFilterValue(undefined);
    setIsFilterOpen(false);
  };

  const filterLabel = useMemo(() => {
    if (!filterType || !filterValue) return "";
    let formattedValue = filterValue;

    if (filterType === "month") {
      const [year, month] = filterValue.split("-").map(Number);
      const date = new Date(year, month - 1, 1);

      formattedValue = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(date);
    }

    if (filterType === "day") {
      const [year, month, day] = filterValue.split("-");
      formattedValue = `${day}/${month}/${year}`;
    }

    if (filterType === "quarter") {
      const [year, q] = filterValue.split("-Q");
      formattedValue = `${q}º trimestre de ${year}`;
    }

    return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
  }, [filterType, filterValue]);

  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [tempValue, setTempValue] = useState(getLocalDateString().slice(0, 7));

  const currentDisplayData = useMemo(() => {
    if (!revenue) return null;

    if (isAdmin && revenue.shops && selectedShopId) {
      return (
        revenue.shops.find((shop) => shop.id === selectedShopId) ||
        revenue.global
      );
    }

    if ((isAdmin || isManager) && revenue.global) return revenue.global;

    return {
      totalRevenue: revenue.totalRevenue ?? 0,
      filteredRevenue: revenue.filteredRevenue ?? 0,
    };
  }, [revenue, isAdmin, isManager, selectedShopId]);

  if (isLoading) return <IsFetchingAndLoading />;

  if (error) {
    return <ErrorMessage isMissing="renda" />;
  }

  const isFiltered = !!filterType && !!filterValue;

  return (
    <div className="max-w-[1000px] mx-auto w-full mt-8">
      <div className="flex justify-between items-center mb-6">
        <H2Bold>{title}</H2Bold>

        <div ref={filterWrapperRef} className="relative">
          <div
            className="flex p-2 items-center gap-2 cursor-pointer hover:bg-black/5 rounded-lg transition-colors border border-gray-200"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Span className="text-sm">Filtros</Span>
            <LuSlidersHorizontal size={18} />
          </div>

          {isFilterOpen && (
            <div
              style={{ padding: "20px", marginTop: "10px", minWidth: "280px" }}
              className="absolute top-full right-0 z-50 bg-[#1e2f62] rounded-xl shadow-2xl flex flex-col gap-4"
            >
              <div>
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Filtrar por período
                </span>
                <div className="flex justify-between gap-2 mt-3">
                  {(["day", "month", "quarter"] as const).map((type) => (
                    <button
                      key={type}
                      className={`
                        flex-1 py-2 text-xs rounded-lg font-bold transition-all uppercase
                        ${
                          tempType === type
                            ? "bg-blue-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }
                      `}
                      onClick={() => {
                        setTempType(type);
                        const localToday = getLocalDateString();
                        if (type === "day") setTempValue(localToday);
                        else if (type === "month")
                          setTempValue(localToday.slice(0, 7));
                        else
                          setTempValue(
                            `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`,
                          );
                      }}
                    >
                      {type === "day"
                        ? "Dia"
                        : type === "month"
                          ? "Mês"
                          : "Tri"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest block">
                  Data de Referência
                </span>
                <div className="mt-1">
                  {tempType === "quarter" ? (
                    <select
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium outline-none"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    >
                      {[1, 2, 3, 4].map((q) => (
                        <option
                          key={q}
                          value={`${new Date().getFullYear()}-Q${q}`}
                        >
                          {q}º Tri de {new Date().getFullYear()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full p-2 bg-white rounded-lg text-gray-700 font-medium outline-none"
                      type={tempType === "day" ? "date" : "month"}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  className="flex-1 py-2 bg-red-50/20 text-red-400 rounded-lg font-bold text-xs uppercase hover:bg-red-50/30 transition-colors"
                  onClick={handleClearFilter}
                >
                  Limpar
                </button>
                <button
                  className="flex-[2] py-2 bg-green-500 text-white rounded-lg font-bold text-xs uppercase hover:bg-green-600 transition-all"
                  onClick={handleApplyFilter}
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAdmin && revenue?.global && (
        <div className="bg-gradient-to-br from-[var(--revenueBoxFrom)] to-[var(--revenueBoxTo)] p-6 rounded-2xl shadow-lg mb-8 text-white">
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <LuStore size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Faturamento Global
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Acumulado</p>
              <p className="text-3xl font-bold">
                {formatCurrency(revenue.global.totalRevenue)}
              </p>
            </div>
            {isFiltered && (
              <div className="md:border-l md:border-white/20 md:pl-6">
                <p className="text-blue-200 text-sm mb-1">{filterLabel}</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(revenue.global.filteredRevenue)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && revenue?.shops && (
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Selecionar Unidade
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedShopId(null)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedShopId === null
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
              }`}
            >
              <p className="font-bold">Geral</p>
              <p className="text-[10px] opacity-60">Todas as unidades</p>
            </button>
            {revenue.shops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => setSelectedShopId(shop.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedShopId === shop.id
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                }`}
              >
                <p className="font-bold truncate">{shop.name}</p>
                <p className="text-[10px] opacity-60">Unidade específica</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentDisplayData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isBarber && (
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-blue-500 rounded-full" />
              <span className="font-bold text-gray-700">
                Detalhes:{" "}
                {isAdmin
                  ? selectedShopId
                    ? revenue?.shops?.find((s) => s.id === selectedShopId)?.name
                    : "Geral"
                  : isManager
                    ? revenue?.shops?.[0]?.name || "Minha Unidade"
                    : ""}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--totalRevenue)] p-6 rounded-2xl border border-gray-100 border-2 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[var(--textPrimary)] text-xs font-bold uppercase tracking-wider">
                Total Faturado
              </span>
              <p className="text-3xl font-bold text-[var(--textPrimary)] mt-2">
                {formatCurrency(currentDisplayData.totalRevenue)}
              </p>
            </div>

            {isFiltered && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                  {filterLabel}
                </span>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {formatCurrency(currentDisplayData.filteredRevenue)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {(!currentDisplayData ||
        (currentDisplayData.totalRevenue === 0 &&
          currentDisplayData.filteredRevenue === 0)) && (
        <div className="mt-10 text-center py-10 border-2 border-dashed border-[var(--textSecondary)] rounded-3xl">
          <Span className="text-[var(--textSecondary)]">
            Nenhum faturamento registrado para este período.
          </Span>
        </div>
      )}
    </div>
  );
};

export default RevenueDisplay;
