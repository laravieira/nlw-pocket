import axios from 'axios'
import type { AxiosInstance } from 'axios'

export type Summary = {
  completed: number
  total: number
  goalsPerDay: {
    [key: string]: {
      id: string
      title: string
      completedAt: string
    }[]
  } | null
}

export type GoalType = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

export type Completion = {
  id: string
  goalId: string
  completedAt: string
}

class Goal {
  protected static API_URL = 'http://localhost:3000'
  protected static axios: AxiosInstance

  constructor() {
    Goal.axios = axios.create({
      baseURL: Goal.API_URL,
    })
  }

  async summary() {
    return Goal.axios.get('/week').then(response => {
      const {
        data: { summary },
      } = response
      return summary as Summary
    })
  }

  async goals() {
    return Goal.axios.get('/goals').then(response => {
      const { data } = response
      return data as GoalType[]
    })
  }

  async create(title: string, desiredWeeklyFrequency: number) {
    return Goal.axios
      .post('/goals', {
        title,
        desiredWeeklyFrequency,
      })
      .then(response => {
        const { data } = response
        return data.goal as GoalType
      })
  }

  async complete(id: string) {
    return Goal.axios.patch(`/goals/${id}`).then(response => {
      const { data } = response
      return data.goalCompletion as Completion
    })
  }
}

export default Goal
