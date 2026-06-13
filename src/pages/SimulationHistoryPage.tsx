import { ArrowRight, CalendarDays, Goal, PiggyBank, Trash2, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getAllFormData, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => getAllFormData())

  const sortedSimulations = useMemo(
    () =>
      [...simulations].sort((a, b) => {
        const dateA = new Date(a.createdAt ?? 0).getTime()
        const dateB = new Date(b.createdAt ?? 0).getTime()
        return dateB - dateA
      }),
    [simulations],
  )

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((simulation) => simulation.id !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe seus objetivos e retome qualquer planejamento salvo."
      />

      {sortedSimulations.length === 0 ? (
        <div className="bg-card border-border rounded-2xl border border-dashed p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <p className="text-foreground mb-2 text-lg font-semibold">
            Nenhuma simulação salva ainda
          </p>
          <p className="text-muted-foreground mb-6 text-sm">
            Crie sua primeira simulação para começar a acompanhar seu progresso.
          </p>
          <Button variant="primary" onClick={() => void navigate('/')}>
            Criar nova simulação
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedSimulations.map((simulation) => {
            const monthlySavings = calcMonthlySavings(simulation)
            const createdAt = simulation.createdAt
              ? new Date(simulation.createdAt).toLocaleDateString('pt-BR')
              : 'Data indisponível'

            return (
              <article
                key={simulation.id}
                className="bg-card border-border/60 flex flex-col gap-4 rounded-2xl border p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)] lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-3 lg:min-w-0 lg:flex-1">
                  <div className="bg-primary/10 mt-0.5 rounded-2xl p-2.5">
                    <Goal size={18} className="text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                        Simulação salva
                      </p>
                      <span className="text-muted-foreground text-sm">{createdAt}</span>
                    </div>
                    <h2 className="text-foreground text-lg font-semibold">{simulation.goalName}</h2>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-120 lg:flex-1">
                  <div className="border-border/60 bg-background/60 rounded-xl border px-3 py-2">
                    <div className="mb-1 flex items-center gap-2">
                      <Wallet size={14} className="text-primary" />
                      <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">
                        Meta
                      </span>
                    </div>
                    <p className="text-foreground text-sm font-medium">{simulation.goalAmount}</p>
                  </div>

                  <div className="border-border/60 bg-background/60 rounded-xl border px-3 py-2">
                    <div className="mb-1 flex items-center gap-2">
                      <CalendarDays size={14} className="text-primary" />
                      <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">
                        Prazo
                      </span>
                    </div>
                    <p className="text-foreground text-sm font-medium">
                      {simulation.goalDeadline} meses
                    </p>
                  </div>

                  <div className="border-border/60 bg-background/60 rounded-xl border px-3 py-2">
                    <div className="mb-1 flex items-center gap-2">
                      <PiggyBank size={14} className="text-primary" />
                      <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">
                        Economia
                      </span>
                    </div>
                    <p className="text-foreground text-sm font-medium">
                      {currencyFormatter.format(monthlySavings)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Button
                    variant="primary"
                    icon={ArrowRight}
                    onClick={() => void navigate(`/resultado/${simulation.id}`)}
                  >
                    Ver detalhes
                  </Button>
                  <Button
                    variant="secondary"
                    icon={Trash2}
                    onClick={() => handleDelete(simulation.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
