INSERT INTO `users` (`iduser`, `name`, `gmail`, `teacher`, `language`, `class`) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', 1, 'Python', 1),
(2, 'Bob Smith', 'bob.smith@gmail.com', 1, 'JavaScript', 2),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', 0, 'Java', 3),
(4, 'Diana Lee', 'diana.lee@gmail.com', 0, 'Python', NULL);

INSERT INTO `class` (`idclass`, `name`, `teacher_id`, `language`) VALUES
(1, 'Introduction to Python', '1', 'Python'),
(2, 'JavaScript for Web Development', '2', 'JavaScript'),
(3, 'Advanced Java Concepts', '2', 'Java');

INSERT INTO `restriction` (`idrestriction`, `nivell`, `content`) VALUES
(1, 'BEGINNER', 'Basics of programming, suitable for beginners'),
(2, 'INTERMEDIATE', 'Intermediate concepts in programming'),
(3, 'ADVANCED', 'Advanced programming techniques');

INSERT INTO `languages` (`idlanguage`, `name`, `system_prompt`) VALUES
(1, 'Python', 'General system prompt for Python'),
(2, 'JavaScript', 'General system prompt for JavaScript'),
(3, 'Java', 'General system prompt for Java');

INSERT INTO `sublanguages` (`id`, `idlanguage`, `name`, `system_prompt`) VALUES
(1, 1, 'Flask', 'Prompt for Flask framework in Python'),
(2, 1, 'Django', 'Prompt for Django framework in Python'),
(3, 2, 'React', 'Prompt for React library in JavaScript'),
(4, 2, 'Node.js', 'Prompt for Node.js runtime in JavaScript'),
(5, 3, 'Spring', 'Prompt for Spring framework in Java'),
(6, 3, 'Hibernate', 'Prompt for Hibernate ORM in Java');
