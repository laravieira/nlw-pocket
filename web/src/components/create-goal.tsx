import Goal from '@/goal.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@ui/button.tsx'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@ui/dialog.tsx'
import { Input } from '@ui/input.tsx'
import { Label } from '@ui/label.tsx'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@ui/radio-group.tsx'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Descreva a atividade.').max(255),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalProps = {
  setOpenCreateGoal: (open: boolean) => void
}

function CreateGoal(props: CreateGoalProps) {
  const queryClient = useQueryClient()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: '',
      desiredWeeklyFrequency: '3',
    },
  })

  async function onCreateGoal(data: z.infer<typeof createGoalSchema>) {
    await new Goal()
      .create(data.title, data.desiredWeeklyFrequency)
      .catch(console.error)
    await queryClient.invalidateQueries({ queryKey: ['summary'] })
    await queryClient.invalidateQueries({ queryKey: ['goals'] })
    reset()
    props.setOpenCreateGoal(false)
  }

  function renderHeader() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <DialogTitle>Cadastrar meta</DialogTitle>
          <DialogClose>
            <X className="size-5 text-zinc-600" />
          </DialogClose>
        </div>
        <DialogDescription>
          Adicione atividades que <u>te fazem bem</u> e que você quer continuar
          praticando toda semana.
        </DialogDescription>
      </div>
    )
  }

  function renderFormBody() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Qual a atividade?</Label>
          <Input
            id="title"
            autoFocus
            placeholder="Praticar exercícios, meditar, etc."
            {...register('title')}
          />
          {errors.title && (
            <p className="text-red-400 text-sm">
              {errors.title.message as string}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weekly-frequency">Quantas vezes na semana?</Label>
          <Controller
            name="desiredWeeklyFrequency"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup value={value} onValueChange={onChange}>
                {['🥱', '🙂', '😎', '😜', '🤨', '🤯', '🔥'].map(
                  (emoji, index) => (
                    <RadioGroupItem key={emoji} value={`${index + 1}`}>
                      <RadioGroupIndicator />
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        {index === 6
                          ? 'Todos os dias da semana'
                          : `${index + 1}x na semana`}
                      </span>
                      <span className="text-lg leading-none">{emoji}</span>
                    </RadioGroupItem>
                  )
                )}
              </RadioGroup>
            )}
          />
        </div>
      </div>
    )
  }

  function renderFooter() {
    return (
      <div className="flex items-center gap-3">
        <DialogClose asChild>
          <Button type="button" className="flex-1" variant="secondary">
            Fechar
          </Button>
        </DialogClose>
        <Button className="flex-1">Salvar</Button>
      </div>
    )
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        {renderHeader()}
        <form
          className="flex-1 flex flex-col justify-between"
          onSubmit={handleSubmit(data =>
            onCreateGoal(data as unknown as z.infer<typeof createGoalSchema>)
          )}
        >
          {renderFormBody()}
          {renderFooter()}
        </form>
      </div>
    </DialogContent>
  )
}

export default CreateGoal
