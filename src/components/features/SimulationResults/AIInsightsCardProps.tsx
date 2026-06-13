import 'react-loading-skeleton/dist/skeleton.css'

import { ArrowUp, LoaderCircle, MessageCircleMore } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Button } from '@/components/shared/Button'
import type { SimulationRecord } from '@/data/simulation'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getChatResponse } from '@/services/aiService'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const simulation = getFormData(simulationId)
    return (simulation?.conversation ?? []).map((message, index) => ({
      ...message,
      id: message.id || `${simulationId}-${index}`,
    }))
  })
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending, chatError])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const question = draft.trim()
    if (!question) {
      return
    }

    const simulation = getFormData(simulationId)
    if (!simulation) {
      setChatError('Simulação não encontrada para continuar a conversa.')
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setDraft('')
    setIsSending(true)
    setChatError(null)

    const updatedSimulation: SimulationRecord = {
      ...simulation,
      conversation: nextMessages,
    }

    updateSimulation(simulationId, updatedSimulation)

    try {
      const prompt = [
        'Você é um educador financeiro empático e claro.',
        'Responda em português, de forma objetiva e útil.',
        'Use o contexto da simulação abaixo para responder a pergunta do usuário.',
        `Objetivo: ${simulation.goalName}`,
        `Custo da meta: ${simulation.goalAmount}`,
        `Prazo: ${simulation.goalDeadline} meses`,
        `Renda mensal: ${simulation.income}`,
        `Despesas fixas: ${simulation.expenses}`,
        `Dívidas/parcelas: ${simulation.debts}`,
        '',
        'Histórico da conversa:',
        ...nextMessages.map(
          (message) => `${message.role === 'user' ? 'Usuário' : 'Educador'}: ${message.content}`,
        ),
        '',
        'Responda apenas à última pergunta do usuário, em no máximo 5 parágrafos.',
      ].join('\n')

      const response = await getChatResponse(prompt)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.trim(),
        createdAt: new Date().toISOString(),
      }

      const finalMessages = [...nextMessages, assistantMessage]
      setMessages(finalMessages)
      updateSimulation(simulationId, {
        ...updatedSimulation,
        conversation: finalMessages,
      })
    } catch {
      setChatError('Não foi possível responder agora. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => fetchInsight(simulationId)}
        />
      )}
      {!isLoading && insight && <Content insight={insight} />}

      <div className="border-border/60 bg-background/50 mt-6 rounded-2xl border p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageCircleMore size={18} className="text-primary" />
          <span className="text-foreground text-sm font-semibold">
            Converse com o Educador Financeiro
          </span>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Faça uma pergunta sobre a sua simulação, como estratégias de economia ou como alcançar
              a meta.
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border-border/60 border'
                  }`}
                >
                  <p className="mb-1 text-[11px] font-semibold tracking-[0.2em] uppercase opacity-70">
                    {message.role === 'user' ? 'Você' : 'Educador'}
                  </p>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="border-border/60 bg-card text-muted-foreground rounded-2xl border px-3 py-2 text-sm">
                Pensando em uma resposta...
              </div>
            </div>
          )}

          {chatError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {chatError}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Pergunte algo sobre sua simulação..."
            className="border-border bg-background text-foreground focus:border-primary min-h-24 flex-1 rounded-2xl border px-3 py-2 text-sm outline-none"
          />
          <Button
            variant="primary"
            icon={isSending ? LoaderCircle : ArrowUp}
            type="submit"
            disabled={isSending || !draft.trim()}
            className="h-fit self-end"
          >
            {isSending ? 'Enviando' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
