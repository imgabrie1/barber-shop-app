import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "@/services/api";
import H2Bold from "@/components/ui/H2Bold";

const WhatsappAdmin = () => {
  const [status, setStatus] = useState<
    "CONNECTED" | "DISCONNECTED" | "LOADING"
  >("LOADING");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const hasTriggeredStart = useRef(false);

  const handleStartWhatsApp = async () => {
    try {
      setIsStarting(true);
      await api.post("/whatsapp/start");
      setTimeout(() => setIsStarting(false), 2000);
    } catch (error) {
      console.error("Erro ao iniciar o WhatsApp:", error);
      setIsStarting(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const response = await api.get("/whatsapp/status");

        if (response.data.connected) {
          setStatus("CONNECTED");
          setQrCode(null);
        } else {
          setStatus("DISCONNECTED");
          setQrCode(response.data.qr);

          if (!response.data.qr && !hasTriggeredStart.current) {
            hasTriggeredStart.current = true;
            handleStartWhatsApp();
          }
        }
      } catch (error) {
        console.error("Erro ao buscar status do WhatsApp:", error);
      }
    };

    fetchStatus();

    if (status !== "CONNECTED") {
      interval = setInterval(fetchStatus, 3000);
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        paddingTop: "40px",
      }}
    >
      <H2Bold>Conexão WhatsApp</H2Bold>

      <div className="mt-10 p-10 border rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[350px]">
        {status === "LOADING" && <p>Carregando status...</p>}

        {status === "CONNECTED" && (
          <div className="text-green-600 flex flex-col items-center">
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/xl"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <H2Bold>WhatsApp Conectado com sucesso!</H2Bold>
            <p className="mt-2 text-gray-500">
              As notificações automáticas estão ativas.
            </p>
          </div>
        )}

        {status === "DISCONNECTED" && qrCode && (
          <div className="flex flex-col items-center">
            <p className="mb-6 text-gray-600">
              Escaneie o QR Code abaixo com o seu WhatsApp (Dispositivos
              Conectados) para ativar o bot da barbearia.
            </p>
            <div className="p-4 bg-white border-4 border-gray-200 rounded-xl">
              <QRCodeSVG value={qrCode} size={256} />
            </div>
            <p className="mt-4 text-sm text-gray-400">
              O QR Code atualiza automaticamente.
            </p>
          </div>
        )}

        {status === "DISCONNECTED" && !qrCode && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500">
              {isStarting
                ? "Iniciando o serviço e gerando QR Code..."
                : "O serviço do WhatsApp está em modo de espera para poupar recursos."}
            </p>
            {!isStarting && (
              <button
                onClick={handleStartWhatsApp}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow transition-colors"
              >
                Gerar QR Code para Conectar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsappAdmin;
