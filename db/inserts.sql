INSERT INTO CLASS (idclass, code, name, teacher_id, language) VALUES
(1, 'PY101', 'Introduction to Python', '[1]', '[{1,"Python",1}]'),
(2, 'JS201', 'JavaScript for Web Development', '[2]', '[{2,"Javascript",3},{1,"Python",1}]'),
(3, 'JAVA301', 'Advanced Java Concepts', '[2]', '[{3,"Java",2}]');

INSERT INTO USER (id, name, gmail, teacher, language, googleId, class) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', TRUE, '[{1,"Python",1}]', NULL, 1),
(2, 'Bob Smith', 'bob.smith@gmail.com', TRUE, '[{2,"Javascript",3},{1,"Python",1}]', NULL, 2),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', FALSE, '[{2,"Javascript",3}]', NULL, 3),
(4, 'Diana Lee', 'diana.lee@gmail.com', FALSE, '[{3,"Java",2}]', NULL, NULL);

INSERT INTO LANGUAGE (idlanguage, name) VALUES
(1, 'Python'),
(2, 'JavaScript'),
(3, 'Java');

INSERT INTO RESTRICTION (content) VALUES
("Only answer questions by explaining, don't provide code"),
("Answer questions by providing code snippets but not direct answers to the problem"),
("Answer questions by providing full code examples");