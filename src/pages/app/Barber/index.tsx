import RevenueDisplay from "@/components/common/RevenueDisplay";

const BarberPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <RevenueDisplay role="barber" title="Painel do Barbeiro" />
    </div>
  );
};

export default BarberPage;
