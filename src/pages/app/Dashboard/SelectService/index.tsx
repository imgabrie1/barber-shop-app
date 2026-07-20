import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";
import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { SiGooglemaps } from "react-icons/si";
import { BiSolidBusiness } from "react-icons/bi";

import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import { useShopUnits } from "@/features/barberServices/hooks/useShopUnits";
import { useAppointment } from "@/contexts/useAppointment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Span from "@/components/ui/Span";

const SelectServicePage = () => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

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

  const hasSingleShop = shopData && shopData.length === 1;
  const resolvedShopId = hasSingleShop ? shopData[0].id : selectedShopId;
  const resolvedStage = hasSingleShop ? "shopData" : stage;
  const selectedShop = shopData?.find((shop) => shop.id === resolvedShopId);

  const {
    data: services,
    isFetching: isFetchingServices,
    isLoading: isLoadingServices,
    error: errorServices,
  } = useServices(
    resolvedShopId ?? "",
    currentPage,
    resolvedStage === "shopData" && !!resolvedShopId,
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

  const handleGoBack = () => {
    if (shopData && shopData.length === 1) {
      navigate(-1);
    } else {
      setStage("init");
      setCurrentPage(1);
    }
  };

  if (resolvedStage === "init") {
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
              className="flex p-4 justify-between items-center cursor-pointer border border-[var(--borderBox)] rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex-1">
                <P className="font-bold">{shop.name}</P>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <P className="text-sm opacity-70">
                    {shop.address || "Endereço não informado"}
                  </P>
                  {shop.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-white/10 rounded text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs"
                      title="Ver no Google Maps"
                    >
                      <SiGooglemaps size={14} />
                      <span className="text-[10px] opacity-80 underline font-medium">Ver no mapa</span>
                    </a>
                  )}
                </div>
              </div>

              <MdNavigateNext size={30} className="text-[var(--textPrimary)] group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>

        {!shopData?.length && !shopLoading && (
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
        {!hasSingleShop && (
          <button
            onClick={handleGoBack}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <MdArrowBack size={24} />
          </button>
        )}

        <H2Bold>Serviços Disponíveis</H2Bold>
      </div>

      {selectedShop && (
        <div className="mb-6 p-4 bg-white/5 border border-[var(--borderBox)] rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--textPrimary)]/10 text-[var(--textPrimary)] rounded-lg flex-shrink-0">
              <BiSolidBusiness size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Unidade Selecionada</p>
              <p className="text-sm font-bold text-white">{selectedShop.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedShop.address || "Endereço não informado"}</p>
            </div>
          </div>
          {selectedShop.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedShop.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
              title="Ver no Google Maps"
            >
              <SiGooglemaps size={16} />
              <span>Ver no mapa</span>
            </a>
          )}
        </div>
      )}

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
              setCurrentShopId(resolvedShopId);

              const currentShop = shopData?.find(
                (s) => s.id === resolvedShopId,
              );
              if (currentShop) {
                setCurrentShopName(currentShop.name);
              }

              navigate(
                `/t/${tenantSlug}/app/appointment/select-barber/${service.id}?price=${service.price}&shopId=${resolvedShopId}`,
                {
                  state: { price: service.price },
                },
              );
            };

            return (
              <div
                key={service.id}
                onClick={handleSelectService}
                className="flex p-3 justify-between items-center cursor-pointer border-[var(--borderBox)] border-b md:border md:rounded-lg hover:bg-white/5"
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