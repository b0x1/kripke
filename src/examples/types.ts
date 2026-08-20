export type ExampleStatement = {
  id: string;
  naturalLanguage: string;
  formula: string;
  postulate?: boolean;
};

export type Example = {
  id: string;
  title: string;
  blurb?: string;
  statements: ExampleStatement[];
};
