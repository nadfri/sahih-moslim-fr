SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '082966c9-f82e-4799-8cb1-41e8c99be147', '{"action":"user_signedup","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2025-08-26 11:47:53.635527+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb4a6929-446c-44b2-b302-6a5861104fae', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 11:47:55.448962+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cc518af-2f98-49c7-bb77-64e3d0b7df58', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 11:55:42.159571+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d3d89a6-25e0-476b-b1a5-b67d0216ae41', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 11:55:52.337292+00', ''),
	('00000000-0000-0000-0000-000000000000', '61ac64fc-1d93-4005-bf7c-72fd79b7fd46', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 11:55:52.592464+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0468692-4c64-49e1-912b-2624260888fa', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 11:56:48.713937+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5ac05e5-ed9e-47cd-b1f7-fd394b00ed8c', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 11:56:54.393917+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c7ba40c-dc0f-410c-a2b4-4c3795dcd011', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 11:56:54.643399+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8173c3f-b749-49e8-85e5-51bbc0f9e4fe', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 11:58:09.779282+00', ''),
	('00000000-0000-0000-0000-000000000000', '712db09a-378b-4d6a-8da5-37062f9a9462', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 12:01:08.569104+00', ''),
	('00000000-0000-0000-0000-000000000000', '5978586d-b3ae-4bcc-99a9-1de7009ceff0', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 12:01:09.020364+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b36bca96-ae0e-47e9-bb51-1b4a7f9e9c61', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 13:03:01.158887+00', ''),
	('00000000-0000-0000-0000-000000000000', '7955723e-e5fe-4828-b399-57061575184a', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 13:03:01.173182+00', ''),
	('00000000-0000-0000-0000-000000000000', '38f92d8c-7118-4c7b-b9ac-79c6880da0c5', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 15:28:30.023667+00', ''),
	('00000000-0000-0000-0000-000000000000', '30a2d18d-f5dc-4157-ba4c-6a2ab4842591', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 15:28:30.034873+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d91d29f-7666-46dd-b95d-dce6c207943a', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 15:28:33.500301+00', ''),
	('00000000-0000-0000-0000-000000000000', '40691cfd-3f4e-4da6-af0e-ad9ba2830df5', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 15:28:52.380423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba1d3693-2379-43f9-84a3-5d7b6f451380', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 15:29:11.981819+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b384d8c-79a5-4c29-956f-d1a12e394832', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 15:29:13.873186+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3cf631f-f387-4e53-a576-02e8fb273fcc', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 15:42:08.736921+00', ''),
	('00000000-0000-0000-0000-000000000000', '38590af1-2f32-4f34-8b63-09e8500578f4', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 15:42:56.808285+00', ''),
	('00000000-0000-0000-0000-000000000000', '162e9ccb-b34f-4e13-a010-1ab5083278ae', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 15:42:58.495589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4f1a410-06d8-4756-ae26-fce5e14bda3e', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 15:43:37.825815+00', ''),
	('00000000-0000-0000-0000-000000000000', '22228bda-34fd-4b7a-b129-34e4539a7029', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-26 15:58:59.221694+00', ''),
	('00000000-0000-0000-0000-000000000000', '71efdc9b-ab07-4036-94bf-6c966264b647', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-26 15:59:01.010959+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e09fce56-100d-48fe-afd6-9de46b52b6a5', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 17:28:52.822691+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9a0a5a9-9569-4a12-8cec-35e1fb728690', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 17:28:52.832495+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c9c7a37-52b0-4202-9cf7-27282c61c568', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:15:44.707732+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6f91f22-61b2-43d0-abc4-14413b4d8e35', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:15:44.725858+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f704862-6702-456f-af94-52a53467a168', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:16:16.094941+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c03f26e2-8684-49ba-b7e4-bb5ff15018b9', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:16:48.818025+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a0d30d5-6a9c-4042-b37c-943599bb8445', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:17:48.92886+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9829eb3-7fa4-4c06-a8b5-b040084f78b6', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:18:19.77185+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bb607bd-f4ae-4bd5-a532-0febd43a6ed5', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:18:20.805122+00', ''),
	('00000000-0000-0000-0000-000000000000', '800eb348-c513-4ebf-b234-903605a380aa', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:18:28.009967+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e0556e3-3c6f-4e8a-bbc8-f2bc6d2476ee', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 19:18:31.25057+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6be1a06-3e90-4ae2-bcd0-ad13c22b89ed', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 13:01:00.548053+00', ''),
	('00000000-0000-0000-0000-000000000000', '486da7f6-e870-4626-8a87-416dd62de859', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 13:01:00.558862+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcd448a6-54e9-40a6-91de-731b1489d633', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 17:34:38.773296+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8b3b11e-d824-475b-95ad-eabbdf0656fd', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 17:34:38.789563+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2682ba1-f25c-4a8c-9552-35936dcfebf3', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 18:58:59.680836+00', ''),
	('00000000-0000-0000-0000-000000000000', '6df2cdd2-659c-4a97-9d1b-251a7dae03b6', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 18:58:59.690103+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e00a557-62d3-459b-89dc-c31c876933cb', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 15:54:34.354197+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bd9616c-8a5a-4887-9e22-d030f95f37fc', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 15:54:34.368007+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d5703ae-3b41-4582-b40e-5b23262743a7', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 16:52:45.850715+00', ''),
	('00000000-0000-0000-0000-000000000000', '85f93e6e-281d-452c-b533-8d7b69fa7d04', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 16:52:45.861236+00', ''),
	('00000000-0000-0000-0000-000000000000', '082092bc-fc04-40d3-a91f-4c5e8d4f1af0', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 19:51:58.270556+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1da0e0b-5aa3-4993-988e-17ae22df55f3', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-28 19:51:58.281309+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5e88acc-a392-4f35-9f3f-21eaf7e0ba5a', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-28 19:52:39.602679+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8450a8e-3cab-4466-930d-50f9313b799f', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-28 19:57:26.620667+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a04d6bc-f20b-4e70-9951-24f73d0c6237', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-28 19:57:26.855323+00', ''),
	('00000000-0000-0000-0000-000000000000', '329b6422-0403-4ef7-a126-c45e76a3aaa8', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-28 20:01:57.863564+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c4e6323-4699-4a20-96c1-62698097c032', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-28 20:02:06.893986+00', ''),
	('00000000-0000-0000-0000-000000000000', '3214e47c-2bc9-414d-8130-123214f87883', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-28 20:02:07.030295+00', ''),
	('00000000-0000-0000-0000-000000000000', '08db711a-02e3-410e-86a2-47b8a9bc11c8', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-28 20:17:13.071734+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b153a9fe-d0e6-4c27-ab1d-f8d246e493b1', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-28 20:17:22.255896+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c2fe4ef-a2ad-467e-ae9e-f0d69e3c2ca7', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 08:25:45.167351+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0c3b98c-6160-447f-9c96-888aff887c8f', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 08:25:45.192902+00', ''),
	('00000000-0000-0000-0000-000000000000', '74410c19-6410-4223-8233-16eeccd0f555', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 14:35:41.18842+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be82a6ad-8fd0-434b-a91b-41dc17aeed35', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 14:35:41.198527+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed56d9bb-fb25-49a6-8f8c-24cc8e3a95d6', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 15:54:29.961411+00', ''),
	('00000000-0000-0000-0000-000000000000', '047ee61e-c5a5-488d-aa07-38d163d512fa', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 15:54:29.975036+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f2d5aaf-00b9-4d22-836a-305a54368fba', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-29 16:37:07.456107+00', ''),
	('00000000-0000-0000-0000-000000000000', '92f0dffe-0e09-445d-bce0-285cdae0dbea', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-29 16:37:25.57229+00', ''),
	('00000000-0000-0000-0000-000000000000', '71012207-b7e4-4b4e-9af8-c6da9be45b59', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-29 16:37:27.560279+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a10da8f4-ca4c-4d63-8ad2-077064751775', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 19:43:45.653171+00', ''),
	('00000000-0000-0000-0000-000000000000', '43096e13-9143-4f14-9071-384f284eb2da', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 19:43:45.666659+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8331496-f024-437c-b3a4-4ec43954d5db', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 19:43:46.589894+00', ''),
	('00000000-0000-0000-0000-000000000000', '48747f81-604e-41dc-b72a-d581d5afa03d', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-29 19:45:18.425021+00', ''),
	('00000000-0000-0000-0000-000000000000', '110b01c4-be4f-496f-a324-08566894c7e2', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-29 19:45:18.529207+00', ''),
	('00000000-0000-0000-0000-000000000000', '52c77218-1d9b-4c87-93a5-de90f5e910eb', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-29 19:50:40.263807+00', ''),
	('00000000-0000-0000-0000-000000000000', '866a031c-42ff-4842-8086-8d20e1fcafb3', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-29 19:50:50.625357+00', ''),
	('00000000-0000-0000-0000-000000000000', '5492c37e-87f6-4eca-af76-703216cf8989', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-29 19:50:50.768299+00', ''),
	('00000000-0000-0000-0000-000000000000', '2129ae98-7ace-4557-9f67-1edc17d93f7f', '{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 14:34:31.834327+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b72b859-4249-4a75-a40b-226d0a120151', '{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 14:34:31.841938+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a4ff8f3-3fd0-4650-b85b-42cba2468e13', '{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-30 15:14:32.130777+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdc5574d-3be8-4492-bd90-8dfd4fba2af4', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-30 15:14:41.476409+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc840863-83da-4389-a308-d571a942804f', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:14:43.552423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3312632-f691-4331-8e3c-a11acf5ceca9', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-30 15:18:45.666859+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a03aba63-6eaf-4964-a608-7d77262aa256', '{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:18:46.171779+00', ''),
	('00000000-0000-0000-0000-000000000000', '5197fb4f-8bad-4402-9b00-a239cdbffd97', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nadfri@gmail.com","user_id":"64986786-596e-4de1-a266-1b8fa9174880","user_phone":""}}', '2025-08-30 15:21:26.895584+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f51fd07-ccbd-4f3e-8bc3-ad4cb33c8cb1', '{"action":"user_signedup","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2025-08-30 15:23:31.159583+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0a7582b-9e2e-4c15-92ed-7c314ed33367', '{"action":"login","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:23:32.805363+00', ''),
	('00000000-0000-0000-0000-000000000000', '55f0d962-a5de-4a36-9dca-c1d4a904c5dc', '{"action":"logout","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-30 15:29:14.571554+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bd9d499-31a4-4d74-bbb1-08d0c525d87f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nadfri@gmail.com","user_id":"7b1c591b-bce5-4437-8d51-786210f5136a","user_phone":""}}', '2025-08-30 15:29:27.087232+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f730db9f-06fe-42ab-af3d-4ee7c9dd6625', '{"action":"user_signedup","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2025-08-30 15:29:37.299055+00', ''),
	('00000000-0000-0000-0000-000000000000', '8643f734-792d-4010-9fa2-5d4696e0c0ab', '{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:29:37.858928+00', ''),
	('00000000-0000-0000-0000-000000000000', '4af0e91c-836d-46de-8b00-1ae3a143a7ea', '{"action":"logout","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-30 15:36:33.016244+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f453473a-6f85-4107-b7ba-0add438b8f2f', '{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-30 15:36:39.646522+00', ''),
	('00000000-0000-0000-0000-000000000000', '76de19f4-6db9-432a-9393-60ac1fe5c429', '{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:36:40.208141+00', ''),
	('00000000-0000-0000-0000-000000000000', '5bad0423-225c-4794-84e5-a7e6247c46dd', '{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-08-30 15:39:35.722109+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c7410cb-dd4c-4816-925f-20862c8b6fa3', '{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2025-08-30 15:39:37.253711+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c32d09d-f585-4dce-8aa6-e94d3870514a', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 16:38:14.211306+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afe8f39b-5dcf-4e9f-b47c-50e150335e98', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 16:38:14.230502+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3a51f4a-5324-42e5-83dc-2afd9dbf0cd4', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 16:38:17.060602+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a44b97da-6b70-4ffd-ab95-c3fb81b2e124', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 18:10:14.272964+00', ''),
	('00000000-0000-0000-0000-000000000000', '80fe7e9e-992f-498c-b12f-bae77922ab72', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 18:10:14.283067+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e663cef7-7a2a-4ea5-adc1-fde101f4b3a7', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 19:11:07.147304+00', ''),
	('00000000-0000-0000-0000-000000000000', '42450893-9162-4d10-af0a-6efe3e2e8af7', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 19:11:07.169891+00', ''),
	('00000000-0000-0000-0000-000000000000', '96b29d49-e967-488c-8dc2-8b7d05707cb9', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 20:13:58.154093+00', ''),
	('00000000-0000-0000-0000-000000000000', '47dde4c2-2c63-4bf8-b0f0-e862d9618f85', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 20:13:58.166263+00', ''),
	('00000000-0000-0000-0000-000000000000', '25662fb7-96a5-4911-ada0-6dca4b9b140f', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 09:12:22.574677+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea5e8178-fa03-4af3-8acd-ea5aa3110423', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 09:12:22.597725+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2ce076f-8187-49aa-b392-e8c46edfadbd', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 11:55:20.576+00', ''),
	('00000000-0000-0000-0000-000000000000', '25eaab65-6939-4eb4-91f3-dbf9632eabf4', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 11:55:20.596996+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acef97e2-8009-4671-82ea-eda2fe3125b9', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 13:53:33.131909+00', ''),
	('00000000-0000-0000-0000-000000000000', '826ead08-fbe5-4dd8-b252-129e5ef39054', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 13:53:33.140063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd47e0f4f-06f2-41d4-96d0-6d66cec72dae', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 14:51:47.328338+00', ''),
	('00000000-0000-0000-0000-000000000000', '0205ba72-07f8-4241-a138-8f9cff86ac84', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 14:51:47.344365+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abb98a8c-e524-4214-a207-8fe1881c928a', '{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 16:09:13.708108+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c71b57a-ce49-4bec-a266-a51aed904f78', '{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-31 16:09:13.737933+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('19c7cc35-9352-444a-851f-cf8cb561c19f', NULL, '95bf3919-81cd-4025-a9cd-aebe53e2c820', 's256', 'YHb4FNFpAfLJ8Wq6gKHGyWTnRq3DQj6NivepCQlFdGA', 'github', '', '', '2025-08-26 11:45:50.265669+00', '2025-08-26 11:45:50.265669+00', 'oauth', NULL),
	('629324e1-f43b-456e-a10b-1462bd9589a2', NULL, '1be1aadb-3d45-499f-a25e-11d63b795590', 's256', 'MqewS7D6KCUkYT1llGKWCH4Q6qGVJZMZGxLWG0gMqLo', 'github', '', '', '2025-08-30 15:21:52.73588+00', '2025-08-30 15:21:52.73588+00', 'oauth', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'b8511f90-2d66-44d0-844c-ed10ae495e50', 'authenticated', 'authenticated', 'nadfri@gmail.com', NULL, '2025-08-30 15:29:37.299575+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-08-30 15:39:37.25437+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "56604321", "name": "Nader FRIGUI", "email": "nadfri@gmail.com", "full_name": "Nader FRIGUI", "user_name": "nadfri", "avatar_url": "https://avatars.githubusercontent.com/u/56604321?v=4", "provider_id": "56604321", "email_verified": true, "phone_verified": false, "preferred_username": "nadfri"}', NULL, '2025-08-30 15:29:37.292924+00', '2025-08-31 16:09:13.777403+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('56604321', 'b8511f90-2d66-44d0-844c-ed10ae495e50', '{"iss": "https://api.github.com", "sub": "56604321", "name": "Nader FRIGUI", "email": "nadfri@gmail.com", "full_name": "Nader FRIGUI", "user_name": "nadfri", "avatar_url": "https://avatars.githubusercontent.com/u/56604321?v=4", "provider_id": "56604321", "email_verified": true, "phone_verified": false, "preferred_username": "nadfri"}', 'github', '2025-08-30 15:29:37.295489+00', '2025-08-30 15:29:37.295543+00', '2025-08-30 15:39:35.719163+00', '7dcf9c93-448c-4a7c-9756-480f668e604a');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('ccd4a684-f9fe-4a49-82c6-c21e398753ee', 'b8511f90-2d66-44d0-844c-ed10ae495e50', '2025-08-30 15:39:37.254439+00', '2025-08-31 16:09:13.784882+00', NULL, 'aal1', NULL, '2025-08-31 16:09:13.78368', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '91.170.9.241', NULL),
	('ab5eeced-fd08-4c36-a49c-0199836e3192', 'b8511f90-2d66-44d0-844c-ed10ae495e50', '2025-08-30 15:36:40.208831+00', '2025-08-30 15:36:40.208831+00', NULL, 'aal1', NULL, NULL, 'node', '91.170.9.241', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ab5eeced-fd08-4c36-a49c-0199836e3192', '2025-08-30 15:36:40.213007+00', '2025-08-30 15:36:40.213007+00', 'oauth', 'd7d52f27-71fc-4f99-a4cf-9af10a2678f9'),
	('ccd4a684-f9fe-4a49-82c6-c21e398753ee', '2025-08-30 15:39:37.258439+00', '2025-08-30 15:39:37.258439+00', 'oauth', '3d6697b3-6d71-4915-8420-1258c540df68');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 38, 'ttj375zh2crd', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-30 20:13:58.18107+00', '2025-08-31 09:12:22.6008+00', '44mmb65aipyp', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 39, 'pqid5k47frpm', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-31 09:12:22.619262+00', '2025-08-31 11:55:20.598832+00', 'ttj375zh2crd', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 40, 'jpi5egcdhlzq', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-31 11:55:20.617976+00', '2025-08-31 13:53:33.141975+00', 'pqid5k47frpm', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 41, 'omxm6vmx6zga', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-31 13:53:33.152279+00', '2025-08-31 14:51:47.345827+00', 'jpi5egcdhlzq', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 42, '7ppuxdqh7khq', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-31 14:51:47.357397+00', '2025-08-31 16:09:13.739667+00', 'omxm6vmx6zga', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 43, 'flba537kbnrb', 'b8511f90-2d66-44d0-844c-ed10ae495e50', false, '2025-08-31 16:09:13.761857+00', '2025-08-31 16:09:13.761857+00', '7ppuxdqh7khq', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 33, 'ny36tsp67vlf', 'b8511f90-2d66-44d0-844c-ed10ae495e50', false, '2025-08-30 15:36:40.20974+00', '2025-08-30 15:36:40.20974+00', NULL, 'ab5eeced-fd08-4c36-a49c-0199836e3192'),
	('00000000-0000-0000-0000-000000000000', 34, 's2lc4rb3opbq', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-30 15:39:37.255485+00', '2025-08-30 16:38:14.231186+00', NULL, 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 35, 'yyuavmkg7r7i', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-30 16:38:14.251448+00', '2025-08-30 18:10:14.286045+00', 's2lc4rb3opbq', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 36, 'qn6otwzloqbn', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-30 18:10:14.300459+00', '2025-08-30 19:11:07.171714+00', 'yyuavmkg7r7i', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee'),
	('00000000-0000-0000-0000-000000000000', 37, '44mmb65aipyp', 'b8511f90-2d66-44d0-844c-ed10ae495e50', true, '2025-08-30 19:11:07.195551+00', '2025-08-30 20:13:58.167835+00', 'qn6otwzloqbn', 'ccd4a684-f9fe-4a49-82c6-c21e398753ee');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Chapter" ("id", "index", "name", "slug", "nameArabic", "createdAt", "updatedAt") VALUES
	('cm9vcp9lp0000hq6graltfp9h', 0, 'Introduction', 'introduction', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0001hq6gin9xjo72', 1, 'La Foi', 'la-foi', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0002hq6g697o5t3i', 2, 'Purification', 'purification', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0003hq6gkv9kr2bx', 3, 'Menstruations', 'menstruations', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0004hq6g0h1mzyei', 4, 'Prières', 'prieres', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0005hq6g8861o4q4', 5, 'Mosquées et lieux de prière', 'mosquees-et-lieux-de-priere', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0006hq6gipilpeko', 6, 'Prière du voyageur', 'priere-du-voyageur', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0007hq6gdo1ki0k1', 7, 'Prière du vendredi', 'priere-du-vendredi', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0008hq6gdkv7nvu9', 8, 'Prière des deux fêtes', 'priere-des-deux-fetes', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp0009hq6gxe3x68nm', 9, 'Prière pour la pluie', 'priere-pour-la-pluie', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000ahq6g6bfxrgnu', 10, 'Prière des éclipses', 'priere-des-eclipses', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000bhq6gxtwona4o', 11, 'Prière des funérailles', 'priere-des-funerailles', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000chq6g71zqve28', 12, 'Zakat', 'zakat', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000dhq6gofknba70', 13, 'Jeûne', 'jeune', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000ehq6gh7cwr8e9', 14, 'Retraite spirituelle', 'retraite-spirituelle', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000fhq6ghfo05w74', 15, 'Pèlerinage', 'pelerinage', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000ghq6gjrp8h4m3', 16, 'Mariage', 'mariage', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000hhq6g5is9r9ly', 17, 'Allaitement', 'allaitement', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000ihq6g2zwtz217', 18, 'Divorce', 'divorce', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000jhq6glfvfye9f', 19, 'Invoquer des malédictions', 'invoquer-des-maledictions', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000khq6gksuq8fr4', 20, 'Affranchissement', 'affranchissement', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000lhq6grw9aor2y', 21, 'Transactions', 'transactions', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000mhq6gdkfasulp', 22, 'Irrigations', 'irrigations', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000nhq6gui980pzc', 23, 'Successions', 'successions', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000ohq6gt4qvd8cy', 24, 'Donations', 'donations', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000phq6gy9itlmoq', 25, 'Testaments', 'testaments', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000qhq6g504yh7qo', 26, 'Voeux', 'voeux', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000rhq6g1ofi8pw0', 27, 'Serments', 'serments', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000shq6gtp5e5vmt', 28, 'Serments collectifs', 'serments-collectifs', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000thq6gkn629uwj', 29, 'Peines légales', 'peines-legales', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000uhq6goxkyj5cv', 30, 'Jugements', 'jugements', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000vhq6gxes128ov', 31, 'Objets trouvés', 'objets-trouves', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000whq6gftedypeh', 32, 'Jihad et Expéditions', 'jihad-et-expeditions', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cm9vcp9lp000xhq6g342vfuwx', 33, 'Commandements', 'commandements', NULL, '2025-04-24 12:40:36.829', '2025-05-10 14:43:21.158'),
	('cmau3yvxo000ehqeo2a2mykkp', 999, 'Inconnu', 'inconnu', NULL, '2025-05-18 20:28:05.293', '2025-05-18 20:28:05.293');


--
-- Data for Name: Hadith; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Hadith" ("id", "numero", "matn_fr", "matn_ar", "chapterId", "createdAt", "updatedAt", "matn_en") VALUES
	('cm9vcvuja0001hqn8yr3a7oqa', 2, 'En effet, ce qui m''empêche de vous rapporter un grand nombre de Hadith, c''est que le ~~Messager d''Allah ﷺ~~, a dit : 

"Celui qui a l''intention de mentir à mon sujet, qu''il prépare sa place en Enfer."', ' وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا غُنْدَرٌ، عَنْ شُعْبَةَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ مَنْصُورٍ، عَنْ رِبْعِيِّ بْنِ حِرَاشٍ، أَنَّهُ سَمِعَ عَلِيًّا، - رضى الله عنه - يَخْطُبُ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم  " لاَ تَكْذِبُوا عَلَىَّ فَإِنَّهُ مَنْ يَكْذِبْ عَلَىَّ يَلِجِ النَّارَ " .', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.894', '2025-05-30 15:02:50.892', ''),
	('cm9vcvujg0002hqn8t60fpwgz', 3, '~~Le Prophète ﷺ~~ a dit: 

« Celui qui ment volontairement sur moi qu''il prépare sa place en enfer ».', 'وَحَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا إِسْمَاعِيلُ، - يَعْنِي ابْنَ عُلَيَّةَ - عَنْ عَبْدِ الْعَزِيزِ بْنِ صُهَيْبٍ، عَنْ أَنَسِ بْنِ مَالِكٍ، أَنَّهُ قَالَ إِنَّهُ لَيَمْنَعُنِي أَنْ أُحَدِّثَكُمْ حَدِيثًا كَثِيرًا أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ  " مَنْ تَعَمَّدَ عَلَىَّ كَذِبًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ " .', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.901', '2025-05-30 15:57:04.79', ''),
	('cm9vcvujv0004hqn8jjtfhnw5', 5, '~~Le Prophète ﷺ~~ a dit: « Il suffit à la personne comme mensonge de transmettre tout ce qu''elle entend »', 'عن أبي هريرة رضي الله عنه قال رسول الله صلى الله عليه و سلم : كفى بالمرء كذبا أن يحدث بكل ما سمع', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.915', '2025-05-30 18:15:25.679', ''),
	('cm9vcvuk20005hqn84x5gg9v9', 6, '~~Le Messager d''Allah~~ a dit: 

Il y aura, à la fin de ma communauté, des gens qui vous raconteront des choses que ni vous ni vos pères n''avez entendues, alors méfiez-vous d''eux.', 'سَيَكُونُ فِي آخِرِ أُمَّتِي أُنَاسٌ يُحَدِّثُونَكُمْ مَا لَمْ تَسْمَعُوا أَنْتُمْ وَلاَ آبَاؤُكُمْ فَإِيَّاكُمْ وَإِيَّاهُمْ', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.923', '2025-05-30 18:22:52.576', ''),
	('cm9vcvuk80006hqn8pi9xkm0o', 7, '~~Le Prophète ﷺ~~ a dit: 

« Il y aura à la fin des temps des grands imposteurs, des grands menteurs qui vont vous apporter des ahadiths que ni vous ni vos ancêtres n''ont entendus auparavant. Faites très attention à eux afin qu''ils ne vous égarent pas et qu''ils ne soient pas une source de troubles pour vous ».', 'عن أبي هريرة رضي الله عنه قال النبي صلى الله عليه و سلم : يكون في آخر الزمان دجالون كذابون . يأتونكم من الأحاديث بما لم تسمعوا أنتم ولا آباؤكم فإياكم وإياهم لا يضلونكم ولا يفتنونكم', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.929', '2025-05-23 14:28:27.345', ''),
	('cmb0vj6340001hqg8jsmqjuub', 33, 'Il est rapporté que **Itban ibn Malik** se rendit à Médine et dit :

— « Ma vue s’est affaiblie. J’ai donc envoyé un message au ~~Prophète ﷺ~~ pour lui dire : “J’ai vivement le désir que tu viennes chez moi pour y accomplir une prière, afin que je puisse prendre cet endroit comme lieu de prière.” »

~~Le Prophète ﷺ~~ vint chez lui, accompagné de certains de ses Compagnons, selon ce qu’Allah avait décrété. Il entra dans la maison, y accomplit la prière, puis ses Compagnons se mirent à discuter entre eux, et la conversation porta sur les hypocrites.

Ils désignèrent alors un homme bien connu parmi eux : **Malik ibn Dukhshum**, et souhaitèrent que le ~~Prophète ﷺ~~ le maudisse, qu’il meure ou qu’un malheur l’atteigne.

Lorsque le ~~Messager d’Allah ﷺ~~ eut terminé la prière, il dit :

— « Ne témoigne-t-il pas qu’il n’y a de divinité digne d’adoration qu’Allah et que je suis le ~~Messager d’Allah~~ ? »

Ils répondirent :

— « Il le dit, certes, mais pas sincèrement, pas du fond du cœur. »

~~Le Prophète ﷺ~~ répondit alors :

— « Quiconque témoigne qu’il n’y a de divinité digne d’adoration qu’Allah et que je suis le ~~Messager d’Allah~~ n’entrera pas en Enfer, ou bien le Feu ne le touchera pas. »

**Anas** (qui rapporte ce récit) dit :

— « Ce hadith m’a profondément marqué, et j’ai ordonné à mon fils de l’écrire. »', 'حَدَّثَنَا شَيْبَانُ بْنُ فَرُّوخَ، حَدَّثَنَا سُلَيْمَانُ، - يَعْنِي ابْنَ الْمُغِيرَةِ - قَالَ حَدَّثَنَا ثَابِتٌ، عَنْ أَنَسِ بْنِ مَالِكٍ، قَالَ حَدَّثَنِي مَحْمُودُ بْنُ الرَّبِيعِ، عَنْ عِتْبَانَ بْنِ مَالِكٍ، قَالَ قَدِمْتُ الْمَدِينَةَ فَلَقِيتُ عِتْبَانَ فَقُلْتُ حَدِيثٌ بَلَغَنِي عَنْكَ قَالَ أَصَابَنِي فِي بَصَرِي بَعْضُ الشَّىْءِ فَبَعَثْتُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم أَنِّي أُحِبُّ أَنْ تَأْتِيَنِي فَتُصَلِّيَ فِي مَنْزِلِي فَأَتَّخِذَهُ مُصَلًّى - قَالَ - فَأَتَى النَّبِيُّ صلى الله عليه وسلم وَمَنْ شَاءَ اللَّهُ مِنْ أَصْحَابِهِ فَدَخَلَ وَهُوَ يُصَلِّي فِي مَنْزِلِي وَأَصْحَابُهُ يَتَحَدَّثُونَ بَيْنَهُمْ ثُمَّ أَسْنَدُوا عُظْمَ ذَلِكَ وَكِبْرَهُ إِلَى مَالِكِ بْنِ دُخْشُمٍ قَالُوا وَدُّوا أَنَّهُ دَعَا عَلَيْهِ فَهَلَكَ وَوَدُّوا أَنَّهُ أَصَابَهُ شَرٌّ ‏.‏ فَقَضَى رَسُولُ اللَّهِ صلى الله عليه وسلم الصَّلاَةَ وَقَالَ ‏"‏ أَلَيْسَ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ ‏"‏ ‏.‏ قَالُوا إِنَّهُ يَقُولُ ذَلِكَ وَمَا هُوَ فِي قَلْبِهِ ‏.‏ قَالَ ‏"‏ لاَ يَشْهَدُ أَحَدٌ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ فَيَدْخُلَ النَّارَ أَوْ تَطْعَمَهُ ‏"‏ ‏.‏ قَالَ أَنَسٌ فَأَعْجَبَنِي هَذَا الْحَدِيثُ فَقُلْتُ لاِبْنِي اكْتُبْهُ فَكَتَبَهُ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 14:06:18.256', '2025-05-23 14:53:26.745', ''),
	('cm9vcvujn0003hqn87tj23wuq', 4, 'Je suis arrivé à la mosquée, et **Al Mughirah**, l''Amir de al-Kufah, a dit : 

« J''ai entendu ~~le Messager d''Allah ﷺ~~, dire : 

En vérité, un mensonge à mon sujet n''est pas comme un mensonge sur n''importe qui d''autre, car celui qui ment intentionnellement à mon sujet, qu''il prépare sa place en Enfer. »
', 'وَحَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ اللَّهِ بْنِ نُمَيْرٍ، حَدَّثَنَا أَبِي، حَدَّثَنَا سَعِيدُ بْنُ عُبَيْدٍ، حَدَّثَنَا عَلِيُّ بْنُ رَبِيعَةَ، قَالَ أَتَيْتُ الْمَسْجِدَ وَالْمُغِيرَةُ أَمِيرُ الْكُوفَةِ قَالَ فَقَالَ الْمُغِيرَةُ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ" إِنَّ كَذِبًا عَلَىَّ لَيْسَ كَكَذِبٍ عَلَى أَحَدٍ فَمَنْ كَذَبَ عَلَىَّ مُتَعَمِّدًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ".', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.908', '2025-08-30 20:25:05.232', ''),
	('cm9vcvuke0007hqn8hdd16tz3', 8, 'La première personne qui a parlé sur le destin à Bassora est **Ma''bad Al Jouhani**. 

Alors que j''étais parti avec **Houmayd Ibn ''Abder Rahman Al Houmayri** pour le Hajj ou la ''Omra nous avons dit : 

Si nous rencontrons un des compagnons du ~~Prophète~~ (qu''Allah les agrée tous), nous le questionnerons sur ce que disent ceux-là sur le destin. 

Nous avons donc trouvé **Abdallah Ibn Omar** (qu''Allah les agrée lui et son père) dans la mosquée et j''ai dit :

-Ô **Abou Abder Rahman** ! Il est apparu des gens derrière nous qui lisent le Coran, étudient la science et font telle et telle chose. Ces gens disent qu''il n''y a pas de destin et que les choses se produisent par elles-mêmes. 

**Abdallah ibn Omar** (qu''Allah les agrée lui et son père) a dit :

 « Lorsque tu rencontreras ces gens, informe-les que je me désavoue d''eux et qu''ils se désavouent de moi. Je jure par la divinité de **Abdallah ibn Omar** ! Si l''un d''eux possédait l''équivalent de la montagne de Ouhoud en or qu''il dépenserait dans le bien, Allah ne l''aurait pas accepté de lui jusqu''à ce qu''il croit au destin ».', 'عن يحيى بن معمر قال: كان أول من قال في القدر بالبصرة معبد الجهني، فانطلقت أنا وحميد بن عبد الرحمن الحميري حاجين أو معتمرين، فقلنا: لو لقينا أحدًا من أصحاب رسول الله ﷺ فسألناه عما يقول هؤلاء في القدر، فوفق لنا عبد الله بن عمر بن الخطاب رضي الله عنهما داخلًا المسجد، فقلت: أبا عبد الرحمن! إنه قد ظهر قبلنا ناس يقرؤون القرآن ويتقفرون العلم، وذكر من شأنهم، وأنهم يزعمون أن لا قدر، وأن الأمر أنف. قال عبد الله بن عمر رضي الله عنهما: فإذا لقيت أولئك فأخبرهم أني بريء منهم وأنهم برآء مني، والذي يحلف به عبد الله بن عمر، لو أن لأحدهم مثل أحد ذهبًا فأنفقه ما قبله الله منه حتى يؤمن بالقدر.', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.934', '2025-05-26 11:43:25.667', ''),
	('cm9vcvukm0008hqn8m2d89h72', 9, '~~Le Prophète ﷺ~~ était assis avec les gens lorsqu’un homme est venu et a dit:

Ô ~~Messager d’Allah~~ ! Qu’est ce que la foi ?


~~Le Prophète ﷺ~~ a dit: «
La foi est que tu croies en Allah, en Ses anges, en Son Livre, en Sa rencontre, en Ses Messagers et que tu croies en la résurrection ».


Puis il a dit: Ô ~~Messager d’Allah~~ ! Qu’est ce que l’Islam ?


~~Le Prophète ﷺ~~ a dit: « L’Islam est que tu adores Allah et que tu ne lui associes rien, que tu accomplisses la prière, que tu t’acquittes de la zakat obligatoire et que tu jeûnes le Ramadan ».


Puis il a dit: Qu’est ce que l’ihsan ?


~~Le Prophète ﷺ~~ a dit: « Que tu adores Allah comme si tu Le voyais et si tu ne Le voies pas certes Lui te voit ».


Puis il a dit: Ô ~~Messager d’Allah~~ ! Quand aura lieu l’Heure ?


~~Le Prophète ﷺ~~ a dit: Le questionné n’en sait pas plus que le questionneur mais je vais t’informer de ses signes: quand la femme esclave enfantera son maître ceci fait partie de ses signes.


Quand les gens nus et ne portant pas de souliers dirigeront les gens ceci fait partie de ses signes. Quand les gardiens de bétails rivaliseront dans les constructions, ceci fait partie de ses signes. Il y a cinq choses que seul Allah connaît ».


Puis ~~le Prophète ﷺ~~ récita : 

*Certes la connaissance de l’Heure est auprès d’Allah, c’est Lui qui fait descendre la pluie et sait ce qu’il y a dans les matrices. Aucune âme ne sait ce qu’elle aura demain et aucune âme ne sait sur quelle terre elle va mourir. Certes Allah est savant et très connaisseur.*


Alors l’homme est parti.


~~Le Prophète ﷺ~~ a dit: « Ramenez moi cet homme ».


Ils sont parti le chercher mais ils n’ont rien vu.


Alors ~~le Prophète ﷺ~~ a dit: « C’est Jibril qui est venu pour apprendre aux gens leur religion ».', 'عن أبي هريرة رضي الله عنه قال : كان رسول الله صلى الله عليه وسلم يوما بارزا للناس فأتاه رجل فقال : يا رسول الله ! ما الإيمان ؟ قال رسول الله صلى الله عليه وسلم : أن تؤمن بالله وملائكته وكتابه ولقائه ورسله وتؤمن بالبعث الآخر قال الرجل : يا رسول الله ! ما الإسلام ؟ قال رسول الله صلى الله عليه وسلم : الإسلام أن تعبد الله ولا تشرك به شيئا وتقيم الصلاة المكتوبة وتؤدي الزكاة المفروضة وتصوم رمضان قال : يا رسول الله ! ما الإحسان ؟ قال رسول الله صلى الله عليه وسلم : أن تعبد الله كأنك تراه فإنك إن لا تراه فإنه يراك قال : يا رسول الله ! متى الساعة ؟ قال رسول الله صلى الله عليه وسلم : ما المسؤول عنها بأعلم من السائل ولكن سأحدثك عن أشراطها : إذا ولدت الأمة ربها فذاك من أشراطها وإذا كانت العراة الحفاة رؤوس الناس فذاك من أشراطها وإذا تطاول رعاء البهم في البنيان فذاك من أشراطها في خمس لا يعلمهن إلا الله . ثم تلا رسول الله صلى الله عليه وسلم : إن الله عنده علم الساعة وينزل الغيث ويعلم ما في الأرحام وما تدري نفس ماذا تكسب غدا وما تدري نفس بأي أرض تموت إن الله عليم خبير ثم أدبر الرجل فقال رسول الله صلى الله عليه وسلم : ردوا علي الرجل فأخذوا ليردوه فلم يروا شيئا فقال رسول الله صلى الله عليه وسلم : هذا جبريل جاء ليعلم الناس دينهم', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.942', '2025-05-23 14:33:15.634', ''),
	('cm9vcvuks0009hqn8moq661oh', 10, '~~Le Prophète ﷺ~~ a dit : « Interrogez moi ».


Mais ils ont refusé de l’interroger.


Alors un homme est venu et s’est assis vers ses genoux et a dit :

 Ô ~~Messager~~ d’Allah ! Qu’est ce que l’Islam ?


~~Le Prophète ﷺ~~ a dit:

 « Tu n’associes rien à Allah, tu accomplis la prière, tu donnes l’aumône obligatoire et tu jeûnes le Ramadan ».


L’homme a dit : 

Tu as dis vrai. Ô ~~Messager d’Allah~~ ! Qu’est ce que la foi ?


Le ~~Prophète ﷺ~~ a dit:

 « Que tu croies en Allah, en Ses anges, en Son Livre, en Sa rencontre, en Ses Messagers, que tu croies en la résurrection et que tu croies en le destin en entier ».


L’homme a dit : Tu as dis vrai. Ô ~~Messager d’Allah~~ ! Qu’est ce que l’ihsan ?


~~Le Prophète ﷺ~~ a dit: « Que tu craignes Allah comme si tu Le voyais et si tu ne Le voies pas certes Lui te voit ».

L’homme a dit : 

Tu as dis vrai.  Ô ~~Messager d’Allah~~ ! Quand aura lieu l’Heure ?


~~Le Prophète ﷺ~~ a dit: Le questionné n’en sait pas plus que le questionneur.


Mais je vais t’informer de ses signes: quand tu verras la femme enfanter son maître ceci fait partie de ses signes.


Quand tu verras les gens nus et ne portant pas de souliers, sourds et muets seront les rois de la terre ceci fait partie de ses signes.

Quand tu verras les gardiens de bétails rivaliser dans les constructions, ceci fait partie de ses signes. Il y a cinq choses de l’invisible que seul Allah connaît ».


Puis ~~le Prophète ﷺ~~ récita : 

*Certes la connaissance de l’Heure est auprès d’Allah, c’est Lui qui descend la pluie et sait ce qu’il y a dans les matrices. Aucune âme ne sait ce qu’elle aura demain et aucune âme ne sait sur quelle terre elle va mourir. Certes Allah est savant et très connaisseur.*


Puis l’homme s’est levé et ~~le Prophète ﷺ~~ a dit : « Ramenez-le moi ».


Ils ont cherché l’homme mais ne l’ont pas trouvé alors ~~le Prophète ﷺ~~ a dit : 

« Il s’agissait de Djibril qui a voulu que vous appreniez au moment où vous ne posiez pas de questions . »', 'عن أبي هريرة رضي الله عنه قال : قال رسول الله صلّى الله عليه وسلّم : سلوني فهابوه أن يسألوه فجاء رجل فجلس عند ركبتيه فقال : يا رسول الله ! ما الإسلام ؟ قال رسول الله صلّى الله عليه وسلّم : لا تشرك بالله شيئًا وتقيم الصلاة وتؤتى الزكاة وتصوم رمضان قال : صدقت يا رسول الله ! ما الإيمان ؟ قال رسول الله صلّى الله عليه وسلّم : أن تؤمن بالله وملائكته وكتابه ولقائه ورسله وتؤمن بالبعث وتؤمن بالقدر كلٌه قال : صدقت يا رسول الله ! ما لإحسان ؟ قال رسول لله صلّى الله عليه وسلّم : أن تخشى الله كأنّك تراه فإنّك إن لا تكن تراه فإنّه يراك قال : صدقت يا رسول الله ! متى تقوم الساعة ؟ قال رسول لله صلّى الله عليه وسلّم : ما المسئول عنها بأعلم من السّائل وسأحدثك عن أشراطها : إذا رأيت المرأة تلد ربها فذاك من أشراطها وإذا رأيت الحفاة العراة الصم البكم ملوك الأرض فذاك من أشراطها وإذا رأيت رعاء البهم يتطاولون في البنيان فذاك من أشراطها في خمس من الغيب لا يعلمهنّ إلاّ الله ثمّ قرأ : إن الله عنده علم السّاعة وينزل الغيث ويعلم ما في الأرحام وما تدري نفس ماذا تكسب غدًا وما تدري نفس بأي أرض تموت إنّ الله عليم خبير ثمّ قام الرجل فقال رسول الله صلّى الله عليه وسلّم : ردّوه عليّ فالتمس فلم يجدوه فقال رسول الله صلى الله عليه وسلم : هذا جبريل أراد أن تعلّموا إذا لم تسألوا', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.948', '2025-05-24 16:46:48.83', ''),
	('cm9vcvukz000ahqn8ryl15s48', 11, 'Un homme, originaire du Najd, aux cheveux ébouriffés, vint voir ~~le Messager d''Allah ﷺ~~.  

Nous entendions le bourdonnement de sa voix sans comprendre ce qu’il disait, jusqu’à ce qu’il s’approche du ~~Messager d’Allah ﷺ~~.
>
> Il s’avéra qu’il posait des questions concernant l’Islam.

>
> ~~Le Messager d’Allah ﷺ~~ répondit :
>
> > « Cinq prières durant le jour et la nuit. »

>
> L’homme demanda :
>
> > « Suis-je obligé d’en accomplir d’autres que celles-ci ? »

>
> ~~Le Prophète ﷺ~~ dit :
>
> > « Non, sauf si tu accomplis des prières surérogatoires. »
>

> Puis il ajouta :
>
> > « Et le jeûne du mois de Ramadan. »
>
> L’homme demanda :
>
> > « Suis-je obligé de jeûner autre chose que cela ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Non, sauf si tu jeûnes volontairement. »

>
> Ensuite, ~~le Prophète ﷺ~~ lui parla de la Zakat.

>
> L’homme demanda :
>
> > « Suis-je obligé de donner autre chose que cela ? »

>
>~~Le Prophète ﷺ~~ répondit :
>
> > « Non, sauf si tu donnes volontairement. »

>
> Alors l’homme s’éloigna en disant :
>
> > « Par Allah, je n’ajouterai rien à cela et je n’en diminuerai rien. »

>
> ~~Le Messager d’Allah ﷺ~~ dit alors :
>
> > « Il réussira s’il est sincère. »
', 'حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدِ بْنِ جَمِيلِ بْنِ طَرِيفِ بْنِ عَبْدِ اللَّهِ الثَّقَفِيُّ، عَنْ مَالِكِ بْنِ أَنَسٍ، - فِيمَا قُرِئَ عَلَيْهِ - عَنْ أَبِي سُهَيْلٍ، عَنْ أَبِيهِ، أَنَّهُ سَمِعَ طَلْحَةَ بْنَ عُبَيْدِ اللَّهِ، يَقُولُ جَاءَ رَجُلٌ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم مِنْ أَهْلِ نَجْدٍ ثَائِرُ الرَّأْسِ نَسْمَعُ دَوِيَّ صَوْتِهِ وَلاَ نَفْقَهُ مَا يَقُولُ حَتَّى دَنَا مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم فَإِذَا هُوَ يَسْأَلُ عَنِ الإِسْلاَمِ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم " خَمْسُ صَلَوَاتٍ فِي الْيَوْمِ وَاللَّيْلَةِ " . فَقَالَ هَلْ عَلَىَّ غَيْرُهُنَّ قَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ وَصِيَامُ شَهْرِ رَمَضَانَ " . فَقَالَ هَلْ عَلَىَّ غَيْرُهُ فَقَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ " . وَذَكَرَ لَهُ رَسُولُ اللَّهِ صلى الله عليه وسلم الزَّكَاةَ فَقَالَ هَلْ عَلَىَّ غَيْرُهَا قَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ " قَالَ فَأَدْبَرَ الرَّجُلُ وَهُوَ يَقُولُ وَاللَّهِ لاَ أَزِيدُ عَلَى هَذَا وَلاَ أَنْقُصُ مِنْهُ . فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم " أَفْلَحَ إِنْ صَدَقَ " .', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.956', '2025-05-23 14:40:04.986', ''),
	('cm9vcvul5000bhqn8aztuhpds', 12, 'Nous avions été interdits de poser des questions au ~~Messager d''Allah ﷺ~~.  

Ainsi, il nous plaisait qu''un homme intelligent des habitants du désert vienne l''interroger en notre présence, afin que nous puissions écouter ses réponses.
>
> Un jour, un homme du désert vint et dit :
>
> > « Ô ~~Muhammad~~, ton messager est venu à nous et prétend que tu affirmes qu''Allah t''a envoyé. »
>

> ~~Le Prophète ﷺ~~ répondit :
>
> > « Il a dit vrai. »
>

> L''homme poursuivit :
>
> > « Qui a créé le ciel ? »

>
>~~Le Prophète ﷺ~~ répondit :
>
> > « Allah. »

>
> L''homme demanda encore :
>
> > « Qui a créé la terre ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Allah. »

>
> L''homme continua :
>
> > « Qui a dressé ces montagnes et y a placé ce qui s''y trouve ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Allah. »

>
> Alors l''homme dit :
>
> > « Par Celui qui a créé le ciel, la terre et dressé ces montagnes, est-ce Allah qui t''a réellement envoyé ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Oui. »

>
> L''homme ajouta :
>
> > « Ton messager prétend que cinq prières nous ont été imposées durant le jour et la nuit. »

>
>~~Le Prophète ﷺ~~ répondit :
>
> > « Il a dit vrai. »

>
> L''homme demanda :
>
> > « Par Celui qui t''a envoyé, est-ce Allah qui t''a ordonné cela ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Oui. »

>
> L''homme continua :
>
> > « Ton messager prétend que la Zakat nous est imposée sur nos biens. »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Il a dit vrai. »

>
> L''homme demanda :
>
> > « Par Celui qui t''a envoyé, est-ce Allah qui t''a ordonné cela ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Oui. »

>
> L''homme poursuivit :
>
> > « Ton messager prétend qu''il nous est imposé de jeûner le mois de Ramadan chaque année. »

>
>~~Le Prophète ﷺ~~ répondit :
>
> > « Il a dit vrai. »

>
> L''homme demanda :
>
> > « Par Celui qui t''a envoyé, est-ce Allah qui t''a ordonné cela ? »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Oui. »

>
> L''homme ajouta :
>
> > « Ton messager prétend que le pèlerinage à la Maison (Ka''bah) est obligatoire pour celui qui en a la capacité. »

>
> ~~Le Prophète ﷺ~~ répondit :
>
> > « Oui. »

>
> À la fin de cet échange, l''homme déclara :
>
> > « Par Celui qui t''a envoyé avec la vérité, je n''ajouterai rien à ces obligations ni n''en diminuerai rien. »

>
> ~~Le Prophète ﷺ~~ conclut alors :
>
> > « S''il est sincère, il entrera au Paradis. »
', 'حَدَّثَنِي عَمْرُو بْنُ مُحَمَّدِ بْنِ بُكَيْرٍ النَّاقِدُ، حَدَّثَنَا هَاشِمُ بْنُ الْقَاسِمِ أَبُو النَّضْرِ، حَدَّثَنَا سُلَيْمَانُ بْنُ الْمُغِيرَةِ، عَنْ ثَابِتٍ، عَنْ أَنَسِ بْنِ مَالِكٍ، قَالَ نُهِينَا أَنْ نَسْأَلَ، رَسُولَ اللَّهِ صلى الله عليه وسلم عَنْ شَىْءٍ فَكَانَ يُعْجِبُنَا أَنْ يَجِيءَ الرَّجُلُ مِنْ أَهْلِ الْبَادِيَةِ الْعَاقِلُ فَيَسْأَلَهُ وَنَحْنُ نَسْمَعُ فَجَاءَ رَجُلٌ مِنْ أَهْلِ الْبَادِيَةِ فَقَالَ يَا مُحَمَّدُ أَتَانَا رَسُولُكَ فَزَعَمَ لَنَا أَنَّكَ تَزْعُمُ أَنَّ اللَّهَ أَرْسَلَكَ قَالَ " صَدَقَ " . قَالَ فَمَنْ خَلَقَ السَّمَاءَ قَالَ " اللَّهُ " . قَالَ فَمَنْ خَلَقَ الأَرْضَ قَالَ " اللَّهُ " . قَالَ فَمَنْ نَصَبَ هَذِهِ الْجِبَالَ وَجَعَلَ فِيهَا مَا جَعَلَ . قَالَ " اللَّهُ " . قَالَ فَبِالَّذِي خَلَقَ السَّمَاءَ وَخَلَقَ الأَرْضَ وَنَصَبَ هَذِهِ الْجِبَالَ آللَّهُ أَرْسَلَكَ قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا خَمْسَ صَلَوَاتٍ فِي يَوْمِنَا وَلَيْلَتِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمْرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا زَكَاةً فِي أَمْوَالِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمْرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا صَوْمَ شَهْرِ رَمَضَانَ فِي سَنَتِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمَرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا حَجَّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلاً . قَالَ " صَدَقَ " . قَالَ ثُمَّ وَلَّى . قَالَ وَالَّذِي بَعَثَكَ بِالْحَقِّ لاَ أَزِيدُ عَلَيْهِنَّ وَلاَ أَنْقُصُ مِنْهُنَّ . فَقَالَ النَّبِيُّ صلى الله عليه وسلم " لَئِنْ صَدَقَ لَيَدْخُلَنَّ الْجَنَّةَ " .', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.962', '2025-05-23 14:45:48.84', ''),
	('cm9vcvulc000chqn8qssf5pvs', 13, 'Un homme est venu au ~~Prophète ﷺ~~ et a dit : 

Montre moi une oeuvre que je pourrais pratiquer et qui me rapprocherait du paradis et m’éloignerait du feu.


~~Le Prophète ﷺ~~ a dit : « Tu adores Allah et tu ne Lui associes rien, tu accomplies la prière, tu t’acquittes de la zakat et tu lies tes liens de parenté ».


Quand l’homme est parti ~~le Prophète ﷺ~~ a dit : « S’il s’accroche à ce qui lui a été ordonné il rentrera dans le paradis ».', 'عن أبي أيوب الأنصاري رضي الله عنه قال : جاء رجل إلى النبي صلى الله عليه وسلم فقال : دلني على عمل أعمله يدنيني من الجنة ويباعدني من النار قال النبي صلى الله عليه وسلم : تعبد الله لا تشرك به شيئا وتقيم الصلاة وتؤتي الزكاة وتصل رحمك فلما أدبر قال النبي صلى الله عليه وسلم : إن تمسك بما أمر به دخل الجنة', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.968', '2025-05-23 14:46:19.062', ''),
	('cm9vcvulj000dhqn8zl076v5f', 14, 'Un homme vint auprès du ~~Prophète ﷺ~~ et lui dit :

« Indique-moi une œuvre qui me rapproche du Paradis et m’éloigne de l’Enfer. » 

~~Le Prophète ﷺ~~ répondit : 

« Tu adores Allah sans rien Lui associer, tu accomplis la prière, tu acquittes la zakat et tu maintiens les liens de parenté. »

 Lorsque l’homme tourna le dos, ~~le Messager d’Allah ﷺ~~ dit : 

« S’il s’en tient à ce qui lui a été ordonné, il entrera au Paradis. »', 'حَدَّثَنَا يَحْيَى بْنُ يَحْيَى التَّمِيمِيُّ، أَخْبَرَنَا أَبُو الأَحْوَصِ، ح وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو الأَحْوَصِ، عَنْ أَبِي إِسْحَاقَ، عَنْ مُوسَى بْنِ طَلْحَةَ، عَنْ أَبِي أَيُّوبَ، قَالَ جَاءَ رَجُلٌ إِلَى النَّبِيِّ صلى الله عليه وسلم فَقَالَ دُلَّنِي عَلَى عَمَلٍ أَعْمَلُهُ يُدْنِينِي مِنَ الْجَنَّةِ وَيُبَاعِدُنِي مِنَ النَّارِ ‏.‏ قَالَ ‏"‏ تَعْبُدُ اللَّهَ لاَ تُشْرِكُ بِهِ شَيْئًا وَتُقِيمُ الصَّلاَةَ وَتُؤْتِي الزَّكَاةَ وَتَصِلُ ذَا رَحِمِكَ ‏"‏ فَلَمَّا أَدْبَرَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ إِنْ تَمَسَّكَ بِمَا أُمِرَ بِهِ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏ وَفِي رِوَايَةِ ابْنِ أَبِي شَيْبَةَ ‏"‏ إِنْ تَمَسَّكَ بِهِ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.975', '2025-05-23 15:15:43.374', ''),
	('cm9vcvulp000ehqn8q8dy47l4', 15, '**Nu‘mān ibn Qawqal** vint trouver ~~le Prophète ﷺ~~ et dit : 
« Si j’accomplis les prières obligatoires, que je m’éloigne de ce qui est interdit, et que je considère licite ce qu’Allah a rendu licite, entrerai-je au Paradis ? » 

~~Le Prophète ﷺ~~ répondit par l’affirmative."', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ - وَاللَّفْظُ لأَبِي كُرَيْبٍ - قَالاَ حَدَّثَنَا أَبُو مُعَاوِيَةَ، عَنِ الأَعْمَشِ، عَنْ أَبِي سُفْيَانَ، عَنْ جَابِرٍ، قَالَ أَتَى النَّبِيَّ صلى الله عليه وسلم النُّعْمَانُ بْنُ قَوْقَلٍ فَقَالَ يَا رَسُولَ اللَّهِ أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَةَ وَحَرَّمْتُ الْحَرَامَ وَأَحْلَلْتُ الْحَلاَلَ أَأَدْخُلُ الْجَنَّةَ فَقَالَ النَّبِيُّ صلى الله عليه وسلم ‏ "‏ نَعَمْ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.982', '2025-05-23 14:47:14.692', ''),
	('cm9vcvulx000fhqn8ve4wdu02', 16, '~~Le Prophète ﷺ~~ a dit: 

« L’Islam est bâti sur cinq choses: 

- Sur le fait d’unifier Allah, 
- d’accomplir la prière, 
- de s’acquitter de la zakat, 
- de jeûner le Ramadan 
- et de faire le pèlerinage ».', 'عن عبدالله بن عمر رضي الله عنهما قال النّبي صلّى الله عليه و سلّم : بُنِيَ الإسلامُ على خمسةٍ : على أن يُوَحَّدَ اللهُ وإقامِ الصلاةِ وإيتاءِ الزكاةِ وصيامِ رمضانَ والحجِّ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.99', '2025-05-23 14:48:45.034', ''),
	('cm9vcvum4000ghqn8u7mjsg77', 17, '~~Le Prophète ﷺ~~ a dit à **Al-Ashajj** de la tribu de ‘Abd al-Qays : 

« Tu possèdes deux qualités qu’Allah aime : la douceur et la patience. »', 'عن عبدالله بن عباس رضي الله عنهما قال النبي صلى الله عليه و سلم للأشج عبد القيس رضي الله عنه : إن فيك خصلتين يحبهما الله : الحلم والأناة', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:43.996', '2025-05-23 14:48:55.885', ''),
	('cm9vcvumc000hhqn851z82svi', 19, '~~Le Messager d''Allah ﷺ~~ m''a envoyé en mission en disant : 

« Tu vas rencontrer un peuple parmi les gens du Livre. Invite-les à témoigner qu''il n''y a de divinité qu''Allah et que ~~Muhammad est le Messager d''Allah~~. 

S''ils obéissent à cela, informe-les qu''Allah leur a imposé cinq prières à accomplir chaque jour et chaque nuit. 

S''ils obéissent à cela, informe-les qu''Allah leur a imposé de prendre la zakat de leurs riches pour la redistribuer à leurs pauvres. 

S''ils obéissent à cela, fais attention à ne pas prendre les meilleurs de leurs biens. Et prends garde à l''invocation du lésé, car il n''y a pas d''intermédiaire entre elle et Allah. »

', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ جَمِيعًا عَنْ وَكِيعٍ، - قَالَ أَبُو بَكْرٍ حَدَّثَنَا وَكِيعٌ، - عَنْ زَكَرِيَّاءَ بْنِ إِسْحَاقَ، قَالَ حَدَّثَنِي يَحْيَى بْنُ عَبْدِ اللَّهِ بْنِ صَيْفِيٍّ، عَنْ أَبِي مَعْبَدٍ، عَنِ ابْنِ عَبَّاسٍ، عَنْ مُعَاذِ بْنِ جَبَلٍ، - قَالَ أَبُو بَكْرٍ رُبَّمَا قَالَ وَكِيعٌ عَنِ ابْنِ عَبَّاسٍ، أَنَّ مُعَاذًا، - قَالَ بَعَثَنِي رَسُولُ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ إِنَّكَ تَأْتِي قَوْمًا مِنْ أَهْلِ الْكِتَابِ ‏.‏ فَادْعُهُمْ إِلَى شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ خَمْسَ صَلَوَاتٍ فِي كُلِّ يَوْمٍ وَلَيْلَةٍ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ صَدَقَةً تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ فَتُرَدُّ فِي فُقَرَائِهِمْ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَإِيَّاكَ وَكَرَائِمَ أَمْوَالِهِمْ وَاتَّقِ دَعْوَةَ الْمَظْلُومِ فَإِنَّهُ لَيْسَ بَيْنَهَا وَبَيْنَ اللَّهِ حِجَابٌ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.005', '2025-05-23 14:50:02.086', ''),
	('cmb0ye7b40005hqg86arxqv0k', 36, '**Salim** rapporte d’après son père (**Abdallah ibn Omar**) que le ~~Prophète ﷺ~~ entendit un homme réprimander son frère au sujet de la pudeur, alors le ~~Prophète ﷺ~~ dit :


« La pudeur fait partie de la foi. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَعَمْرٌو النَّاقِدُ، وَزُهَيْرُ بْنُ حَرْبٍ، قَالُوا حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ، عَنِ الزُّهْرِيِّ، عَنْ سَالِمٍ، عَنْ أَبِيهِ، سَمِعَ النَّبِيُّ صلى الله عليه وسلم رَجُلاً يَعِظُ أَخَاهُ فِي الْحَيَاءِ فَقَالَ ‏ "‏ الْحَيَاءُ مِنَ الإِيمَانِ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 15:26:25.408', '2025-05-23 15:26:25.408', ''),
	('cm9vcvumj000ihqn8w9l5c840', 20, 'Lorsque le ~~Messager d''Allah ﷺ~~ mourut et qu''**Abu Bakr** fut désigné comme calife après lui, et que certains des Arabes renièrent leur foi, **Omar ibn al-Khattab** dit à **Abu Bakr** : 

« Comment vas-tu combattre les gens, alors que le ~~Messager d''Allah ﷺ~~ a dit : 

"J''ai été ordonné de combattre les gens jusqu''à ce qu''ils disent : Il n''y a pas de divinité sauf Allah". 

Celui qui dit : ''Il n''y a pas de divinité sauf Allah'' a protégé son bien et sa vie, sauf par son droit et son compte sera auprès d''Allah.'' »

Alors, **Abu Bakr** répondit : 

« Par Allah, je combattrai ceux qui différencient entre la prière et la zakat. Car la zakat est un droit du bien. Par Allah, même s''ils me retiennent un fil de chameau qu''ils devaient remettre au ~~Messager d''Allah ﷺ~~, je les combattrai pour cela. » 

**Omar ibn al-Khattab** dit alors :

 « Par Allah, ce n''est que lorsque j''ai vu que Allah avait élargi la poitrine d''Abu Bakr pour le combat, que j''ai su que c''était la vérité. »
', 'حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثُ بْنُ سَعْدٍ، عَنْ عُقَيْلٍ، عَنِ الزُّهْرِيِّ، قَالَ أَخْبَرَنِي عُبَيْدُ اللَّهِ بْنُ عَبْدِ اللَّهِ بْنِ عُتْبَةَ بْنِ مَسْعُودٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ لَمَّا تُوُفِّيَ رَسُولُ اللَّهِ صلى الله عليه وسلم وَاسْتُخْلِفَ أَبُو بَكْرٍ بَعْدَهُ وَكَفَرَ مَنْ كَفَرَ مِنَ الْعَرَبِ قَالَ عُمَرُ بْنُ الْخَطَّابِ لأَبِي بَكْرٍ كَيْفَ تُقَاتِلُ النَّاسَ وَقَدْ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَقُولُوا لاَ إِلَهَ إِلاَّ اللَّهُ فَمَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ فَقَدْ عَصَمَ مِنِّي مَالَهُ وَنَفْسَهُ إِلاَّ بِحَقِّهِ وَحِسَابُهُ عَلَى اللَّهِ ‏"‏ ‏.‏ فَقَالَ أَبُو بَكْرٍ وَاللَّهِ لأُقَاتِلَنَّ مَنْ فَرَّقَ بَيْنَ الصَّلاَةِ وَالزَّكَاةِ فَإِنَّ الزَّكَاةَ حَقُّ الْمَالِ وَاللَّهِ لَوْ مَنَعُونِي عِقَالاً كَانُوا يُؤَدُّونَهُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم لَقَاتَلْتُهُمْ عَلَى مَنْعِهِ ‏.‏ فَقَالَ عُمَرُ بْنُ الْخَطَّابِ فَوَاللَّهِ مَا هُوَ إِلاَّ أَنْ رَأَيْتُ اللَّهَ عَزَّ وَجَلَّ قَدْ شَرَحَ صَدْرَ أَبِي بَكْرٍ لِلْقِتَالِ فَعَرَفْتُ أَنَّهُ الْحَقُّ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.011', '2025-05-23 14:50:42.911', ''),
	('cm9vcvumr000jhqn8fvx6viad', 21, '~~Le Messager d’Allah ﷺ~~ a dit :

« Il m’a été ordonné de combattre les gens jusqu’à ce qu’ils témoignent qu’il n’y a de divinité qu’Allah. Celui qui professe cela voit sa vie et ses biens protégés de ma part, sauf pour ce qui est dû en droit. Quant à son jugement final, il appartient à Allah. »', 'وَحَدَّثَنَا أَبُو الطَّاهِرِ، وَحَرْمَلَةُ بْنُ يَحْيَى، وَأَحْمَدُ بْنُ عِيسَى، قَالَ أَحْمَدُ حَدَّثَنَا وَقَالَ الآخَرَانِ، أَخْبَرَنَا ابْنُ وَهْبٍ، قَالَ أَخْبَرَنِي يُونُسُ، عَنِ ابْنِ شِهَابٍ، قَالَ حَدَّثَنِي سَعِيدُ بْنُ الْمُسَيَّبِ، أَنَّ أَبَا هُرَيْرَةَ، أَخْبَرَهُ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَقُولُوا لاَ إِلَهَ إِلاَّ اللَّهُ فَمَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ عَصَمَ مِنِّي مَالَهُ وَنَفْسَهُ إِلاَّ بِحَقِّهِ وَحِسَابُهُ عَلَى اللَّهِ ‏"‏ ‏.‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.019', '2025-05-23 14:50:52.16', ''),
	('cm9vcvumy000khqn8qc642hcr', 22, '~~Le Messager d’Allah ﷺ~~ nous dit en s’adressant à nous :

« N’êtes-vous pas satisfaits de constituer un quart des habitants du Paradis ? »

Le narrateur dit : Nous avons glorifié Allah (c’est-à-dire que nous avons dit Allâhu Akbar).

Puis, il dit :

« N’êtes-vous pas satisfaits de constituer un tiers des habitants du Paradis ? »

Nous avons glorifié Allah.

Puis, il dit :

« J’espère que vous constituerez la moitié des habitants du Paradis. Et je vais vous en expliquer la raison :
Les croyants parmi les mécréants ne sont pas plus nombreux qu’un poil blanc sur le corps d’un bœuf noir, ou un poil noir sur le corps d’un bœuf blanc. »', 'حَدَّثَنَا هَنَّادُ بْنُ السَّرِيِّ، حَدَّثَنَا أَبُو الأَحْوَصِ، عَنْ أَبِي إِسْحَاقَ، عَنْ عَمْرِو بْنِ مَيْمُونٍ، عَنْ عَبْدِ اللَّهِ، قَالَ قَالَ لَنَا رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ أَمَا تَرْضَوْنَ أَنْ تَكُونُوا رُبُعَ أَهْلِ الْجَنَّةِ ‏"‏ قَالَ فَكَبَّرْنَا ‏.‏ ثُمَّ قَالَ ‏"‏ أَمَا تَرْضَوْنَ أَنْ تَكُونُوا ثُلُثَ أَهْلِ الْجَنَّةِ ‏"‏ قَالَ فَكَبَّرْنَا ‏.‏ ثُمَّ قَالَ ‏"‏ إِنِّي لأَرْجُو أَنْ تَكُونُوا شَطْرَ أَهْلِ الْجَنَّةِ وَسَأُخْبِرُكُمْ عَنْ ذَلِكَ مَا الْمُسْلِمُونَ فِي الْكُفَّارِ إِلاَّ كَشَعْرَةٍ بَيْضَاءَ فِي ثَوْرٍ أَسْوَدَ أَوْ كَشَعْرَةٍ سَوْدَاءَ فِي ثَوْرٍ أَبْيَضَ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.027', '2025-05-23 14:51:12.458', ''),
	('cm9vcvun5000lhqn8kcscvvd2', 23, '~~Le Prophète ﷺ~~ a dit:

« Celui qui unifie Allah et mécroit dans ce qui est adoré en dehors d’Allah alors son argent et son sang sont interdits et son jugement incombe à Allah ».', 'عن طارق بن أشيم رضي الله عنه قال النّبي صلّى الله عليه و سلّم : مَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ وَكَفَرَ بِمَا يُعْبَدُ مِنْ دُونِ اللَّهِ حَرُمَ مَالُهُ وَدَمُهُ وَحِسَابُهُ عَلَى اللَّهِ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.033', '2025-05-23 14:51:20.34', ''),
	('cm9vcvund000mhqn8fxpvxmvm', 24, 'Au moment de la mort de **Abou Talib**, le ~~Prophète ﷺ~~ a trouvé auprès de lui **Abou Jahl** et **Abdallah Ibn Abi Oumaya Ibn Al Moughira**.


~~Le Prophète ﷺ~~ a dit : « Ô mon oncle ! Dis : -La Ilaha Illa Allah- ; c’est une parole par laquelle je témoignerai pour toi auprès d’Allah ».


Alors **Abou Jahl** et **‘Abdallah Ibn Abi Oumaya** ont dit : 

Ô **Abou Talib** ! Vas-tu t’écarter de la voie de ‘Abdel Moutalib ?


~~Le Prophète ﷺ~~ n’a cessé de lui présenter cette parole et de lui répéter cette phrase jusqu’à ce que la dernière chose que **Abou Talib** ai dit est qu’il est sur la voie de ‘Abdel Moutalib et il a refuser de dire -La Ilaha Illa Allah-.


Alors le ~~Prophète ﷺ~~ a dit : Par Allah ! Je vais certes demander le pardon pour toi tant qu’on ne me l’aura pas interdit.


Allah a donc révélé : 
"Il n’appartient pas au Prophète et aux croyants de demander le pardon pour les associateurs même s’ils font partie de leurs proches après qu’il leur soit devenu clair qu’ils font partie des gens de la géhenne".


Et Allah a révélé au ~~Prophète ﷺ~~ concernant **Abou Talib** : 

"Certes tu ne guides pas ceux que tu aimes mais Allah guide qui Il veut et Il est plus connaisseur des biens-guidés".', 'عن المسيب بن حزن قال : لما حضر أبا طالب الوفاة جاء رسول الله صلى الله عليه وسلم فوجد عنده أبا جهل وعبد الله بن أبي أمية بن المغيرة
فقال رسول الله صلى الله عليه وسلم : يا عم ! قل : لا إله إلا الله كلمة أشهد لك بها عند الله
فقال أبو جهل وعبدالله بن أبي أمية : يا أبا طالب ! أترغب عن ملة عبدالمطلب ؟
فلم يزل رسول الله صلى الله عليه وسلم يعرضها عليه ويعيد له تلك المقالة حتى قال أبو طالب آخر ما كلمهم : هو على ملة عبدالمطلب وأبي أن يقول : لا إله إلا الله
فقال رسول الله صلى الله عليه وسلم : أما والله ! لأستغفرن لك ما لم أنه عنه
فأنزل الله : ما كان للنبي والذين آمنوا أن يستغفروا للمشركين ولو كانوا أولي قربى من بعد ما تبين لهم أنهم أصحاب الجحيم
وأنزل الله في أبي طالب فقال لرسول الله صلى الله عليه وسلم : إنك لا تهدي من أحببت ولكن الله يهدي من يشاء وهو أعلم بالمهتدين ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.041', '2025-05-23 15:03:42.653', ''),
	('cm9vcvunk000nhqn8r5y2wh9c', 25, '~~Le Messager d''Allah ﷺ~~ dit à son oncle au moment de sa mort :

« Prononce : Lā ilāha illa Allah , et je témoignerai pour toi au Jour du Jugement. »

Mais **Abou Talib** refusa de le dire.

Alors Allah révéla ce verset :

*« Tu ne guides pas celui que tu aimes, mais c’est Allah qui guide qui Il veut. Et Il connaît mieux ceux qui sont bien guidés. »
Sourate Al-Qasas 28, verset 56*', 'حَدَّثَنَا مُحَمَّدُ بْنُ عَبَّادٍ، وَابْنُ أَبِي عُمَرَ، قَالاَ حَدَّثَنَا مَرْوَانُ، عَنْ يَزِيدَ، - وَهُوَ ابْنُ كَيْسَانَ - عَنْ أَبِي حَازِمٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم لِعَمِّهِ عِنْدَ الْمَوْتِ ‏"‏ قُلْ لاَ إِلَهَ إِلاَّ اللَّهُ أَشْهَدُ لَكَ بِهَا يَوْمَ الْقِيَامَةِ ‏"‏ ‏.‏ فَأَبَى فَأَنْزَلَ اللَّهُ ‏{‏ إِنَّكَ لاَ تَهْدِي مَنْ أَحْبَبْتَ‏}‏ الآيَةَ ‏.‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.049', '2025-05-23 15:02:25.326', ''),
	('cm9vcvunz000ohqn8ianfgh36', 26, '~~Le Messager d’Allah ﷺ~~ a dit :

« Celui qui meurt sachant (de manière complète) qu’il n’y a de dieu qu’Allah, il entrera au Paradis. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَزُهَيْرُ بْنُ حَرْبٍ، كِلاَهُمَا عَنْ إِسْمَاعِيلَ بْنِ إِبْرَاهِيمَ، - قَالَ أَبُو بَكْرٍ حَدَّثَنَا ابْنُ عُلَيَّةَ، - عَنْ خَالِدٍ، قَالَ حَدَّثَنِي الْوَلِيدُ بْنُ مُسْلِمٍ، عَنْ حُمْرَانَ، عَنْ عُثْمَانَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لاَ إِلَهَ إِلاَّ اللَّهُ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.064', '2025-05-23 15:01:48.581', ''),
	('cm9vcvuod000phqn83xudsoe8', 27, 'Nous étions en marche avec le ~~Messager de Dieu ﷺ~~ vers Tabuk. Les provisions du groupe étaient presque épuisées. La situation devint tellement critique que les hommes décidèrent d''abattre certains de leurs chameaux.


À ce moment-là, **Omar** dit : "Ô ~~Messager de Dieu~~, je souhaite que vous rassembliez ce qui reste des provisions et que vous invoquiez les bénédictions de Dieu dessus."


Il le fit donc. Ceux qui possédaient du blé vinrent avec du blé. Ceux qui avaient des dattes vinrent avec des dattes. 

Et **Mujahid** dit : Ceux qui possédaient des noyaux de dattes vinrent avec des noyaux.


Je demandai : "Que faisaient-ils avec les noyaux de dattes ?"

Ils répondirent : "Ils les suçaient, puis buvaient de l''eau dessus."


Il invoqua alors les bénédictions de Dieu sur elles, et il y eut une telle augmentation miraculeuse des provisions que les gens purent complètement les reconstituer.


À ce moment-là, il dit : "Je témoigne qu''il n''y a de dieu que Dieu, et que je suis Son ~~Messager~~. Celui qui rencontrera Dieu sans douter de ces deux principes entrera au paradis."', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ النَّضْرِ بْنِ أَبِي النَّضْرِ، قَالَ حَدَّثَنِي أَبُو النَّضْرِ، هَاشِمُ بْنُ الْقَاسِمِ حَدَّثَنَا عُبَيْدُ اللَّهِ الأَشْجَعِيُّ، عَنْ مَالِكِ بْنِ مِغْوَلٍ، عَنْ طَلْحَةَ بْنِ مُصَرِّفٍ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ كُنَّا مَعَ النَّبِيِّ صلى الله عليه وسلم فِي مَسِيرٍ - قَالَ - فَنَفِدَتْ أَزْوَادُ الْقَوْمِ قَالَ حَتَّى هَمَّ بِنَحْرِ بَعْضِ حَمَائِلِهِمْ - قَالَ - فَقَالَ عُمَرُ يَا رَسُولَ اللَّهِ لَوْ جَمَعْتَ مَا بَقِيَ مِنْ أَزْوَادِ الْقَوْمِ فَدَعَوْتَ اللَّهَ عَلَيْهَا ‏.‏ قَالَ فَفَعَلَ - قَالَ - فَجَاءَ ذُو الْبُرِّ بِبُرِّهِ وَذُو التَّمْرِ بِتَمْرِهِ - قَالَ وَقَالَ مُجَاهِدٌ وَذُو النَّوَاةِ بِنَوَاهُ - قُلْتُ وَمَا كَانُوا يَصْنَعُونَ بِالنَّوَى قَالَ كَانُوا يَمُصُّونَهُ وَيَشْرَبُونَ عَلَيْهِ الْمَاءَ ‏.‏ قَالَ فَدَعَا عَلَيْهَا - قَالَ - حَتَّى مَلأَ الْقَوْمُ أَزْوِدَتَهُمْ - قَالَ - فَقَالَ عِنْدَ ذَلِكَ ‏ "‏ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ لاَ يَلْقَى اللَّهَ بِهِمَا عَبْدٌ غَيْرَ شَاكٍّ فِيهِمَا إِلاَّ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.078', '2025-05-23 15:01:39.657', ''),
	('cm9vcvuot000qhqn8kvk0wcxv', 28, 'Le ~~Messager d’Allah ﷺ~~ a dit :

« Celui qui dit :
“Il n’y a de divinité qu’Allah, Lui Seul sans associé,


~~Muhammad~~ est Son serviteur et Son messager,


Jésus est le serviteur d’Allah, le fils de Sa servante,


Sa parole qu’Il a jetée en Maryam (Marie), et un esprit venant de Lui,


le Paradis est vérité,


et l’Enfer est vérité”,


Allah lui ouvrira les huit portes du Paradis, et il y entrera par celle qu’il voudra. »', 'حَدَّثَنَا دَاوُدُ بْنُ رُشَيْدٍ، حَدَّثَنَا الْوَلِيدُ، - يَعْنِي ابْنَ مُسْلِمٍ - عَنِ ابْنِ جَابِرٍ، قَالَ حَدَّثَنِي عُمَيْرُ بْنُ هَانِئٍ، قَالَ حَدَّثَنِي جُنَادَةُ بْنُ أَبِي أُمَيَّةَ، حَدَّثَنَا عُبَادَةُ بْنُ الصَّامِتِ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ قَالَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ وَأَنَّ عِيسَى عَبْدُ اللَّهِ وَابْنُ أَمَتِهِ وَكَلِمَتُهُ أَلْقَاهَا إِلَى مَرْيَمَ وَرُوحٌ مِنْهُ وَأَنَّ الْجَنَّةَ حَقٌّ وَأَنَّ النَّارَ حَقٌّ أَدْخَلَهُ اللَّهُ مِنْ أَىِّ أَبْوَابِ الْجَنَّةِ الثَّمَانِيَةِ شَاءَ ‏"‏ ‏.‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:45:44.093', '2025-05-29 20:55:35.831', ''),
	('cm9vcx8zt0000hqykm0dx0n87', 18, 'Des gens de la tribu de `Abd al-Qays vinrent au ~~Prophète ﷺ~~ et dirent :

« Ô ~~Messager d’Allah~~, nous sommes d’un groupe de Rabīʿa, et entre toi et nous il y a les mécréants de Mudar. Nous ne pouvons venir à toi qu’au cours des mois sacrés. Ordonne-nous donc quelque chose que nous transmettrons à ceux que nous avons laissés derrière nous et par lequel nous entrerons au Paradis si nous nous y conformons. »

Le ~~Messager d’Allah ﷺ~~ dit :

« Je vous ordonne quatre choses et je vous interdis quatre choses :

-  -Adorez Allah sans rien Lui associer,
-  -Accomplissez la prière,
-  -Acquittez la zakat,
-  -Jeûnez le mois de Ramadan,
-  -Et donnez le cinquième (khums) du butin.

Je vous interdis quatre choses :

- -Ne consommez pas du dubba'' (récipient fait de gourde),
- -Ni du hantaam (récipient fait de bois),
- -Ni du muzaffat (récipient de métal)
- -Ni du naqeér (récipient où vous faites un petit trou pour y verser un liquide).', 'حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، حَدَّثَنَا ابْنُ عُلَيَّةَ، حَدَّثَنَا سَعِيدُ بْنُ أَبِي عَرُوبَةَ، عَنْ قَتَادَةَ، قَالَ حَدَّثَنَا مَنْ، لَقِيَ الْوَفْدَ الَّذِينَ قَدِمُوا عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم مِنْ عَبْدِ الْقَيْسِ ‏.‏ قَالَ سَعِيدٌ وَذَكَرَ قَتَادَةُ أَبَا نَضْرَةَ عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ فِي حَدِيثِهِ هَذَا ‏.‏ أَنَّ أُنَاسًا مِنْ عَبْدِ الْقَيْسِ قَدِمُوا عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالُوا يَا نَبِيَّ اللَّهِ إِنَّا حَىٌّ مِنْ رَبِيعَةَ وَبَيْنَنَا وَبَيْنَكَ كُفَّارُ مُضَرَ وَلاَ نَقْدِرُ عَلَيْكَ إِلاَّ فِي أَشْهُرِ الْحُرُمِ فَمُرْنَا بِأَمْرٍ نَأْمُرُ بِهِ مَنْ وَرَاءَنَا وَنَدْخُلُ بِهِ الْجَنَّةَ إِذَا نَحْنُ أَخَذْنَا بِهِ ‏.‏ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ آمُرُكُمْ بِأَرْبَعٍ وَأَنْهَاكُمْ عَنْ أَرْبَعٍ اعْبُدُوا اللَّهَ وَلاَ تُشْرِكُوا بِهِ شَيْئًا وَأَقِيمُوا الصَّلاَةَ وَآتُوا الزَّكَاةَ وَصُومُوا رَمَضَانَ وَأَعْطُوا الْخُمُسَ مِنَ الْغَنَائِمِ وَأَنْهَاكُمْ عَنْ أَرْبَعٍ عَنِ الدُّبَّاءِ وَالْحَنْتَمِ وَالْمُزَفَّتِ وَالنَّقِيرِ ‏"‏ ‏.‏ قَالُوا يَا نَبِيَّ اللَّهِ مَا عِلْمُكَ بِالنَّقِيرِ قَالَ ‏"‏ بَلَى جِذْعٌ تَنْقُرُونَهُ فَتَقْذِفُونَ فِيهِ مِنَ الْقُطَيْعَاءِ - قَالَ سَعِيدٌ أَوْ قَالَ مِنَ التَّمْرِ - ثُمَّ تَصُبُّونَ فِيهِ مِنَ الْمَاءِ حَتَّى إِذَا سَكَنَ غَلَيَانُهُ شَرِبْتُمُوهُ حَتَّى إِنَّ أَحَدَكُمْ - أَوْ إِنَّ أَحَدَهُمْ - لَيَضْرِبُ ابْنَ عَمِّهِ بِالسَّيْفِ ‏"‏ ‏.‏ قَالَ وَفِي الْقَوْمِ رَجُلٌ أَصَابَتْهُ جِرَاحَةٌ كَذَلِكَ ‏.‏ قَالَ وَكُنْتُ أَخْبَأُهَا حَيَاءً مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم فَقُلْتُ فَفِيمَ نَشْرَبُ يَا رَسُولَ اللَّهِ قَالَ ‏"‏ فِي أَسْقِيَةِ الأَدَمِ الَّتِي يُلاَثُ عَلَى أَفْوَاهِهَا ‏"‏ ‏.‏ قَالُوا يَا رَسُولَ اللَّهِ إِنَّ أَرْضَنَا كَثِيرَةُ الْجِرْذَانِ وَلاَ تَبْقَى بِهَا أَسْقِيَةُ الأَدَمِ ‏.‏ فَقَالَ نَبِيُّ اللَّهِ صلى الله عليه وسلم ‏"‏ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ ‏"‏ ‏.‏ قَالَ وَقَالَ نَبِيُّ اللَّهِ صلى الله عليه وسلم لأَشَجِّ عَبْدِ الْقَيْسِ ‏"‏ إِنَّ فِيكَ لَخَصْلَتَيْنِ يُحِبُّهُمَا اللَّهُ الْحِلْمُ وَالأَنَاةُ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-04-24 12:46:49.29', '2025-05-23 14:49:33.97', ''),
	('cmb0xs1ro0002hqg8a296gymo', 34, '~~Le Messager d''Allah ﷺ~~ a dit:

A goûté à la douceur de la foi celui qui est satisfait d’Allah comme Seigneur, de l’Islam comme religion, et de ~~Muhammad ﷺ~~ comme Prophète.', 'حَدَّثَنَا مُحَمَّدُ بْنُ يَحْيَى بْنِ أَبِي عُمَرَ الْمَكِّيُّ، وَبِشْرُ بْنُ الْحَكَمِ، قَالاَ حَدَّثَنَا عَبْدُ الْعَزِيزِ، - وَهُوَ ابْنُ مُحَمَّدٍ - الدَّرَاوَرْدِيُّ عَنْ يَزِيدَ بْنِ الْهَادِ، عَنْ مُحَمَّدِ بْنِ إِبْرَاهِيمَ، عَنْ عَامِرِ بْنِ سَعْدٍ، عَنِ الْعَبَّاسِ بْنِ عَبْدِ الْمُطَّلِبِ، أَنَّهُ سَمِعَ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ ذَاقَ طَعْمَ الإِيمَانِ مَنْ رَضِيَ بِاللَّهِ رَبًّا وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ رَسُولاً ‏"‏ ‏‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 15:09:11.796', '2025-05-30 15:14:27.069', ''),
	('cmazhx5bd0002hqdc2d1lhexu', 29, 'Je suis allé voir **Oubada ibn as-Samit** alors qu’il était à l’agonie.

En voyant cela, je me suis mis à pleurer.

Il me dit alors :

Donne-moi un peu de temps (pour que je te parle). Pourquoi pleures-tu ? 

Par Allah, si l’on me demandait de témoigner pour toi, je témoignerais en ta faveur (que tu es croyant).


Si l’on me demandait d’intercéder, j’intercéderais pour toi.
Et si j’avais le pouvoir de t’être utile, je le ferais sans hésiter.

Et maintenant écoute :

Par Allah, jamais je n’ai entendu quoi que ce soit du ~~Messager d’Allah ﷺ~~ qui puisse te profiter sans te le transmettre — sauf un seul hadith. Et c’est celui que je vais te rapporter aujourd’hui, car je suis sur le point de rendre l’âme.

J’ai entendu le ~~Messager d’Allah ﷺ~~ dire :

*« Quiconque témoigne qu’il n’y a pas de divinité en dehors d’Allah et que ~~Muhammad~~ est le Messager d’Allah, Allah lui interdira le Feu de l’Enfer. »*', 'حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثٌ، عَنِ ابْنِ عَجْلاَنَ، عَنْ مُحَمَّدِ بْنِ يَحْيَى بْنِ حَبَّانَ، عَنِ ابْنِ مُحَيْرِيزٍ، عَنِ الصُّنَابِحِيِّ، عَنْ عُبَادَةَ بْنِ الصَّامِتِ، أَنَّهُ قَالَ دَخَلْتُ عَلَيْهِ وَهُوَ فِي الْمَوْتِ فَبَكَيْتُ فَقَالَ مَهْلاً لِمَ تَبْكِي فَوَاللَّهِ لَئِنِ اسْتُشْهِدْتُ لأَشْهَدَنَّ لَكَ وَلَئِنْ شُفِّعْتُ لأَشْفَعَنَّ لَكَ وَلَئِنِ اسْتَطَعْتُ لأَنْفَعَنَّكَ ثُمَّ قَالَ وَاللَّهِ مَا مِنْ حَدِيثٍ سَمِعْتُهُ مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم لَكُمْ فِيهِ خَيْرٌ إِلاَّ حَدَّثْتُكُمُوهُ إِلاَّ حَدِيثًا وَاحِدًا وَسَوْفَ أُحَدِّثُكُمُوهُ الْيَوْمَ وَقَدْ أُحِيطَ بِنَفْسِي سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ مَنْ شَهِدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ حَرَّمَ اللَّهُ عَلَيْهِ النَّارَ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-22 14:57:29.641', '2025-05-23 14:59:54.337', ''),
	('cmazkcu4x0005hqdc4wtyjlfh', 30, 'J’étais assis en croupe derrière le ~~Prophète ﷺ~~ sur une monture, et rien ne nous séparait sinon l’arrière de la selle. Le ~~Prophète ﷺ~~ m’appela :

— « Ô **Muadh ibn Jabal** ! »

Je répondis :
— « Me voici, à ton service, ô ~~Messager d’Allah~~ ! »

Il avança un peu, puis m’appela de nouveau :

— « Ô **Muadh ibn Jabal** ! »

Je répondis de même. Il reprit la marche, puis m’appela une troisième fois :

— « Ô **Muadh ibn Jaba**l ! »

Je répondis encore :
— « Me voici, à ton service, ô ~~Messager d’Allah~~ ! »

Il dit alors :

« Sais-tu quel est le droit d’Allah sur Ses serviteurs ? »

Je répondis :

— « Allah et Son Messager en savent mieux. »

Il dit :

« Le droit d’Allah sur Ses serviteurs est qu’ils L’adorent sans rien Lui associer. »

Puis, après avoir avancé encore un moment, il ajouta :

« Et sais-tu quel est le droit des serviteurs sur Allah s’ils accomplissent cela (s’ils L’adorent sans rien Lui associer) ? »

Je répondis :

— « Allah et Son ~~Messager~~ en savent mieux. »

Il dit :

« C’est qu’Il ne les châtiera pas (en Enfer). »

', 'حَدَّثَنَا هَدَّابُ بْنُ خَالِدٍ الأَزْدِيُّ، حَدَّثَنَا هَمَّامٌ، حَدَّثَنَا قَتَادَةُ، حَدَّثَنَا أَنَسُ بْنُ مَالِكٍ، عَنْ مُعَاذِ بْنِ جَبَلٍ، قَالَ كُنْتُ رِدْفَ النَّبِيِّ صلى الله عليه وسلم لَيْسَ بَيْنِي وَبَيْنَهُ إِلاَّ مُؤْخِرَةُ الرَّحْلِ فَقَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ ثُمَّ سَارَ سَاعَةً ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ ثُمَّ سَارَ سَاعَةَ ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ هَلْ تَدْرِي مَا حَقُّ اللَّهِ عَلَى الْعِبَادِ ‏"‏ ‏.‏ قَالَ قُلْتُ اللَّهُ وَرَسُولُهُ أَعْلَمُ ‏.‏ قَالَ ‏"‏ فَإِنَّ حَقَّ اللَّهِ عَلَى الْعِبَادِ أَنْ يَعْبُدُوهُ وَلاَ يُشْرِكُوا بِهِ شَيْئًا ‏"‏ ‏.‏ ثُمَّ سَارَ سَاعَةً ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ هَلْ تَدْرِي مَا حَقُّ الْعِبَادِ عَلَى اللَّهِ إِذَا فَعَلُوا ذَلِكَ ‏"‏ ‏.‏ قَالَ قُلْتُ اللَّهُ وَرَسُولُهُ أَعْلَمُ ‏.‏ قَالَ ‏"‏ أَنْ لاَ يُعَذِّبَهُمْ ‏"‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-22 16:05:40.881', '2025-05-23 14:58:37.367', ''),
	('cmazkolo70006hqdcp9pabpz4', 31, 'Nous étions assis autour du ~~Messager d’Allah ﷺ~~. **Abou Bakr** et **Omar** étaient également présents parmi nous.

À un moment, le ~~Messager d’Allah ﷺ~~ se leva et s’absenta. Son absence se prolongea, ce qui nous inquiéta : nous craignions qu’il lui soit arrivé quelque chose de la part d’un ennemi, alors que nous n’étions pas avec lui. Pris d’alarme, nous nous levâmes tous.

J’étais le premier à me précipiter, et je partis à sa recherche. Je parvins à un jardin appartenant aux Banû an-Najjâr (une tribu des Ansâr). Je fis le tour du jardin pour y chercher une porte, mais je n’en trouvai pas. Je vis un petit ruisseau s’écouler dans le jardin depuis un puits situé à l’extérieur. Je me recroquevillai alors sur moi-même, comme le fait un renard, et je me glissai à l’intérieur.

Le ~~Messager d’Allah ﷺ~~ me dit :

— « Est-ce toi, **Abou Huraira** ? »

Je répondis :

— « Oui, ô ~~Messager d’Allah~~. »

Il me dit :

— « Qu’as-tu ? »

Je répondis :

— « Tu étais avec nous, puis tu t’es levé et tu es parti, et ton absence s’est prolongée. Nous avons eu peur qu’un ennemi ne te fasse du mal. J’ai été le premier à m’alarmer, et quand je suis arrivé à ce jardin, je me suis faufilé à l’intérieur comme un renard. Les autres me suivent. »

Alors le ~~Prophète ﷺ~~ m’appela :

— « Ô **Abou Huraira** ! »

Puis il me donna ses sandales en disant :

— « Prends ces sandales et lorsque tu rencontreras quelqu’un hors de ce jardin qui témoigne qu’il n’y a de divinité digne d’adoration qu’Allah, avec certitude dans son cœur, annonce-lui la bonne nouvelle qu’il entrera au Paradis. »

Le premier que je rencontrai fut **Omar**. Il me dit :

— « Quelles sont ces sandales, ô **Abou Huraira** ? »

Je répondis :

— « Ce sont les sandales du ~~Messager d’Allah ﷺ~~. Il m’a envoyé avec elles pour annoncer à toute personne que je rencontrerai, qui témoigne qu’il n’y a de divinité digne d’adoration qu’Allah, avec conviction dans son cœur, qu’elle entrera au Paradis. »

Alors **Omar** me frappa la poitrine, ce qui me fit tomber sur le dos. Il me dit :

— « Retourne voir le ~~Messager d’Allah ﷺ~~. »

Je retournai alors vers lui, sur le point de pleurer. **Omar** me suivit de près. ~~Le Prophète ﷺ~~ me dit :

— « Qu’as-tu, ô **Abou Huraira**? »

Je répondis :

— « J’ai rencontré **Omar** et je lui ai transmis le message que tu m’as confié. Il m’a frappé la poitrine, ce qui m’a fait tomber, puis il m’a ordonné de revenir vers toi. »

~~Le Messager d’Allah ﷺ~~ demanda alors à **Omar**:

— « Pourquoi as-tu fait cela, ô **Omar** ? »

Il répondit :

— « Que mes père et mère te soient sacrifiés, ô ~~Messager d’Allah~~ ! Est-ce bien toi qui as envoyé **Abou Huraira** avec tes sandales pour annoncer à toute personne qu’il rencontrerait, qui atteste qu’il n’y a de divinité qu’Allah avec certitude dans son cœur, qu’elle entrerait au Paradis ? »

Il répondit :

— « Oui. »

**Omar** dit alors :

— « Je t’en prie, ne le fais pas. J’ai peur que les gens s’appuient uniquement sur cela et délaissent les bonnes actions. »

~~Le Messager d’Allah ﷺ~~ répondit :

— « Eh bien, qu’ils agissent. »

', 'حَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا عُمَرُ بْنُ يُونُسَ الْحَنَفِيُّ، حَدَّثَنَا عِكْرِمَةُ بْنُ عَمَّارٍ، قَالَ حَدَّثَنِي أَبُو كَثِيرٍ، قَالَ حَدَّثَنِي أَبُو هُرَيْرَةَ، قَالَ كُنَّا قُعُودًا حَوْلَ رَسُولِ اللَّهِ صلى الله عليه وسلم مَعَنَا أَبُو بَكْرٍ وَعُمَرُ فِي نَفَرٍ فَقَامَ رَسُولُ اللَّهِ صلى الله عليه وسلم مِنْ بَيْنِ أَظْهُرِنَا فَأَبْطَأَ عَلَيْنَا وَخَشِينَا أَنْ يُقْتَطَعَ دُونَنَا وَفَزِعْنَا فَقُمْنَا فَكُنْتُ أَوَّلَ مَنْ فَزِعَ فَخَرَجْتُ أَبْتَغِي رَسُولَ اللَّهِ صلى الله عليه وسلم حَتَّى أَتَيْتُ حَائِطًا لِلأَنْصَارِ لِبَنِي النَّجَّارِ فَدُرْتُ بِهِ هَلْ أَجِدُ لَهُ بَابًا فَلَمْ أَجِدْ فَإِذَا رَبِيعٌ يَدْخُلُ فِي جَوْفِ حَائِطٍ مِنْ بِئْرٍ خَارِجَةٍ - وَالرَّبِيعُ الْجَدْوَلُ - فَاحْتَفَزْتُ كَمَا يَحْتَفِزُ الثَّعْلَبُ فَدَخَلْتُ عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالَ ‏"‏ أَبُو هُرَيْرَةَ ‏"‏ ‏.‏ فَقُلْتُ نَعَمْ يَا رَسُولَ اللَّهِ ‏.‏ قَالَ ‏"‏ مَا شَأْنُكَ ‏"‏ ‏.‏ قُلْتُ كُنْتَ بَيْنَ أَظْهُرِنَا فَقُمْتَ فَأَبْطَأْتَ عَلَيْنَا فَخَشِينَا أَنْ تُقْتَطَعَ دُونَنَا فَفَزِعْنَا فَكُنْتُ أَوَّلَ مَنْ فَزِعَ فَأَتَيْتُ هَذَا الْحَائِطَ فَاحْتَفَزْتُ كَمَا يَحْتَفِزُ الثَّعْلَبُ وَهَؤُلاَءِ النَّاسُ وَرَائِي فَقَالَ ‏"‏ يَا أَبَا هُرَيْرَةَ ‏"‏ ‏.‏ وَأَعْطَانِي نَعْلَيْهِ قَالَ ‏"‏ اذْهَبْ بِنَعْلَىَّ هَاتَيْنِ فَمَنْ لَقِيتَ مِنْ وَرَاءِ هَذَا الْحَائِطِ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ فَبَشِّرْهُ بِالْجَنَّةِ ‏"‏ فَكَانَ أَوَّلَ مَنْ لَقِيتُ عُمَرُ فَقَالَ مَا هَاتَانِ النَّعْلاَنِ يَا أَبَا هُرَيْرَةَ ‏.‏ فَقُلْتُ هَاتَانِ نَعْلاَ رَسُولِ اللَّهِ صلى الله عليه وسلم بَعَثَنِي بِهِمَا مَنْ لَقِيتُ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ بَشَّرْتُهُ بِالْجَنَّةِ ‏.‏ فَضَرَبَ عُمَرُ بِيَدِهِ بَيْنَ ثَدْيَىَّ فَخَرَرْتُ لاِسْتِي فَقَالَ ارْجِعْ يَا أَبَا هُرَيْرَةَ فَرَجَعْتُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَأَجْهَشْتُ بُكَاءً وَرَكِبَنِي عُمَرُ فَإِذَا هُوَ عَلَى أَثَرِي فَقَالَ لِي رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ مَا لَكَ يَا أَبَا هُرَيْرَةَ ‏"‏ ‏.‏ قُلْتُ لَقِيتُ عُمَرَ فَأَخْبَرْتُهُ بِالَّذِي بَعَثْتَنِي بِهِ فَضَرَبَ بَيْنَ ثَدْيَىَّ ضَرْبَةً خَرَرْتُ لاِسْتِي قَالَ ارْجِعْ ‏.‏ فَقَالَ لَهُ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ يَا عُمَرُ مَا حَمَلَكَ عَلَى مَا فَعَلْتَ ‏"‏ ‏.‏ قَالَ يَا رَسُولَ اللَّهِ بِأَبِي أَنْتَ وَأُمِّي أَبَعَثْتَ أَبَا هُرَيْرَةَ بِنَعْلَيْكَ مَنْ لَقِيَ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ بَشَّرَهُ بِالْجَنَّةِ ‏.‏ قَالَ ‏"‏ نَعَمْ ‏"‏ ‏.‏ قَالَ فَلاَ تَفْعَلْ فَإِنِّي أَخْشَى أَنْ يَتَّكِلَ النَّاسُ عَلَيْهَا فَخَلِّهِمْ يَعْمَلُونَ ‏.‏ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ فَخَلِّهِمْ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-22 16:14:49.784', '2025-05-23 14:57:10.729', ''),
	('cmazl1jyc0007hqdc7i58ownw', 32, '~~Le Prophète d’Allah ﷺ~~ s’adressa à **Muadh ibn Jabal** alors que ce dernier était derrière lui sur la monture. Il l’interpela :

— « Ô **Muadh** ! »

Il répondit :

— « À ton service et à ton obéissance, ô ~~Messager d’Allah~~. »

~~Le Prophète ﷺ~~ l’appela de nouveau :

— « Ô  **Muadh** ! »

Il répondit :

— « À ton service et à ton obéissance. »

~~Le Prophète ﷺ~~ l’appela une troisième fois :

— « Ô  **Muadh** ! »

Il répondit :

— « À ton service et à ton obéissance, ô ~~Messager d’Allah~~. »

~~Le Prophète ﷺ~~ dit alors :

*« Quiconque témoigne sincèrement, du fond de son cœur, qu’il n’y a de divinité digne d’adoration qu’Allah et que ~~Muhammad~~ est Son serviteur et Son Messager, Allah le préservera du Feu (de l’Enfer). »*

 **Muadh** demanda :

— « Ô ~~Messager d’Allah~~, ne devrais-je pas en informer les gens afin qu’ils se réjouissent ? »

~~Le Prophète ﷺ~~ répondit :

— « Ils s’y fieraient alors uniquement (et délaisseraient les œuvres). »

 **Muadh** ne transmit ce hadith qu’au moment de sa mort, par crainte de commettre un péché.', 'حَدَّثَنَا إِسْحَاقُ بْنُ مَنْصُورٍ، أَخْبَرَنَا مُعَاذُ بْنُ هِشَامٍ، قَالَ حَدَّثَنِي أَبِي، عَنْ قَتَادَةَ، قَالَ حَدَّثَنَا أَنَسُ بْنُ مَالِكٍ، أَنَّ نَبِيَّ اللَّهِ صلى الله عليه وسلم وَمُعَاذُ بْنُ جَبَلٍ رَدِيفُهُ عَلَى الرَّحْلِ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ مَا مِنْ عَبْدٍ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ إِلاَّ حَرَّمَهُ اللَّهُ عَلَى النَّارِ ‏"‏ ‏.‏ قَالَ يَا رَسُولَ اللَّهِ أَفَلاَ أُخْبِرُ بِهَا النَّاسَ فَيَسْتَبْشِرُوا قَالَ ‏"‏ إِذًا يَتَّكِلُوا ‏"‏ فَأَخْبَرَ بِهَا مُعَاذٌ عِنْدَ مَوْتِهِ تَأَثُّمًا', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-22 16:24:54.085', '2025-05-23 14:54:42.031', ''),
	('cmb0xzika0003hqg87ovjjqpi', 35, 'Le ~~Prophète ﷺ~~ a dit: 

La foi (îmân) comporte plus de soixante-dix branches — ou plus de soixante —, et la pudeur (al-ḥayâ'') est une branche de la foi.', 'حَدَّثَنَا عُبَيْدُ اللَّهِ بْنُ سَعِيدٍ، وَعَبْدُ بْنُ حُمَيْدٍ، قَالاَ حَدَّثَنَا أَبُو عَامِرٍ الْعَقَدِيُّ، حَدَّثَنَا سُلَيْمَانُ بْنُ بِلاَلٍ، عَنْ عَبْدِ اللَّهِ بْنِ دِينَارٍ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ ‏"‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 15:15:00.154', '2025-05-23 15:15:00.154', ''),
	('cmb0ylzpo0009hqg8fidikpy0', 37, '~~Le Prophète ﷺ~~ a dit :

« La modestie n’engendre que le bien. »

**Bushair ibn Kaab** a dit : « Cela est consigné dans les livres de sagesse, il y a sobriété en cela et tranquillité d’esprit en cela. »

**Imran** a dit : « Je vous rapporte la tradition du ~~Messager d’Allah ﷺ~~ et vous me parlez de vos livres. »', 'حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَمُحَمَّدُ بْنُ بَشَّارٍ، - وَاللَّفْظُ لاِبْنِ الْمُثَنَّى - قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ قَتَادَةَ، قَالَ سَمِعْتُ أَبَا السَّوَّارِ، يُحَدِّثُ أَنَّهُ سَمِعَ عِمْرَانَ بْنَ حُصَيْنٍ، يُحَدِّثُ عَنِ النَّبِيِّ صلى الله عليه وسلم أَنَّهُ قَالَ ‏ "‏ الْحَيَاءُ لاَ يَأْتِي إِلاَّ بِخَيْرٍ ‏"‏ ‏.‏ فَقَالَ بُشَيْرُ بْنُ كَعْبٍ إِنَّهُ مَكْتُوبٌ فِي الْحِكْمَةِ أَنَّ مِنْهُ وَقَارًا وَمِنْهُ سَكِينَةً ‏.‏ فَقَالَ عِمْرَانُ أُحَدِّثُكَ عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم وَتُحَدِّثُنِي عَنْ صُحُفِكَ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 15:32:28.813', '2025-05-23 15:32:28.813', ''),
	('cmb0yqwrp000bhqg8iyahp2de', 38, 'J’ai demandé au ~~Messager d’Allah~~ de me dire quelque chose sur l’Islam qui puisse me dispenser de devoir poser la même question à quelqu’un d’autre après toi. »

Dans le hadith d’Abu ‘Usama, les mots sont : « autre que toi ».

Il (~~le Prophète ﷺ)~~ a répondu :

« Dis : J’affirme ma foi en Allah, puis tiens-toi fermement à cela. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ قَالاَ حَدَّثَنَا ابْنُ نُمَيْرٍ، ح وَحَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ، جَمِيعًا عَنْ جَرِيرٍ، ح وَحَدَّثَنَا أَبُو كُرَيْبٍ، حَدَّثَنَا أَبُو أُسَامَةَ، كُلُّهُمْ عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ سُفْيَانَ بْنِ عَبْدِ اللَّهِ الثَّقَفِيِّ، قَالَ قُلْتُ يَا رَسُولَ اللَّهِ قُلْ لِي فِي الإِسْلاَمِ قَوْلاً لاَ أَسْأَلُ عَنْهُ أَحَدًا بَعْدَكَ - وَفِي حَدِيثِ أَبِي أُسَامَةَ غَيْرَكَ - قَالَ ‏ "‏ قُلْ آمَنْتُ بِاللَّهِ فَاسْتَقِمْ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-23 15:36:18.277', '2025-05-23 15:36:18.277', ''),
	('cmb2hnvuj0000hqskin96kr1t', 39, 'Un homme demanda au ~~Messager d’Allah~~ ﷺ :

« Quel est le meilleur acte en Islam ? »

Le ~~Prophète~~ ﷺ répondit :

« Que tu donnes à manger (aux autres)
et que tu salues celui que tu connais et celui que tu ne connais pas. »', 'حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثٌ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ رُمْحِ بْنِ الْمُهَاجِرِ، أَخْبَرَنَا اللَّيْثُ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو، أَنَّ رَجُلاً، سَأَلَ رَسُولَ اللَّهِ صلى الله عليه وسلم أَىُّ الإِسْلاَمِ خَيْرٌ قَالَ ‏ "‏ تُطْعِمُ الطَّعَامَ وَتَقْرَأُ السَّلاَمَ عَلَى مَنْ عَرَفْتَ وَمَنْ لَمْ تَعْرِفْ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-24 17:13:35.996', '2025-05-24 17:13:35.996', ''),
	('cmb2iaazo0001hqskn0dn3arw', 40, 'Un homme demanda au ~~Messager d’Allah ﷺ~~  :

— "Quel est le meilleur des musulmans ?"

Le ~~Prophète ﷺ~~  répondit :

— "Celui dont les musulmans sont à l’abri de la langue et de la main."', 'وَحَدَّثَنَا أَبُو الطَّاهِرِ، أَحْمَدُ بْنُ عَمْرِو بْنِ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ سَرْحٍ الْمِصْرِيُّ أَخْبَرَنَا ابْنُ وَهْبٍ، عَنْ عَمْرِو بْنِ الْحَارِثِ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، أَنَّهُ سَمِعَ عَبْدَ اللَّهِ بْنَ عَمْرِو بْنِ الْعَاصِ، يَقُولُ إِنَّ رَجُلاً سَأَلَ رَسُولَ اللَّهِ صلى الله عليه وسلم أَىُّ الْمُسْلِمِينَ خَيْرٌ قَالَ ‏ "‏ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"‏ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-24 17:31:02.053', '2025-05-24 17:31:02.053', ''),
	('cmb3knjnh0002hqskaqxkr3pw', 41, 'Le ~~Messager d’Allah~~  ~~ﷺ~~ a dit:

— « Le musulman est celui dont les musulmans sont à l’abri de la langue et de la main. »', 'حَدَّثَنَا حَسَنٌ الْحُلْوَانِيُّ، وَعَبْدُ بْنُ حُمَيْدٍ، جَمِيعًا عَنْ أَبِي عَاصِمٍ، - قَالَ عَبْدٌ أَنْبَأَنَا أَبُو عَاصِمٍ، - عَنِ ابْنِ جُرَيْجٍ، أَنَّهُ سَمِعَ أَبَا الزُّبَيْرِ، يَقُولُ سَمِعْتُ جَابِرًا، يَقُولُ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقُولُ ‏ "‏ الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"‏ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:25:05.213', '2025-05-25 11:25:05.213', ''),
	('cmb3krc4d0004hqskrqdesp2f', 42, '« J’ai dit : Ô ~~Messager d’Allah~~, quelle est la meilleure [forme] d’islam ? »

Le ~~Prophète~~ répondit :
« Celui dont les musulmans sont à l’abri de la langue et de la main. »', 'وَحَدَّثَنِي سَعِيدُ بْنُ يَحْيَى بْنِ سَعِيدٍ الأُمَوِيُّ، قَالَ حَدَّثَنِي أَبِي، حَدَّثَنَا أَبُو بُرْدَةَ بْنُ عَبْدِ اللَّهِ بْنِ أَبِي بُرْدَةَ بْنِ أَبِي مُوسَى، عَنْ أَبِي بُرْدَةَ، عَنْ أَبِي مُوسَى، قَالَ قُلْتُ يَا رَسُولَ اللَّهِ أَىُّ الإِسْلاَمِ أَفْضَلُ قَالَ ‏ "‏ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:28:02.078', '2025-05-25 11:28:02.078', ''),
	('cmb3ku0x40005hqskudt8juiy', 43, 'Le ~~Prophète~~ ~~ﷺ~~ a dit :

Il y a trois choses qui, lorsqu’elles se trouvent chez une personne, lui font goûter à la douceur de la foi :

– qu’Allah et Son ~~Messager~~ soient plus aimés de lui que toute autre chose,

– qu’il aime une personne uniquement pour Allah,

– et qu’il déteste retourner à la mécréance après qu’Allah l’en a sauvé, tout comme il détesterait être jeté dans le feu.', 'حَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ، وَمُحَمَّدُ بْنُ يَحْيَى بْنِ أَبِي عُمَرَ، وَمُحَمَّدُ بْنُ بَشَّارٍ، جَمِيعًا عَنِ الثَّقَفِيِّ، - قَالَ ابْنُ أَبِي عُمَرَ حَدَّثَنَا عَبْدُ الْوَهَّابِ، - عَنْ أَيُّوبَ، عَنْ أَبِي قِلاَبَةَ، عَنْ أَنَسٍ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ ثَلاَثٌ مَنْ كُنَّ فِيهِ وَجَدَ بِهِنَّ حَلاَوَةَ الإِيمَانِ مَنْ كَانَ اللَّهُ وَرَسُولُهُ أَحَبَّ إِلَيْهِ مِمَّا سِوَاهُمَا وَأَنْ يُحِبَّ الْمَرْءَ لاَ يُحِبُّهُ إِلاَّ لِلَّهِ وَأَنْ يَكْرَهَ أَنْ يَعُودَ فِي الْكُفْرِ بَعْدَ أَنْ أَنْقَذَهُ اللَّهُ مِنْهُ كَمَا يَكْرَهُ أَنْ يُقْذَفَ فِي النَّارِ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:30:07.528', '2025-05-25 11:30:07.528', ''),
	('cmb3kv5rq0006hqskrd1g4u7u', 44, 'Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :

« Aucun serviteur (ou homme, selon une variante) ne croit véritablement tant que je ne suis pas plus aimé de lui que sa famille, sa richesse et tous les gens. »', 'وَحَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا إِسْمَاعِيلُ ابْنُ عُلَيَّةَ، ح وَحَدَّثَنَا شَيْبَانُ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا عَبْدُ الْوَارِثِ، كِلاَهُمَا عَنْ عَبْدِ الْعَزِيزِ، عَنْ أَنَسٍ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ لاَ يُؤْمِنُ عَبْدٌ - وَفِي حَدِيثِ عَبْدِ الْوَارِثِ الرَّجُلُ - حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ أَهْلِهِ وَمَالِهِ وَالنَّاسِ أَجْمَعِينَ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:31:00.471', '2025-05-25 11:31:00.471', ''),
	('cmb3kyjf70007hqsk8wfh2dy8', 45, 'Le ~~Prophète~~ ~~ﷺ~~ a dit :

« Aucun de vous ne croit véritablement tant qu’il n’aime pas pour son frère — ou il a dit : pour son voisin — ce qu’il aime pour lui-même. »', 'حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، قَالَ سَمِعْتُ قَتَادَةَ، يُحَدِّثُ عَنْ أَنَسِ بْنِ مَالِكٍ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ - أَوْ قَالَ لِجَارِهِ - مَا يُحِبُّ لِنَفْسِهِ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:33:38.131', '2025-05-25 11:33:38.131', ''),
	('cmb3lbh7a0008hqskkypyzizt', 46, 'Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :

« N’entrera pas au Paradis celui dont le voisin n’est pas à l’abri de ses nuisances. »', 'حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، وَقُتَيْبَةُ بْنُ سَعِيدٍ، وَعَلِيُّ بْنُ حُجْرٍ، جَمِيعًا عَنْ إِسْمَاعِيلَ بْنِ جَعْفَرٍ، - قَالَ ابْنُ أَيُّوبَ حَدَّثَنَا إِسْمَاعِيلُ، - قَالَ أَخْبَرَنِي الْعَلاَءُ، عَنْ أَبِيهِ، عَنْ أَبِي هُرَيْرَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ لاَ يَدْخُلُ الْجَنَّةَ مَنْ لاَ يَأْمَنُ جَارُهُ بَوَائِقَهُ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:43:41.783', '2025-05-25 11:43:41.783', ''),
	('cmb3lj9cs0009hqskah3xh5bo', 47, 'Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :

« Que celui qui croit en Allah et au Jour dernier dise du bien ou qu’il se taise ;

et que celui qui croit en Allah et au Jour dernier honore son voisin ;

et que celui qui croit en Allah et au Jour dernier honore son invité. »', 'حَدَّثَنِي حَرْمَلَةُ بْنُ يَحْيَى، أَنْبَأَنَا ابْنُ وَهْبٍ، قَالَ أَخْبَرَنِي يُونُسُ، عَنِ ابْنِ شِهَابٍ، عَنْ أَبِي سَلَمَةَ بْنِ عَبْدِ الرَّحْمَنِ، عَنْ أَبِي هُرَيْرَةَ، عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 11:49:44.86', '2025-05-25 11:49:44.86', ''),
	('cmb3m4fzs000bhqskbcwwpcqd', 48, 'Le ~~Prophète~~ ~~ﷺ~~ a dit :

« Celui qui croit en Allah et au Jour Dernier qu’il agisse bien envers son voisin ;

et celui qui croit en Allah et au Jour Dernier qu’il honore son invité ;

et celui qui croit en Allah et au Jour Dernier qu’il dise du bien, ou qu’il se taise. »', 'حَدَّثَنَا زُهَيْرُ بْنُ حَرْبٍ، وَمُحَمَّدُ بْنُ عَبْدِ اللَّهِ بْنِ نُمَيْرٍ، جَمِيعًا عَنِ ابْنِ عُيَيْنَةَ، - قَالَ ابْنُ نُمَيْرٍ حَدَّثَنَا سُفْيَانُ، - عَنْ عَمْرٍو، أَنَّهُ سَمِعَ نَافِعَ بْنَ جُبَيْرٍ، يُخْبِرُ عَنْ أَبِي شُرَيْحٍ الْخُزَاعِيِّ، أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُحْسِنْ إِلَى جَارِهِ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَسْكُتْ ‏"‏ ‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 12:06:13.241', '2025-05-25 12:06:13.241', ''),
	('cmb3mg9m9000ehqsk2x8ijldc', 49, '**Marwan** fut le premier à faire le khotbat al Aid (sermon de la fête) avant la prière (de l’Aid).

Un homme se leva et lui dit : « La prière passe avant le sermon ! »

**Marwan** répondit : « Cela a été abandonné. »

Alors **Abou Sa‘îd** dit :

Quant à cet homme, il a accompli son devoir. J’ai entendu le ~~Messager d’Allah~~ ~~ﷺ~~ dire :

« Celui d’entre vous qui voit un blâmable, qu’il le change de sa main ;

s’il ne peut pas, alors par sa langue ;

et s’il ne peut pas, alors dans son cœur — et cela est le plus faible degré de la foi. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا وَكِيعٌ، عَنْ سُفْيَانَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، كِلاَهُمَا عَنْ قَيْسِ بْنِ مُسْلِمٍ، عَنْ طَارِقِ بْنِ شِهَابٍ، - وَهَذَا حَدِيثُ أَبِي بَكْرٍ - قَالَ أَوَّلُ مَنْ بَدَأَ بِالْخُطْبَةِ يَوْمَ الْعِيدِ قَبْلَ الصَّلاَةِ مَرْوَانُ فَقَامَ إِلَيْهِ رَجُلٌ فَقَالَ الصَّلاَةُ قَبْلَ الْخُطْبَةِ ‏.‏ فَقَالَ قَدْ تُرِكَ مَا هُنَالِكَ ‏.‏ فَقَالَ أَبُو سَعِيدٍ أَمَّا هَذَا فَقَدْ قَضَى مَا عَلَيْهِ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ وَذَلِكَ أَضْعَفُ الإِيمَانِ ‏"‏ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 12:15:24.849', '2025-05-25 12:15:24.849', ''),
	('cmb3ms0l4000hhqskqnzphnab', 50, 'Le ~~Messager~~ d’Allâh (paix soit sur lui) a dit :

« Aucun prophète qu’Allah ait envoyé avant moi vers sa communauté, n’a eu parmi son peuple des disciples et compagnons qui suivaient sa voie et obéissaient à son ordre. 

Puis après eux vinrent des successeurs qui disaient ce qu’ils ne faisaient pas et faisaient ce qu’ils n’étaient pas ordonnés de faire.

Quiconque lutte contre eux par la main est croyant ;

quiconque lutte contre eux par la langue est croyant ;

 quiconque lutte contre eux par le cœur est croyant, et au-delà de cela il n’y a pas de foi même pas au grain de moutarde. »

**Abou Rafi‘** dit : 

Je l’ai rapporté à **Abdullah ibn Omar**, il me l’a rejeté. Puis vint **Ibn Mas‘ud** qui était à Qanâtah, **Abdullah ibn Omar** voulut que je l’accompagne pour lui rendre visite (car **Ibn Mas‘ud** était malade), alors je suis allé avec lui. 

Quand nous nous sommes assis devant lui, j’ai demandé à **Ibn Mas‘ud** au sujet de ce hadith, il me l’a rapporté comme je l’avais rapporté à **Ibn Omar.**', 'حَدَّثَنِي عَمْرٌو النَّاقِدُ، وَأَبُو بَكْرِ بْنُ النَّضْرِ وَعَبْدُ بْنُ حُمَيْدٍ - وَاللَّفْظُ لِعَبْدٍ - قَالُوا حَدَّثَنَا يَعْقُوبُ بْنُ إِبْرَاهِيمَ بْنِ سَعْدٍ، قَالَ حَدَّثَنِي أَبِي، عَنْ صَالِحِ بْنِ كَيْسَانَ، عَنِ الْحَارِثِ، عَنْ جَعْفَرِ بْنِ عَبْدِ اللَّهِ بْنِ الْحَكَمِ، عَنْ عَبْدِ الرَّحْمَنِ بْنِ الْمِسْوَرِ، عَنْ أَبِي رَافِعٍ، عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَا مِنْ نَبِيٍّ بَعَثَهُ اللَّهُ فِي أُمَّةٍ قَبْلِي إِلاَّ كَانَ لَهُ مِنْ أُمَّتِهِ حَوَارِيُّونَ وَأَصْحَابٌ يَأْخُذُونَ بِسُنَّتِهِ وَيَقْتَدُونَ بِأَمْرِهِ ثُمَّ إِنَّهَا تَخْلُفُ مِنْ بَعْدِهِمْ خُلُوفٌ يَقُولُونَ مَا لاَ يَفْعَلُونَ وَيَفْعَلُونَ مَا لاَ يُؤْمَرُونَ فَمَنْ جَاهَدَهُمْ بِيَدِهِ فَهُوَ مُؤْمِنٌ وَمَنْ جَاهَدَهُمْ بِلِسَانِهِ فَهُوَ مُؤْمِنٌ وَمَنْ جَاهَدَهُمْ بِقَلْبِهِ فَهُوَ مُؤْمِنٌ وَلَيْسَ وَرَاءَ ذَلِكَ مِنَ الإِيمَانِ حَبَّةُ خَرْدَلٍ ‏"‏ ‏.‏ قَالَ أَبُو رَافِعٍ فَحَدَّثْتُهُ عَبْدَ اللَّهِ بْنَ عُمَرَ فَأَنْكَرَهُ عَلَىَّ فَقَدِمَ ابْنُ مَسْعُودٍ فَنَزَلَ بِقَنَاةَ فَاسْتَتْبَعَنِي إِلَيْهِ عَبْدُ اللَّهِ بْنُ عُمَرَ يَعُودُهُ فَانْطَلَقْتُ مَعَهُ فَلَمَّا جَلَسْنَا سَأَلْتُ ابْنَ مَسْعُودٍ عَنْ هَذَا الْحَدِيثِ فَحَدَّثَنِيهِ كَمَا حَدَّثْتُهُ ابْنَ عُمَرَ ‏.‏ قَالَ صَالِحٌ وَقَدْ تُحُدِّثَ بِنَحْوِ ذَلِكَ عَنْ أَبِي رَافِعٍ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 12:24:33.017', '2025-05-25 12:24:33.017', ''),
	('cmb3mumlk000ihqsk691111jb', 51, 'Le ~~Messager d’Allah~~ ~~ﷺ~~ montra le Yémen de la main et dit :

« En vérité, la foi est vers ce côté, et la dureté et l’endurcissement des cœurs se trouvent chez les gens rudes qui conduisent leurs chameaux par la queue, vers l’endroit d’où émergent les deux cornes de Satan, ce sont les tribus de Rabi’a et Mudar. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو أُسَامَةَ، ح وَحَدَّثَنَا ابْنُ نُمَيْرٍ، حَدَّثَنَا أَبِي ح، وَحَدَّثَنَا أَبُو كُرَيْبٍ، حَدَّثَنَا ابْنُ إِدْرِيسَ، كُلُّهُمْ عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، ح وَحَدَّثَنَا يَحْيَى بْنُ حَبِيبٍ الْحَارِثِيُّ، - وَاللَّفْظُ لَهُ - حَدَّثَنَا مُعْتَمِرٌ، عَنْ إِسْمَاعِيلَ، قَالَ سَمِعْتُ قَيْسًا، يَرْوِي عَنْ أَبِي مَسْعُودٍ، قَالَ أَشَارَ النَّبِيُّ صلى الله عليه وسلم بِيَدِهِ نَحْوَ الْيَمَنِ فَقَالَ ‏ "‏ أَلاَ إِنَّ الإِيمَانَ هَا هُنَا وَإِنَّ الْقَسْوَةَ وَغِلَظَ الْقُلُوبِ فِي الْفَدَّادِينَ عِنْدَ أُصُولِ أَذْنَابِ الإِبِلِ حَيْثُ يَطْلُعُ قَرْنَا الشَّيْطَانِ فِي رَبِيعَةَ وَمُضَرَ ‏"‏ ‏.‏
', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-25 12:26:34.857', '2025-05-25 12:26:34.857', ''),
	('cmb5a6ukx0000hqawcrt4uenn', 52, 'Le ~~Messager d’Allah~~ a dit :

« Les gens du Yémen sont venus. Ils ont les cœurs tendres. La foi est yéménite, la compréhension est yéménite, et la sagesse est yéménite. »', 'حَدَّثَنَا أَبُو الرَّبِيعِ الزَّهْرَانِيُّ، أَنْبَأَنَا حَمَّادٌ، حَدَّثَنَا أَيُّوبُ، حَدَّثَنَا مُحَمَّدٌ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ جَاءَ أَهْلُ الْيَمَنِ هُمْ أَرَقُّ أَفْئِدَةً الإِيمَانُ يَمَانٍ وَالْفِقْهُ يَمَانٍ وَالْحِكْمَةُ يَمَانِيَةٌ ‏"‏ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-26 16:07:42.416', '2025-05-26 16:07:42.416', ''),
	('cmb5a87270001hqawv0nqkajp', 53, 'Le ~~Messager d’Allah~~ a dit :

« La dureté du cœur et la rudesse sont à l''Est, et la foi est parmi les gens du Hijaz. »', 'وَحَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ، أَخْبَرَنَا عَبْدُ اللَّهِ بْنُ الْحَارِثِ الْمَخْزُومِيُّ، عَنِ ابْنِ جُرَيْجٍ، قَالَ أَخْبَرَنِي أَبُو الزُّبَيْرِ، أَنَّهُ سَمِعَ جَابِرَ بْنَ عَبْدِ اللَّهِ، يَقُولُ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ غِلَظُ الْقُلُوبِ وَالْجَفَاءُ فِي الْمَشْرِقِ وَالإِيمَانُ فِي أَهْلِ الْحِجَازِ ‏"‏ ‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-26 16:08:45.247', '2025-05-26 16:08:45.247', ''),
	('cmb5a9pj40002hqaw7eg5wxwn', 54, 'Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :

« Vous n’entrerez pas au Paradis tant que vous ne croirez pas, et vous ne croirez pas tant que vous ne vous aimerez pas les uns les autres.

 Ne vous indiquerai-je pas une chose que si vous la faites, vous vous aimerez ? 

Propagez le salut entre vous : as-salamu ‘alaykum. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو مُعَاوِيَةَ، وَوَكِيعٌ، عَنِ الأَعْمَشِ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ لاَ تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا وَلاَ تُؤْمِنُوا حَتَّى تَحَابُّوا ‏.‏ أَوَلاَ أَدُلُّكُمْ عَلَى شَىْءٍ إِذَا فَعَلْتُمُوهُ تَحَابَبْتُمْ أَفْشُوا السَّلاَمَ بَيْنَكُمْ ‏"', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-26 16:09:55.841', '2025-05-26 16:09:55.841', ''),
	('cmb5aca5i0004hqawvo775oaa', 55, 'Le ~~Prophète~~ ~~ﷺ~~ a dit :

« La religion, c’est la sincérité (an-nasîha). »

Nous avons demandé : « Envers qui ? »

Il répondit :

« Envers Allah, envers Son Livre, envers Son ~~Messager~~, envers les dirigeants des musulmans et envers la masse des musulmans. »', 'حَدَّثَنَا مُحَمَّدُ بْنُ عَبَّادٍ الْمَكِّيُّ، حَدَّثَنَا سُفْيَانُ، قَالَ قُلْتُ لِسُهَيْلٍ إِنَّ عَمْرًا حَدَّثَنَا عَنِ الْقَعْقَاعِ، عَنْ أَبِيكَ، قَالَ وَرَجَوْتُ أَنْ يُسْقِطَ، عَنِّي رَجُلاً قَالَ فَقَالَ سَمِعْتُهُ مِنَ الَّذِي سَمِعَهُ مِنْهُ أَبِي كَانَ صَدِيقًا لَهُ بِالشَّامِ ثُمَّ حَدَّثَنَا سُفْيَانُ عَنْ سُهَيْلٍ عَنْ عَطَاءِ بْنِ يَزِيدَ عَنْ تَمِيمٍ الدَّارِيِّ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ ‏"‏ الدِّينُ النَّصِيحَةُ ‏"‏ قُلْنَا لِمَنْ قَالَ ‏"‏ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ ‏"‏ ‏', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-26 16:11:55.879', '2025-05-26 16:11:55.879', ''),
	('cmb5dn2un0001hqcgcmvjwysx', 56, '« J’ai prêté allégeance au ~~Messager d’Allah~~ ~~ﷺ~~ pour l’accomplissement de la prière, le paiement de la zakat, et la sincérité et le bon conseil envers tout musulman. »', 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا عَبْدُ اللَّهِ بْنُ نُمَيْرٍ، وَأَبُو أُسَامَةَ عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، عَنْ قَيْسٍ، عَنْ جَرِيرٍ، قَالَ بَايَعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم عَلَى إِقَامِ الصَّلاَةِ وَإِيتَاءِ الزَّكَاةِ وَالنُّصْحِ لِكُلِّ مُسْلِمٍ ', 'cm9vcp9lp0001hq6gin9xjo72', '2025-05-26 17:44:18.479', '2025-05-26 17:44:18.479', ''),
	('cm9vcvuiw0000hqn8w2a0yrxq', 1, '~~L''Envoyé d''Allah ﷺ~~ dit: 

Ne m''attribuez pas des paroles mensongères ! 

Certes, quiconque le fait, ira en Enfer.', 'وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا غُنْدَرٌ، عَنْ شُعْبَةَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ مَنْصُورٍ، عَنْ رِبْعِيِّ بْنِ حِرَاشٍ، أَنَّهُ سَمِعَ عَلِيًّا، - رضى الله عنه - يَخْطُبُ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم  " لاَ تَكْذِبُوا عَلَىَّ فَإِنَّهُ مَنْ يَكْذِبْ عَلَىَّ يَلِجِ النَّارَ " ', 'cm9vcp9lp0000hq6graltfp9h', '2025-04-24 12:45:43.881', '2025-08-30 18:33:13.603', '');


--
-- Data for Name: Transmitter; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Transmitter" ("id", "name", "slug", "nameArabic", "createdAt", "updatedAt") VALUES
	('cmb5fh23s0000hq8welt8jbp2', 'Abbad ibn Tamim', 'abbad-ibn-tamim', NULL, '2025-05-26 18:35:36.809', '2025-05-26 18:35:36.809'),
	('cmb5fh2460001hq8wbcc0onjs', 'Abbas ibn Abd al-Muttalib', 'abbas-ibn-abd-al-muttalib', NULL, '2025-05-26 18:35:36.822', '2025-05-26 18:35:36.822'),
	('cmb5fh24d0002hq8wazpxgct0', 'Abd al-Rahman ibn Awf', 'abd-al-rahman-ibn-awf', NULL, '2025-05-26 18:35:36.83', '2025-05-26 18:35:36.83'),
	('cmb5fh24l0003hq8wd3elzd06', 'Abdallah ibn Abbas', 'abdallah-ibn-abbas', NULL, '2025-05-26 18:35:36.838', '2025-05-26 18:35:36.838'),
	('cmb5fh24s0004hq8wg6tan7gb', 'Abdallah ibn Amr ibn al-Aas', 'abdallah-ibn-amr-ibn-al-aas', NULL, '2025-05-26 18:35:36.844', '2025-05-26 18:35:36.844'),
	('cmb5fh24z0005hq8wd33c7h6l', 'Abdallah ibn Jafar', 'abdallah-ibn-jafar', NULL, '2025-05-26 18:35:36.851', '2025-05-26 18:35:36.851'),
	('cmb5fh2550006hq8w6rnj9qbd', 'Abdallah ibn Mas''ud', 'abdallah-ibn-masud', NULL, '2025-05-26 18:35:36.858', '2025-05-26 18:35:36.858'),
	('cmb5fh25c0007hq8wapm4he3n', 'Abdallah ibn Omar', 'abdallah-ibn-omar', NULL, '2025-05-26 18:35:36.865', '2025-05-26 18:35:36.865'),
	('cmb5fh25k0008hq8wakqrhuir', 'Abdallah ibn Zaid', 'abdallah-ibn-zaid', NULL, '2025-05-26 18:35:36.872', '2025-05-26 18:35:36.872'),
	('cmb5fh25r0009hq8w3t52pb54', 'Abdur Rahman ibn Abou Bakra', 'abdur-rahman-ibn-abou-bakra', NULL, '2025-05-26 18:35:36.879', '2025-05-26 18:35:36.879'),
	('cmb5fh25x000ahq8w22hmy1l7', 'Abou Ayyub al Ansari', 'abou-ayyub-al-ansari', NULL, '2025-05-26 18:35:36.885', '2025-05-26 18:35:36.885'),
	('cmb5fh263000bhq8wfqxpc67u', 'Abou Bakr as-Siddiq', 'abou-bakr-as-siddiq', NULL, '2025-05-26 18:35:36.891', '2025-05-26 18:35:36.891'),
	('cmb5fh269000chq8woopa7sxt', 'Abou Bakr ibn Abou Shaiba', 'abou-bakr-ibn-abou-shaiba', NULL, '2025-05-26 18:35:36.898', '2025-05-26 18:35:36.898'),
	('cmb5fh26f000dhq8wydbbahen', 'Abou Barza al-Aslami', 'abou-barza-al-aslami', NULL, '2025-05-26 18:35:36.904', '2025-05-26 18:35:36.904'),
	('cmb5fh26l000ehq8wtjrgkiz0', 'Abou Darda', 'abou-darda', NULL, '2025-05-26 18:35:36.91', '2025-05-26 18:35:36.91'),
	('cmb5fh26t000fhq8wrm8ymy0x', 'Abou Huraira', 'abou-huraira', NULL, '2025-05-26 18:35:36.917', '2025-05-26 18:35:36.917'),
	('cmb5fh26y000ghq8wo6xp53ck', 'Abou Musa al-Ash''ari', 'abou-musa-al-ashari', NULL, '2025-05-26 18:35:36.923', '2025-05-26 18:35:36.923'),
	('cmb5fh274000hhq8w07ng90bb', 'Abou Sa''id al-Khudri', 'abou-said-al-khudri', NULL, '2025-05-26 18:35:36.929', '2025-05-26 18:35:36.929'),
	('cmb5fh27b000ihq8wvgiaqfpq', 'Abou Salama', 'abou-salama', NULL, '2025-05-26 18:35:36.935', '2025-05-26 18:35:36.935'),
	('cmb5fh27i000jhq8wz14e0tto', 'Abou Sufyan', 'abou-sufyan', NULL, '2025-05-26 18:35:36.942', '2025-05-26 18:35:36.942'),
	('cmb5fh27q000khq8won7zmmyt', 'Abou Umama', 'abou-umama', NULL, '2025-05-26 18:35:36.951', '2025-05-26 18:35:36.951'),
	('cmb5fh27w000lhq8w343tn8ay', 'Abou Qatada', 'abou-qatada', NULL, '2025-05-26 18:35:36.956', '2025-05-26 18:35:36.956'),
	('cmb5fh283000mhq8wins4bqvr', 'Aisha bint Abi Bakr', 'aisha-bint-abi-bakr', NULL, '2025-05-26 18:35:36.963', '2025-05-26 18:35:36.963'),
	('cmb5fh28b000nhq8w93wbsvur', 'Ali ibn Abi Talib', 'ali-ibn-abi-talib', NULL, '2025-05-26 18:35:36.971', '2025-05-26 18:35:36.971'),
	('cmb5fh28l000ohq8wzry599hy', 'Ali ibn Rabi''ah', 'ali-ibn-rabiah', NULL, '2025-05-26 18:35:36.981', '2025-05-26 18:35:36.981'),
	('cmb5fh28v000phq8wakftezd4', 'Amr ibn al-Aas', 'amr-ibn-al-aas', NULL, '2025-05-26 18:35:36.991', '2025-05-26 18:35:36.991'),
	('cmb5fh293000qhq8w42gy3oin', 'Anas ibn Malik', 'anas-ibn-malik', NULL, '2025-05-26 18:35:36.999', '2025-05-26 18:35:36.999'),
	('cmb5fh298000rhq8wp0r8m9s9', 'Asma bint Abi Bakr', 'asma-bint-abi-bakr', NULL, '2025-05-26 18:35:37.005', '2025-05-26 18:35:37.005'),
	('cmb5fh29j000shq8wr6pwhx87', 'Bilal ibn Rabah', 'bilal-ibn-rabah', NULL, '2025-05-26 18:35:37.016', '2025-05-26 18:35:37.016'),
	('cmb5fh29q000thq8wr88kx639', 'Burayda ibn al-Husayb', 'burayda-ibn-al-husayb', NULL, '2025-05-26 18:35:37.022', '2025-05-26 18:35:37.022'),
	('cmb5fh29w000uhq8wajjppm69', 'Fatima bint Muhammad', 'fatima-bint-muhammad', NULL, '2025-05-26 18:35:37.028', '2025-05-26 18:35:37.028'),
	('cmb5fh2a3000vhq8wctpj7b40', 'Hafsa bint Omar', 'hafsa-bint-omar', NULL, '2025-05-26 18:35:37.036', '2025-05-26 18:35:37.036'),
	('cmb5fh2a9000whq8wyck0iryl', 'Hamza ibn Abd al-Muttalib', 'hamza-ibn-abd-al-muttalib', NULL, '2025-05-26 18:35:37.041', '2025-05-26 18:35:37.041'),
	('cmb5fh2ai000xhq8wfgmmvlr7', 'Jabir ibn Abdallah', 'jabir-ibn-abdallah', NULL, '2025-05-26 18:35:37.05', '2025-05-26 18:35:37.05'),
	('cmb5fh2an000yhq8wxwqb5ugk', 'Khabbab ibn al-Aratt', 'khabbab-ibn-al-aratt', NULL, '2025-05-26 18:35:37.056', '2025-05-26 18:35:37.056'),
	('cmb5fh2au000zhq8wphk7op5l', 'Malik ibn al-Huwayrith', 'malik-ibn-al-huwayrith', NULL, '2025-05-26 18:35:37.062', '2025-05-26 18:35:37.062'),
	('cmb5fh2b00010hq8wmfxnin8p', 'Mousayib ibn Hazan', 'mousayib-ibn-hazan', NULL, '2025-05-26 18:35:37.069', '2025-05-26 18:35:37.069'),
	('cmb5fh2b60011hq8wdb2fynim', 'Muadh ibn Jabal', 'muadh-ibn-jabal', NULL, '2025-05-26 18:35:37.074', '2025-05-26 18:35:37.074'),
	('cmb5fh2bd0012hq8w396djcqt', 'Nou''man ibn Qawqal', 'nouman-ibn-qawqal', NULL, '2025-05-26 18:35:37.082', '2025-05-26 18:35:37.082'),
	('cmb5fh2bk0013hq8wzcoqdpca', 'Omar ibn al-Khattab', 'omar-ibn-al-khattab', NULL, '2025-05-26 18:35:37.088', '2025-05-26 18:35:37.088'),
	('cmb5fh2bq0014hq8w07gt9u1m', 'Othman ibn Affan', 'othman-ibn-affan', NULL, '2025-05-26 18:35:37.094', '2025-05-26 18:35:37.094'),
	('cmb5fh2bw0015hq8wlfctv1xf', 'Oubada ibn as-Samit', 'oubada-ibn-as-samit', NULL, '2025-05-26 18:35:37.101', '2025-05-26 18:35:37.101'),
	('cmb5fh2c20016hq8wvapyi2cp', 'Oqba ibn Amr', 'oqba-ibn-amr', NULL, '2025-05-26 18:35:37.106', '2025-05-26 18:35:37.106'),
	('cmb5fh2c80017hq8w7qzec54w', 'Oum Salama', 'oum-salama', NULL, '2025-05-26 18:35:37.112', '2025-05-26 18:35:37.112'),
	('cmb5fh2ce0018hq8w5cgaqp9e', 'Ousama ibn Zayd', 'ousama-ibn-zayd', NULL, '2025-05-26 18:35:37.118', '2025-05-26 18:35:37.118'),
	('cmb5fh2cj0019hq8wsqzc1pie', 'Sa''d ibn Abi Waqqas', 'sad-ibn-abi-waqqas', NULL, '2025-05-26 18:35:37.124', '2025-05-26 18:35:37.124'),
	('cmb5fh2cr001ahq8wk45ctnth', 'Salman al-Farsi', 'salman-al-farsi', NULL, '2025-05-26 18:35:37.132', '2025-05-26 18:35:37.132'),
	('cmb5fh2cx001bhq8wr2l7t3sg', 'Talha ibn Ubayd Allah', 'talha-ibn-ubayd-allah', NULL, '2025-05-26 18:35:37.138', '2025-05-26 18:35:37.138'),
	('cmb5fh2d3001chq8w3ntblk3v', 'Tariq ibn Ouchaym', 'tariq-ibn-ouchaym', NULL, '2025-05-26 18:35:37.143', '2025-05-26 18:35:37.143'),
	('cmb5fh2d9001dhq8wpke3xzb8', 'Yahya ibn Ma''mar', 'yahya-ibn-mamar', NULL, '2025-05-26 18:35:37.15', '2025-05-26 18:35:37.15'),
	('cmb5fh2dg001ehq8wx7yqi1ff', 'Yahya ibn Yamur', 'yahya-ibn-yamur', NULL, '2025-05-26 18:35:37.156', '2025-05-26 18:35:37.156'),
	('cmb5fh2dm001fhq8w9vnutva2', 'Yazid al-Faqir', 'yazid-al-faqir', NULL, '2025-05-26 18:35:37.162', '2025-05-26 18:35:37.162'),
	('cmb5fh2ds001ghq8wxmihcaej', 'Zayd ibn Thabit', 'zayd-ibn-thabit', NULL, '2025-05-26 18:35:37.169', '2025-05-26 18:35:37.169'),
	('cmb5fh2dy001hhq8wx0j0duea', 'Zubair ibn al-Awwam', 'zubair-ibn-al-awwam', NULL, '2025-05-26 18:35:37.174', '2025-05-26 18:35:37.174'),
	('cmb5fh2e6001ihq8wf4kbjts0', 'Inconnu', 'inconnu', NULL, '2025-05-26 18:35:37.183', '2025-05-26 18:35:37.183'),
	('cmb5fh2ec001jhq8wzxa9apkd', 'Abou Abdallah As-Sunabihi', 'abou-abdallah-as-sunabihi', NULL, '2025-05-26 18:35:37.189', '2025-05-26 18:35:37.189'),
	('cmb5fh2ei001khq8wfdwwt82o', 'Abbas', 'abbas', NULL, '2025-05-26 18:35:37.194', '2025-05-26 18:35:37.194'),
	('cmb5fh2er001lhq8wjw4w8o49', 'Abda', 'abda', NULL, '2025-05-26 18:35:37.204', '2025-05-26 18:35:37.204'),
	('cmb5fh2ex001mhq8wphbapslq', 'Itban ibn Malik', 'itban-ibn-malik', NULL, '2025-05-26 18:35:37.209', '2025-05-26 18:35:37.209'),
	('cmb5fh2f4001nhq8w19jtppym', 'Imran ibn Husain', 'imran-ibn-husain', NULL, '2025-05-26 18:35:37.217', '2025-05-26 18:35:37.217'),
	('cmb5fh2fa001ohq8w0wkfyh87', 'Sofian Ibn Abdillah Al Thaqafi', 'sofian-ibn-abdillah-al-thaqafi', NULL, '2025-05-26 18:35:37.223', '2025-05-26 18:35:37.223'),
	('cmb5fh2fg001phq8wqe8jlv2m', 'Abou Moussa al-Achari', 'abou-moussa-al-achari', NULL, '2025-05-26 18:35:37.228', '2025-05-26 18:35:37.228'),
	('cmb5fh2fo001qhq8w4s534ly2', 'Abou Chourayh Al Khouza''i', 'abou-chourayh-al-khouzai', NULL, '2025-05-26 18:35:37.236', '2025-05-26 18:35:37.236'),
	('cmb5fh2fu001rhq8wijt6ps8f', 'Tariq ibn Shihab', 'tariq-ibn-shihab', NULL, '2025-05-26 18:35:37.242', '2025-05-26 18:35:37.242'),
	('cmb5fh2g1001shq8wormpxrwg', 'Tamim ad-Dari', 'tamim-ad-dari', NULL, '2025-05-26 18:35:37.249', '2025-05-26 18:35:37.249'),
	('cmb5fh2g7001thq8wc43ctkrr', 'Jarir Ibn Abdallah', 'jarir-ibn-abdallah', NULL, '2025-05-26 18:35:37.255', '2025-05-26 18:35:37.255'),
	('cmb6ktqgm0000hqxwk3emxv4a', 'Muhammad ibn Jafar', 'muhammad-ibn-jafar', 'محمد بن جعفر', '2025-05-27 13:53:12.503', '2025-05-27 13:53:12.503'),
	('cmb6kyg6z0001hqxwgf9tadyx', 'Shu''ba ibn al-Hajjaj', 'shuba-ibn-al-hajjaj', NULL, '2025-05-27 13:56:52.476', '2025-05-27 13:56:52.476'),
	('cmb9uft2h0000hq3se53y36er', 'Dawud ibn Rashid', 'dawud-ibn-rashid', 'داود بن رشيد', '2025-05-29 20:45:37.382', '2025-05-29 20:45:37.382'),
	('cmb9ujknk0001hq3sa02u38od', 'Ibn Jabir', 'ibn-jabir', 'ابْنِ جَابِرٍ', '2025-05-29 20:48:33.105', '2025-05-29 20:48:33.105'),
	('cmb9ukhx60002hq3sci12gbn6', 'Al-Walid ibn Muslim', 'al-walid-ibn-muslim', 'الوليد بن مسلم', '2025-05-29 20:49:16.219', '2025-05-29 20:49:16.219'),
	('cmb9um1210003hq3sdsm2tfl6', 'Umayr ibn Hani', 'umayr-ibn-hani', 'عُمَيْرُ بْنُ هَانِئٍ', '2025-05-29 20:50:27.673', '2025-05-29 20:50:27.673'),
	('cmb9umt5y0004hq3szbrnu426', 'Junada ibn Abi Omayya', 'junada-ibn-abi-omayya', NULL, '2025-05-29 20:51:04.103', '2025-05-29 20:51:04.103'),
	('cmbax5orr0000hqbkw0he7drx', 'Zuhayr ibn Harb', 'zuhayr-ibn-harb', 'زهير بن حرب', '2025-05-30 14:49:30.28', '2025-05-30 14:49:30.28'),
	('cmbaxhvk90001hqbkscfmsy5k', 'Ismail ibn Ulayyah', 'ismail-ibn-ulayyah', 'إسماعيل بن علية', '2025-05-30 14:58:58.953', '2025-05-30 14:58:58.953'),
	('cmbaxldb70002hqbktzgi6uu1', 'Abd al-Aziz ibn Suhayb', 'abd-al-aziz-ibn-suhayb', 'عبد العزيز بن صهيب', '2025-05-30 15:01:41.923', '2025-05-30 15:01:41.923'),
	('cmbaxpkxx0007hqbkfqdlj4v8', 'Muhammad ibn Yahya ibn Abi Omar el-Mekki', 'muhammad-ibn-yahya-ibn-abi-omar-el-mekki', 'محمد بن يحيى بن أبي عمر المكي', '2025-05-30 15:04:58.438', '2025-05-30 15:04:58.438'),
	('cmbaxqerz0008hqbkcozbyshs', 'Bishr ibn al-Hakam', 'bishr-ibn-al-hakam', 'بشر بن الحكم', '2025-05-30 15:05:37.104', '2025-05-30 15:05:37.104'),
	('cmbaxrdqn0009hqbk6j2cc9dh', 'Abd al-Aziz ibn Muhammad ad-Darawardi', 'abd-al-aziz-ibn-muhammad-ad-darawardi', 'عبد العزيز بن محمد الدراوردي', '2025-05-30 15:06:22.415', '2025-05-30 15:06:22.415'),
	('cmbaxrx7z000ahqbk7z94ndsj', 'Yazid ibn al-Had', 'yazid-ibn-al-had', 'يزيد بن الهاد', '2025-05-30 15:06:47.663', '2025-05-30 15:06:47.663'),
	('cmbaxshmt000bhqbkivhxeacs', 'Muhammad ibn Ibrahim', 'muhammad-ibn-ibrahim', 'محمد بن إبراهيم', '2025-05-30 15:07:14.117', '2025-05-30 15:07:14.117'),
	('cmbaxt5f5000chqbkzkl5y5ev', 'Amir ibn Saad', 'amir-ibn-saad', 'عامر بن سعد', '2025-05-30 15:07:44.946', '2025-05-30 15:07:44.946'),
	('cmbay381w000khqbklq4tor6z', 'Muhammad ibn Ubayd al-Ghubari', 'muhammad-ibn-ubayd-al-ghubari', 'محمد بن عبيد الغبري', '2025-05-30 15:15:34.916', '2025-05-30 15:15:34.916'),
	('cmbay3s81000lhqbkvccsargp', 'Abou Awanah', 'abou-awanah', 'أبو عوانة', '2025-05-30 15:16:01.058', '2025-05-30 15:35:00.527'),
	('cmbayybf10000hq7ok48ecrdp', 'Abou Hassin', 'abou-hassin', 'أبو حصين', '2025-05-30 15:39:45.614', '2025-05-30 15:39:45.614'),
	('cmbaz1yxg0001hq7osoouihyt', 'Abu Salih as-Sammam', 'abu-salih-as-sammam', 'أبو صالح السمان', '2025-05-30 15:42:36.052', '2025-05-30 15:42:36.052'),
	('cmbazgaii0007hq7oe887g3s4', 'Muhammad ibn Abdallah ibn Noumayr', 'muhammad-ibn-abdallah-ibn-noumayr', 'محمد بن عبد الله بن نمير', '2025-05-30 15:53:44.25', '2025-05-30 15:53:44.25'),
	('cmbazhzyw0008hq7o9yyb1c5f', 'Abdallah ibn Noumayr', 'abdallah-ibn-noumayr', 'عبد الله بن نمير', '2025-05-30 15:55:03.896', '2025-05-30 15:55:03.896'),
	('cmbazirz10009hq7o8odtfwu8', 'Said ibn Oubayd', 'said-ibn-oubayd', 'سعيد بن عبيد', '2025-05-30 15:55:40.189', '2025-05-30 15:55:40.189'),
	('cmbazroe4000jhq7o85jjz37j', 'Al Mughirah ibn Shu''bah', 'al-mughirah-ibn-shubah', 'المغيرة بن شعبة', '2025-05-30 16:02:35.452', '2025-05-30 16:02:35.452'),
	('cmbb253wd000qhq7oq3upwb5n', 'Hafs ibn Asim', 'hafs-ibn-asim', 'حفص بن عاصم', '2025-05-30 17:09:01.309', '2025-05-30 17:09:01.309'),
	('cmbb3s7qa000rhq7ofbhivxjf', 'Ubayd Allah ibn Muadh al-Anbari', 'ubayd-allah-ibn-muadh-al-anbari', 'عبيد الله بن معاذ العنبرى', '2025-05-30 17:54:58.979', '2025-05-30 17:54:58.979'),
	('cmbb3tkzo000shq7o0cqfg1xq', 'Muadh ibn Muadh', 'muadh-ibn-muadh', 'معاذ بن معاذ', '2025-05-30 17:56:02.82', '2025-05-30 17:56:02.82'),
	('cmbb438iv000thq7o6dsxsn5a', 'Khubayb ibn Abd al-Rahman', 'khubayb-ibn-abd-al-rahman', 'خُبَيْبِ بْنِ عَبْدِ الرَّحْمَنِ', '2025-05-30 18:03:33.224', '2025-05-30 18:16:16.305'),
	('cmbb464fn000uhq7om2axs8vr', 'Muhammad ibn al-Muthanna', 'muhammad-ibn-al-muthanna', 'مُحَمَّدُ بْنُ الْمُثَنَّى', '2025-05-30 18:05:47.891', '2025-05-30 18:05:47.891'),
	('cmbb4bi4k000vhq7ocgnsl0as', 'Abd ar-Rahman ibn Mahdi', 'abd-ar-rahman-ibn-mahdi', 'عبد الرحمن بن مهدي', '2025-05-30 18:09:58.916', '2025-05-30 18:09:58.916'),
	('cmbb4mkk60011hq7oept5b6wl', 'Abdallah ibn Yazid', 'abdallah-ibn-yazid', 'عبد الله بن يزيد', '2025-05-30 18:18:35.286', '2025-05-30 18:18:35.286'),
	('cmbb4nus20012hq7ojlqr7box', 'Said ibn Abi Ayyoub', 'said-ibn-abi-ayyoub', 'سعيد بن ابي ايوب', '2025-05-30 18:19:35.186', '2025-05-30 18:19:35.186'),
	('cmbb4od8n0013hq7ox7ggv0fi', 'Abou Hani', 'abou-hani', 'ابو هانئ', '2025-05-30 18:19:59.111', '2025-05-30 18:19:59.111'),
	('cmbb4q8l10014hq7oxoc8d5r6', 'Abou Othman Moslim ibn Yassar', 'abou-othman-moslim-ibn-yassar', 'ابو عثمان مسلم بن يسار', '2025-05-30 18:21:26.389', '2025-05-30 18:21:26.389'),
	('cmeyhm4po0000hqwcxhzz1hg7', 'Ghundar', 'ghundar', 'غُنْدَر', '2025-08-30 16:39:58.811', '2025-08-30 16:39:58.811'),
	('cmeyhqixf0001hqwc9b8xmipo', 'Mansur ibn al-Muʿtamir', 'mansur-ibn-al-mutamir', 'منصور بن المعتمر', '2025-08-30 16:43:23.86', '2025-08-30 16:43:23.86'),
	('cmeyhrl2h0002hqwcdzk1sgq7', 'Rib’i ibn Hirash', 'ribi-ibn-hirash', NULL, '2025-08-30 16:44:13.29', '2025-08-30 16:44:13.29');


--
-- Data for Name: HadithTransmitter; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."HadithTransmitter" ("id", "hadithId", "transmitterId", "order") VALUES
	('cmeylnrqn0002hqaoe54delwt', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmb5fh269000chq8woopa7sxt', 1),
	('cmeylnrqn0003hqao7fyj5qfm', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmeyhm4po0000hqwcxhzz1hg7', 2),
	('cmeylnrqn0004hqaociqpydge', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmb6kyg6z0001hqxwgf9tadyx', 3),
	('cmeylnrqn0005hqaows9pum05', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmeyhqixf0001hqwc9b8xmipo', 4),
	('cmeylnrqn0006hqaoaw766tw2', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmeyhrl2h0002hqwcdzk1sgq7', 5),
	('cmeylnrqn0007hqaox06ozeqx', 'cm9vcvuiw0000hqn8w2a0yrxq', 'cmb5fh28b000nhq8w93wbsvur', 6);


--
-- Data for Name: Sahaba; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Sahaba" ("id", "name", "slug", "nameArabic", "createdAt", "updatedAt") VALUES
	('cm9vcgarm0000hq44chyvfj3g', 'Abdallah ibn Omar', 'abdallah-ibn-omar', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.973'),
	('cm9vcgarn0001hq448s762h00', 'Abdallah ibn Abi Umayya', 'abdallah-ibn-abi-umayya', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.978'),
	('cm9vcgarn0002hq4456q5ntv4', 'Abdallah ibn Abbas', 'abdallah-ibn-abbas', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.982'),
	('cm9vcgarn0003hq44xxq156nr', 'Abou Bakr As-Siddiq', 'abou-bakr-as-siddiq', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.987'),
	('cm9vcgarn0004hq44javr0mtf', 'Abou Darda', 'abou-darda', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.992'),
	('cm9vcgarn0005hq44j0v9kvnf', 'Abou Huraira', 'abou-huraira', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:49.997'),
	('cm9vcgarn0006hq441whh7wv3', 'Abou Talib', 'abou-talib', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.001'),
	('cm9vcgarn0007hq44sfnidn1g', 'Abou Ayyub Al-Ansari', 'abou-ayyub-al-ansari', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.007'),
	('cm9vcgarn0008hq44agwokdmw', 'Abou Dharr Al-Ghifari', 'abou-dharr-al-ghifari', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.013'),
	('cm9vcgarn0009hq44r3jcdyxt', 'Abou Muslim Al-Khawlani', 'abou-muslim-al-khawlani', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.017'),
	('cm9vcgarn000ahq44ajv49uy6', 'Al-Ashajj Abd al-Qays', 'al-ashajj-abd-al-qays', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.022'),
	('cm9vcgarn000bhq44o4rk0edf', 'Al Mughirah ibn Shu''bah', 'al-mughirah-ibn-shubah', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.027'),
	('cm9vcgarn000chq44bboisieo', 'Ali ibn Abi Talib', 'ali-ibn-abi-talib', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.032'),
	('cm9vcgarn000dhq449s2aoas6', 'Anas ibn Malik', 'anas-ibn-malik', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.037'),
	('cm9vcgarn000ehq44b546jgbm', 'Bilal ibn Rabah', 'bilal-ibn-rabah', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.042'),
	('cm9vcgarn000fhq44iaedfe1b', 'Fatimah bint Muhammad', 'fatimah-bint-muhammad', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.046'),
	('cm9vcgarn000ghq44ea0as91l', 'Hassan ibn Ali', 'hassan-ibn-ali', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.051'),
	('cm9vcgarn000hhq44r2u13re0', 'Houmayd ibn Abder Rahman Al Houmayri', 'houmayd-ibn-abder-rahman-al-houmayri', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.056'),
	('cm9vcgarn000ihq44oth8ensx', 'Omar ibn al-Khattab', 'omar-ibn-al-khattab', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.061'),
	('cm9vcgarn000jhq44eiv1j507', 'Othman ibn Affan', 'othman-ibn-affan', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.067'),
	('cm9vcgarn000khq44jc8vms2h', 'Ma''bad Al Jouhani', 'mabad-al-jouhani', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.072'),
	('cm9vcgarn000lhq44mbjibk16', 'Muadh ibn Jabal', 'muadh-ibn-jabal', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.077'),
	('cm9vcgarn000mhq445ie9lc8c', 'Mujahid ibn Jabr', 'mujahid-ibn-jabr', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.082'),
	('cm9vcgarn000nhq44b8mfwpoi', 'Nou''man ibn Qawqal', 'nouman-ibn-qawqal', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.087'),
	('cm9vcgarn000ohq446eqiaa31', 'Salman Al-Farsi', 'salman-al-farsi', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.091'),
	('cm9vcgarn000phq441yye4p9i', 'Zayd ibn Harithah', 'zayd-ibn-harithah', NULL, '2025-04-24 12:33:38.435', '2025-05-05 10:30:50.097'),
	('cmazhortc0001hqdc181t8j84', 'Oubada ibn as-Samit', 'oubada-ibn-as-samit', NULL, '2025-05-22 14:50:58.897', '2025-05-22 14:53:29.614'),
	('cmazm2vsz0009hqdc0tstyxjk', 'Itban ibn Malik', 'itban-ibn-malik', NULL, '2025-05-22 16:53:55.715', '2025-05-22 16:53:55.715'),
	('cmb0ycf8j0004hqg8vfvcxi7v', 'Salim ibn Abdallah', 'salim-ibn-abdallah', NULL, '2025-05-23 15:25:02.372', '2025-05-23 15:25:02.372'),
	('cmb0yjs900007hqg8dc0k77ia', 'Bushair ibn Kaab', 'bushair-ibn-kaab', NULL, '2025-05-23 15:30:45.828', '2025-05-23 15:30:45.828'),
	('cmb0yjylr0008hqg84eoinl0q', 'Imran ibn Husain', 'imran-ibn-husain', NULL, '2025-05-23 15:30:54.063', '2025-05-23 15:30:54.063'),
	('cmb3ma7to000chqskzq1nyg6p', 'Abou Sa''id al-Khudri', 'abou-said-al-khudri', NULL, '2025-05-25 12:10:42.589', '2025-05-25 12:10:42.589'),
	('cmb3mlktq000fhqsk2fsa4253', 'Abdallah ibn Mas''ud', 'abdallah-ibn-masud', NULL, '2025-05-25 12:19:32.654', '2025-05-25 12:19:32.654'),
	('cmb3mnqdc000ghqsk8o1vl0xw', 'Abou Rafi''', 'abou-rafi', NULL, '2025-05-25 12:21:13.153', '2025-05-25 12:21:13.153');


--
-- Data for Name: _HadithToSahaba; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_HadithToSahaba" ("A", "B") VALUES
	('cm9vcvujn0003hqn87tj23wuq', 'cm9vcgarn000bhq44o4rk0edf');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('f354ef5e-70a0-4aaf-b5de-4cb391df4e27', 'a677157d3d8242436edd7580b0bd44e2dbd5e625ef19bb6e93e28b0f3db6bad0', '2025-08-30 13:26:28.786236+00', '20250816134625_init_postgresql_with_search_optimization', NULL, NULL, '2025-08-30 13:26:28.670997+00', 1),
	('f354e588-b1d0-47ae-9586-6026136a7423', 'c7907f457baffb83354e9ea05aa157c4b7f5738b9a86e48ef8438fe5c2f0324f', '2025-08-30 13:26:28.894504+00', '20250819140000_add_fuzzy_search_and_unaccent_support', NULL, NULL, '2025-08-30 13:26:28.836194+00', 1),
	('b25b3b66-1b06-442f-93dd-3a2be5fd940b', '8c266c0e82a1c442c0e5976f776bc063c2a15ca9a059b85180028b5e3dd9ebc8', '2025-08-30 13:26:29.032182+00', '20250830130412_update', NULL, NULL, '2025-08-30 13:26:28.954989+00', 1);


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "name", "image", "role", "createdAt", "updatedAt") VALUES
	('b8511f90-2d66-44d0-844c-ed10ae495e50', 'nadfri@gmail.com', NULL, NULL, 'ADMIN', '2025-08-30 15:35:12.975', '2025-08-30 15:35:12.975');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 43, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
