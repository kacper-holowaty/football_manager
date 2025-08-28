export interface Achievement {
  readonly achievementId: string;
  readonly name: string;
  readonly date: Date;
  readonly description: string;
}

export interface AchievementRequest {
  readonly name: string;
  readonly date: string;
  readonly description: string;
}