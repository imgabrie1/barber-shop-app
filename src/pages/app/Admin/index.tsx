import H2Bold from "@/components/ui/H2Bold";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import Span from "@/components/ui/Span";
import { useRevenue } from "@/features/Admin/hooks/useRevenue";
import { formatCurrency } from "@/utils/masks";
import { useState, useMemo } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";

const AdminPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempType, setTempType] = useState<"day" | "month" | "quarter">(
    "month",
  );
  const [tempValue, setTempValue] = useState(
    new Date().toISOString().split("T")[0].slice(0, 7),
  );

  const [filterType, setFilterType] = useState<
    "day" | "month" | "quarter" | undefined
  >();
  const [filterValue, setFilterValue] = useState<string | undefined>();

  const {
    data: revenue,
    isLoading,
    error,
  } = useRevenue({
    filterType,
    filterValue,
  });

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
      const date = new Date(filterValue + "-01");
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
      formattedValue = `${q}º trimestre ${year}`;
    }

    return `${formattedValue}`;
  }, [filterType, filterValue]);

  if (isLoading) return <IsFetchingAndLoading />;

  if (error) {
    return (
      <div>
        <H2Bold>Painel Administrativo</H2Bold>
        <p role="alert">
          {error instanceof Error ? error.message : "Erro ao buscar renda"}
        </p>
      </div>
    );
  }

  const isFiltered = !!filterType && !!filterValue;
  const isBroken =
    !revenue || (revenue.totalRevenue === 0 && revenue.filteredRevenue === 0);

  return (
    <div style={{ padding: "0 10px" }}>
      <H2Bold style={{ marginBottom: "10px" }}>Painel Administrativo</H2Bold>

      <div className="flex flex-col items-end relative">
        <div
          style={{ paddingLeft: "30vw" }}
          className="flex flex-col w-[50vw] relative"
        >
          <div
            className="flex items-center justify-between  cursor-pointer p-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Span>Filtros</Span>

            <LuSlidersHorizontal size={20} />
          </div>

          {isFilterOpen && (
            <div
              style={{
                padding: "20px",
                marginTop: "10px",
                minWidth: "280px",
              }}
              className="absolute top-full right-0 z-50 bg-white border border-gray-100 rounded-xl shadow-2xl flex flex-col gap-4 border-t-4 border-blue-500 animate-in fade-in zoom-in duration-200"
            >
              <div>
                <span className="text-blue-900 text-xs font-bold uppercase tracking-widest">
                  Filtrar por período
                </span>
                <div
                  style={{ marginTop: "12px" }}
                  className="flex justify-between gap-2"
                >
                  {(["day", "month", "quarter"] as const).map((type) => (
                    <button
                      key={type}
                      style={{ padding: "8px 12px" }}
                      className={`
                        flex-1 text-xs rounded-lg font-bold transition-all uppercase tracking-tighter
                        ${
                          tempType === type
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }
                        active:scale-95
                        `}
                      onClick={() => {
                        setTempType(type);
                        const now = new Date().toISOString().split("T")[0];
                        if (type === "day") setTempValue(now);
                        else if (type === "month")
                          setTempValue(now.slice(0, 7));
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
                          : "Trimestre"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">
                  Data de Referência
                </span>
                <div style={{ marginTop: "6px" }}>
                  {tempType === "quarter" ? (
                    <select
                      style={{ padding: "10px" }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    >
                      {[1, 2, 3, 4].map((q) => (
                        <option
                          key={q}
                          value={`${new Date().getFullYear()}-Q${q}`}
                        >
                          {q}º Trimestre de {new Date().getFullYear()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={{ padding: "10px" }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      type={tempType === "day" ? "date" : "month"}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div style={{ marginTop: "10px" }} className="flex gap-3">
                <button
                  style={{ padding: "12px" }}
                  className="flex-1 bg-red-50 text-red-600 rounded-lg font-bold text-xs uppercase hover:bg-red-100 transition-colors"
                  onClick={handleClearFilter}
                >
                  Limpar
                </button>
                <button
                  style={{ padding: "12px" }}
                  className="flex-[2] bg-green-500 text-white rounded-lg font-bold text-xs uppercase shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:translate-y-0.5"
                  onClick={handleApplyFilter}
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {isFiltered ? (
          <div
            style={{ marginTop: "30px" }}
            className="h-[20vh] flex flex-col justify-between gap-4"
          >
            <div
              style={{ padding: "24px" }}
              className="bg-[var(--revenueFilteredBox)] rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col items-start transition-shadow hover:shadow-lg"
            >
              <span className="text-blue-900 text-sm font-medium uppercase tracking-wider">
                {filterLabel}
              </span>
              <div
                style={{ marginTop: "8px" }}
                className="text-3xl font-bold text-gray-800"
              >
                {formatCurrency(revenue?.filteredRevenue ?? 0)}
              </div>
            </div>
            <div
              style={{ padding: "24px" }}
              className="bg-[var(--revenueBox)] rounded-lg shadow-md border-l-4 border-green-500 flex flex-col items-start transition-shadow hover:shadow-lg"
            >
              <span className="text-green-900 text-sm font-medium uppercase tracking-wider">
                Total Acumulado
              </span>
              <div
                style={{ marginTop: "8px" }}
                className="text-3xl font-bold text-gray-800"
              >
                {formatCurrency(revenue?.totalRevenue ?? 0)}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ marginTop: "30px" }}
            className="h-[20vh] flex flex-col justify-between"
          >
            <div
              style={{ padding: "24px" }}
              className="bg-[var(--revenueBox)] rounded-lg shadow-md border-l-4 border-green-500 flex flex-col items-start transition-shadow hover:shadow-lg"
            >
              <span className="text-green-900 text-sm font-medium uppercase tracking-wider">
                Total Faturado
              </span>
              <div
                style={{ marginTop: "8px" }}
                className="text-3xl font-bold text-gray-800"
              >
                {formatCurrency(revenue?.totalRevenue ?? 0)}
              </div>
            </div>
          </div>
        )}
      </div>

      {isBroken && (
        <div>
          <Span>O caixa está vazio. Por enquanto...</Span>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
