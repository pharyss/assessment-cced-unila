type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Assessment = {
  id: string;
  title: string;
  paragraph: string;
<<<<<<< HEAD
  rules: string[];
=======
  rules: string;
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
};
