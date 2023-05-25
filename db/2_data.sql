-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

\connect app_db

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.tenants DISABLE TRIGGER ALL;

INSERT INTO public.tenants (id, display_name, is_admin) VALUES (1, 'user tenant 1', false);
INSERT INTO public.tenants (id, display_name, is_admin) VALUES (2, 'user tenant 2', false);
INSERT INTO public.tenants (id, display_name, is_admin) VALUES (3, 'user tenant 3', false);
INSERT INTO public.tenants (id, display_name, is_admin) VALUES (4, 'user tenant 4', false);
INSERT INTO public.tenants (id, display_name, is_admin) VALUES (5, 'user tenant 5', false);
INSERT INTO public.tenants (id, display_name, is_admin) VALUES (6, 'admin tenant', true);


ALTER TABLE public.tenants ENABLE TRIGGER ALL;

--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.patients DISABLE TRIGGER ALL;

      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (1, 1, 'John', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (2, 1, 'Jim', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (3, 1, 'Bob', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (4, 1, 'Jerry', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (5, 1, 'Fran', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (6, 2, 'John', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (7, 2, 'James', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (8, 2, 'Josh', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (9, 2, 'Harry', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (10, 2, 'Mary', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (11, 3, 'John', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (12, 3, 'Jeoffrey', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (13, 3, 'Max', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (14, 3, 'Min', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (15, 3, 'Patronius', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (16, 4, 'John', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (17, 4, 'Jane', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (18, 4, 'Homer', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (19, 4, 'Maggie', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (20, 4, 'Bart', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (21, 5, 'John', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (22, 5, 'Walker', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (23, 5, 'Yeezy', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (24, 5, 'Puff Daddy', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (25, 5, 'The Rock', 'Doe', '1992-05-13');



ALTER TABLE public.patients ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (1, 1, 't1 user1', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (2, 1, 't1 user2', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (3, 2, 't2 user1', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (4, 2, 't2 user2', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (5, 3, 't3 user1', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (6, 3, 't3 user2', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (7, 4, 't4 user1', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (8, 4, 't4 user2', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (9, 5, 't5 user1', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (10, 5, 't5 user2', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2');
INSERT INTO public.users (id, tenant_id, user_name, password) VALUES (11, 6, 't6 admin', '$2b$10$YJ3paQsDvg7ykcUEB6kmQetsGcaRfPzTwvpOEQSc565epW.P82lMO');


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 25, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- PostgreSQL database dump complete
--

