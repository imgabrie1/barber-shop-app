import { useUsers } from "../../../features/users/hooks/useUsers";

const DashboardPage = () => {
  const { data, isFetching, error } = useUsers();

  return (
    <div>
      <p>DashboardPage</p>
      {/* <button type="button" onClick={() => refetch()}>
        Buscar
      </button> */}
      {isFetching ? <p>Carregando...</p> : null}
      {error ? <p role="alert">Erro ao buscar usuarios</p> : null}
      {data ? data.map((user) => <p key={user.id}>{user.name}</p>) : null}
    </div>
  );
};
export default DashboardPage;
