import { useParams, Link } from "react-router-dom";

export default function JobDetailPage() {
  const { id } = useParams();

  // Simulando dados só pra exemplo — depois você pode buscar de uma API ou lista
  const vagas = [
    { id: "1", titulo: "Cozinheiro", empresa: "Restaurante Bom Sabor", cidade: "São Paulo", salario: "R$ 130/dia", descricao: "Responsável por preparar refeições e manter a cozinha organizada." },
    { id: "2", titulo: "Auxiliar de Horta", empresa: "Fazenda Verde Vida", cidade: "Ubarana-SP", salario: "R$ 100/dia", descricao: "Auxiliar no plantio e manutenção das hortaliças." },
  ];

  const vaga = vagas.find(v => v.id === id);

  if (!vaga) {
    return <p className="p-6 text-gray-600">Vaga não encontrada.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700">{vaga.titulo}</h1>
      <p><strong>Empresa:</strong> {vaga.empresa}</p>
      <p><strong>Cidade:</strong> {vaga.cidade}</p>
      <p><strong>Salário:</strong> {vaga.salario}</p>
      <p className="mt-2">{vaga.descricao}</p>

      <Link to="/jobs" className="text-blue-600 underline mt-4 block">
        ← Voltar para lista de vagas
      </Link>
    </div>
  );
}
