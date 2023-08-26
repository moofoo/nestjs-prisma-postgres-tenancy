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

INSERT INTO public.tenants (id, display_name) VALUES (1, 'tenant 1');
INSERT INTO public.tenants (id, display_name) VALUES (2, 'tenant 2');

ALTER TABLE public.tenants ENABLE TRIGGER ALL;


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, user_name, password, is_admin) VALUES (1, 'joe', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2', false);
INSERT INTO public.users (id, user_name, password, is_admin) VALUES (2, 'bruce', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2', false);
INSERT INTO public.users (id, user_name, password, is_admin) VALUES (3, 'jeremy', '$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2', false);
INSERT INTO public.users (id, user_name, password, is_admin) VALUES (4, 'yeezy', '$2b$10$YJ3paQsDvg7ykcUEB6kmQetsGcaRfPzTwvpOEQSc565epW.P82lMO', true);


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: user_tenans; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.user_tenants DISABLE TRIGGER ALL;

INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (1, 1, 1);
INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (2, 2, 2);
INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (3, 1, 3);
INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (4, 2, 3);
INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (5, 1, 4);
INSERT INTO public.user_tenants (id, tenant_id, user_id) VALUES (6, 2, 4);


ALTER TABLE public.user_tenants ENABLE TRIGGER ALL;

--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.patients DISABLE TRIGGER ALL;

      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (1, 1, 'John', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (2, 1, 'Jim', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (3, 1, 'Bob', 'Doe', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (4, 1, 'Jerry', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (5, 1, 'Fran', 'Doe', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (6, 2, 'John', 'Doe2', '1992-05-13');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (7, 2, 'James', 'Doe2', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (8, 2, 'Josh', 'Doe2', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (9, 2, 'Harry', 'Doe2', '1984-02-11');
      INSERT INTO public.patients (id, tenant_id, first_name, last_name, dob) VALUES (10, 2, 'Mary', 'Doe2', '1992-05-13');

ALTER TABLE public.patients ENABLE TRIGGER ALL;




--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 11, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: user_tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tenants_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

