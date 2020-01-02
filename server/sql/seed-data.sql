-- User Role
INSERT INTO public.user_role (id, name, description)
VALUES (1, 'sys-admin', 'System Administrator');
INSERT INTO public.user_role (id, name, description)
VALUES (2, 'survey-admin', 'Survey Administrator');

ALTER SEQUENCE user_role_id_seq RESTART WITH 101;

-- User
INSERT INTO public."user" (id, email, "firstName", "lastName", "password")
VALUES (1, 'tom.nurkkala@gmail.com', 'Tom', 'Nurkkala',
        '$2b$10$3P393Jj5xcDX1uW4K5RnRO9PSjCnHp7E0eoL/85LlCJJ0rAz/Kmmm');

INSERT INTO public."user" (id, email, "firstName", "lastName", "password")
VALUES (2, 'knkiers@taylor.edu', 'Ken', 'Kiers',
        '$2b$10$3P393Jj5xcDX1uW4K5RnRO9PSjCnHp7E0eoL/85LlCJJ0rAz/Kmmm');

INSERT INTO public."user" (id, email, "firstName", "lastName", "password")
VALUES (3, 'stbird@taylor.edu', 'Steve', 'Bird',
        '$2b$10$3P393Jj5xcDX1uW4K5RnRO9PSjCnHp7E0eoL/85LlCJJ0rAz/Kmmm');

INSERT INTO public."user" (id, email, "firstName", "lastName", "password")
VALUES (4, 'william_slauson@taylor.edu', 'William', 'Slauson',
        '$2b$10$3P393Jj5xcDX1uW4K5RnRO9PSjCnHp7E0eoL/85LlCJJ0rAz/Kmmm');

ALTER SEQUENCE user_id_seq RESTART WITH 101;

-- User Roles
INSERT INTO public.user_roles_user_role ("userId", "userRoleId")
VALUES (1, 1);
INSERT INTO public.user_roles_user_role ("userId", "userRoleId")
VALUES (1, 2);
INSERT INTO public.user_roles_user_role ("userId", "userRoleId")
VALUES (2, 1);
INSERT INTO public.user_roles_user_role ("userId", "userRoleId")
VALUES (3, 2);
INSERT INTO public.user_roles_user_role ("userId", "userRoleId")
VALUES (4, 1);

-- Letter Element Type
INSERT INTO public.letter_element_type (id, key, description)
VALUES (1, 'chart', 'Bar Chart');
INSERT INTO public.letter_element_type (id, key, description)
VALUES (2, 'boolean-calculation-results', 'Boolean Calculation Results');
INSERT INTO public.letter_element_type (id, key, description)
VALUES (3, 'header', 'Header (Top of Letter)');
INSERT INTO public.letter_element_type (id, key, description)
VALUES (4, 'footer', 'Footer (End of Letter)');
INSERT INTO public.letter_element_type (id, key, description)
VALUES (5, 'boilerplate', 'Boilerplate Text');
INSERT INTO public.letter_element_type (id, key, description)
VALUES (6, 'image', 'Image');

ALTER SEQUENCE letter_element_type_id_seq RESTART WITH 101;
