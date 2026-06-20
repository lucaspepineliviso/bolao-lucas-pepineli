"use client";

export default function RegrasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2">📖 Regras do Bolão</h1>
        <p className="text-text-muted">Bolão Lucas Pepineli - Copa do Mundo 2026</p>
      </div>

      <div className="space-y-6">
        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Como funciona
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
            <li>• Crie sua conta gratuitamente com nome e email.</li>
            <li>• Antes de cada jogo, faça seu palpite com o placar exato (ex: Brasil 2 × 1 Argentina).</li>
            <li>• Você pode palpitar em todos os 104 jogos da Copa (72 da fase de grupos + 32 do mata-mata).</li>
            <li>• Os palpites podem ser alterados até o apito inicial de cada partida.</li>
            <li>• Acompanhe seus acertos e sua pontuação no ranking do bolão.</li>
          </ul>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-accent/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-accent rounded-full" />
            Planos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-light rounded-xl p-4">
              <h3 className="font-bold text-lg mb-1">🆓 Grátis</h3>
              <p className="text-xs text-text-muted mb-2">Para quem só quer se divertir</p>
              <ul className="text-xs space-y-1">
                <li>✓ Palpites em todos os jogos</li>
                <li>✓ Ranking geral</li>
                <li className="text-danger">✗ Sem direito a prêmio</li>
              </ul>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <h3 className="font-bold text-lg mb-1">👑 Premium — R$ 10</h3>
              <p className="text-xs text-text-muted mb-2">Para quem quer concorrer ao prêmio</p>
              <p className="text-xs text-danger font-bold mb-2">⏰ Prazo: até 28/06/2026 (fim da fase de grupos)</p>
              <ul className="text-xs space-y-1">
                <li>✓ Palpites em todos os jogos</li>
                <li>✓ Ranking premium exclusivo</li>
                <li>✓ Concorre ao prêmio final (80% do total arrecadado)</li>
                <li className="text-xs text-text-muted mt-2">* 20% de taxa de administração</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-accent/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-success rounded-full" />
            Cálculo da Premiação
          </h2>
          <div className="bg-surface-light rounded-xl p-5 space-y-3 text-sm">
            <p className="font-medium">Fórmula do prêmio:</p>
            <div className="bg-bg rounded-xl p-4 font-mono text-sm space-y-1">
              <p><span className="text-text-muted">Prêmio Líquido</span> = <span className="text-accent">Total Arrecadado</span> − <span className="text-danger">Taxa Admin (20%)</span></p>
            </div>

            <div className="mt-3">
              <p className="font-medium mb-2">Exemplo com 20 participantes premium:</p>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-primary/10">
                    <td className="py-2 text-text-muted">Participantes Premium</td>
                    <td className="py-2 text-right font-bold">20</td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="py-2 text-text-muted">Valor por participante</td>
                    <td className="py-2 text-right font-bold">R$ 10</td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="py-2 text-text-muted">Total Arrecadado</td>
                    <td className="py-2 text-right font-bold text-accent">R$ 200</td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="py-2 text-text-muted">Taxa de Administração (20%)</td>
                    <td className="py-2 text-right font-bold text-danger">− R$ 40</td>
                  </tr>
                  <tr className="text-base">
                    <td className="py-2 font-bold text-success">🏆 Prêmio do Vencedor</td>
                    <td className="py-2 text-right font-black text-success">R$ 160</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3">
              <p className="font-medium mb-2">Outros exemplos:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface rounded-xl p-3">
                  <p className="text-text-muted">5 premium</p>
                  <p className="font-bold">R$ 50 → Prêmio: <span className="text-success">R$ 40</span></p>
                </div>
                <div className="bg-surface rounded-xl p-3">
                  <p className="text-text-muted">10 premium</p>
                  <p className="font-bold">R$ 100 → Prêmio: <span className="text-success">R$ 80</span></p>
                </div>
                <div className="bg-surface rounded-xl p-3">
                  <p className="text-text-muted">30 premium</p>
                  <p className="font-bold">R$ 300 → Prêmio: <span className="text-success">R$ 240</span></p>
                </div>
                <div className="bg-surface rounded-xl p-3">
                  <p className="text-text-muted">50 premium</p>
                  <p className="font-bold">R$ 500 → Prêmio: <span className="text-success">R$ 400</span></p>
                </div>
              </div>
            </div>

            <div className="mt-2 p-3 bg-primary/10 rounded-xl text-xs">
              <p className="font-medium mb-1">📌 Observações importantes:</p>
              <ul className="space-y-1 text-text-muted">
                <li>• A taxa de 20% cobre custos do sistema (hospedagem, domínio) e taxa de administração do organizador.</li>
                <li>• O prêmio é pago <strong>exclusivamente</strong> ao participante premium com maior pontuação ao final da Copa.</li>
                <li>• Em caso de empate em pontos, os critérios de desempate definidos neste regulamento serão aplicados.</li>
                <li>• O pagamento do prêmio será realizado via Pix em até 7 dias após o término da Copa.</li>
                <li>• Participantes gratuitos não concorrem ao prêmio, independente da pontuação.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-success rounded-full" />
            Pontuação
          </h2>
          <div className="space-y-3">
            <div className="bg-surface-light rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-success">Placar Exato</p>
                <p className="text-xs text-text-muted">Acertar o resultado e os gols de ambos os times</p>
              </div>
              <span className="text-2xl font-black text-success">10 pts</span>
            </div>
            <div className="bg-surface-light rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-secondary">Gols de Um Time</p>
                <p className="text-xs text-text-muted">Acertar o resultado e o número de gols de um dos times</p>
              </div>
              <span className="text-2xl font-black text-secondary">5 pts</span>
            </div>
            <div className="bg-surface-light rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-accent">Vencedor / Empate</p>
                <p className="text-xs text-text-muted">Acertar apenas quem venceu (ou que empatou), sem os gols</p>
              </div>
              <span className="text-2xl font-black text-accent">3 pts</span>
            </div>
            <div className="bg-surface-light rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-danger">Errou</p>
                <p className="text-xs text-text-muted">Não acertou o vencedor nem o empate</p>
              </div>
              <span className="text-2xl font-black text-danger">0 pts</span>
            </div>
          </div>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-accent rounded-full" />
            Exemplos
          </h2>
          <div className="space-y-3 text-sm">
            <div className="bg-surface-light rounded-xl p-4">
              <p className="font-medium mb-1">Jogo: Brasil 2 × 1 Argentina</p>
              <ul className="space-y-1 text-text-muted">
                <li>• Palpite <strong>2 × 1</strong> → <span className="text-success font-bold">10 pts</span> (placar exato)</li>
                <li>• Palpite <strong>2 × 0</strong> → <span className="text-secondary font-bold">5 pts</span> (acertou os gols do Brasil)</li>
                <li>• Palpite <strong>3 × 1</strong> → <span className="text-secondary font-bold">5 pts</span> (acertou os gols da Argentina)</li>
                <li>• Palpite <strong>3 × 2</strong> → <span className="text-accent font-bold">3 pts</span> (só acertou a vitória do Brasil)</li>
                <li>• Palpite <strong>1 × 2</strong> → <span className="text-danger font-bold">0 pts</span> (errou tudo)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-secondary rounded-full" />
            Critérios de Desempate
          </h2>
          <p className="text-sm text-text-muted mb-3">
            Caso dois ou mais participantes terminem com a mesma pontuação, o desempate será feito na seguinte ordem:
          </p>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-3 bg-surface-light rounded-xl p-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-medium">Mais placares exatos</p>
                <p className="text-xs text-text-muted">Quem acertou mais resultados com 10 pts</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-surface-light rounded-xl p-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-medium">Mais palpites com 5 pts</p>
                <p className="text-xs text-text-muted">Quem acertou mais gols de um time</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-surface-light rounded-xl p-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-medium">Menos palpites em branco</p>
                <p className="text-xs text-text-muted">Quem menos deixou de palpitar</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-surface-light rounded-xl p-3">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
              <div>
                <p className="font-medium">Ordem de cadastro</p>
                <p className="text-xs text-text-muted">Quem se cadastrou primeiro no bolão</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-danger rounded-full" />
            Regras Gerais
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
            <li>• <strong>Prazo:</strong> Os palpites podem ser feitos ou alterados até o apito inicial de cada partida. Após o início do jogo, o palpite é congelado.</li>
            <li>• <strong>Jogos encerrados:</strong> Quando o admin inserir o resultado real, os pontos são calculados automaticamente.</li>
            <li>• <strong>Mata-mata:</strong> Nos jogos eliminatórios (Oitavas, Quartas, Semifinal e Final), considere apenas o placar do tempo normal (incluindo acréscimos). Prorrogação e pênaltis não contam para o palpite.</li>
            <li>• <strong>Integridade:</strong> Cada participante pode ter apenas uma conta. Contas duplicadas serão removidas.</li>
            <li>• <strong>Admin:</strong> O organizador do bolão (Lucas Pepineli) é o administrador e responsável por inserir os resultados oficiais.</li>
            <li>• <strong>Prêmio:</strong> Apenas participantes <strong>Premium</strong> concorrem ao prêmio. O valor é calculado automaticamente: 80% do total arrecadado com as inscrições premium. O pagamento é feito via Pix pelo organizador em até 7 dias após a final.</li>
            <li>• <strong>Plano Premium:</strong> Para se tornar premium, acesse o menu do usuário e clique em "Seja Premium". O valor de R$ 10 é pago via Pix para o organizador. Após a confirmação, sua conta é liberada automaticamente.</li>
            <li>• <strong>Prazo para Premium:</strong> A opção de se tornar premium está disponível apenas até o <strong>dia 28 de Junho de 2026</strong> (fim da fase de grupos). Após essa data, não será mais possível alterar o plano. Participantes gratuitos permanecerão gratuitos até o final da Copa.</li>
          </ul>
        </section>

        <section className="bg-surface rounded-2xl p-6 border border-primary/10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Fases da Copa 2026
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {[
              { fase: "Fase de Grupos", jogos: 72, periodo: "11 a 27 de Junho" },
              { fase: "Oitavas de Final", jogos: 16, periodo: "28 Jun a 1 Jul" },
              { fase: "Oitavas Final", jogos: 8, periodo: "3 a 6 de Julho" },
              { fase: "Quartas de Final", jogos: 4, periodo: "9 a 11 de Julho" },
              { fase: "Semifinais", jogos: 2, periodo: "14 e 15 de Julho" },
              { fase: "Disputa 3º Lugar", jogos: 1, periodo: "18 de Julho" },
              { fase: "Final", jogos: 1, periodo: "19 de Julho" },
            ].map((item) => (
              <div key={item.fase} className="bg-surface-light rounded-xl p-3 text-center">
                <p className="font-bold text-xs">{item.fase}</p>
                <p className="text-lg font-black text-primary">{item.jogos}</p>
                <p className="text-xs text-text-muted">{item.periodo}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
