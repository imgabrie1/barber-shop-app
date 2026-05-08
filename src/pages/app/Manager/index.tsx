import RevenueDisplay from "@/components/common/RevenueDisplay";

const ManagerPage = () => {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <RevenueDisplay role="manager" title="Painel do Gerente" />
    </div>
  );
};

export default ManagerPage;
