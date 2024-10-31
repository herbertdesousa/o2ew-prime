/*
  title              titulo
  goal               objetivo
  goal step          passos
  goal step asnwer   passos
*/

export class Goal {
  $clientId!: string;

  id!: string;

  title!: string;

  title_id!: string;

  description!: string;

  color!: string;

  steps: GoalStep[] = [];
}

export class GoalStep {
  $clientId!: string;

  id!: string;

  description!: string;

  asnwers: GoalStepAnswer[] = [];
}

export class GoalStepAnswer {
  $clientId!: string;

  id!: string;

  description!: string;

  date_label!: string;
}

