import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";
import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { ErrorMessage } from "@/components/common/ErrorMessage";

import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import { useShopUnits } from "@/features/barberServices/hooks/useShopUnits";
import { useAppointment } from "@/contexts/useAppointment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Span from "@/components/ui/Span";

const SelectServicePage = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState<"init" | "shopData">("init");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  const {
    setCurrentServiceId,
    setCurrentServiceName,
    setCurrentServiceDuration,
    setCurrentShopId,
    setCurrentShopName,
  } = useAppointment();

  const {
    data: shopData,
    isLoading: shopLoading,
    error: shopError,
  } = useShopUnits();

  const {
    data: services,
    isFetching: isFetchingServices,
    isLoading: isLoadingServices,
    error: errorServices,
  } = useServices(
    selectedShopId ?? "",
    currentPage,
    stage === "shopData" && !!selectedShopId,
  );

  const handleSelectShop = (shopId: string, shopName: string) => {
    setSelectedShopId(shopId);
    setCurrentShopName(shopName);
    setStage("shopData");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (services && currentPage < Math.ceil(services.total / services.limit)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isFirstPage = currentPage === 1;

  const isLastPage = services
    ? currentPage >= Math.ceil(services.total / services.limit)
    : true;

  if (stage === "init") {
    return (
      <div>
        <H2Bold>Selecione uma Unidade</H2Bold>

        {shopLoading && <IsFetchingAndLoading />}
        {shopError && <ErrorMessage isMissing="unidades" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {shopData?.map((shop) => (
            <div
              key={shop.id}
              onClick={() => handleSelectShop(shop.id, shop.name)}
              className="flex p-4 justify-between items-center cursor-pointer border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div>
                <P className="font-bold">{shop.name}</P>

                <P className="text-sm opacity-70">
                  {shop.address || "Endereço não informado"}
                </P>
              </div>

              <MdNavigateNext size={30} className="text-[var(--textPrimary)]" />
            </div>
          ))}
        </div>

        {!shopData?.length && (
          <div className="flex items-center mt-6 justify-center">
            <p className="text-2xl text-gray-400 font-bold">
              Nenhuma unidade encontrada
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => {
            setStage("init");
            setCurrentPage(1);
          }}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <MdArrowBack size={24} />
        </button>

        <H2Bold>Serviços Disponíveis</H2Bold>
      </div>

      {(isLoadingServices || shopLoading) && <IsFetchingAndLoading />}

      {errorServices && <ErrorMessage isMissing="serviços" />}

      {!isLoadingServices && services?.data?.length === 0 && (
        <div className="flex justify-center items-center mt-6">
          <p className="text-gray-400 font-bold text-xl">
            Nenhum serviço encontrado para esta unidade.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mt-6">
          {services?.data?.map((service) => {
            const handleSelectService = () => {
              setCurrentServiceId(service.id);
              setCurrentServiceName(service.name);
              setCurrentServiceDuration(service.durationMinutes);
              setCurrentShopId(selectedShopId);

              navigate(
                `/app/appointment/select-barber/${service.id}?price=${service.price}&shopId=${selectedShopId}`,
                {
                  state: { price: service.price },
                },
              );
            };

            return (
              <div
                key={service.id}
                onClick={handleSelectService}
                className="flex p-3 justify-between items-center cursor-pointer border-white/20 border-b md:border md:rounded-lg hover:bg-white/5"
              >
                <div>
                  <P className="font-medium">{service.name}</P>

                  <P className="text-sm opacity-80">
                    Duração média: {service.durationMinutes} min
                  </P>

                  <P className="text-[var(--textPrimary)]">
                    R$ {service.price}
                  </P>
                </div>

                <MdNavigateNext
                  className="text-[var(--textPrimary)] md:hidden"
                  size={30}
                />
              </div>
            );
          })}
        </div>

        {services && services.total > services.limit && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center justify-center gap-4">
              <IoIosArrowBack
                size={24}
                onClick={handlePrevPage}
                className="text-[var(--textPrimary)]"
                style={{
                  cursor: isFirstPage ? "default" : "pointer",
                  opacity: isFirstPage ? 0.3 : 1,
                }}
              />

              <Span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                Página {currentPage} de{" "}
                {Math.ceil(services.total / services.limit)}
              </Span>

              <IoIosArrowForward
                size={24}
                onClick={handleNextPage}
                className="text-[var(--textPrimary)]"
                style={{
                  cursor: isLastPage ? "default" : "pointer",
                  opacity: isLastPage ? 0.3 : 1,
                }}
              />
            </div>

            {isFetchingServices && !isLoadingServices && (
              <p className="text-center text-xs text-gray-400">Carregando...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectServicePage;
