type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Assessment = {
  id: string;
  title: string;
  paragraph: string;
  rules: string[];
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
};
