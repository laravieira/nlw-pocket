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

function CreateGoal() {
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
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weekly-frequency">Quantas vezes na semana?</Label>
          <RadioGroup>
            {['🥱', '🙂', '😎', '😜', '🤨', '🤯', '🔥'].map((emoji, index) => (
              <RadioGroupItem key={emoji} value={index + 1}>
                <RadioGroupIndicator />
                <span className="text-zinc-300 text-sm font-medium leading-none">
                  {index === 6
                    ? 'Todos os dias da semana'
                    : `${index + 1}x na semana`}
                </span>
                <span className="text-lg leading-none">{emoji}</span>
              </RadioGroupItem>
            ))}
          </RadioGroup>
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
        <form className="flex-1 flex flex-col justify-between">
          {renderFormBody()}
          {renderFooter()}
        </form>
      </div>
    </DialogContent>
  )
}

export default CreateGoal
