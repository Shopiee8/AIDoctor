import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  id: string
  name: string
  href: string
  status: 'complete' | 'current' | 'upcoming'
}

type StepsProps = {
  steps: Omit<Step, 'status'>[]
  currentStep: string
  className?: string
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  const stepsWithStatus = steps.map((step) => ({
    ...step,
    status:
      step.id === currentStep
        ? 'current'
        : steps.findIndex((s) => s.id === step.id) <
          steps.findIndex((s) => s.id === currentStep)
        ? 'complete'
        : 'upcoming',
  }))

  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="flex items-center justify-center">
        {stepsWithStatus.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary dark:bg-primary/80" />
                </div>
                <a
                  href={step.href}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary text-primary-foreground"
                >
                  <Check className="h-5 w-5 text-inherit" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === 'current' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <a
                  href={step.href}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background dark:bg-card"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <a
                  href={step.href}
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-card dark:hover:border-gray-500"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 hidden justify-center space-x-8 sm:flex">
        {stepsWithStatus.map((step) => (
          <div key={step.id} className="flex items-center">
            <span
              className={cn(
                'text-sm font-medium',
                step.status === 'current' 
                  ? 'text-primary dark:text-primary-foreground' 
                  : 'text-muted-foreground',
                step.status === 'complete' ? 'text-primary dark:text-primary-foreground' : ''
              )}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </nav>
  )
}
