import type { Level } from './types'

export interface ScaleOption {
  value: Level
  label: string
  emoji: string
}

export const MOODS: ScaleOption[] = [
  { value: 1, label: 'Awful', emoji: '😣' },
  { value: 2, label: 'Low', emoji: '😔' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😄' },
]

export const ENERGY: ScaleOption[] = [
  { value: 1, label: 'Drained', emoji: '🪫' },
  { value: 2, label: 'Tired', emoji: '🥱' },
  { value: 3, label: 'Steady', emoji: '🙂' },
  { value: 4, label: 'Energized', emoji: '⚡' },
  { value: 5, label: 'Buzzing', emoji: '🚀' },
]

export const moodOf = (level: Level) => MOODS[level - 1]
export const energyOf = (level: Level) => ENERGY[level - 1]

export interface Activity {
  id: string
  label: string
  emoji: string
}

export const ACTIVITIES: Activity[] = [
  { id: 'exercise', label: 'Exercise', emoji: '🏃' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'friends', label: 'Friends', emoji: '🫶' },
  { id: 'family', label: 'Family', emoji: '🏡' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🌿' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'learning', label: 'Learning', emoji: '🧠' },
  { id: 'music', label: 'Music', emoji: '🎧' },
  { id: 'rest', label: 'Rest', emoji: '🛋️' },
]

export const activityOf = (id: string) => ACTIVITIES.find((a) => a.id === id)

export const PROMPTS = [
  "What's on your mind right now?",
  'What made you smile today?',
  'Describe a small moment you want to remember.',
  'What drained you today, and what restored you?',
  'What are you looking forward to?',
  "What's something you learned recently?",
  'If today had a headline, what would it be?',
]
