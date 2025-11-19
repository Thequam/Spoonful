// Default activities that will be seeded for each new user
export const DEFAULT_ACTIVITIES = [
  // Very High Energy (5 spoons)
  {
    name: "Running Long Distance",
    spoons: 5,
    category: "Very High Energy",
    description: "Marathon or long-distance running",
  },
  { name: "Power Gym Session", spoons: 5, category: "Very High Energy", description: "Intense weightlifting or HIIT" },
  { name: "Sports Match", spoons: 5, category: "Very High Energy", description: "Competitive sports or team games" },
  {
    name: "Long Distance Driving",
    spoons: 5,
    category: "Very High Energy",
    description: "Extended driving requiring extreme concentration",
  },

  // High Energy (4 spoons)
  { name: "Gym/Exercise", spoons: 4, category: "High Energy", description: "Intense physical activity" },
  {
    name: "Heavy Socialising",
    spoons: 4,
    category: "High Energy",
    description: "Large gatherings or extended social events",
  },
  {
    name: "Driving Long Distance",
    spoons: 4,
    category: "High Energy",
    description: "Extended driving requiring high concentration",
  },
  { name: "Dancing", spoons: 4, category: "High Energy", description: "Active dancing or dance classes" },
  { name: "Hiking", spoons: 4, category: "High Energy", description: "Outdoor hiking or trekking" },

  // Medium Energy (3 spoons)
  { name: "Laptop Work", spoons: 3, category: "Medium Energy", description: "Focused computer work" },
  {
    name: "Conversations/Meetings",
    spoons: 3,
    category: "Medium Energy",
    description: "Business meetings or important conversations",
  },
  { name: "Shopping", spoons: 3, category: "Medium Energy", description: "Grocery or retail shopping" },
  { name: "Cooking Meal", spoons: 3, category: "Medium Energy", description: "Preparing a full meal" },
  { name: "Cleaning House", spoons: 3, category: "Medium Energy", description: "Deep cleaning or housework" },

  // Low Energy (2 spoons)
  { name: "House Chores", spoons: 2, category: "Low Energy", description: "Light household tasks" },
  { name: "Light Cooking", spoons: 2, category: "Low Energy", description: "Simple meal preparation" },
  { name: "Relaxing/TV", spoons: 2, category: "Low Energy", description: "Watching TV or relaxing" },
  { name: "Rest in Car", spoons: 2, category: "Low Energy", description: "Resting while in vehicle" },
  { name: "Light Socialising", spoons: 2, category: "Low Energy", description: "Brief social interactions" },

  // Very Low Energy (1 spoon)
  { name: "Reading", spoons: 1, category: "Very Low Energy", description: "Reading books or articles" },
  { name: "Short Phone Call", spoons: 1, category: "Very Low Energy", description: "Brief phone conversations" },
  { name: "Quiet Social Interaction", spoons: 1, category: "Very Low Energy", description: "Calm one-on-one time" },
  { name: "Gentle Stretching", spoons: 1, category: "Very Low Energy", description: "Light stretching exercises" },
  { name: "Listening to Music", spoons: 1, category: "Very Low Energy", description: "Passive music listening" },

  // Recharging (0 spoons)
  { name: "Sleep", spoons: 0, category: "Recharging", description: "Nighttime sleep" },
  { name: "Rest in Bed", spoons: 0, category: "Recharging", description: "Resting or napping in bed" },
  { name: "Meditation", spoons: 0, category: "Recharging", description: "Meditation or mindfulness practice" },
  { name: "Deep Rest", spoons: 0, category: "Recharging", description: "Complete rest and recovery" },
] as const

export type DefaultActivity = (typeof DEFAULT_ACTIVITIES)[number]
