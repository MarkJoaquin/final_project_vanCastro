export type StepsSection = {
  name: string;
  id: string;
  title: string;
  mainText: string[] | { title: string; description: string }[],
  subText: {
    text: string;
    linkText: string;
    linkTo: string;
    className: string;
  },
    className: string;
    LinkTo: string;
};
