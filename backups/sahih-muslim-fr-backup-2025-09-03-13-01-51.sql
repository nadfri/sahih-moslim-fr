--
-- PostgreSQL database dump
--

\restrict av1SgeFj7hrAP7b33iBF4FfcVgzuWro7V1mLD4kuesBaS8Hsh4ndM12mERmbOln

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-03 13:01:52

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

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
DROP POLICY IF EXISTS "Profiles is accessible to users" ON public.profiles;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public."_HadithToSahaba" DROP CONSTRAINT IF EXISTS "_HadithToSahaba_B_fkey";
ALTER TABLE IF EXISTS ONLY public."_HadithToSahaba" DROP CONSTRAINT IF EXISTS "_HadithToSahaba_A_fkey";
ALTER TABLE IF EXISTS ONLY public."Hadith" DROP CONSTRAINT IF EXISTS "Hadith_chapterId_fkey";
ALTER TABLE IF EXISTS ONLY public."HadithTransmitter" DROP CONSTRAINT IF EXISTS "HadithTransmitter_transmitterId_fkey";
ALTER TABLE IF EXISTS ONLY public."HadithTransmitter" DROP CONSTRAINT IF EXISTS "HadithTransmitter_hadithId_fkey";
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_key;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.profiles_email_key;
DROP INDEX IF EXISTS public.hadith_matn_fr_trgm_idx;
DROP INDEX IF EXISTS public.hadith_matn_fr_fts_idx;
DROP INDEX IF EXISTS public.hadith_matn_ar_trgm_idx;
DROP INDEX IF EXISTS public."_HadithToSahaba_B_index";
DROP INDEX IF EXISTS public."Transmitter_slug_key";
DROP INDEX IF EXISTS public."Transmitter_slug_idx";
DROP INDEX IF EXISTS public."Transmitter_name_key";
DROP INDEX IF EXISTS public."Transmitter_name_idx";
DROP INDEX IF EXISTS public."Sahaba_slug_key";
DROP INDEX IF EXISTS public."Sahaba_slug_idx";
DROP INDEX IF EXISTS public."Sahaba_name_key";
DROP INDEX IF EXISTS public."Sahaba_name_idx";
DROP INDEX IF EXISTS public."Hadith_numero_key";
DROP INDEX IF EXISTS public."Hadith_numero_idx";
DROP INDEX IF EXISTS public."Hadith_matn_fr_idx";
DROP INDEX IF EXISTS public."Hadith_matn_en_idx";
DROP INDEX IF EXISTS public."Hadith_matn_ar_idx";
DROP INDEX IF EXISTS public."Hadith_chapterId_numero_idx";
DROP INDEX IF EXISTS public."Hadith_chapterId_idx";
DROP INDEX IF EXISTS public."HadithTransmitter_transmitterId_idx";
DROP INDEX IF EXISTS public."HadithTransmitter_hadithId_transmitterId_key";
DROP INDEX IF EXISTS public."HadithTransmitter_hadithId_order_key";
DROP INDEX IF EXISTS public."HadithTransmitter_hadithId_idx";
DROP INDEX IF EXISTS public."Chapter_slug_key";
DROP INDEX IF EXISTS public."Chapter_slug_idx";
DROP INDEX IF EXISTS public."Chapter_name_key";
DROP INDEX IF EXISTS public."Chapter_name_idx";
DROP INDEX IF EXISTS public."Chapter_index_key";
DROP INDEX IF EXISTS public."Chapter_index_idx";
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_clients_client_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY supabase_migrations.seed_files DROP CONSTRAINT IF EXISTS seed_files_pkey;
ALTER TABLE IF EXISTS ONLY supabase_migrations.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."_HadithToSahaba" DROP CONSTRAINT IF EXISTS "_HadithToSahaba_AB_pkey";
ALTER TABLE IF EXISTS ONLY public."Transmitter" DROP CONSTRAINT IF EXISTS "Transmitter_pkey";
ALTER TABLE IF EXISTS ONLY public."Sahaba" DROP CONSTRAINT IF EXISTS "Sahaba_pkey";
ALTER TABLE IF EXISTS ONLY public."Hadith" DROP CONSTRAINT IF EXISTS "Hadith_pkey";
ALTER TABLE IF EXISTS ONLY public."HadithTransmitter" DROP CONSTRAINT IF EXISTS "HadithTransmitter_pkey";
ALTER TABLE IF EXISTS ONLY public."Chapter" DROP CONSTRAINT IF EXISTS "Chapter_pkey";
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_client_id_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS supabase_migrations.seed_files;
DROP TABLE IF EXISTS supabase_migrations.schema_migrations;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."_HadithToSahaba";
DROP TABLE IF EXISTS public."Transmitter";
DROP TABLE IF EXISTS public."Sahaba";
DROP TABLE IF EXISTS public."HadithTransmitter";
DROP TABLE IF EXISTS public."Hadith";
DROP TABLE IF EXISTS public."Chapter";
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS unaccent;
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_trgm;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP EXTENSION IF EXISTS pg_graphql;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS supabase_migrations;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
-- *not* dropping schema, since initdb creates it
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- TOC entry 32 (class 2615 OID 16494)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- TOC entry 18 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- TOC entry 30 (class 2615 OID 16624)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- TOC entry 29 (class 2615 OID 16613)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- TOC entry 13 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- TOC entry 106 (class 2615 OID 37617)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 4148 (class 0 OID 0)
-- Dependencies: 106
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 11 (class 2615 OID 16605)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- TOC entry 33 (class 2615 OID 16542)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- TOC entry 113 (class 2615 OID 40546)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- TOC entry 27 (class 2615 OID 16653)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- TOC entry 6 (class 3079 OID 16689)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4149 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4150 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 8 (class 3079 OID 37813)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 4151 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- TOC entry 4 (class 3079 OID 16443)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4152 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16654)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4153 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 7 (class 3079 OID 37806)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4154 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4155 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1173 (class 1247 OID 16782)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1197 (class 1247 OID 16923)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1170 (class 1247 OID 16776)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1167 (class 1247 OID 16771)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1266 (class 1247 OID 43877)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- TOC entry 1203 (class 1247 OID 16965)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1239 (class 1247 OID 38942)
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


--
-- TOC entry 1218 (class 1247 OID 17136)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1225 (class 1247 OID 17093)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1228 (class 1247 OID 17107)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- TOC entry 1224 (class 1247 OID 17178)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- TOC entry 1221 (class 1247 OID 17149)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- TOC entry 425 (class 1255 OID 16540)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4156 (class 0 OID 0)
-- Dependencies: 425
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 445 (class 1255 OID 16753)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 379 (class 1255 OID 16539)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4157 (class 0 OID 0)
-- Dependencies: 379
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 401 (class 1255 OID 16538)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4158 (class 0 OID 0)
-- Dependencies: 401
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 458 (class 1255 OID 16597)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4159 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 442 (class 1255 OID 16618)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4160 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 416 (class 1255 OID 16599)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4161 (class 0 OID 0)
-- Dependencies: 416
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 374 (class 1255 OID 16609)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 473 (class 1255 OID 16610)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 386 (class 1255 OID 16620)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4162 (class 0 OID 0)
-- Dependencies: 386
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 427 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 474 (class 1255 OID 17171)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 501 (class 1255 OID 17252)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 428 (class 1255 OID 17184)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 479 (class 1255 OID 17133)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 398 (class 1255 OID 17128)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 480 (class 1255 OID 17179)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 396 (class 1255 OID 17192)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 406 (class 1255 OID 17123)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 404 (class 1255 OID 17251)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 394 (class 1255 OID 17121)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 433 (class 1255 OID 17160)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 455 (class 1255 OID 17245)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 440 (class 1255 OID 17036)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 447 (class 1255 OID 17010)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 465 (class 1255 OID 17009)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 377 (class 1255 OID 17008)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- TOC entry 391 (class 1255 OID 17022)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 439 (class 1255 OID 17075)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 460 (class 1255 OID 17038)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 420 (class 1255 OID 17091)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 382 (class 1255 OID 17025)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 438 (class 1255 OID 17026)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 333 (class 1259 OID 16525)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4163 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 350 (class 1259 OID 16927)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- TOC entry 4164 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 341 (class 1259 OID 16725)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 4165 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4166 (class 0 OID 0)
-- Dependencies: 341
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 332 (class 1259 OID 16518)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- TOC entry 4167 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 345 (class 1259 OID 16814)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- TOC entry 4168 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 344 (class 1259 OID 16802)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- TOC entry 4169 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 343 (class 1259 OID 16789)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- TOC entry 4170 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 371 (class 1259 OID 43881)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- TOC entry 351 (class 1259 OID 16977)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- TOC entry 331 (class 1259 OID 16507)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- TOC entry 4171 (class 0 OID 0)
-- Dependencies: 331
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 330 (class 1259 OID 16506)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4172 (class 0 OID 0)
-- Dependencies: 330
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 348 (class 1259 OID 16856)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- TOC entry 4173 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 349 (class 1259 OID 16874)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- TOC entry 4174 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 334 (class 1259 OID 16533)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- TOC entry 4175 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 342 (class 1259 OID 16755)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- TOC entry 4176 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4177 (class 0 OID 0)
-- Dependencies: 342
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 347 (class 1259 OID 16841)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- TOC entry 4178 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 346 (class 1259 OID 16832)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- TOC entry 4179 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4180 (class 0 OID 0)
-- Dependencies: 346
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 329 (class 1259 OID 16495)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- TOC entry 4181 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4182 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 363 (class 1259 OID 38993)
-- Name: Chapter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Chapter" (
    id text NOT NULL,
    index integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "nameArabic" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 362 (class 1259 OID 38985)
-- Name: Hadith; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Hadith" (
    id text NOT NULL,
    numero integer NOT NULL,
    matn_fr text NOT NULL,
    matn_ar text NOT NULL,
    "chapterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    matn_en text NOT NULL
);


--
-- TOC entry 366 (class 1259 OID 39025)
-- Name: HadithTransmitter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HadithTransmitter" (
    id text NOT NULL,
    "hadithId" text NOT NULL,
    "transmitterId" text NOT NULL,
    "order" integer NOT NULL
);


--
-- TOC entry 364 (class 1259 OID 39009)
-- Name: Sahaba; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Sahaba" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "nameArabic" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 365 (class 1259 OID 39017)
-- Name: Transmitter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transmitter" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "nameArabic" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 367 (class 1259 OID 39032)
-- Name: _HadithToSahaba; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_HadithToSahaba" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- TOC entry 361 (class 1259 OID 38932)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 368 (class 1259 OID 39123)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id text NOT NULL,
    email text,
    name text,
    image text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 360 (class 1259 OID 17255)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- TOC entry 352 (class 1259 OID 17003)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- TOC entry 357 (class 1259 OID 17109)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- TOC entry 356 (class 1259 OID 17108)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 335 (class 1259 OID 16546)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- TOC entry 4183 (class 0 OID 0)
-- Dependencies: 335
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 337 (class 1259 OID 16588)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 336 (class 1259 OID 16561)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- TOC entry 4184 (class 0 OID 0)
-- Dependencies: 336
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 353 (class 1259 OID 17040)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- TOC entry 354 (class 1259 OID 17054)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 369 (class 1259 OID 40547)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- TOC entry 370 (class 1259 OID 40554)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- TOC entry 3691 (class 2604 OID 16510)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4111 (class 0 OID 16525)
-- Dependencies: 333
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	082966c9-f82e-4799-8cb1-41e8c99be147	{"action":"user_signedup","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}	2025-08-26 11:47:53.635527+00	
00000000-0000-0000-0000-000000000000	eb4a6929-446c-44b2-b302-6a5861104fae	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 11:47:55.448962+00	
00000000-0000-0000-0000-000000000000	2cc518af-2f98-49c7-bb77-64e3d0b7df58	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 11:55:42.159571+00	
00000000-0000-0000-0000-000000000000	9d3d89a6-25e0-476b-b1a5-b67d0216ae41	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 11:55:52.337292+00	
00000000-0000-0000-0000-000000000000	61ac64fc-1d93-4005-bf7c-72fd79b7fd46	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 11:55:52.592464+00	
00000000-0000-0000-0000-000000000000	a0468692-4c64-49e1-912b-2624260888fa	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 11:56:48.713937+00	
00000000-0000-0000-0000-000000000000	b5ac05e5-ed9e-47cd-b1f7-fd394b00ed8c	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 11:56:54.393917+00	
00000000-0000-0000-0000-000000000000	6c7ba40c-dc0f-410c-a2b4-4c3795dcd011	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 11:56:54.643399+00	
00000000-0000-0000-0000-000000000000	d8173c3f-b749-49e8-85e5-51bbc0f9e4fe	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 11:58:09.779282+00	
00000000-0000-0000-0000-000000000000	712db09a-378b-4d6a-8da5-37062f9a9462	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 12:01:08.569104+00	
00000000-0000-0000-0000-000000000000	5978586d-b3ae-4bcc-99a9-1de7009ceff0	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 12:01:09.020364+00	
00000000-0000-0000-0000-000000000000	b36bca96-ae0e-47e9-bb51-1b4a7f9e9c61	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 13:03:01.158887+00	
00000000-0000-0000-0000-000000000000	7955723e-e5fe-4828-b399-57061575184a	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 13:03:01.173182+00	
00000000-0000-0000-0000-000000000000	38f92d8c-7118-4c7b-b9ac-79c6880da0c5	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 15:28:30.023667+00	
00000000-0000-0000-0000-000000000000	30a2d18d-f5dc-4157-ba4c-6a2ab4842591	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 15:28:30.034873+00	
00000000-0000-0000-0000-000000000000	6d91d29f-7666-46dd-b95d-dce6c207943a	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 15:28:33.500301+00	
00000000-0000-0000-0000-000000000000	40691cfd-3f4e-4da6-af0e-ad9ba2830df5	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 15:28:52.380423+00	
00000000-0000-0000-0000-000000000000	ba1d3693-2379-43f9-84a3-5d7b6f451380	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 15:29:11.981819+00	
00000000-0000-0000-0000-000000000000	0b384d8c-79a5-4c29-956f-d1a12e394832	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 15:29:13.873186+00	
00000000-0000-0000-0000-000000000000	f3cf631f-f387-4e53-a576-02e8fb273fcc	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 15:42:08.736921+00	
00000000-0000-0000-0000-000000000000	38590af1-2f32-4f34-8b63-09e8500578f4	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 15:42:56.808285+00	
00000000-0000-0000-0000-000000000000	162e9ccb-b34f-4e13-a010-1ab5083278ae	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 15:42:58.495589+00	
00000000-0000-0000-0000-000000000000	c4f1a410-06d8-4756-ae26-fce5e14bda3e	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 15:43:37.825815+00	
00000000-0000-0000-0000-000000000000	22228bda-34fd-4b7a-b129-34e4539a7029	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-26 15:58:59.221694+00	
00000000-0000-0000-0000-000000000000	71efdc9b-ab07-4036-94bf-6c966264b647	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-26 15:59:01.010959+00	
00000000-0000-0000-0000-000000000000	e09fce56-100d-48fe-afd6-9de46b52b6a5	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 17:28:52.822691+00	
00000000-0000-0000-0000-000000000000	c9a0a5a9-9569-4a12-8cec-35e1fb728690	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 17:28:52.832495+00	
00000000-0000-0000-0000-000000000000	0c9c7a37-52b0-4202-9cf7-27282c61c568	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:15:44.707732+00	
00000000-0000-0000-0000-000000000000	d6f91f22-61b2-43d0-abc4-14413b4d8e35	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:15:44.725858+00	
00000000-0000-0000-0000-000000000000	9f704862-6702-456f-af94-52a53467a168	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:16:16.094941+00	
00000000-0000-0000-0000-000000000000	c03f26e2-8684-49ba-b7e4-bb5ff15018b9	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:16:48.818025+00	
00000000-0000-0000-0000-000000000000	3a0d30d5-6a9c-4042-b37c-943599bb8445	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:17:48.92886+00	
00000000-0000-0000-0000-000000000000	a9829eb3-7fa4-4c06-a8b5-b040084f78b6	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:18:19.77185+00	
00000000-0000-0000-0000-000000000000	1bb607bd-f4ae-4bd5-a532-0febd43a6ed5	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:18:20.805122+00	
00000000-0000-0000-0000-000000000000	800eb348-c513-4ebf-b234-903605a380aa	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:18:28.009967+00	
00000000-0000-0000-0000-000000000000	7e0556e3-3c6f-4e8a-bbc8-f2bc6d2476ee	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 19:18:31.25057+00	
00000000-0000-0000-0000-000000000000	c6be1a06-3e90-4ae2-bcd0-ad13c22b89ed	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 13:01:00.548053+00	
00000000-0000-0000-0000-000000000000	486da7f6-e870-4626-8a87-416dd62de859	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 13:01:00.558862+00	
00000000-0000-0000-0000-000000000000	fcd448a6-54e9-40a6-91de-731b1489d633	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 17:34:38.773296+00	
00000000-0000-0000-0000-000000000000	e8b3b11e-d824-475b-95ad-eabbdf0656fd	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 17:34:38.789563+00	
00000000-0000-0000-0000-000000000000	a2682ba1-f25c-4a8c-9552-35936dcfebf3	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 18:58:59.680836+00	
00000000-0000-0000-0000-000000000000	6df2cdd2-659c-4a97-9d1b-251a7dae03b6	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-27 18:58:59.690103+00	
00000000-0000-0000-0000-000000000000	8e00a557-62d3-459b-89dc-c31c876933cb	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 15:54:34.354197+00	
00000000-0000-0000-0000-000000000000	4bd9616c-8a5a-4887-9e22-d030f95f37fc	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 15:54:34.368007+00	
00000000-0000-0000-0000-000000000000	8d5703ae-3b41-4582-b40e-5b23262743a7	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 16:52:45.850715+00	
00000000-0000-0000-0000-000000000000	85f93e6e-281d-452c-b533-8d7b69fa7d04	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 16:52:45.861236+00	
00000000-0000-0000-0000-000000000000	082092bc-fc04-40d3-a91f-4c5e8d4f1af0	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 19:51:58.270556+00	
00000000-0000-0000-0000-000000000000	c1da0e0b-5aa3-4993-988e-17ae22df55f3	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 19:51:58.281309+00	
00000000-0000-0000-0000-000000000000	a5e88acc-a392-4f35-9f3f-21eaf7e0ba5a	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 19:52:39.602679+00	
00000000-0000-0000-0000-000000000000	d8450a8e-3cab-4466-930d-50f9313b799f	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-28 19:57:26.620667+00	
00000000-0000-0000-0000-000000000000	4a04d6bc-f20b-4e70-9951-24f73d0c6237	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-28 19:57:26.855323+00	
00000000-0000-0000-0000-000000000000	329b6422-0403-4ef7-a126-c45e76a3aaa8	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 20:01:57.863564+00	
00000000-0000-0000-0000-000000000000	1c4e6323-4699-4a20-96c1-62698097c032	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-28 20:02:06.893986+00	
00000000-0000-0000-0000-000000000000	3214e47c-2bc9-414d-8130-123214f87883	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-28 20:02:07.030295+00	
00000000-0000-0000-0000-000000000000	08db711a-02e3-410e-86a2-47b8a9bc11c8	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-28 20:17:13.071734+00	
00000000-0000-0000-0000-000000000000	b153a9fe-d0e6-4c27-ab1d-f8d246e493b1	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-28 20:17:22.255896+00	
00000000-0000-0000-0000-000000000000	0c2fe4ef-a2ad-467e-ae9e-f0d69e3c2ca7	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 08:25:45.167351+00	
00000000-0000-0000-0000-000000000000	b0c3b98c-6160-447f-9c96-888aff887c8f	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 08:25:45.192902+00	
00000000-0000-0000-0000-000000000000	74410c19-6410-4223-8233-16eeccd0f555	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 14:35:41.18842+00	
00000000-0000-0000-0000-000000000000	be82a6ad-8fd0-434b-a91b-41dc17aeed35	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 14:35:41.198527+00	
00000000-0000-0000-0000-000000000000	ed56d9bb-fb25-49a6-8f8c-24cc8e3a95d6	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 15:54:29.961411+00	
00000000-0000-0000-0000-000000000000	047ee61e-c5a5-488d-aa07-38d163d512fa	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 15:54:29.975036+00	
00000000-0000-0000-0000-000000000000	2f2d5aaf-00b9-4d22-836a-305a54368fba	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-29 16:37:07.456107+00	
00000000-0000-0000-0000-000000000000	92f0dffe-0e09-445d-bce0-285cdae0dbea	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-29 16:37:25.57229+00	
00000000-0000-0000-0000-000000000000	71012207-b7e4-4b4e-9af8-c6da9be45b59	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-29 16:37:27.560279+00	
00000000-0000-0000-0000-000000000000	a10da8f4-ca4c-4d63-8ad2-077064751775	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 19:43:45.653171+00	
00000000-0000-0000-0000-000000000000	43096e13-9143-4f14-9071-384f284eb2da	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 19:43:45.666659+00	
00000000-0000-0000-0000-000000000000	f8331496-f024-437c-b3a4-4ec43954d5db	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 19:43:46.589894+00	
00000000-0000-0000-0000-000000000000	48747f81-604e-41dc-b72a-d581d5afa03d	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-29 19:45:18.425021+00	
00000000-0000-0000-0000-000000000000	110b01c4-be4f-496f-a324-08566894c7e2	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-29 19:45:18.529207+00	
00000000-0000-0000-0000-000000000000	52c77218-1d9b-4c87-93a5-de90f5e910eb	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-29 19:50:40.263807+00	
00000000-0000-0000-0000-000000000000	866a031c-42ff-4842-8086-8d20e1fcafb3	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-29 19:50:50.625357+00	
00000000-0000-0000-0000-000000000000	5492c37e-87f6-4eca-af76-703216cf8989	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-29 19:50:50.768299+00	
00000000-0000-0000-0000-000000000000	2129ae98-7ace-4557-9f67-1edc17d93f7f	{"action":"token_refreshed","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 14:34:31.834327+00	
00000000-0000-0000-0000-000000000000	3b72b859-4249-4a75-a40b-226d0a120151	{"action":"token_revoked","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 14:34:31.841938+00	
00000000-0000-0000-0000-000000000000	3a4ff8f3-3fd0-4650-b85b-42cba2468e13	{"action":"logout","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 15:14:32.130777+00	
00000000-0000-0000-0000-000000000000	cdc5574d-3be8-4492-bd90-8dfd4fba2af4	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-30 15:14:41.476409+00	
00000000-0000-0000-0000-000000000000	bc840863-83da-4389-a308-d571a942804f	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:14:43.552423+00	
00000000-0000-0000-0000-000000000000	d3312632-f691-4331-8e3c-a11acf5ceca9	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-30 15:18:45.666859+00	
00000000-0000-0000-0000-000000000000	a03aba63-6eaf-4964-a608-7d77262aa256	{"action":"login","actor_id":"64986786-596e-4de1-a266-1b8fa9174880","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:18:46.171779+00	
00000000-0000-0000-0000-000000000000	5197fb4f-8bad-4402-9b00-a239cdbffd97	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nadfri@gmail.com","user_id":"64986786-596e-4de1-a266-1b8fa9174880","user_phone":""}}	2025-08-30 15:21:26.895584+00	
00000000-0000-0000-0000-000000000000	1f51fd07-ccbd-4f3e-8bc3-ad4cb33c8cb1	{"action":"user_signedup","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}	2025-08-30 15:23:31.159583+00	
00000000-0000-0000-0000-000000000000	a0a7582b-9e2e-4c15-92ed-7c314ed33367	{"action":"login","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:23:32.805363+00	
00000000-0000-0000-0000-000000000000	55f0d962-a5de-4a36-9dca-c1d4a904c5dc	{"action":"logout","actor_id":"7b1c591b-bce5-4437-8d51-786210f5136a","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 15:29:14.571554+00	
00000000-0000-0000-0000-000000000000	4bd9d499-31a4-4d74-bbb1-08d0c525d87f	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nadfri@gmail.com","user_id":"7b1c591b-bce5-4437-8d51-786210f5136a","user_phone":""}}	2025-08-30 15:29:27.087232+00	
00000000-0000-0000-0000-000000000000	f730db9f-06fe-42ab-af3d-4ee7c9dd6625	{"action":"user_signedup","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}	2025-08-30 15:29:37.299055+00	
00000000-0000-0000-0000-000000000000	8643f734-792d-4010-9fa2-5d4696e0c0ab	{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:29:37.858928+00	
00000000-0000-0000-0000-000000000000	4af0e91c-836d-46de-8b00-1ae3a143a7ea	{"action":"logout","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 15:36:33.016244+00	
00000000-0000-0000-0000-000000000000	f453473a-6f85-4107-b7ba-0add438b8f2f	{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-30 15:36:39.646522+00	
00000000-0000-0000-0000-000000000000	76de19f4-6db9-432a-9393-60ac1fe5c429	{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:36:40.208141+00	
00000000-0000-0000-0000-000000000000	5bad0423-225c-4794-84e5-a7e6247c46dd	{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}	2025-08-30 15:39:35.722109+00	
00000000-0000-0000-0000-000000000000	4c7410cb-dd4c-4816-925f-20862c8b6fa3	{"action":"login","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}	2025-08-30 15:39:37.253711+00	
00000000-0000-0000-0000-000000000000	3c32d09d-f585-4dce-8aa6-e94d3870514a	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 16:38:14.211306+00	
00000000-0000-0000-0000-000000000000	afe8f39b-5dcf-4e9f-b47c-50e150335e98	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 16:38:14.230502+00	
00000000-0000-0000-0000-000000000000	e3a51f4a-5324-42e5-83dc-2afd9dbf0cd4	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 16:38:17.060602+00	
00000000-0000-0000-0000-000000000000	a44b97da-6b70-4ffd-ab95-c3fb81b2e124	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 18:10:14.272964+00	
00000000-0000-0000-0000-000000000000	80fe7e9e-992f-498c-b12f-bae77922ab72	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 18:10:14.283067+00	
00000000-0000-0000-0000-000000000000	e663cef7-7a2a-4ea5-adc1-fde101f4b3a7	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 19:11:07.147304+00	
00000000-0000-0000-0000-000000000000	42450893-9162-4d10-af0a-6efe3e2e8af7	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 19:11:07.169891+00	
00000000-0000-0000-0000-000000000000	96b29d49-e967-488c-8dc2-8b7d05707cb9	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 20:13:58.154093+00	
00000000-0000-0000-0000-000000000000	47dde4c2-2c63-4bf8-b0f0-e862d9618f85	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 20:13:58.166263+00	
00000000-0000-0000-0000-000000000000	25662fb7-96a5-4911-ada0-6dca4b9b140f	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 09:12:22.574677+00	
00000000-0000-0000-0000-000000000000	ea5e8178-fa03-4af3-8acd-ea5aa3110423	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 09:12:22.597725+00	
00000000-0000-0000-0000-000000000000	f2ce076f-8187-49aa-b392-e8c46edfadbd	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 11:55:20.576+00	
00000000-0000-0000-0000-000000000000	25eaab65-6939-4eb4-91f3-dbf9632eabf4	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 11:55:20.596996+00	
00000000-0000-0000-0000-000000000000	acef97e2-8009-4671-82ea-eda2fe3125b9	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 13:53:33.131909+00	
00000000-0000-0000-0000-000000000000	826ead08-fbe5-4dd8-b252-129e5ef39054	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 13:53:33.140063+00	
00000000-0000-0000-0000-000000000000	d47e0f4f-06f2-41d4-96d0-6d66cec72dae	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 14:51:47.328338+00	
00000000-0000-0000-0000-000000000000	0205ba72-07f8-4241-a138-8f9cff86ac84	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 14:51:47.344365+00	
00000000-0000-0000-0000-000000000000	abb98a8c-e524-4214-a207-8fe1881c928a	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 16:09:13.708108+00	
00000000-0000-0000-0000-000000000000	5c71b57a-ce49-4bec-a266-a51aed904f78	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 16:09:13.737933+00	
00000000-0000-0000-0000-000000000000	a8dbd30d-143e-4cfd-9cc9-4a12c5240482	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 19:13:34.717037+00	
00000000-0000-0000-0000-000000000000	35c33627-a353-4f67-86d8-0ad872324b06	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 19:13:34.729938+00	
00000000-0000-0000-0000-000000000000	76ba6a0f-bb31-407d-a267-7a0a0921a2e7	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 20:11:42.380627+00	
00000000-0000-0000-0000-000000000000	fb982b2b-1396-4a62-87ab-276ef8685b67	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 20:11:42.393793+00	
00000000-0000-0000-0000-000000000000	253cd0f4-aaf7-4847-b011-d41072f7c99b	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 10:01:39.91012+00	
00000000-0000-0000-0000-000000000000	9ca544cd-3f3e-4b3c-8aba-182eeccdc708	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 10:01:39.934107+00	
00000000-0000-0000-0000-000000000000	4c75b341-b526-495c-8780-e919313d8e82	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 11:11:39.481551+00	
00000000-0000-0000-0000-000000000000	825c4abc-dfd0-4822-9408-e1e253b9266f	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 11:11:39.508195+00	
00000000-0000-0000-0000-000000000000	688229db-c6c8-4d2b-8679-44e02c92da19	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 11:05:43.068582+00	
00000000-0000-0000-0000-000000000000	49a8265d-ce08-4eb6-a5d1-dbe0690c13cc	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 11:05:43.095683+00	
00000000-0000-0000-0000-000000000000	1b5898ba-5545-4017-a7d1-0663d2ce126a	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 12:21:10.430411+00	
00000000-0000-0000-0000-000000000000	aa1e14e4-f6ca-4021-aa77-cc4a5fbc764e	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 12:21:10.457025+00	
00000000-0000-0000-0000-000000000000	d3b5b76e-b15e-4373-9386-1e04b6ca49f0	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 13:19:11.602736+00	
00000000-0000-0000-0000-000000000000	fb182f91-59c1-4101-8b74-91409017b8db	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 13:19:11.621668+00	
00000000-0000-0000-0000-000000000000	765a1c06-04fd-4ed3-8094-f276ad97d899	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:18:16.176402+00	
00000000-0000-0000-0000-000000000000	708a9167-32ef-4fa0-9c3c-8ce5d24af1ee	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:18:16.192907+00	
00000000-0000-0000-0000-000000000000	371c2131-7d72-48cc-bcd5-2d12ab9cf61b	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 15:17:00.16203+00	
00000000-0000-0000-0000-000000000000	67ebdc67-3c48-4da6-84b2-7793ac7a9b48	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 15:17:00.185257+00	
00000000-0000-0000-0000-000000000000	c8cd39ad-e842-4d18-b97b-945e4d8ebdf9	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 15:17:02.870073+00	
00000000-0000-0000-0000-000000000000	77197dba-da2c-47fc-8bb6-71d8ccc56d6c	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 16:16:59.098646+00	
00000000-0000-0000-0000-000000000000	db66ca85-d019-4ae2-b734-331d623d84b2	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 16:16:59.122872+00	
00000000-0000-0000-0000-000000000000	cfdf4f1b-d305-4da5-81a8-e9ecca2c066b	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 17:48:51.084315+00	
00000000-0000-0000-0000-000000000000	5ba52e62-d51a-4f79-8228-1bc020045751	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 17:48:51.110912+00	
00000000-0000-0000-0000-000000000000	8c68b7d2-3abd-4eb6-884a-4ce059fb546a	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 18:53:34.109912+00	
00000000-0000-0000-0000-000000000000	79449b35-3ca9-43e9-8890-e20356c80240	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 18:53:34.129874+00	
00000000-0000-0000-0000-000000000000	afa2e191-387f-4ff1-94f1-d52133269d97	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 09:40:37.886808+00	
00000000-0000-0000-0000-000000000000	594b6122-1140-42d2-b6bf-8f5225b62b84	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 09:40:37.90669+00	
00000000-0000-0000-0000-000000000000	ab4fcceb-5387-4285-be15-4978b077d2b8	{"action":"token_refreshed","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 10:48:12.559689+00	
00000000-0000-0000-0000-000000000000	67bd7c27-9737-4783-8f56-d0043cfa4f8c	{"action":"token_revoked","actor_id":"b8511f90-2d66-44d0-844c-ed10ae495e50","actor_name":"Nader FRIGUI","actor_username":"nadfri@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 10:48:12.579288+00	
\.


--
-- TOC entry 4125 (class 0 OID 16927)
-- Dependencies: 350
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
19c7cc35-9352-444a-851f-cf8cb561c19f	\N	95bf3919-81cd-4025-a9cd-aebe53e2c820	s256	YHb4FNFpAfLJ8Wq6gKHGyWTnRq3DQj6NivepCQlFdGA	github			2025-08-26 11:45:50.265669+00	2025-08-26 11:45:50.265669+00	oauth	\N
629324e1-f43b-456e-a10b-1462bd9589a2	\N	1be1aadb-3d45-499f-a25e-11d63b795590	s256	MqewS7D6KCUkYT1llGKWCH4Q6qGVJZMZGxLWG0gMqLo	github			2025-08-30 15:21:52.73588+00	2025-08-30 15:21:52.73588+00	oauth	\N
\.


--
-- TOC entry 4116 (class 0 OID 16725)
-- Dependencies: 341
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
56604321	b8511f90-2d66-44d0-844c-ed10ae495e50	{"iss": "https://api.github.com", "sub": "56604321", "name": "Nader FRIGUI", "email": "nadfri@gmail.com", "full_name": "Nader FRIGUI", "user_name": "nadfri", "avatar_url": "https://avatars.githubusercontent.com/u/56604321?v=4", "provider_id": "56604321", "email_verified": true, "phone_verified": false, "preferred_username": "nadfri"}	github	2025-08-30 15:29:37.295489+00	2025-08-30 15:29:37.295543+00	2025-08-30 15:39:35.719163+00	7dcf9c93-448c-4a7c-9756-480f668e604a
\.


--
-- TOC entry 4110 (class 0 OID 16518)
-- Dependencies: 332
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4120 (class 0 OID 16814)
-- Dependencies: 345
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
ab5eeced-fd08-4c36-a49c-0199836e3192	2025-08-30 15:36:40.213007+00	2025-08-30 15:36:40.213007+00	oauth	d7d52f27-71fc-4f99-a4cf-9af10a2678f9
ccd4a684-f9fe-4a49-82c6-c21e398753ee	2025-08-30 15:39:37.258439+00	2025-08-30 15:39:37.258439+00	oauth	3d6697b3-6d71-4915-8420-1258c540df68
\.


--
-- TOC entry 4119 (class 0 OID 16802)
-- Dependencies: 344
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4118 (class 0 OID 16789)
-- Dependencies: 343
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- TOC entry 4142 (class 0 OID 43881)
-- Dependencies: 371
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4126 (class 0 OID 16977)
-- Dependencies: 351
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4109 (class 0 OID 16507)
-- Dependencies: 331
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	38	ttj375zh2crd	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-30 20:13:58.18107+00	2025-08-31 09:12:22.6008+00	44mmb65aipyp	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	39	pqid5k47frpm	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 09:12:22.619262+00	2025-08-31 11:55:20.598832+00	ttj375zh2crd	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	40	jpi5egcdhlzq	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 11:55:20.617976+00	2025-08-31 13:53:33.141975+00	pqid5k47frpm	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	41	omxm6vmx6zga	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 13:53:33.152279+00	2025-08-31 14:51:47.345827+00	jpi5egcdhlzq	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	42	7ppuxdqh7khq	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 14:51:47.357397+00	2025-08-31 16:09:13.739667+00	omxm6vmx6zga	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	43	flba537kbnrb	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 16:09:13.761857+00	2025-08-31 19:13:34.733111+00	7ppuxdqh7khq	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	44	ssou722ldekm	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 19:13:34.7518+00	2025-08-31 20:11:42.394544+00	flba537kbnrb	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	45	nae2roo42ezi	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-31 20:11:42.408954+00	2025-09-01 10:01:39.935572+00	ssou722ldekm	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	46	q7t6kmricona	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-01 10:01:39.955974+00	2025-09-01 11:11:39.508979+00	nae2roo42ezi	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	47	cfaewfwg52gx	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-01 11:11:39.532211+00	2025-09-02 11:05:43.096464+00	q7t6kmricona	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	48	vss256j32bvv	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 11:05:43.116249+00	2025-09-02 12:21:10.457885+00	cfaewfwg52gx	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	49	p2woxurtxuur	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 12:21:10.478122+00	2025-09-02 13:19:11.622407+00	vss256j32bvv	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	50	cf7bjzwr774c	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 13:19:11.637977+00	2025-09-02 14:18:16.193643+00	p2woxurtxuur	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	51	7ea4ecvnl7hr	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 14:18:16.201632+00	2025-09-02 15:17:00.188392+00	cf7bjzwr774c	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	52	n42xvy6tets7	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 15:17:00.204187+00	2025-09-02 16:16:59.123647+00	7ea4ecvnl7hr	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	53	v5aupu4ma6u3	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 16:16:59.142388+00	2025-09-02 17:48:51.112774+00	n42xvy6tets7	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	54	rm5bazpfn6gl	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 17:48:51.132576+00	2025-09-02 18:53:34.130563+00	v5aupu4ma6u3	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	55	bosttpgirkru	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-02 18:53:34.154823+00	2025-09-03 09:40:37.907369+00	rm5bazpfn6gl	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	56	2spy2tdpnotn	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-09-03 09:40:37.927031+00	2025-09-03 10:48:12.579995+00	bosttpgirkru	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	57	u36233satuiw	b8511f90-2d66-44d0-844c-ed10ae495e50	f	2025-09-03 10:48:12.595993+00	2025-09-03 10:48:12.595993+00	2spy2tdpnotn	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	33	ny36tsp67vlf	b8511f90-2d66-44d0-844c-ed10ae495e50	f	2025-08-30 15:36:40.20974+00	2025-08-30 15:36:40.20974+00	\N	ab5eeced-fd08-4c36-a49c-0199836e3192
00000000-0000-0000-0000-000000000000	34	s2lc4rb3opbq	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-30 15:39:37.255485+00	2025-08-30 16:38:14.231186+00	\N	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	35	yyuavmkg7r7i	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-30 16:38:14.251448+00	2025-08-30 18:10:14.286045+00	s2lc4rb3opbq	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	36	qn6otwzloqbn	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-30 18:10:14.300459+00	2025-08-30 19:11:07.171714+00	yyuavmkg7r7i	ccd4a684-f9fe-4a49-82c6-c21e398753ee
00000000-0000-0000-0000-000000000000	37	44mmb65aipyp	b8511f90-2d66-44d0-844c-ed10ae495e50	t	2025-08-30 19:11:07.195551+00	2025-08-30 20:13:58.167835+00	qn6otwzloqbn	ccd4a684-f9fe-4a49-82c6-c21e398753ee
\.


--
-- TOC entry 4123 (class 0 OID 16856)
-- Dependencies: 348
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4124 (class 0 OID 16874)
-- Dependencies: 349
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4112 (class 0 OID 16533)
-- Dependencies: 334
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- TOC entry 4117 (class 0 OID 16755)
-- Dependencies: 342
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
ccd4a684-f9fe-4a49-82c6-c21e398753ee	b8511f90-2d66-44d0-844c-ed10ae495e50	2025-08-30 15:39:37.254439+00	2025-09-03 10:48:12.616097+00	\N	aal1	\N	2025-09-03 10:48:12.615995	node	91.170.9.241	\N
ab5eeced-fd08-4c36-a49c-0199836e3192	b8511f90-2d66-44d0-844c-ed10ae495e50	2025-08-30 15:36:40.208831+00	2025-08-30 15:36:40.208831+00	\N	aal1	\N	\N	node	91.170.9.241	\N
\.


--
-- TOC entry 4122 (class 0 OID 16841)
-- Dependencies: 347
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4121 (class 0 OID 16832)
-- Dependencies: 346
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4107 (class 0 OID 16495)
-- Dependencies: 329
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	b8511f90-2d66-44d0-844c-ed10ae495e50	authenticated	authenticated	nadfri@gmail.com	\N	2025-08-30 15:29:37.299575+00	\N		\N		\N			\N	2025-08-30 15:39:37.25437+00	{"provider": "github", "providers": ["github"]}	{"iss": "https://api.github.com", "sub": "56604321", "name": "Nader FRIGUI", "email": "nadfri@gmail.com", "full_name": "Nader FRIGUI", "user_name": "nadfri", "avatar_url": "https://avatars.githubusercontent.com/u/56604321?v=4", "provider_id": "56604321", "email_verified": true, "phone_verified": false, "preferred_username": "nadfri"}	\N	2025-08-30 15:29:37.292924+00	2025-09-03 10:48:12.60996+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4134 (class 0 OID 38993)
-- Dependencies: 363
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Chapter" (id, index, name, slug, "nameArabic", "createdAt", "updatedAt") FROM stdin;
cm9vcp9lp0000hq6graltfp9h	0	Introduction	introduction	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.288
cm9vcp9lp000chq6g71zqve28	12	Zakat	zakat	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.107
cm9vcp9lp000dhq6gofknba70	13	Jeûne	jeune	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.193
cm9vcp9lp000ehq6gh7cwr8e9	14	Retraite spirituelle	retraite-spirituelle	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.264
cm9vcp9lp000fhq6ghfo05w74	15	Pèlerinage	pelerinage	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.337
cm9vcp9lp000ghq6gjrp8h4m3	16	Mariage	mariage	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.461
cm9vcp9lp000hhq6g5is9r9ly	17	Allaitement	allaitement	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.551
cm9vcp9lp000ihq6g2zwtz217	18	Divorce	divorce	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.629
cm9vcp9lp000jhq6glfvfye9f	19	Invoquer des malédictions	invoquer-des-maledictions	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.707
cm9vcp9lp000khq6gksuq8fr4	20	Affranchissement	affranchissement	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.776
cm9vcp9lp000lhq6grw9aor2y	21	Transactions	transactions	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.95
cm9vcp9lp000mhq6gdkfasulp	22	Irrigations	irrigations	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.093
cm9vcp9lp000nhq6gui980pzc	23	Successions	successions	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.232
cm9vcp9lp000ohq6gt4qvd8cy	24	Donations	donations	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.331
cm9vcp9lp000phq6gy9itlmoq	25	Testaments	testaments	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.385
cm9vcp9lp000qhq6g504yh7qo	26	Voeux	voeux	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.432
cm9vcp9lp000rhq6g1ofi8pw0	27	Serments	serments	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.485
cm9vcp9lp000shq6gtp5e5vmt	28	Serments collectifs	serments-collectifs	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.545
cm9vcp9lp000thq6gkn629uwj	29	Peines légales	peines-legales	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.599
cm9vcp9lp000uhq6goxkyj5cv	30	Jugements	jugements	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.652
cm9vcp9lp000vhq6gxes128ov	31	Objets trouvés	objets-trouves	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.719
cm9vcp9lp000whq6gftedypeh	32	Jihad et Expéditions	jihad-et-expeditions	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.783
cm9vcp9lp000xhq6g342vfuwx	33	Commandements	commandements	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:42.839
cm9vcp9lp0001hq6gin9xjo72	1	La Foi	la-foi	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.353
cm9vcp9lp0002hq6g697o5t3i	2	Purification	purification	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.451
cm9vcp9lp0003hq6gkv9kr2bx	3	Menstruations	menstruations	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.512
cmau3yvxo000ehqeo2a2mykkp	999	Inconnu	inconnu	\N	2025-05-18 20:28:05.293	2025-09-02 18:21:42.964
cm9vcp9lp0004hq6g0h1mzyei	4	Prières	prieres	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.578
cm9vcp9lp0005hq6g8861o4q4	5	Mosquées et lieux de prière	mosquees-et-lieux-de-priere	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.627
cm9vcp9lp0006hq6gipilpeko	6	Prière du voyageur	priere-du-voyageur	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.701
cm9vcp9lp0007hq6gdo1ki0k1	7	Prière du vendredi	priere-du-vendredi	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.759
cm9vcp9lp0008hq6gdkv7nvu9	8	Prière des deux fêtes	priere-des-deux-fetes	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.809
cm9vcp9lp0009hq6gxe3x68nm	9	Prière pour la pluie	priere-pour-la-pluie	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.862
cm9vcp9lp000ahq6g6bfxrgnu	10	Prière des éclipses	priere-des-eclipses	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:40.943
cm9vcp9lp000bhq6gxtwona4o	11	Prière des funérailles	priere-des-funerailles	\N	2025-04-24 12:40:36.829	2025-09-02 18:21:41.054
\.


--
-- TOC entry 4133 (class 0 OID 38985)
-- Dependencies: 362
-- Data for Name: Hadith; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Hadith" (id, numero, matn_fr, matn_ar, "chapterId", "createdAt", "updatedAt", matn_en) FROM stdin;
cmf2ir4a70075hq4scszv1c5g	57	TEST		cm9vcp9lp0001hq6gin9xjo72	2025-09-02 12:22:55.855	2025-09-02 12:22:55.855	
cm9vcvuk20005hqn84x5gg9v9	6	~~Le Messager d'Allah~~ a dit: \n\nIl y aura, à la fin de ma communauté, des gens qui vous raconteront des choses que ni vous ni vos pères n'avez entendues, alors méfiez-vous d'eux.	سَيَكُونُ فِي آخِرِ أُمَّتِي أُنَاسٌ يُحَدِّثُونَكُمْ مَا لَمْ تَسْمَعُوا أَنْتُمْ وَلاَ آبَاؤُكُمْ فَإِيَّاكُمْ وَإِيَّاهُمْ	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.923	2025-09-02 11:57:46.83	
cm9vcvuk80006hqn8pi9xkm0o	7	~~Le Prophète ﷺ~~ a dit: \n\n« Il y aura à la fin des temps des grands imposteurs, des grands menteurs qui vont vous apporter des ahadiths que ni vous ni vos ancêtres n'ont entendus auparavant. Faites très attention à eux afin qu'ils ne vous égarent pas et qu'ils ne soient pas une source de troubles pour vous ».	عن أبي هريرة رضي الله عنه قال النبي صلى الله عليه و سلم : يكون في آخر الزمان دجالون كذابون . يأتونكم من الأحاديث بما لم تسمعوا أنتم ولا آباؤكم فإياكم وإياهم لا يضلونكم ولا يفتنونكم	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.929	2025-09-02 11:57:47.024	
cm9vcvujg0002hqn8t60fpwgz	3	~~Le Prophète ﷺ~~ a dit: \n\n« Celui qui ment volontairement sur moi qu'il prépare sa place en enfer ».	وَحَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا إِسْمَاعِيلُ، - يَعْنِي ابْنَ عُلَيَّةَ - عَنْ عَبْدِ الْعَزِيزِ بْنِ صُهَيْبٍ، عَنْ أَنَسِ بْنِ مَالِكٍ، أَنَّهُ قَالَ إِنَّهُ لَيَمْنَعُنِي أَنْ أُحَدِّثَكُمْ حَدِيثًا كَثِيرًا أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ  " مَنْ تَعَمَّدَ عَلَىَّ كَذِبًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ " .	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.901	2025-09-02 11:57:46.155	
cm9vcvujn0003hqn87tj23wuq	4	Je suis arrivé à la mosquée, et **Al Mughirah**, l'Amir de al-Kufah, a dit : \n\n« J'ai entendu ~~le Messager d'Allah ﷺ~~, dire : \n\nEn vérité, un mensonge à mon sujet n'est pas comme un mensonge sur n'importe qui d'autre, car celui qui ment intentionnellement à mon sujet, qu'il prépare sa place en Enfer. »\n	وَحَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ اللَّهِ بْنِ نُمَيْرٍ، حَدَّثَنَا أَبِي، حَدَّثَنَا سَعِيدُ بْنُ عُبَيْدٍ، حَدَّثَنَا عَلِيُّ بْنُ رَبِيعَةَ، قَالَ أَتَيْتُ الْمَسْجِدَ وَالْمُغِيرَةُ أَمِيرُ الْكُوفَةِ قَالَ فَقَالَ الْمُغِيرَةُ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ" إِنَّ كَذِبًا عَلَىَّ لَيْسَ كَكَذِبٍ عَلَى أَحَدٍ فَمَنْ كَذَبَ عَلَىَّ مُتَعَمِّدًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ".	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.908	2025-09-02 11:57:46.371	
cm9vcvujv0004hqn8jjtfhnw5	5	~~Le Prophète ﷺ~~ a dit: « Il suffit à la personne comme mensonge de transmettre tout ce qu'elle entend »	عن أبي هريرة رضي الله عنه قال رسول الله صلى الله عليه و سلم : كفى بالمرء كذبا أن يحدث بكل ما سمع	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.915	2025-09-02 11:57:46.65	
cmb0vj6340001hqg8jsmqjuub	33	Il est rapporté que **Itban ibn Malik** se rendit à Médine et dit :\n\n— « Ma vue s’est affaiblie. J’ai donc envoyé un message au ~~Prophète ﷺ~~ pour lui dire : “J’ai vivement le désir que tu viennes chez moi pour y accomplir une prière, afin que je puisse prendre cet endroit comme lieu de prière.” »\n\n~~Le Prophète ﷺ~~ vint chez lui, accompagné de certains de ses Compagnons, selon ce qu’Allah avait décrété. Il entra dans la maison, y accomplit la prière, puis ses Compagnons se mirent à discuter entre eux, et la conversation porta sur les hypocrites.\n\nIls désignèrent alors un homme bien connu parmi eux : **Malik ibn Dukhshum**, et souhaitèrent que le ~~Prophète ﷺ~~ le maudisse, qu’il meure ou qu’un malheur l’atteigne.\n\nLorsque le ~~Messager d’Allah ﷺ~~ eut terminé la prière, il dit :\n\n— « Ne témoigne-t-il pas qu’il n’y a de divinité digne d’adoration qu’Allah et que je suis le ~~Messager d’Allah~~ ? »\n\nIls répondirent :\n\n— « Il le dit, certes, mais pas sincèrement, pas du fond du cœur. »\n\n~~Le Prophète ﷺ~~ répondit alors :\n\n— « Quiconque témoigne qu’il n’y a de divinité digne d’adoration qu’Allah et que je suis le ~~Messager d’Allah~~ n’entrera pas en Enfer, ou bien le Feu ne le touchera pas. »\n\n**Anas** (qui rapporte ce récit) dit :\n\n— « Ce hadith m’a profondément marqué, et j’ai ordonné à mon fils de l’écrire. »	حَدَّثَنَا شَيْبَانُ بْنُ فَرُّوخَ، حَدَّثَنَا سُلَيْمَانُ، - يَعْنِي ابْنَ الْمُغِيرَةِ - قَالَ حَدَّثَنَا ثَابِتٌ، عَنْ أَنَسِ بْنِ مَالِكٍ، قَالَ حَدَّثَنِي مَحْمُودُ بْنُ الرَّبِيعِ، عَنْ عِتْبَانَ بْنِ مَالِكٍ، قَالَ قَدِمْتُ الْمَدِينَةَ فَلَقِيتُ عِتْبَانَ فَقُلْتُ حَدِيثٌ بَلَغَنِي عَنْكَ قَالَ أَصَابَنِي فِي بَصَرِي بَعْضُ الشَّىْءِ فَبَعَثْتُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم أَنِّي أُحِبُّ أَنْ تَأْتِيَنِي فَتُصَلِّيَ فِي مَنْزِلِي فَأَتَّخِذَهُ مُصَلًّى - قَالَ - فَأَتَى النَّبِيُّ صلى الله عليه وسلم وَمَنْ شَاءَ اللَّهُ مِنْ أَصْحَابِهِ فَدَخَلَ وَهُوَ يُصَلِّي فِي مَنْزِلِي وَأَصْحَابُهُ يَتَحَدَّثُونَ بَيْنَهُمْ ثُمَّ أَسْنَدُوا عُظْمَ ذَلِكَ وَكِبْرَهُ إِلَى مَالِكِ بْنِ دُخْشُمٍ قَالُوا وَدُّوا أَنَّهُ دَعَا عَلَيْهِ فَهَلَكَ وَوَدُّوا أَنَّهُ أَصَابَهُ شَرٌّ ‏.‏ فَقَضَى رَسُولُ اللَّهِ صلى الله عليه وسلم الصَّلاَةَ وَقَالَ ‏"‏ أَلَيْسَ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ ‏"‏ ‏.‏ قَالُوا إِنَّهُ يَقُولُ ذَلِكَ وَمَا هُوَ فِي قَلْبِهِ ‏.‏ قَالَ ‏"‏ لاَ يَشْهَدُ أَحَدٌ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ فَيَدْخُلَ النَّارَ أَوْ تَطْعَمَهُ ‏"‏ ‏.‏ قَالَ أَنَسٌ فَأَعْجَبَنِي هَذَا الْحَدِيثُ فَقُلْتُ لاِبْنِي اكْتُبْهُ فَكَتَبَهُ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 14:06:18.256	2025-09-02 11:57:52.284	
cm9vcvuks0009hqn8moq661oh	10	~~Le Prophète ﷺ~~ a dit : « Interrogez moi ».\n\n\nMais ils ont refusé de l’interroger.\n\n\nAlors un homme est venu et s’est assis vers ses genoux et a dit :\n\n Ô ~~Messager~~ d’Allah ! Qu’est ce que l’Islam ?\n\n\n~~Le Prophète ﷺ~~ a dit:\n\n « Tu n’associes rien à Allah, tu accomplis la prière, tu donnes l’aumône obligatoire et tu jeûnes le Ramadan ».\n\n\nL’homme a dit : \n\nTu as dis vrai. Ô ~~Messager d’Allah~~ ! Qu’est ce que la foi ?\n\n\nLe ~~Prophète ﷺ~~ a dit:\n\n « Que tu croies en Allah, en Ses anges, en Son Livre, en Sa rencontre, en Ses Messagers, que tu croies en la résurrection et que tu croies en le destin en entier ».\n\n\nL’homme a dit : Tu as dis vrai. Ô ~~Messager d’Allah~~ ! Qu’est ce que l’ihsan ?\n\n\n~~Le Prophète ﷺ~~ a dit: « Que tu craignes Allah comme si tu Le voyais et si tu ne Le voies pas certes Lui te voit ».\n\nL’homme a dit : \n\nTu as dis vrai.  Ô ~~Messager d’Allah~~ ! Quand aura lieu l’Heure ?\n\n\n~~Le Prophète ﷺ~~ a dit: Le questionné n’en sait pas plus que le questionneur.\n\n\nMais je vais t’informer de ses signes: quand tu verras la femme enfanter son maître ceci fait partie de ses signes.\n\n\nQuand tu verras les gens nus et ne portant pas de souliers, sourds et muets seront les rois de la terre ceci fait partie de ses signes.\n\nQuand tu verras les gardiens de bétails rivaliser dans les constructions, ceci fait partie de ses signes. Il y a cinq choses de l’invisible que seul Allah connaît ».\n\n\nPuis ~~le Prophète ﷺ~~ récita : \n\n*Certes la connaissance de l’Heure est auprès d’Allah, c’est Lui qui descend la pluie et sait ce qu’il y a dans les matrices. Aucune âme ne sait ce qu’elle aura demain et aucune âme ne sait sur quelle terre elle va mourir. Certes Allah est savant et très connaisseur.*\n\n\nPuis l’homme s’est levé et ~~le Prophète ﷺ~~ a dit : « Ramenez-le moi ».\n\n\nIls ont cherché l’homme mais ne l’ont pas trouvé alors ~~le Prophète ﷺ~~ a dit : \n\n« Il s’agissait de Djibril qui a voulu que vous appreniez au moment où vous ne posiez pas de questions . »	عن أبي هريرة رضي الله عنه قال : قال رسول الله صلّى الله عليه وسلّم : سلوني فهابوه أن يسألوه فجاء رجل فجلس عند ركبتيه فقال : يا رسول الله ! ما الإسلام ؟ قال رسول الله صلّى الله عليه وسلّم : لا تشرك بالله شيئًا وتقيم الصلاة وتؤتى الزكاة وتصوم رمضان قال : صدقت يا رسول الله ! ما الإيمان ؟ قال رسول الله صلّى الله عليه وسلّم : أن تؤمن بالله وملائكته وكتابه ولقائه ورسله وتؤمن بالبعث وتؤمن بالقدر كلٌه قال : صدقت يا رسول الله ! ما لإحسان ؟ قال رسول لله صلّى الله عليه وسلّم : أن تخشى الله كأنّك تراه فإنّك إن لا تكن تراه فإنّه يراك قال : صدقت يا رسول الله ! متى تقوم الساعة ؟ قال رسول لله صلّى الله عليه وسلّم : ما المسئول عنها بأعلم من السّائل وسأحدثك عن أشراطها : إذا رأيت المرأة تلد ربها فذاك من أشراطها وإذا رأيت الحفاة العراة الصم البكم ملوك الأرض فذاك من أشراطها وإذا رأيت رعاء البهم يتطاولون في البنيان فذاك من أشراطها في خمس من الغيب لا يعلمهنّ إلاّ الله ثمّ قرأ : إن الله عنده علم السّاعة وينزل الغيث ويعلم ما في الأرحام وما تدري نفس ماذا تكسب غدًا وما تدري نفس بأي أرض تموت إنّ الله عليم خبير ثمّ قام الرجل فقال رسول الله صلّى الله عليه وسلّم : ردّوه عليّ فالتمس فلم يجدوه فقال رسول الله صلى الله عليه وسلم : هذا جبريل أراد أن تعلّموا إذا لم تسألوا	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.948	2025-09-02 11:57:47.673	
cm9vcvul5000bhqn8aztuhpds	12	Nous avions été interdits de poser des questions au ~~Messager d'Allah ﷺ~~.  \n\nAinsi, il nous plaisait qu'un homme intelligent des habitants du désert vienne l'interroger en notre présence, afin que nous puissions écouter ses réponses.\n>\n> Un jour, un homme du désert vint et dit :\n>\n> > « Ô ~~Muhammad~~, ton messager est venu à nous et prétend que tu affirmes qu'Allah t'a envoyé. »\n>\n\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Il a dit vrai. »\n>\n\n> L'homme poursuivit :\n>\n> > « Qui a créé le ciel ? »\n\n>\n>~~Le Prophète ﷺ~~ répondit :\n>\n> > « Allah. »\n\n>\n> L'homme demanda encore :\n>\n> > « Qui a créé la terre ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Allah. »\n\n>\n> L'homme continua :\n>\n> > « Qui a dressé ces montagnes et y a placé ce qui s'y trouve ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Allah. »\n\n>\n> Alors l'homme dit :\n>\n> > « Par Celui qui a créé le ciel, la terre et dressé ces montagnes, est-ce Allah qui t'a réellement envoyé ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Oui. »\n\n>\n> L'homme ajouta :\n>\n> > « Ton messager prétend que cinq prières nous ont été imposées durant le jour et la nuit. »\n\n>\n>~~Le Prophète ﷺ~~ répondit :\n>\n> > « Il a dit vrai. »\n\n>\n> L'homme demanda :\n>\n> > « Par Celui qui t'a envoyé, est-ce Allah qui t'a ordonné cela ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Oui. »\n\n>\n> L'homme continua :\n>\n> > « Ton messager prétend que la Zakat nous est imposée sur nos biens. »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Il a dit vrai. »\n\n>\n> L'homme demanda :\n>\n> > « Par Celui qui t'a envoyé, est-ce Allah qui t'a ordonné cela ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Oui. »\n\n>\n> L'homme poursuivit :\n>\n> > « Ton messager prétend qu'il nous est imposé de jeûner le mois de Ramadan chaque année. »\n\n>\n>~~Le Prophète ﷺ~~ répondit :\n>\n> > « Il a dit vrai. »\n\n>\n> L'homme demanda :\n>\n> > « Par Celui qui t'a envoyé, est-ce Allah qui t'a ordonné cela ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Oui. »\n\n>\n> L'homme ajouta :\n>\n> > « Ton messager prétend que le pèlerinage à la Maison (Ka'bah) est obligatoire pour celui qui en a la capacité. »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Oui. »\n\n>\n> À la fin de cet échange, l'homme déclara :\n>\n> > « Par Celui qui t'a envoyé avec la vérité, je n'ajouterai rien à ces obligations ni n'en diminuerai rien. »\n\n>\n> ~~Le Prophète ﷺ~~ conclut alors :\n>\n> > « S'il est sincère, il entrera au Paradis. »\n	حَدَّثَنِي عَمْرُو بْنُ مُحَمَّدِ بْنِ بُكَيْرٍ النَّاقِدُ، حَدَّثَنَا هَاشِمُ بْنُ الْقَاسِمِ أَبُو النَّضْرِ، حَدَّثَنَا سُلَيْمَانُ بْنُ الْمُغِيرَةِ، عَنْ ثَابِتٍ، عَنْ أَنَسِ بْنِ مَالِكٍ، قَالَ نُهِينَا أَنْ نَسْأَلَ، رَسُولَ اللَّهِ صلى الله عليه وسلم عَنْ شَىْءٍ فَكَانَ يُعْجِبُنَا أَنْ يَجِيءَ الرَّجُلُ مِنْ أَهْلِ الْبَادِيَةِ الْعَاقِلُ فَيَسْأَلَهُ وَنَحْنُ نَسْمَعُ فَجَاءَ رَجُلٌ مِنْ أَهْلِ الْبَادِيَةِ فَقَالَ يَا مُحَمَّدُ أَتَانَا رَسُولُكَ فَزَعَمَ لَنَا أَنَّكَ تَزْعُمُ أَنَّ اللَّهَ أَرْسَلَكَ قَالَ " صَدَقَ " . قَالَ فَمَنْ خَلَقَ السَّمَاءَ قَالَ " اللَّهُ " . قَالَ فَمَنْ خَلَقَ الأَرْضَ قَالَ " اللَّهُ " . قَالَ فَمَنْ نَصَبَ هَذِهِ الْجِبَالَ وَجَعَلَ فِيهَا مَا جَعَلَ . قَالَ " اللَّهُ " . قَالَ فَبِالَّذِي خَلَقَ السَّمَاءَ وَخَلَقَ الأَرْضَ وَنَصَبَ هَذِهِ الْجِبَالَ آللَّهُ أَرْسَلَكَ قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا خَمْسَ صَلَوَاتٍ فِي يَوْمِنَا وَلَيْلَتِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمْرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا زَكَاةً فِي أَمْوَالِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمْرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا صَوْمَ شَهْرِ رَمَضَانَ فِي سَنَتِنَا . قَالَ " صَدَقَ " . قَالَ فَبِالَّذِي أَرْسَلَكَ آللَّهُ أَمَرَكَ بِهَذَا قَالَ " نَعَمْ " . قَالَ وَزَعَمَ رَسُولُكَ أَنَّ عَلَيْنَا حَجَّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلاً . قَالَ " صَدَقَ " . قَالَ ثُمَّ وَلَّى . قَالَ وَالَّذِي بَعَثَكَ بِالْحَقِّ لاَ أَزِيدُ عَلَيْهِنَّ وَلاَ أَنْقُصُ مِنْهُنَّ . فَقَالَ النَّبِيُّ صلى الله عليه وسلم " لَئِنْ صَدَقَ لَيَدْخُلَنَّ الْجَنَّةَ " .	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.962	2025-09-02 11:57:48.038	
cm9vcvum4000ghqn8u7mjsg77	17	~~Le Prophète ﷺ~~ a dit à **Al-Ashajj** de la tribu de ‘Abd al-Qays : \n\n« Tu possèdes deux qualités qu’Allah aime : la douceur et la patience. »	عن عبدالله بن عباس رضي الله عنهما قال النبي صلى الله عليه و سلم للأشج عبد القيس رضي الله عنه : إن فيك خصلتين يحبهما الله : الحلم والأناة	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.996	2025-09-02 11:57:49.068	
cmb0ye7b40005hqg86arxqv0k	36	**Salim** rapporte d’après son père (**Abdallah ibn Omar**) que le ~~Prophète ﷺ~~ entendit un homme réprimander son frère au sujet de la pudeur, alors le ~~Prophète ﷺ~~ dit :\n\n\n« La pudeur fait partie de la foi. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَعَمْرٌو النَّاقِدُ، وَزُهَيْرُ بْنُ حَرْبٍ، قَالُوا حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ، عَنِ الزُّهْرِيِّ، عَنْ سَالِمٍ، عَنْ أَبِيهِ، سَمِعَ النَّبِيُّ صلى الله عليه وسلم رَجُلاً يَعِظُ أَخَاهُ فِي الْحَيَاءِ فَقَالَ ‏ "‏ الْحَيَاءُ مِنَ الإِيمَانِ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 15:26:25.408	2025-09-02 11:57:52.911	
cm9vcvulp000ehqn8q8dy47l4	15	**Nu‘mān ibn Qawqal** vint trouver ~~le Prophète ﷺ~~ et dit : \n« Si j’accomplis les prières obligatoires, que je m’éloigne de ce qui est interdit, et que je considère licite ce qu’Allah a rendu licite, entrerai-je au Paradis ? » \n\n~~Le Prophète ﷺ~~ répondit par l’affirmative."	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ - وَاللَّفْظُ لأَبِي كُرَيْبٍ - قَالاَ حَدَّثَنَا أَبُو مُعَاوِيَةَ، عَنِ الأَعْمَشِ، عَنْ أَبِي سُفْيَانَ، عَنْ جَابِرٍ، قَالَ أَتَى النَّبِيَّ صلى الله عليه وسلم النُّعْمَانُ بْنُ قَوْقَلٍ فَقَالَ يَا رَسُولَ اللَّهِ أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَةَ وَحَرَّمْتُ الْحَرَامَ وَأَحْلَلْتُ الْحَلاَلَ أَأَدْخُلُ الْجَنَّةَ فَقَالَ النَّبِيُّ صلى الله عليه وسلم ‏ "‏ نَعَمْ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.982	2025-09-02 11:57:48.668	
cm9vcvulx000fhqn8ve4wdu02	16	~~Le Prophète ﷺ~~ a dit: \n\n« L’Islam est bâti sur cinq choses: \n\n- Sur le fait d’unifier Allah, \n- d’accomplir la prière, \n- de s’acquitter de la zakat, \n- de jeûner le Ramadan \n- et de faire le pèlerinage ».	عن عبدالله بن عمر رضي الله عنهما قال النّبي صلّى الله عليه و سلّم : بُنِيَ الإسلامُ على خمسةٍ : على أن يُوَحَّدَ اللهُ وإقامِ الصلاةِ وإيتاءِ الزكاةِ وصيامِ رمضانَ والحجِّ	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.99	2025-09-02 11:57:48.851	
cm9vcvumc000hhqn851z82svi	19	~~Le Messager d'Allah ﷺ~~ m'a envoyé en mission en disant : \n\n« Tu vas rencontrer un peuple parmi les gens du Livre. Invite-les à témoigner qu'il n'y a de divinité qu'Allah et que ~~Muhammad est le Messager d'Allah~~. \n\nS'ils obéissent à cela, informe-les qu'Allah leur a imposé cinq prières à accomplir chaque jour et chaque nuit. \n\nS'ils obéissent à cela, informe-les qu'Allah leur a imposé de prendre la zakat de leurs riches pour la redistribuer à leurs pauvres. \n\nS'ils obéissent à cela, fais attention à ne pas prendre les meilleurs de leurs biens. Et prends garde à l'invocation du lésé, car il n'y a pas d'intermédiaire entre elle et Allah. »\n\n	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ جَمِيعًا عَنْ وَكِيعٍ، - قَالَ أَبُو بَكْرٍ حَدَّثَنَا وَكِيعٌ، - عَنْ زَكَرِيَّاءَ بْنِ إِسْحَاقَ، قَالَ حَدَّثَنِي يَحْيَى بْنُ عَبْدِ اللَّهِ بْنِ صَيْفِيٍّ، عَنْ أَبِي مَعْبَدٍ، عَنِ ابْنِ عَبَّاسٍ، عَنْ مُعَاذِ بْنِ جَبَلٍ، - قَالَ أَبُو بَكْرٍ رُبَّمَا قَالَ وَكِيعٌ عَنِ ابْنِ عَبَّاسٍ، أَنَّ مُعَاذًا، - قَالَ بَعَثَنِي رَسُولُ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ إِنَّكَ تَأْتِي قَوْمًا مِنْ أَهْلِ الْكِتَابِ ‏.‏ فَادْعُهُمْ إِلَى شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ خَمْسَ صَلَوَاتٍ فِي كُلِّ يَوْمٍ وَلَيْلَةٍ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ صَدَقَةً تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ فَتُرَدُّ فِي فُقَرَائِهِمْ فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَإِيَّاكَ وَكَرَائِمَ أَمْوَالِهِمْ وَاتَّقِ دَعْوَةَ الْمَظْلُومِ فَإِنَّهُ لَيْسَ بَيْنَهَا وَبَيْنَ اللَّهِ حِجَابٌ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.005	2025-09-02 11:57:49.435	
cm9vcvund000mhqn8fxpvxmvm	24	Au moment de la mort de **Abou Talib**, le ~~Prophète ﷺ~~ a trouvé auprès de lui **Abou Jahl** et **Abdallah Ibn Abi Oumaya Ibn Al Moughira**.\n\n\n~~Le Prophète ﷺ~~ a dit : « Ô mon oncle ! Dis : -La Ilaha Illa Allah- ; c’est une parole par laquelle je témoignerai pour toi auprès d’Allah ».\n\n\nAlors **Abou Jahl** et **‘Abdallah Ibn Abi Oumaya** ont dit : \n\nÔ **Abou Talib** ! Vas-tu t’écarter de la voie de ‘Abdel Moutalib ?\n\n\n~~Le Prophète ﷺ~~ n’a cessé de lui présenter cette parole et de lui répéter cette phrase jusqu’à ce que la dernière chose que **Abou Talib** ai dit est qu’il est sur la voie de ‘Abdel Moutalib et il a refuser de dire -La Ilaha Illa Allah-.\n\n\nAlors le ~~Prophète ﷺ~~ a dit : Par Allah ! Je vais certes demander le pardon pour toi tant qu’on ne me l’aura pas interdit.\n\n\nAllah a donc révélé : \n"Il n’appartient pas au Prophète et aux croyants de demander le pardon pour les associateurs même s’ils font partie de leurs proches après qu’il leur soit devenu clair qu’ils font partie des gens de la géhenne".\n\n\nEt Allah a révélé au ~~Prophète ﷺ~~ concernant **Abou Talib** : \n\n"Certes tu ne guides pas ceux que tu aimes mais Allah guide qui Il veut et Il est plus connaisseur des biens-guidés".	عن المسيب بن حزن قال : لما حضر أبا طالب الوفاة جاء رسول الله صلى الله عليه وسلم فوجد عنده أبا جهل وعبد الله بن أبي أمية بن المغيرة\nفقال رسول الله صلى الله عليه وسلم : يا عم ! قل : لا إله إلا الله كلمة أشهد لك بها عند الله\nفقال أبو جهل وعبدالله بن أبي أمية : يا أبا طالب ! أترغب عن ملة عبدالمطلب ؟\nفلم يزل رسول الله صلى الله عليه وسلم يعرضها عليه ويعيد له تلك المقالة حتى قال أبو طالب آخر ما كلمهم : هو على ملة عبدالمطلب وأبي أن يقول : لا إله إلا الله\nفقال رسول الله صلى الله عليه وسلم : أما والله ! لأستغفرن لك ما لم أنه عنه\nفأنزل الله : ما كان للنبي والذين آمنوا أن يستغفروا للمشركين ولو كانوا أولي قربى من بعد ما تبين لهم أنهم أصحاب الجحيم\nوأنزل الله في أبي طالب فقال لرسول الله صلى الله عليه وسلم : إنك لا تهدي من أحببت ولكن الله يهدي من يشاء وهو أعلم بالمهتدين 	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.041	2025-09-02 11:57:50.489	
cm9vcvumr000jhqn8fvx6viad	21	~~Le Messager d’Allah ﷺ~~ a dit :\n\n« Il m’a été ordonné de combattre les gens jusqu’à ce qu’ils témoignent qu’il n’y a de divinité qu’Allah. Celui qui professe cela voit sa vie et ses biens protégés de ma part, sauf pour ce qui est dû en droit. Quant à son jugement final, il appartient à Allah. »	وَحَدَّثَنَا أَبُو الطَّاهِرِ، وَحَرْمَلَةُ بْنُ يَحْيَى، وَأَحْمَدُ بْنُ عِيسَى، قَالَ أَحْمَدُ حَدَّثَنَا وَقَالَ الآخَرَانِ، أَخْبَرَنَا ابْنُ وَهْبٍ، قَالَ أَخْبَرَنِي يُونُسُ، عَنِ ابْنِ شِهَابٍ، قَالَ حَدَّثَنِي سَعِيدُ بْنُ الْمُسَيَّبِ، أَنَّ أَبَا هُرَيْرَةَ، أَخْبَرَهُ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَقُولُوا لاَ إِلَهَ إِلاَّ اللَّهُ فَمَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ عَصَمَ مِنِّي مَالَهُ وَنَفْسَهُ إِلاَّ بِحَقِّهِ وَحِسَابُهُ عَلَى اللَّهِ ‏"‏ ‏.‏	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.019	2025-09-02 11:57:49.878	
cm9vcvun5000lhqn8kcscvvd2	23	~~Le Prophète ﷺ~~ a dit:\n\n« Celui qui unifie Allah et mécroit dans ce qui est adoré en dehors d’Allah alors son argent et son sang sont interdits et son jugement incombe à Allah ».	عن طارق بن أشيم رضي الله عنه قال النّبي صلّى الله عليه و سلّم : مَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ وَكَفَرَ بِمَا يُعْبَدُ مِنْ دُونِ اللَّهِ حَرُمَ مَالُهُ وَدَمُهُ وَحِسَابُهُ عَلَى اللَّهِ	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.033	2025-09-02 11:57:50.291	
cm9vcvunz000ohqn8ianfgh36	26	~~Le Messager d’Allah ﷺ~~ a dit :\n\n« Celui qui meurt sachant (de manière complète) qu’il n’y a de dieu qu’Allah, il entrera au Paradis. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَزُهَيْرُ بْنُ حَرْبٍ، كِلاَهُمَا عَنْ إِسْمَاعِيلَ بْنِ إِبْرَاهِيمَ، - قَالَ أَبُو بَكْرٍ حَدَّثَنَا ابْنُ عُلَيَّةَ، - عَنْ خَالِدٍ، قَالَ حَدَّثَنِي الْوَلِيدُ بْنُ مُسْلِمٍ، عَنْ حُمْرَانَ، عَنْ عُثْمَانَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لاَ إِلَهَ إِلاَّ اللَّهُ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.064	2025-09-02 11:57:50.893	
cm9vcvuot000qhqn8kvk0wcxv	28	Le ~~Messager d’Allah ﷺ~~ a dit :\n\n« Celui qui dit :\n“Il n’y a de divinité qu’Allah, Lui Seul sans associé,\n\n\n~~Muhammad~~ est Son serviteur et Son messager,\n\n\nJésus est le serviteur d’Allah, le fils de Sa servante,\n\n\nSa parole qu’Il a jetée en Maryam (Marie), et un esprit venant de Lui,\n\n\nle Paradis est vérité,\n\n\net l’Enfer est vérité”,\n\n\nAllah lui ouvrira les huit portes du Paradis, et il y entrera par celle qu’il voudra. »	حَدَّثَنَا دَاوُدُ بْنُ رُشَيْدٍ، حَدَّثَنَا الْوَلِيدُ، - يَعْنِي ابْنَ مُسْلِمٍ - عَنِ ابْنِ جَابِرٍ، قَالَ حَدَّثَنِي عُمَيْرُ بْنُ هَانِئٍ، قَالَ حَدَّثَنِي جُنَادَةُ بْنُ أَبِي أُمَيَّةَ، حَدَّثَنَا عُبَادَةُ بْنُ الصَّامِتِ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ قَالَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ وَأَنَّ عِيسَى عَبْدُ اللَّهِ وَابْنُ أَمَتِهِ وَكَلِمَتُهُ أَلْقَاهَا إِلَى مَرْيَمَ وَرُوحٌ مِنْهُ وَأَنَّ الْجَنَّةَ حَقٌّ وَأَنَّ النَّارَ حَقٌّ أَدْخَلَهُ اللَّهُ مِنْ أَىِّ أَبْوَابِ الْجَنَّةِ الثَّمَانِيَةِ شَاءَ ‏"‏ ‏.‏	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.093	2025-09-02 11:57:51.295	
cmb0xs1ro0002hqg8a296gymo	34	~~Le Messager d'Allah ﷺ~~ a dit:\n\nA goûté à la douceur de la foi celui qui est satisfait d’Allah comme Seigneur, de l’Islam comme religion, et de ~~Muhammad ﷺ~~ comme Prophète.	حَدَّثَنَا مُحَمَّدُ بْنُ يَحْيَى بْنِ أَبِي عُمَرَ الْمَكِّيُّ، وَبِشْرُ بْنُ الْحَكَمِ، قَالاَ حَدَّثَنَا عَبْدُ الْعَزِيزِ، - وَهُوَ ابْنُ مُحَمَّدٍ - الدَّرَاوَرْدِيُّ عَنْ يَزِيدَ بْنِ الْهَادِ، عَنْ مُحَمَّدِ بْنِ إِبْرَاهِيمَ، عَنْ عَامِرِ بْنِ سَعْدٍ، عَنِ الْعَبَّاسِ بْنِ عَبْدِ الْمُطَّلِبِ، أَنَّهُ سَمِعَ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ ذَاقَ طَعْمَ الإِيمَانِ مَنْ رَضِيَ بِاللَّهِ رَبًّا وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ رَسُولاً ‏"‏ ‏‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 15:09:11.796	2025-09-02 11:57:52.489	
cmazl1jyc0007hqdc7i58ownw	32	~~Le Prophète d’Allah ﷺ~~ s’adressa à **Muadh ibn Jabal** alors que ce dernier était derrière lui sur la monture. Il l’interpela :\n\n— « Ô **Muadh** ! »\n\nIl répondit :\n\n— « À ton service et à ton obéissance, ô ~~Messager d’Allah~~. »\n\n~~Le Prophète ﷺ~~ l’appela de nouveau :\n\n— « Ô  **Muadh** ! »\n\nIl répondit :\n\n— « À ton service et à ton obéissance. »\n\n~~Le Prophète ﷺ~~ l’appela une troisième fois :\n\n— « Ô  **Muadh** ! »\n\nIl répondit :\n\n— « À ton service et à ton obéissance, ô ~~Messager d’Allah~~. »\n\n~~Le Prophète ﷺ~~ dit alors :\n\n*« Quiconque témoigne sincèrement, du fond de son cœur, qu’il n’y a de divinité digne d’adoration qu’Allah et que ~~Muhammad~~ est Son serviteur et Son Messager, Allah le préservera du Feu (de l’Enfer). »*\n\n **Muadh** demanda :\n\n— « Ô ~~Messager d’Allah~~, ne devrais-je pas en informer les gens afin qu’ils se réjouissent ? »\n\n~~Le Prophète ﷺ~~ répondit :\n\n— « Ils s’y fieraient alors uniquement (et délaisseraient les œuvres). »\n\n **Muadh** ne transmit ce hadith qu’au moment de sa mort, par crainte de commettre un péché.	حَدَّثَنَا إِسْحَاقُ بْنُ مَنْصُورٍ، أَخْبَرَنَا مُعَاذُ بْنُ هِشَامٍ، قَالَ حَدَّثَنِي أَبِي، عَنْ قَتَادَةَ، قَالَ حَدَّثَنَا أَنَسُ بْنُ مَالِكٍ، أَنَّ نَبِيَّ اللَّهِ صلى الله عليه وسلم وَمُعَاذُ بْنُ جَبَلٍ رَدِيفُهُ عَلَى الرَّحْلِ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ يَا مُعَاذُ ‏"‏ ‏.‏ قَالَ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ مَا مِنْ عَبْدٍ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ إِلاَّ حَرَّمَهُ اللَّهُ عَلَى النَّارِ ‏"‏ ‏.‏ قَالَ يَا رَسُولَ اللَّهِ أَفَلاَ أُخْبِرُ بِهَا النَّاسَ فَيَسْتَبْشِرُوا قَالَ ‏"‏ إِذًا يَتَّكِلُوا ‏"‏ فَأَخْبَرَ بِهَا مُعَاذٌ عِنْدَ مَوْتِهِ تَأَثُّمًا	cm9vcp9lp0001hq6gin9xjo72	2025-05-22 16:24:54.085	2025-09-02 11:57:52.079	
cmb0xzika0003hqg87ovjjqpi	35	Le ~~Prophète ﷺ~~ a dit: \n\nLa foi (îmân) comporte plus de soixante-dix branches — ou plus de soixante —, et la pudeur (al-ḥayâ') est une branche de la foi.	حَدَّثَنَا عُبَيْدُ اللَّهِ بْنُ سَعِيدٍ، وَعَبْدُ بْنُ حُمَيْدٍ، قَالاَ حَدَّثَنَا أَبُو عَامِرٍ الْعَقَدِيُّ، حَدَّثَنَا سُلَيْمَانُ بْنُ بِلاَلٍ، عَنْ عَبْدِ اللَّهِ بْنِ دِينَارٍ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ ‏"‏	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 15:15:00.154	2025-09-02 11:57:52.679	
cmb3krc4d0004hqskrqdesp2f	42	« J’ai dit : Ô ~~Messager d’Allah~~, quelle est la meilleure [forme] d’islam ? »\n\nLe ~~Prophète~~ répondit :\n« Celui dont les musulmans sont à l’abri de la langue et de la main. »	وَحَدَّثَنِي سَعِيدُ بْنُ يَحْيَى بْنِ سَعِيدٍ الأُمَوِيُّ، قَالَ حَدَّثَنِي أَبِي، حَدَّثَنَا أَبُو بُرْدَةَ بْنُ عَبْدِ اللَّهِ بْنِ أَبِي بُرْدَةَ بْنِ أَبِي مُوسَى، عَنْ أَبِي بُرْدَةَ، عَنْ أَبِي مُوسَى، قَالَ قُلْتُ يَا رَسُولَ اللَّهِ أَىُّ الإِسْلاَمِ أَفْضَلُ قَالَ ‏ "‏ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:28:02.078	2025-09-02 11:57:54.039	
cmb0yqwrp000bhqg8iyahp2de	38	J’ai demandé au ~~Messager d’Allah~~ de me dire quelque chose sur l’Islam qui puisse me dispenser de devoir poser la même question à quelqu’un d’autre après toi. »\n\nDans le hadith d’Abu ‘Usama, les mots sont : « autre que toi ».\n\nIl (~~le Prophète ﷺ)~~ a répondu :\n\n« Dis : J’affirme ma foi en Allah, puis tiens-toi fermement à cela. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَأَبُو كُرَيْبٍ قَالاَ حَدَّثَنَا ابْنُ نُمَيْرٍ، ح وَحَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ، جَمِيعًا عَنْ جَرِيرٍ، ح وَحَدَّثَنَا أَبُو كُرَيْبٍ، حَدَّثَنَا أَبُو أُسَامَةَ، كُلُّهُمْ عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ سُفْيَانَ بْنِ عَبْدِ اللَّهِ الثَّقَفِيِّ، قَالَ قُلْتُ يَا رَسُولَ اللَّهِ قُلْ لِي فِي الإِسْلاَمِ قَوْلاً لاَ أَسْأَلُ عَنْهُ أَحَدًا بَعْدَكَ - وَفِي حَدِيثِ أَبِي أُسَامَةَ غَيْرَكَ - قَالَ ‏ "‏ قُلْ آمَنْتُ بِاللَّهِ فَاسْتَقِمْ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 15:36:18.277	2025-09-02 11:57:53.296	
cmb2iaazo0001hqskn0dn3arw	40	Un homme demanda au ~~Messager d’Allah ﷺ~~  :\n\n— "Quel est le meilleur des musulmans ?"\n\nLe ~~Prophète ﷺ~~  répondit :\n\n— "Celui dont les musulmans sont à l’abri de la langue et de la main."	وَحَدَّثَنَا أَبُو الطَّاهِرِ، أَحْمَدُ بْنُ عَمْرِو بْنِ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ سَرْحٍ الْمِصْرِيُّ أَخْبَرَنَا ابْنُ وَهْبٍ، عَنْ عَمْرِو بْنِ الْحَارِثِ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، أَنَّهُ سَمِعَ عَبْدَ اللَّهِ بْنَ عَمْرِو بْنِ الْعَاصِ، يَقُولُ إِنَّ رَجُلاً سَأَلَ رَسُولَ اللَّهِ صلى الله عليه وسلم أَىُّ الْمُسْلِمِينَ خَيْرٌ قَالَ ‏ "‏ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"‏ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-24 17:31:02.053	2025-09-02 11:57:53.668	
cmb3knjnh0002hqskaqxkr3pw	41	Le ~~Messager d’Allah~~  ~~ﷺ~~ a dit:\n\n— « Le musulman est celui dont les musulmans sont à l’abri de la langue et de la main. »	حَدَّثَنَا حَسَنٌ الْحُلْوَانِيُّ، وَعَبْدُ بْنُ حُمَيْدٍ، جَمِيعًا عَنْ أَبِي عَاصِمٍ، - قَالَ عَبْدٌ أَنْبَأَنَا أَبُو عَاصِمٍ، - عَنِ ابْنِ جُرَيْجٍ، أَنَّهُ سَمِعَ أَبَا الزُّبَيْرِ، يَقُولُ سَمِعْتُ جَابِرًا، يَقُولُ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقُولُ ‏ "‏ الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ ‏"‏ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:25:05.213	2025-09-02 11:57:53.854	
cmb3lbh7a0008hqskkypyzizt	46	Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :\n\n« N’entrera pas au Paradis celui dont le voisin n’est pas à l’abri de ses nuisances. »	حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، وَقُتَيْبَةُ بْنُ سَعِيدٍ، وَعَلِيُّ بْنُ حُجْرٍ، جَمِيعًا عَنْ إِسْمَاعِيلَ بْنِ جَعْفَرٍ، - قَالَ ابْنُ أَيُّوبَ حَدَّثَنَا إِسْمَاعِيلُ، - قَالَ أَخْبَرَنِي الْعَلاَءُ، عَنْ أَبِيهِ، عَنْ أَبِي هُرَيْرَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ لاَ يَدْخُلُ الْجَنَّةَ مَنْ لاَ يَأْمَنُ جَارُهُ بَوَائِقَهُ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:43:41.783	2025-09-02 11:57:54.825	
cmb3kv5rq0006hqskrd1g4u7u	44	Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :\n\n« Aucun serviteur (ou homme, selon une variante) ne croit véritablement tant que je ne suis pas plus aimé de lui que sa famille, sa richesse et tous les gens. »	وَحَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا إِسْمَاعِيلُ ابْنُ عُلَيَّةَ، ح وَحَدَّثَنَا شَيْبَانُ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا عَبْدُ الْوَارِثِ، كِلاَهُمَا عَنْ عَبْدِ الْعَزِيزِ، عَنْ أَنَسٍ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ لاَ يُؤْمِنُ عَبْدٌ - وَفِي حَدِيثِ عَبْدِ الْوَارِثِ الرَّجُلُ - حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ أَهْلِهِ وَمَالِهِ وَالنَّاسِ أَجْمَعِينَ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:31:00.471	2025-09-02 11:57:54.431	
cmb3kyjf70007hqsk8wfh2dy8	45	Le ~~Prophète~~ ~~ﷺ~~ a dit :\n\n« Aucun de vous ne croit véritablement tant qu’il n’aime pas pour son frère — ou il a dit : pour son voisin — ce qu’il aime pour lui-même. »	حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، قَالَ سَمِعْتُ قَتَادَةَ، يُحَدِّثُ عَنْ أَنَسِ بْنِ مَالِكٍ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ - أَوْ قَالَ لِجَارِهِ - مَا يُحِبُّ لِنَفْسِهِ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:33:38.131	2025-09-02 11:57:54.61	
cmb3lj9cs0009hqskah3xh5bo	47	Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :\n\n« Que celui qui croit en Allah et au Jour dernier dise du bien ou qu’il se taise ;\n\net que celui qui croit en Allah et au Jour dernier honore son voisin ;\n\net que celui qui croit en Allah et au Jour dernier honore son invité. »	حَدَّثَنِي حَرْمَلَةُ بْنُ يَحْيَى، أَنْبَأَنَا ابْنُ وَهْبٍ، قَالَ أَخْبَرَنِي يُونُسُ، عَنِ ابْنِ شِهَابٍ، عَنْ أَبِي سَلَمَةَ بْنِ عَبْدِ الرَّحْمَنِ، عَنْ أَبِي هُرَيْرَةَ، عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:49:44.86	2025-09-02 11:57:55.052	
cmb3mumlk000ihqsk691111jb	51	Le ~~Messager d’Allah~~ ~~ﷺ~~ montra le Yémen de la main et dit :\n\n« En vérité, la foi est vers ce côté, et la dureté et l’endurcissement des cœurs se trouvent chez les gens rudes qui conduisent leurs chameaux par la queue, vers l’endroit d’où émergent les deux cornes de Satan, ce sont les tribus de Rabi’a et Mudar. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو أُسَامَةَ، ح وَحَدَّثَنَا ابْنُ نُمَيْرٍ، حَدَّثَنَا أَبِي ح، وَحَدَّثَنَا أَبُو كُرَيْبٍ، حَدَّثَنَا ابْنُ إِدْرِيسَ، كُلُّهُمْ عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، ح وَحَدَّثَنَا يَحْيَى بْنُ حَبِيبٍ الْحَارِثِيُّ، - وَاللَّفْظُ لَهُ - حَدَّثَنَا مُعْتَمِرٌ، عَنْ إِسْمَاعِيلَ، قَالَ سَمِعْتُ قَيْسًا، يَرْوِي عَنْ أَبِي مَسْعُودٍ، قَالَ أَشَارَ النَّبِيُّ صلى الله عليه وسلم بِيَدِهِ نَحْوَ الْيَمَنِ فَقَالَ ‏ "‏ أَلاَ إِنَّ الإِيمَانَ هَا هُنَا وَإِنَّ الْقَسْوَةَ وَغِلَظَ الْقُلُوبِ فِي الْفَدَّادِينَ عِنْدَ أُصُولِ أَذْنَابِ الإِبِلِ حَيْثُ يَطْلُعُ قَرْنَا الشَّيْطَانِ فِي رَبِيعَةَ وَمُضَرَ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 12:26:34.857	2025-09-02 11:57:55.85	
cmb5a6ukx0000hqawcrt4uenn	52	Le ~~Messager d’Allah~~ a dit :\n\n« Les gens du Yémen sont venus. Ils ont les cœurs tendres. La foi est yéménite, la compréhension est yéménite, et la sagesse est yéménite. »	حَدَّثَنَا أَبُو الرَّبِيعِ الزَّهْرَانِيُّ، أَنْبَأَنَا حَمَّادٌ، حَدَّثَنَا أَيُّوبُ، حَدَّثَنَا مُحَمَّدٌ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ جَاءَ أَهْلُ الْيَمَنِ هُمْ أَرَقُّ أَفْئِدَةً الإِيمَانُ يَمَانٍ وَالْفِقْهُ يَمَانٍ وَالْحِكْمَةُ يَمَانِيَةٌ ‏"‏ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-26 16:07:42.416	2025-09-02 11:57:56.057	
cmb5a9pj40002hqaw7eg5wxwn	54	Le ~~Messager d’Allah~~ ~~ﷺ~~ a dit :\n\n« Vous n’entrerez pas au Paradis tant que vous ne croirez pas, et vous ne croirez pas tant que vous ne vous aimerez pas les uns les autres.\n\n Ne vous indiquerai-je pas une chose que si vous la faites, vous vous aimerez ? \n\nPropagez le salut entre vous : as-salamu ‘alaykum. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو مُعَاوِيَةَ، وَوَكِيعٌ، عَنِ الأَعْمَشِ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ لاَ تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا وَلاَ تُؤْمِنُوا حَتَّى تَحَابُّوا ‏.‏ أَوَلاَ أَدُلُّكُمْ عَلَى شَىْءٍ إِذَا فَعَلْتُمُوهُ تَحَابَبْتُمْ أَفْشُوا السَّلاَمَ بَيْنَكُمْ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-26 16:09:55.841	2025-09-02 11:57:56.472	
cm9vcvuja0001hqn8yr3a7oqa	2	En effet, ce qui m'empêche de vous rapporter un grand nombre de Hadith, c'est que le ~~Messager d'Allah ﷺ~~, a dit : \n\n"Celui qui a l'intention de mentir à mon sujet, qu'il prépare sa place en Enfer."	 وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا غُنْدَرٌ، عَنْ شُعْبَةَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ مَنْصُورٍ، عَنْ رِبْعِيِّ بْنِ حِرَاشٍ، أَنَّهُ سَمِعَ عَلِيًّا، - رضى الله عنه - يَخْطُبُ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم  " لاَ تَكْذِبُوا عَلَىَّ فَإِنَّهُ مَنْ يَكْذِبْ عَلَىَّ يَلِجِ النَّارَ " .	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.894	2025-09-02 11:57:45.949	
cm9vcvuiw0000hqn8w2a0yrxq	1	~~L'Envoyé d'Allah ﷺ~~ dit: \n\nNe m'attribuez pas des paroles mensongères ! \n\nCertes, quiconque le fait, ira en Enfer.	وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا غُنْدَرٌ، عَنْ شُعْبَةَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَابْنُ، بَشَّارٍ قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ مَنْصُورٍ، عَنْ رِبْعِيِّ بْنِ حِرَاشٍ، أَنَّهُ سَمِعَ عَلِيًّا، - رضى الله عنه - يَخْطُبُ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم  " لاَ تَكْذِبُوا عَلَىَّ فَإِنَّهُ مَنْ يَكْذِبْ عَلَىَّ يَلِجِ النَّارَ " 	cm9vcp9lp0000hq6graltfp9h	2025-04-24 12:45:43.881	2025-09-02 11:57:45.671	
cm9vcvukz000ahqn8ryl15s48	11	Un homme, originaire du Najd, aux cheveux ébouriffés, vint voir ~~le Messager d'Allah ﷺ~~.  \n\nNous entendions le bourdonnement de sa voix sans comprendre ce qu’il disait, jusqu’à ce qu’il s’approche du ~~Messager d’Allah ﷺ~~.\n>\n> Il s’avéra qu’il posait des questions concernant l’Islam.\n\n>\n> ~~Le Messager d’Allah ﷺ~~ répondit :\n>\n> > « Cinq prières durant le jour et la nuit. »\n\n>\n> L’homme demanda :\n>\n> > « Suis-je obligé d’en accomplir d’autres que celles-ci ? »\n\n>\n> ~~Le Prophète ﷺ~~ dit :\n>\n> > « Non, sauf si tu accomplis des prières surérogatoires. »\n>\n\n> Puis il ajouta :\n>\n> > « Et le jeûne du mois de Ramadan. »\n>\n> L’homme demanda :\n>\n> > « Suis-je obligé de jeûner autre chose que cela ? »\n\n>\n> ~~Le Prophète ﷺ~~ répondit :\n>\n> > « Non, sauf si tu jeûnes volontairement. »\n\n>\n> Ensuite, ~~le Prophète ﷺ~~ lui parla de la Zakat.\n\n>\n> L’homme demanda :\n>\n> > « Suis-je obligé de donner autre chose que cela ? »\n\n>\n>~~Le Prophète ﷺ~~ répondit :\n>\n> > « Non, sauf si tu donnes volontairement. »\n\n>\n> Alors l’homme s’éloigna en disant :\n>\n> > « Par Allah, je n’ajouterai rien à cela et je n’en diminuerai rien. »\n\n>\n> ~~Le Messager d’Allah ﷺ~~ dit alors :\n>\n> > « Il réussira s’il est sincère. »\n	حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدِ بْنِ جَمِيلِ بْنِ طَرِيفِ بْنِ عَبْدِ اللَّهِ الثَّقَفِيُّ، عَنْ مَالِكِ بْنِ أَنَسٍ، - فِيمَا قُرِئَ عَلَيْهِ - عَنْ أَبِي سُهَيْلٍ، عَنْ أَبِيهِ، أَنَّهُ سَمِعَ طَلْحَةَ بْنَ عُبَيْدِ اللَّهِ، يَقُولُ جَاءَ رَجُلٌ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم مِنْ أَهْلِ نَجْدٍ ثَائِرُ الرَّأْسِ نَسْمَعُ دَوِيَّ صَوْتِهِ وَلاَ نَفْقَهُ مَا يَقُولُ حَتَّى دَنَا مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم فَإِذَا هُوَ يَسْأَلُ عَنِ الإِسْلاَمِ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم " خَمْسُ صَلَوَاتٍ فِي الْيَوْمِ وَاللَّيْلَةِ " . فَقَالَ هَلْ عَلَىَّ غَيْرُهُنَّ قَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ وَصِيَامُ شَهْرِ رَمَضَانَ " . فَقَالَ هَلْ عَلَىَّ غَيْرُهُ فَقَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ " . وَذَكَرَ لَهُ رَسُولُ اللَّهِ صلى الله عليه وسلم الزَّكَاةَ فَقَالَ هَلْ عَلَىَّ غَيْرُهَا قَالَ " لاَ . إِلاَّ أَنْ تَطَّوَّعَ " قَالَ فَأَدْبَرَ الرَّجُلُ وَهُوَ يَقُولُ وَاللَّهِ لاَ أَزِيدُ عَلَى هَذَا وَلاَ أَنْقُصُ مِنْهُ . فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم " أَفْلَحَ إِنْ صَدَقَ " .	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.956	2025-09-02 11:57:47.859	
cmb5dn2un0001hqcgcmvjwysx	56	« J’ai prêté allégeance au ~~Messager d’Allah~~ ~~ﷺ~~ pour l’accomplissement de la prière, le paiement de la zakat, et la sincérité et le bon conseil envers tout musulman. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا عَبْدُ اللَّهِ بْنُ نُمَيْرٍ، وَأَبُو أُسَامَةَ عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، عَنْ قَيْسٍ، عَنْ جَرِيرٍ، قَالَ بَايَعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم عَلَى إِقَامِ الصَّلاَةِ وَإِيتَاءِ الزَّكَاةِ وَالنُّصْحِ لِكُلِّ مُسْلِمٍ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-26 17:44:18.479	2025-09-02 11:57:56.891	
cm9vcx8zt0000hqykm0dx0n87	18	Des gens de la tribu de `Abd al-Qays vinrent au ~~Prophète ﷺ~~ et dirent :\n\n« Ô ~~Messager d’Allah~~, nous sommes d’un groupe de Rabīʿa, et entre toi et nous il y a les mécréants de Mudar. Nous ne pouvons venir à toi qu’au cours des mois sacrés. Ordonne-nous donc quelque chose que nous transmettrons à ceux que nous avons laissés derrière nous et par lequel nous entrerons au Paradis si nous nous y conformons. »\n\nLe ~~Messager d’Allah ﷺ~~ dit :\n\n« Je vous ordonne quatre choses et je vous interdis quatre choses :\n\n-  -Adorez Allah sans rien Lui associer,\n-  -Accomplissez la prière,\n-  -Acquittez la zakat,\n-  -Jeûnez le mois de Ramadan,\n-  -Et donnez le cinquième (khums) du butin.\n\nJe vous interdis quatre choses :\n\n- -Ne consommez pas du dubba' (récipient fait de gourde),\n- -Ni du hantaam (récipient fait de bois),\n- -Ni du muzaffat (récipient de métal)\n- -Ni du naqeér (récipient où vous faites un petit trou pour y verser un liquide).	حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، حَدَّثَنَا ابْنُ عُلَيَّةَ، حَدَّثَنَا سَعِيدُ بْنُ أَبِي عَرُوبَةَ، عَنْ قَتَادَةَ، قَالَ حَدَّثَنَا مَنْ، لَقِيَ الْوَفْدَ الَّذِينَ قَدِمُوا عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم مِنْ عَبْدِ الْقَيْسِ ‏.‏ قَالَ سَعِيدٌ وَذَكَرَ قَتَادَةُ أَبَا نَضْرَةَ عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ فِي حَدِيثِهِ هَذَا ‏.‏ أَنَّ أُنَاسًا مِنْ عَبْدِ الْقَيْسِ قَدِمُوا عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالُوا يَا نَبِيَّ اللَّهِ إِنَّا حَىٌّ مِنْ رَبِيعَةَ وَبَيْنَنَا وَبَيْنَكَ كُفَّارُ مُضَرَ وَلاَ نَقْدِرُ عَلَيْكَ إِلاَّ فِي أَشْهُرِ الْحُرُمِ فَمُرْنَا بِأَمْرٍ نَأْمُرُ بِهِ مَنْ وَرَاءَنَا وَنَدْخُلُ بِهِ الْجَنَّةَ إِذَا نَحْنُ أَخَذْنَا بِهِ ‏.‏ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ آمُرُكُمْ بِأَرْبَعٍ وَأَنْهَاكُمْ عَنْ أَرْبَعٍ اعْبُدُوا اللَّهَ وَلاَ تُشْرِكُوا بِهِ شَيْئًا وَأَقِيمُوا الصَّلاَةَ وَآتُوا الزَّكَاةَ وَصُومُوا رَمَضَانَ وَأَعْطُوا الْخُمُسَ مِنَ الْغَنَائِمِ وَأَنْهَاكُمْ عَنْ أَرْبَعٍ عَنِ الدُّبَّاءِ وَالْحَنْتَمِ وَالْمُزَفَّتِ وَالنَّقِيرِ ‏"‏ ‏.‏ قَالُوا يَا نَبِيَّ اللَّهِ مَا عِلْمُكَ بِالنَّقِيرِ قَالَ ‏"‏ بَلَى جِذْعٌ تَنْقُرُونَهُ فَتَقْذِفُونَ فِيهِ مِنَ الْقُطَيْعَاءِ - قَالَ سَعِيدٌ أَوْ قَالَ مِنَ التَّمْرِ - ثُمَّ تَصُبُّونَ فِيهِ مِنَ الْمَاءِ حَتَّى إِذَا سَكَنَ غَلَيَانُهُ شَرِبْتُمُوهُ حَتَّى إِنَّ أَحَدَكُمْ - أَوْ إِنَّ أَحَدَهُمْ - لَيَضْرِبُ ابْنَ عَمِّهِ بِالسَّيْفِ ‏"‏ ‏.‏ قَالَ وَفِي الْقَوْمِ رَجُلٌ أَصَابَتْهُ جِرَاحَةٌ كَذَلِكَ ‏.‏ قَالَ وَكُنْتُ أَخْبَأُهَا حَيَاءً مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم فَقُلْتُ فَفِيمَ نَشْرَبُ يَا رَسُولَ اللَّهِ قَالَ ‏"‏ فِي أَسْقِيَةِ الأَدَمِ الَّتِي يُلاَثُ عَلَى أَفْوَاهِهَا ‏"‏ ‏.‏ قَالُوا يَا رَسُولَ اللَّهِ إِنَّ أَرْضَنَا كَثِيرَةُ الْجِرْذَانِ وَلاَ تَبْقَى بِهَا أَسْقِيَةُ الأَدَمِ ‏.‏ فَقَالَ نَبِيُّ اللَّهِ صلى الله عليه وسلم ‏"‏ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ وَإِنْ أَكَلَتْهَا الْجِرْذَانُ ‏"‏ ‏.‏ قَالَ وَقَالَ نَبِيُّ اللَّهِ صلى الله عليه وسلم لأَشَجِّ عَبْدِ الْقَيْسِ ‏"‏ إِنَّ فِيكَ لَخَصْلَتَيْنِ يُحِبُّهُمَا اللَّهُ الْحِلْمُ وَالأَنَاةُ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:46:49.29	2025-09-02 11:57:49.252	
cm9vcvumy000khqn8qc642hcr	22	~~Le Messager d’Allah ﷺ~~ nous dit en s’adressant à nous :\n\n« N’êtes-vous pas satisfaits de constituer un quart des habitants du Paradis ? »\n\nLe narrateur dit : Nous avons glorifié Allah (c’est-à-dire que nous avons dit Allâhu Akbar).\n\nPuis, il dit :\n\n« N’êtes-vous pas satisfaits de constituer un tiers des habitants du Paradis ? »\n\nNous avons glorifié Allah.\n\nPuis, il dit :\n\n« J’espère que vous constituerez la moitié des habitants du Paradis. Et je vais vous en expliquer la raison :\nLes croyants parmi les mécréants ne sont pas plus nombreux qu’un poil blanc sur le corps d’un bœuf noir, ou un poil noir sur le corps d’un bœuf blanc. »	حَدَّثَنَا هَنَّادُ بْنُ السَّرِيِّ، حَدَّثَنَا أَبُو الأَحْوَصِ، عَنْ أَبِي إِسْحَاقَ، عَنْ عَمْرِو بْنِ مَيْمُونٍ، عَنْ عَبْدِ اللَّهِ، قَالَ قَالَ لَنَا رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ أَمَا تَرْضَوْنَ أَنْ تَكُونُوا رُبُعَ أَهْلِ الْجَنَّةِ ‏"‏ قَالَ فَكَبَّرْنَا ‏.‏ ثُمَّ قَالَ ‏"‏ أَمَا تَرْضَوْنَ أَنْ تَكُونُوا ثُلُثَ أَهْلِ الْجَنَّةِ ‏"‏ قَالَ فَكَبَّرْنَا ‏.‏ ثُمَّ قَالَ ‏"‏ إِنِّي لأَرْجُو أَنْ تَكُونُوا شَطْرَ أَهْلِ الْجَنَّةِ وَسَأُخْبِرُكُمْ عَنْ ذَلِكَ مَا الْمُسْلِمُونَ فِي الْكُفَّارِ إِلاَّ كَشَعْرَةٍ بَيْضَاءَ فِي ثَوْرٍ أَسْوَدَ أَوْ كَشَعْرَةٍ سَوْدَاءَ فِي ثَوْرٍ أَبْيَضَ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.027	2025-09-02 11:57:50.081	
cm9vcvunk000nhqn8r5y2wh9c	25	~~Le Messager d'Allah ﷺ~~ dit à son oncle au moment de sa mort :\n\n« Prononce : Lā ilāha illa Allah , et je témoignerai pour toi au Jour du Jugement. »\n\nMais **Abou Talib** refusa de le dire.\n\nAlors Allah révéla ce verset :\n\n*« Tu ne guides pas celui que tu aimes, mais c’est Allah qui guide qui Il veut. Et Il connaît mieux ceux qui sont bien guidés. »\nSourate Al-Qasas 28, verset 56*	حَدَّثَنَا مُحَمَّدُ بْنُ عَبَّادٍ، وَابْنُ أَبِي عُمَرَ، قَالاَ حَدَّثَنَا مَرْوَانُ، عَنْ يَزِيدَ، - وَهُوَ ابْنُ كَيْسَانَ - عَنْ أَبِي حَازِمٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم لِعَمِّهِ عِنْدَ الْمَوْتِ ‏"‏ قُلْ لاَ إِلَهَ إِلاَّ اللَّهُ أَشْهَدُ لَكَ بِهَا يَوْمَ الْقِيَامَةِ ‏"‏ ‏.‏ فَأَبَى فَأَنْزَلَ اللَّهُ ‏{‏ إِنَّكَ لاَ تَهْدِي مَنْ أَحْبَبْتَ‏}‏ الآيَةَ ‏.‏	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.049	2025-09-02 11:57:50.678	
cmazhx5bd0002hqdc2d1lhexu	29	Je suis allé voir **Oubada ibn as-Samit** alors qu’il était à l’agonie.\n\nEn voyant cela, je me suis mis à pleurer.\n\nIl me dit alors :\n\nDonne-moi un peu de temps (pour que je te parle). Pourquoi pleures-tu ? \n\nPar Allah, si l’on me demandait de témoigner pour toi, je témoignerais en ta faveur (que tu es croyant).\n\n\nSi l’on me demandait d’intercéder, j’intercéderais pour toi.\nEt si j’avais le pouvoir de t’être utile, je le ferais sans hésiter.\n\nEt maintenant écoute :\n\nPar Allah, jamais je n’ai entendu quoi que ce soit du ~~Messager d’Allah ﷺ~~ qui puisse te profiter sans te le transmettre — sauf un seul hadith. Et c’est celui que je vais te rapporter aujourd’hui, car je suis sur le point de rendre l’âme.\n\nJ’ai entendu le ~~Messager d’Allah ﷺ~~ dire :\n\n*« Quiconque témoigne qu’il n’y a pas de divinité en dehors d’Allah et que ~~Muhammad~~ est le Messager d’Allah, Allah lui interdira le Feu de l’Enfer. »*	حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثٌ، عَنِ ابْنِ عَجْلاَنَ، عَنْ مُحَمَّدِ بْنِ يَحْيَى بْنِ حَبَّانَ، عَنِ ابْنِ مُحَيْرِيزٍ، عَنِ الصُّنَابِحِيِّ، عَنْ عُبَادَةَ بْنِ الصَّامِتِ، أَنَّهُ قَالَ دَخَلْتُ عَلَيْهِ وَهُوَ فِي الْمَوْتِ فَبَكَيْتُ فَقَالَ مَهْلاً لِمَ تَبْكِي فَوَاللَّهِ لَئِنِ اسْتُشْهِدْتُ لأَشْهَدَنَّ لَكَ وَلَئِنْ شُفِّعْتُ لأَشْفَعَنَّ لَكَ وَلَئِنِ اسْتَطَعْتُ لأَنْفَعَنَّكَ ثُمَّ قَالَ وَاللَّهِ مَا مِنْ حَدِيثٍ سَمِعْتُهُ مِنْ رَسُولِ اللَّهِ صلى الله عليه وسلم لَكُمْ فِيهِ خَيْرٌ إِلاَّ حَدَّثْتُكُمُوهُ إِلاَّ حَدِيثًا وَاحِدًا وَسَوْفَ أُحَدِّثُكُمُوهُ الْيَوْمَ وَقَدْ أُحِيطَ بِنَفْسِي سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ مَنْ شَهِدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ حَرَّمَ اللَّهُ عَلَيْهِ النَّارَ	cm9vcp9lp0001hq6gin9xjo72	2025-05-22 14:57:29.641	2025-09-02 11:57:51.482	
cmb2hnvuj0000hqskin96kr1t	39	Un homme demanda au ~~Messager d’Allah~~ ﷺ :\n\n« Quel est le meilleur acte en Islam ? »\n\nLe ~~Prophète~~ ﷺ répondit :\n\n« Que tu donnes à manger (aux autres)\net que tu salues celui que tu connais et celui que tu ne connais pas. »	حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثٌ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ رُمْحِ بْنِ الْمُهَاجِرِ، أَخْبَرَنَا اللَّيْثُ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو، أَنَّ رَجُلاً، سَأَلَ رَسُولَ اللَّهِ صلى الله عليه وسلم أَىُّ الإِسْلاَمِ خَيْرٌ قَالَ ‏ "‏ تُطْعِمُ الطَّعَامَ وَتَقْرَأُ السَّلاَمَ عَلَى مَنْ عَرَفْتَ وَمَنْ لَمْ تَعْرِفْ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-24 17:13:35.996	2025-09-02 11:57:53.512	
cmb3m4fzs000bhqskbcwwpcqd	48	Le ~~Prophète~~ ~~ﷺ~~ a dit :\n\n« Celui qui croit en Allah et au Jour Dernier qu’il agisse bien envers son voisin ;\n\net celui qui croit en Allah et au Jour Dernier qu’il honore son invité ;\n\net celui qui croit en Allah et au Jour Dernier qu’il dise du bien, ou qu’il se taise. »	حَدَّثَنَا زُهَيْرُ بْنُ حَرْبٍ، وَمُحَمَّدُ بْنُ عَبْدِ اللَّهِ بْنِ نُمَيْرٍ، جَمِيعًا عَنِ ابْنِ عُيَيْنَةَ، - قَالَ ابْنُ نُمَيْرٍ حَدَّثَنَا سُفْيَانُ، - عَنْ عَمْرٍو، أَنَّهُ سَمِعَ نَافِعَ بْنَ جُبَيْرٍ، يُخْبِرُ عَنْ أَبِي شُرَيْحٍ الْخُزَاعِيِّ، أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُحْسِنْ إِلَى جَارِهِ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَسْكُتْ ‏"‏ ‏	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 12:06:13.241	2025-09-02 11:57:55.239	
cm9vcvuke0007hqn8hdd16tz3	8	La première personne qui a parlé sur le destin à Bassora est **Ma'bad Al Jouhani**. \n\nAlors que j'étais parti avec **Houmayd Ibn 'Abder Rahman Al Houmayri** pour le Hajj ou la 'Omra nous avons dit : \n\nSi nous rencontrons un des compagnons du ~~Prophète~~ (qu'Allah les agrée tous), nous le questionnerons sur ce que disent ceux-là sur le destin. \n\nNous avons donc trouvé **Abdallah Ibn Omar** (qu'Allah les agrée lui et son père) dans la mosquée et j'ai dit :\n\n-Ô **Abou Abder Rahman** ! Il est apparu des gens derrière nous qui lisent le Coran, étudient la science et font telle et telle chose. Ces gens disent qu'il n'y a pas de destin et que les choses se produisent par elles-mêmes. \n\n**Abdallah ibn Omar** (qu'Allah les agrée lui et son père) a dit :\n\n « Lorsque tu rencontreras ces gens, informe-les que je me désavoue d'eux et qu'ils se désavouent de moi. Je jure par la divinité de **Abdallah ibn Omar** ! Si l'un d'eux possédait l'équivalent de la montagne de Ouhoud en or qu'il dépenserait dans le bien, Allah ne l'aurait pas accepté de lui jusqu'à ce qu'il croit au destin ».	عن يحيى بن معمر قال: كان أول من قال في القدر بالبصرة معبد الجهني، فانطلقت أنا وحميد بن عبد الرحمن الحميري حاجين أو معتمرين، فقلنا: لو لقينا أحدًا من أصحاب رسول الله ﷺ فسألناه عما يقول هؤلاء في القدر، فوفق لنا عبد الله بن عمر بن الخطاب رضي الله عنهما داخلًا المسجد، فقلت: أبا عبد الرحمن! إنه قد ظهر قبلنا ناس يقرؤون القرآن ويتقفرون العلم، وذكر من شأنهم، وأنهم يزعمون أن لا قدر، وأن الأمر أنف. قال عبد الله بن عمر رضي الله عنهما: فإذا لقيت أولئك فأخبرهم أني بريء منهم وأنهم برآء مني، والذي يحلف به عبد الله بن عمر، لو أن لأحدهم مثل أحد ذهبًا فأنفقه ما قبله الله منه حتى يؤمن بالقدر.	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.934	2025-09-02 11:57:47.252	
cm9vcvuod000phqn83xudsoe8	27	Nous étions en marche avec le ~~Messager de Dieu ﷺ~~ vers Tabuk. Les provisions du groupe étaient presque épuisées. La situation devint tellement critique que les hommes décidèrent d'abattre certains de leurs chameaux.\n\n\nÀ ce moment-là, **Omar** dit : "Ô ~~Messager de Dieu~~, je souhaite que vous rassembliez ce qui reste des provisions et que vous invoquiez les bénédictions de Dieu dessus."\n\n\nIl le fit donc. Ceux qui possédaient du blé vinrent avec du blé. Ceux qui avaient des dattes vinrent avec des dattes. \n\nEt **Mujahid** dit : Ceux qui possédaient des noyaux de dattes vinrent avec des noyaux.\n\n\nJe demandai : "Que faisaient-ils avec les noyaux de dattes ?"\n\nIls répondirent : "Ils les suçaient, puis buvaient de l'eau dessus."\n\n\nIl invoqua alors les bénédictions de Dieu sur elles, et il y eut une telle augmentation miraculeuse des provisions que les gens purent complètement les reconstituer.\n\n\nÀ ce moment-là, il dit : "Je témoigne qu'il n'y a de dieu que Dieu, et que je suis Son ~~Messager~~. Celui qui rencontrera Dieu sans douter de ces deux principes entrera au paradis."	حَدَّثَنَا أَبُو بَكْرِ بْنُ النَّضْرِ بْنِ أَبِي النَّضْرِ، قَالَ حَدَّثَنِي أَبُو النَّضْرِ، هَاشِمُ بْنُ الْقَاسِمِ حَدَّثَنَا عُبَيْدُ اللَّهِ الأَشْجَعِيُّ، عَنْ مَالِكِ بْنِ مِغْوَلٍ، عَنْ طَلْحَةَ بْنِ مُصَرِّفٍ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ كُنَّا مَعَ النَّبِيِّ صلى الله عليه وسلم فِي مَسِيرٍ - قَالَ - فَنَفِدَتْ أَزْوَادُ الْقَوْمِ قَالَ حَتَّى هَمَّ بِنَحْرِ بَعْضِ حَمَائِلِهِمْ - قَالَ - فَقَالَ عُمَرُ يَا رَسُولَ اللَّهِ لَوْ جَمَعْتَ مَا بَقِيَ مِنْ أَزْوَادِ الْقَوْمِ فَدَعَوْتَ اللَّهَ عَلَيْهَا ‏.‏ قَالَ فَفَعَلَ - قَالَ - فَجَاءَ ذُو الْبُرِّ بِبُرِّهِ وَذُو التَّمْرِ بِتَمْرِهِ - قَالَ وَقَالَ مُجَاهِدٌ وَذُو النَّوَاةِ بِنَوَاهُ - قُلْتُ وَمَا كَانُوا يَصْنَعُونَ بِالنَّوَى قَالَ كَانُوا يَمُصُّونَهُ وَيَشْرَبُونَ عَلَيْهِ الْمَاءَ ‏.‏ قَالَ فَدَعَا عَلَيْهَا - قَالَ - حَتَّى مَلأَ الْقَوْمُ أَزْوِدَتَهُمْ - قَالَ - فَقَالَ عِنْدَ ذَلِكَ ‏ "‏ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ لاَ يَلْقَى اللَّهَ بِهِمَا عَبْدٌ غَيْرَ شَاكٍّ فِيهِمَا إِلاَّ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.078	2025-09-02 11:57:51.109	
cmb5a87270001hqawv0nqkajp	53	Le ~~Messager d’Allah~~ a dit :\n\n« La dureté du cœur et la rudesse sont à l'Est, et la foi est parmi les gens du Hijaz. »	وَحَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ، أَخْبَرَنَا عَبْدُ اللَّهِ بْنُ الْحَارِثِ الْمَخْزُومِيُّ، عَنِ ابْنِ جُرَيْجٍ، قَالَ أَخْبَرَنِي أَبُو الزُّبَيْرِ، أَنَّهُ سَمِعَ جَابِرَ بْنَ عَبْدِ اللَّهِ، يَقُولُ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ غِلَظُ الْقُلُوبِ وَالْجَفَاءُ فِي الْمَشْرِقِ وَالإِيمَانُ فِي أَهْلِ الْحِجَازِ ‏"‏ ‏	cm9vcp9lp0001hq6gin9xjo72	2025-05-26 16:08:45.247	2025-09-02 11:57:56.276	
cm9vcvukm0008hqn8m2d89h72	9	~~Le Prophète ﷺ~~ était assis avec les gens lorsqu’un homme est venu et a dit:\n\nÔ ~~Messager d’Allah~~ ! Qu’est ce que la foi ?\n\n\n~~Le Prophète ﷺ~~ a dit: «\nLa foi est que tu croies en Allah, en Ses anges, en Son Livre, en Sa rencontre, en Ses Messagers et que tu croies en la résurrection ».\n\n\nPuis il a dit: Ô ~~Messager d’Allah~~ ! Qu’est ce que l’Islam ?\n\n\n~~Le Prophète ﷺ~~ a dit: « L’Islam est que tu adores Allah et que tu ne lui associes rien, que tu accomplisses la prière, que tu t’acquittes de la zakat obligatoire et que tu jeûnes le Ramadan ».\n\n\nPuis il a dit: Qu’est ce que l’ihsan ?\n\n\n~~Le Prophète ﷺ~~ a dit: « Que tu adores Allah comme si tu Le voyais et si tu ne Le voies pas certes Lui te voit ».\n\n\nPuis il a dit: Ô ~~Messager d’Allah~~ ! Quand aura lieu l’Heure ?\n\n\n~~Le Prophète ﷺ~~ a dit: Le questionné n’en sait pas plus que le questionneur mais je vais t’informer de ses signes: quand la femme esclave enfantera son maître ceci fait partie de ses signes.\n\n\nQuand les gens nus et ne portant pas de souliers dirigeront les gens ceci fait partie de ses signes. Quand les gardiens de bétails rivaliseront dans les constructions, ceci fait partie de ses signes. Il y a cinq choses que seul Allah connaît ».\n\n\nPuis ~~le Prophète ﷺ~~ récita : \n\n*Certes la connaissance de l’Heure est auprès d’Allah, c’est Lui qui fait descendre la pluie et sait ce qu’il y a dans les matrices. Aucune âme ne sait ce qu’elle aura demain et aucune âme ne sait sur quelle terre elle va mourir. Certes Allah est savant et très connaisseur.*\n\n\nAlors l’homme est parti.\n\n\n~~Le Prophète ﷺ~~ a dit: « Ramenez moi cet homme ».\n\n\nIls sont parti le chercher mais ils n’ont rien vu.\n\n\nAlors ~~le Prophète ﷺ~~ a dit: « C’est Jibril qui est venu pour apprendre aux gens leur religion ».	عن أبي هريرة رضي الله عنه قال : كان رسول الله صلى الله عليه وسلم يوما بارزا للناس فأتاه رجل فقال : يا رسول الله ! ما الإيمان ؟ قال رسول الله صلى الله عليه وسلم : أن تؤمن بالله وملائكته وكتابه ولقائه ورسله وتؤمن بالبعث الآخر قال الرجل : يا رسول الله ! ما الإسلام ؟ قال رسول الله صلى الله عليه وسلم : الإسلام أن تعبد الله ولا تشرك به شيئا وتقيم الصلاة المكتوبة وتؤدي الزكاة المفروضة وتصوم رمضان قال : يا رسول الله ! ما الإحسان ؟ قال رسول الله صلى الله عليه وسلم : أن تعبد الله كأنك تراه فإنك إن لا تراه فإنه يراك قال : يا رسول الله ! متى الساعة ؟ قال رسول الله صلى الله عليه وسلم : ما المسؤول عنها بأعلم من السائل ولكن سأحدثك عن أشراطها : إذا ولدت الأمة ربها فذاك من أشراطها وإذا كانت العراة الحفاة رؤوس الناس فذاك من أشراطها وإذا تطاول رعاء البهم في البنيان فذاك من أشراطها في خمس لا يعلمهن إلا الله . ثم تلا رسول الله صلى الله عليه وسلم : إن الله عنده علم الساعة وينزل الغيث ويعلم ما في الأرحام وما تدري نفس ماذا تكسب غدا وما تدري نفس بأي أرض تموت إن الله عليم خبير ثم أدبر الرجل فقال رسول الله صلى الله عليه وسلم : ردوا علي الرجل فأخذوا ليردوه فلم يروا شيئا فقال رسول الله صلى الله عليه وسلم : هذا جبريل جاء ليعلم الناس دينهم	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.942	2025-09-02 11:57:47.465	
cm9vcvulc000chqn8qssf5pvs	13	Un homme est venu au ~~Prophète ﷺ~~ et a dit : \n\nMontre moi une oeuvre que je pourrais pratiquer et qui me rapprocherait du paradis et m’éloignerait du feu.\n\n\n~~Le Prophète ﷺ~~ a dit : « Tu adores Allah et tu ne Lui associes rien, tu accomplies la prière, tu t’acquittes de la zakat et tu lies tes liens de parenté ».\n\n\nQuand l’homme est parti ~~le Prophète ﷺ~~ a dit : « S’il s’accroche à ce qui lui a été ordonné il rentrera dans le paradis ».	عن أبي أيوب الأنصاري رضي الله عنه قال : جاء رجل إلى النبي صلى الله عليه وسلم فقال : دلني على عمل أعمله يدنيني من الجنة ويباعدني من النار قال النبي صلى الله عليه وسلم : تعبد الله لا تشرك به شيئا وتقيم الصلاة وتؤتي الزكاة وتصل رحمك فلما أدبر قال النبي صلى الله عليه وسلم : إن تمسك بما أمر به دخل الجنة	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.968	2025-09-02 11:57:48.238	
cm9vcvulj000dhqn8zl076v5f	14	Un homme vint auprès du ~~Prophète ﷺ~~ et lui dit :\n\n« Indique-moi une œuvre qui me rapproche du Paradis et m’éloigne de l’Enfer. » \n\n~~Le Prophète ﷺ~~ répondit : \n\n« Tu adores Allah sans rien Lui associer, tu accomplis la prière, tu acquittes la zakat et tu maintiens les liens de parenté. »\n\n Lorsque l’homme tourna le dos, ~~le Messager d’Allah ﷺ~~ dit : \n\n« S’il s’en tient à ce qui lui a été ordonné, il entrera au Paradis. »	حَدَّثَنَا يَحْيَى بْنُ يَحْيَى التَّمِيمِيُّ، أَخْبَرَنَا أَبُو الأَحْوَصِ، ح وَحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا أَبُو الأَحْوَصِ، عَنْ أَبِي إِسْحَاقَ، عَنْ مُوسَى بْنِ طَلْحَةَ، عَنْ أَبِي أَيُّوبَ، قَالَ جَاءَ رَجُلٌ إِلَى النَّبِيِّ صلى الله عليه وسلم فَقَالَ دُلَّنِي عَلَى عَمَلٍ أَعْمَلُهُ يُدْنِينِي مِنَ الْجَنَّةِ وَيُبَاعِدُنِي مِنَ النَّارِ ‏.‏ قَالَ ‏"‏ تَعْبُدُ اللَّهَ لاَ تُشْرِكُ بِهِ شَيْئًا وَتُقِيمُ الصَّلاَةَ وَتُؤْتِي الزَّكَاةَ وَتَصِلُ ذَا رَحِمِكَ ‏"‏ فَلَمَّا أَدْبَرَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ إِنْ تَمَسَّكَ بِمَا أُمِرَ بِهِ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏ وَفِي رِوَايَةِ ابْنِ أَبِي شَيْبَةَ ‏"‏ إِنْ تَمَسَّكَ بِهِ ‏"‏ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:43.975	2025-09-02 11:57:48.455	
cm9vcvumj000ihqn8w9l5c840	20	Lorsque le ~~Messager d'Allah ﷺ~~ mourut et qu'**Abu Bakr** fut désigné comme calife après lui, et que certains des Arabes renièrent leur foi, **Omar ibn al-Khattab** dit à **Abu Bakr** : \n\n« Comment vas-tu combattre les gens, alors que le ~~Messager d'Allah ﷺ~~ a dit : \n\n"J'ai été ordonné de combattre les gens jusqu'à ce qu'ils disent : Il n'y a pas de divinité sauf Allah". \n\nCelui qui dit : 'Il n'y a pas de divinité sauf Allah' a protégé son bien et sa vie, sauf par son droit et son compte sera auprès d'Allah.' »\n\nAlors, **Abu Bakr** répondit : \n\n« Par Allah, je combattrai ceux qui différencient entre la prière et la zakat. Car la zakat est un droit du bien. Par Allah, même s'ils me retiennent un fil de chameau qu'ils devaient remettre au ~~Messager d'Allah ﷺ~~, je les combattrai pour cela. » \n\n**Omar ibn al-Khattab** dit alors :\n\n « Par Allah, ce n'est que lorsque j'ai vu que Allah avait élargi la poitrine d'Abu Bakr pour le combat, que j'ai su que c'était la vérité. »\n	حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا لَيْثُ بْنُ سَعْدٍ، عَنْ عُقَيْلٍ، عَنِ الزُّهْرِيِّ، قَالَ أَخْبَرَنِي عُبَيْدُ اللَّهِ بْنُ عَبْدِ اللَّهِ بْنِ عُتْبَةَ بْنِ مَسْعُودٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ لَمَّا تُوُفِّيَ رَسُولُ اللَّهِ صلى الله عليه وسلم وَاسْتُخْلِفَ أَبُو بَكْرٍ بَعْدَهُ وَكَفَرَ مَنْ كَفَرَ مِنَ الْعَرَبِ قَالَ عُمَرُ بْنُ الْخَطَّابِ لأَبِي بَكْرٍ كَيْفَ تُقَاتِلُ النَّاسَ وَقَدْ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَقُولُوا لاَ إِلَهَ إِلاَّ اللَّهُ فَمَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ فَقَدْ عَصَمَ مِنِّي مَالَهُ وَنَفْسَهُ إِلاَّ بِحَقِّهِ وَحِسَابُهُ عَلَى اللَّهِ ‏"‏ ‏.‏ فَقَالَ أَبُو بَكْرٍ وَاللَّهِ لأُقَاتِلَنَّ مَنْ فَرَّقَ بَيْنَ الصَّلاَةِ وَالزَّكَاةِ فَإِنَّ الزَّكَاةَ حَقُّ الْمَالِ وَاللَّهِ لَوْ مَنَعُونِي عِقَالاً كَانُوا يُؤَدُّونَهُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم لَقَاتَلْتُهُمْ عَلَى مَنْعِهِ ‏.‏ فَقَالَ عُمَرُ بْنُ الْخَطَّابِ فَوَاللَّهِ مَا هُوَ إِلاَّ أَنْ رَأَيْتُ اللَّهَ عَزَّ وَجَلَّ قَدْ شَرَحَ صَدْرَ أَبِي بَكْرٍ لِلْقِتَالِ فَعَرَفْتُ أَنَّهُ الْحَقُّ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-04-24 12:45:44.011	2025-09-02 11:57:49.64	
cmazkcu4x0005hqdc4wtyjlfh	30	J’étais assis en croupe derrière le ~~Prophète ﷺ~~ sur une monture, et rien ne nous séparait sinon l’arrière de la selle. Le ~~Prophète ﷺ~~ m’appela :\n\n— « Ô **Muadh ibn Jabal** ! »\n\nJe répondis :\n— « Me voici, à ton service, ô ~~Messager d’Allah~~ ! »\n\nIl avança un peu, puis m’appela de nouveau :\n\n— « Ô **Muadh ibn Jabal** ! »\n\nJe répondis de même. Il reprit la marche, puis m’appela une troisième fois :\n\n— « Ô **Muadh ibn Jaba**l ! »\n\nJe répondis encore :\n— « Me voici, à ton service, ô ~~Messager d’Allah~~ ! »\n\nIl dit alors :\n\n« Sais-tu quel est le droit d’Allah sur Ses serviteurs ? »\n\nJe répondis :\n\n— « Allah et Son Messager en savent mieux. »\n\nIl dit :\n\n« Le droit d’Allah sur Ses serviteurs est qu’ils L’adorent sans rien Lui associer. »\n\nPuis, après avoir avancé encore un moment, il ajouta :\n\n« Et sais-tu quel est le droit des serviteurs sur Allah s’ils accomplissent cela (s’ils L’adorent sans rien Lui associer) ? »\n\nJe répondis :\n\n— « Allah et Son ~~Messager~~ en savent mieux. »\n\nIl dit :\n\n« C’est qu’Il ne les châtiera pas (en Enfer). »\n\n	حَدَّثَنَا هَدَّابُ بْنُ خَالِدٍ الأَزْدِيُّ، حَدَّثَنَا هَمَّامٌ، حَدَّثَنَا قَتَادَةُ، حَدَّثَنَا أَنَسُ بْنُ مَالِكٍ، عَنْ مُعَاذِ بْنِ جَبَلٍ، قَالَ كُنْتُ رِدْفَ النَّبِيِّ صلى الله عليه وسلم لَيْسَ بَيْنِي وَبَيْنَهُ إِلاَّ مُؤْخِرَةُ الرَّحْلِ فَقَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ ثُمَّ سَارَ سَاعَةً ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ ثُمَّ سَارَ سَاعَةَ ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ هَلْ تَدْرِي مَا حَقُّ اللَّهِ عَلَى الْعِبَادِ ‏"‏ ‏.‏ قَالَ قُلْتُ اللَّهُ وَرَسُولُهُ أَعْلَمُ ‏.‏ قَالَ ‏"‏ فَإِنَّ حَقَّ اللَّهِ عَلَى الْعِبَادِ أَنْ يَعْبُدُوهُ وَلاَ يُشْرِكُوا بِهِ شَيْئًا ‏"‏ ‏.‏ ثُمَّ سَارَ سَاعَةً ثُمَّ قَالَ ‏"‏ يَا مُعَاذَ بْنَ جَبَلٍ ‏"‏ ‏.‏ قُلْتُ لَبَّيْكَ رَسُولَ اللَّهِ وَسَعْدَيْكَ ‏.‏ قَالَ ‏"‏ هَلْ تَدْرِي مَا حَقُّ الْعِبَادِ عَلَى اللَّهِ إِذَا فَعَلُوا ذَلِكَ ‏"‏ ‏.‏ قَالَ قُلْتُ اللَّهُ وَرَسُولُهُ أَعْلَمُ ‏.‏ قَالَ ‏"‏ أَنْ لاَ يُعَذِّبَهُمْ ‏"‏	cm9vcp9lp0001hq6gin9xjo72	2025-05-22 16:05:40.881	2025-09-02 11:57:51.68	
cmazkolo70006hqdcp9pabpz4	31	Nous étions assis autour du ~~Messager d’Allah ﷺ~~. **Abou Bakr** et **Omar** étaient également présents parmi nous.\n\nÀ un moment, le ~~Messager d’Allah ﷺ~~ se leva et s’absenta. Son absence se prolongea, ce qui nous inquiéta : nous craignions qu’il lui soit arrivé quelque chose de la part d’un ennemi, alors que nous n’étions pas avec lui. Pris d’alarme, nous nous levâmes tous.\n\nJ’étais le premier à me précipiter, et je partis à sa recherche. Je parvins à un jardin appartenant aux Banû an-Najjâr (une tribu des Ansâr). Je fis le tour du jardin pour y chercher une porte, mais je n’en trouvai pas. Je vis un petit ruisseau s’écouler dans le jardin depuis un puits situé à l’extérieur. Je me recroquevillai alors sur moi-même, comme le fait un renard, et je me glissai à l’intérieur.\n\nLe ~~Messager d’Allah ﷺ~~ me dit :\n\n— « Est-ce toi, **Abou Huraira** ? »\n\nJe répondis :\n\n— « Oui, ô ~~Messager d’Allah~~. »\n\nIl me dit :\n\n— « Qu’as-tu ? »\n\nJe répondis :\n\n— « Tu étais avec nous, puis tu t’es levé et tu es parti, et ton absence s’est prolongée. Nous avons eu peur qu’un ennemi ne te fasse du mal. J’ai été le premier à m’alarmer, et quand je suis arrivé à ce jardin, je me suis faufilé à l’intérieur comme un renard. Les autres me suivent. »\n\nAlors le ~~Prophète ﷺ~~ m’appela :\n\n— « Ô **Abou Huraira** ! »\n\nPuis il me donna ses sandales en disant :\n\n— « Prends ces sandales et lorsque tu rencontreras quelqu’un hors de ce jardin qui témoigne qu’il n’y a de divinité digne d’adoration qu’Allah, avec certitude dans son cœur, annonce-lui la bonne nouvelle qu’il entrera au Paradis. »\n\nLe premier que je rencontrai fut **Omar**. Il me dit :\n\n— « Quelles sont ces sandales, ô **Abou Huraira** ? »\n\nJe répondis :\n\n— « Ce sont les sandales du ~~Messager d’Allah ﷺ~~. Il m’a envoyé avec elles pour annoncer à toute personne que je rencontrerai, qui témoigne qu’il n’y a de divinité digne d’adoration qu’Allah, avec conviction dans son cœur, qu’elle entrera au Paradis. »\n\nAlors **Omar** me frappa la poitrine, ce qui me fit tomber sur le dos. Il me dit :\n\n— « Retourne voir le ~~Messager d’Allah ﷺ~~. »\n\nJe retournai alors vers lui, sur le point de pleurer. **Omar** me suivit de près. ~~Le Prophète ﷺ~~ me dit :\n\n— « Qu’as-tu, ô **Abou Huraira**? »\n\nJe répondis :\n\n— « J’ai rencontré **Omar** et je lui ai transmis le message que tu m’as confié. Il m’a frappé la poitrine, ce qui m’a fait tomber, puis il m’a ordonné de revenir vers toi. »\n\n~~Le Messager d’Allah ﷺ~~ demanda alors à **Omar**:\n\n— « Pourquoi as-tu fait cela, ô **Omar** ? »\n\nIl répondit :\n\n— « Que mes père et mère te soient sacrifiés, ô ~~Messager d’Allah~~ ! Est-ce bien toi qui as envoyé **Abou Huraira** avec tes sandales pour annoncer à toute personne qu’il rencontrerait, qui atteste qu’il n’y a de divinité qu’Allah avec certitude dans son cœur, qu’elle entrerait au Paradis ? »\n\nIl répondit :\n\n— « Oui. »\n\n**Omar** dit alors :\n\n— « Je t’en prie, ne le fais pas. J’ai peur que les gens s’appuient uniquement sur cela et délaissent les bonnes actions. »\n\n~~Le Messager d’Allah ﷺ~~ répondit :\n\n— « Eh bien, qu’ils agissent. »\n\n	حَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا عُمَرُ بْنُ يُونُسَ الْحَنَفِيُّ، حَدَّثَنَا عِكْرِمَةُ بْنُ عَمَّارٍ، قَالَ حَدَّثَنِي أَبُو كَثِيرٍ، قَالَ حَدَّثَنِي أَبُو هُرَيْرَةَ، قَالَ كُنَّا قُعُودًا حَوْلَ رَسُولِ اللَّهِ صلى الله عليه وسلم مَعَنَا أَبُو بَكْرٍ وَعُمَرُ فِي نَفَرٍ فَقَامَ رَسُولُ اللَّهِ صلى الله عليه وسلم مِنْ بَيْنِ أَظْهُرِنَا فَأَبْطَأَ عَلَيْنَا وَخَشِينَا أَنْ يُقْتَطَعَ دُونَنَا وَفَزِعْنَا فَقُمْنَا فَكُنْتُ أَوَّلَ مَنْ فَزِعَ فَخَرَجْتُ أَبْتَغِي رَسُولَ اللَّهِ صلى الله عليه وسلم حَتَّى أَتَيْتُ حَائِطًا لِلأَنْصَارِ لِبَنِي النَّجَّارِ فَدُرْتُ بِهِ هَلْ أَجِدُ لَهُ بَابًا فَلَمْ أَجِدْ فَإِذَا رَبِيعٌ يَدْخُلُ فِي جَوْفِ حَائِطٍ مِنْ بِئْرٍ خَارِجَةٍ - وَالرَّبِيعُ الْجَدْوَلُ - فَاحْتَفَزْتُ كَمَا يَحْتَفِزُ الثَّعْلَبُ فَدَخَلْتُ عَلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالَ ‏"‏ أَبُو هُرَيْرَةَ ‏"‏ ‏.‏ فَقُلْتُ نَعَمْ يَا رَسُولَ اللَّهِ ‏.‏ قَالَ ‏"‏ مَا شَأْنُكَ ‏"‏ ‏.‏ قُلْتُ كُنْتَ بَيْنَ أَظْهُرِنَا فَقُمْتَ فَأَبْطَأْتَ عَلَيْنَا فَخَشِينَا أَنْ تُقْتَطَعَ دُونَنَا فَفَزِعْنَا فَكُنْتُ أَوَّلَ مَنْ فَزِعَ فَأَتَيْتُ هَذَا الْحَائِطَ فَاحْتَفَزْتُ كَمَا يَحْتَفِزُ الثَّعْلَبُ وَهَؤُلاَءِ النَّاسُ وَرَائِي فَقَالَ ‏"‏ يَا أَبَا هُرَيْرَةَ ‏"‏ ‏.‏ وَأَعْطَانِي نَعْلَيْهِ قَالَ ‏"‏ اذْهَبْ بِنَعْلَىَّ هَاتَيْنِ فَمَنْ لَقِيتَ مِنْ وَرَاءِ هَذَا الْحَائِطِ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ فَبَشِّرْهُ بِالْجَنَّةِ ‏"‏ فَكَانَ أَوَّلَ مَنْ لَقِيتُ عُمَرُ فَقَالَ مَا هَاتَانِ النَّعْلاَنِ يَا أَبَا هُرَيْرَةَ ‏.‏ فَقُلْتُ هَاتَانِ نَعْلاَ رَسُولِ اللَّهِ صلى الله عليه وسلم بَعَثَنِي بِهِمَا مَنْ لَقِيتُ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ بَشَّرْتُهُ بِالْجَنَّةِ ‏.‏ فَضَرَبَ عُمَرُ بِيَدِهِ بَيْنَ ثَدْيَىَّ فَخَرَرْتُ لاِسْتِي فَقَالَ ارْجِعْ يَا أَبَا هُرَيْرَةَ فَرَجَعْتُ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَأَجْهَشْتُ بُكَاءً وَرَكِبَنِي عُمَرُ فَإِذَا هُوَ عَلَى أَثَرِي فَقَالَ لِي رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ مَا لَكَ يَا أَبَا هُرَيْرَةَ ‏"‏ ‏.‏ قُلْتُ لَقِيتُ عُمَرَ فَأَخْبَرْتُهُ بِالَّذِي بَعَثْتَنِي بِهِ فَضَرَبَ بَيْنَ ثَدْيَىَّ ضَرْبَةً خَرَرْتُ لاِسْتِي قَالَ ارْجِعْ ‏.‏ فَقَالَ لَهُ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ يَا عُمَرُ مَا حَمَلَكَ عَلَى مَا فَعَلْتَ ‏"‏ ‏.‏ قَالَ يَا رَسُولَ اللَّهِ بِأَبِي أَنْتَ وَأُمِّي أَبَعَثْتَ أَبَا هُرَيْرَةَ بِنَعْلَيْكَ مَنْ لَقِيَ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ مُسْتَيْقِنًا بِهَا قَلْبُهُ بَشَّرَهُ بِالْجَنَّةِ ‏.‏ قَالَ ‏"‏ نَعَمْ ‏"‏ ‏.‏ قَالَ فَلاَ تَفْعَلْ فَإِنِّي أَخْشَى أَنْ يَتَّكِلَ النَّاسُ عَلَيْهَا فَخَلِّهِمْ يَعْمَلُونَ ‏.‏ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ فَخَلِّهِمْ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-22 16:14:49.784	2025-09-02 11:57:51.876	
cmb0ylzpo0009hqg8fidikpy0	37	~~Le Prophète ﷺ~~ a dit :\n\n« La modestie n’engendre que le bien. »\n\n**Bushair ibn Kaab** a dit : « Cela est consigné dans les livres de sagesse, il y a sobriété en cela et tranquillité d’esprit en cela. »\n\n**Imran** a dit : « Je vous rapporte la tradition du ~~Messager d’Allah ﷺ~~ et vous me parlez de vos livres. »	حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، وَمُحَمَّدُ بْنُ بَشَّارٍ، - وَاللَّفْظُ لاِبْنِ الْمُثَنَّى - قَالاَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ قَتَادَةَ، قَالَ سَمِعْتُ أَبَا السَّوَّارِ، يُحَدِّثُ أَنَّهُ سَمِعَ عِمْرَانَ بْنَ حُصَيْنٍ، يُحَدِّثُ عَنِ النَّبِيِّ صلى الله عليه وسلم أَنَّهُ قَالَ ‏ "‏ الْحَيَاءُ لاَ يَأْتِي إِلاَّ بِخَيْرٍ ‏"‏ ‏.‏ فَقَالَ بُشَيْرُ بْنُ كَعْبٍ إِنَّهُ مَكْتُوبٌ فِي الْحِكْمَةِ أَنَّ مِنْهُ وَقَارًا وَمِنْهُ سَكِينَةً ‏.‏ فَقَالَ عِمْرَانُ أُحَدِّثُكَ عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم وَتُحَدِّثُنِي عَنْ صُحُفِكَ	cm9vcp9lp0001hq6gin9xjo72	2025-05-23 15:32:28.813	2025-09-02 11:57:53.113	
cmb3ku0x40005hqskudt8juiy	43	Le ~~Prophète~~ ~~ﷺ~~ a dit :\n\nIl y a trois choses qui, lorsqu’elles se trouvent chez une personne, lui font goûter à la douceur de la foi :\n\n– qu’Allah et Son ~~Messager~~ soient plus aimés de lui que toute autre chose,\n\n– qu’il aime une personne uniquement pour Allah,\n\n– et qu’il déteste retourner à la mécréance après qu’Allah l’en a sauvé, tout comme il détesterait être jeté dans le feu.	حَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ، وَمُحَمَّدُ بْنُ يَحْيَى بْنِ أَبِي عُمَرَ، وَمُحَمَّدُ بْنُ بَشَّارٍ، جَمِيعًا عَنِ الثَّقَفِيِّ، - قَالَ ابْنُ أَبِي عُمَرَ حَدَّثَنَا عَبْدُ الْوَهَّابِ، - عَنْ أَيُّوبَ، عَنْ أَبِي قِلاَبَةَ، عَنْ أَنَسٍ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ ثَلاَثٌ مَنْ كُنَّ فِيهِ وَجَدَ بِهِنَّ حَلاَوَةَ الإِيمَانِ مَنْ كَانَ اللَّهُ وَرَسُولُهُ أَحَبَّ إِلَيْهِ مِمَّا سِوَاهُمَا وَأَنْ يُحِبَّ الْمَرْءَ لاَ يُحِبُّهُ إِلاَّ لِلَّهِ وَأَنْ يَكْرَهَ أَنْ يَعُودَ فِي الْكُفْرِ بَعْدَ أَنْ أَنْقَذَهُ اللَّهُ مِنْهُ كَمَا يَكْرَهُ أَنْ يُقْذَفَ فِي النَّارِ ‏"	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 11:30:07.528	2025-09-02 11:57:54.23	
cmb3mg9m9000ehqsk2x8ijldc	49	**Marwan** fut le premier à faire le khotbat al Aid (sermon de la fête) avant la prière (de l’Aid).\n\nUn homme se leva et lui dit : « La prière passe avant le sermon ! »\n\n**Marwan** répondit : « Cela a été abandonné. »\n\nAlors **Abou Sa‘îd** dit :\n\nQuant à cet homme, il a accompli son devoir. J’ai entendu le ~~Messager d’Allah~~ ~~ﷺ~~ dire :\n\n« Celui d’entre vous qui voit un blâmable, qu’il le change de sa main ;\n\ns’il ne peut pas, alors par sa langue ;\n\net s’il ne peut pas, alors dans son cœur — et cela est le plus faible degré de la foi. »	حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا وَكِيعٌ، عَنْ سُفْيَانَ، ح وَحَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، كِلاَهُمَا عَنْ قَيْسِ بْنِ مُسْلِمٍ، عَنْ طَارِقِ بْنِ شِهَابٍ، - وَهَذَا حَدِيثُ أَبِي بَكْرٍ - قَالَ أَوَّلُ مَنْ بَدَأَ بِالْخُطْبَةِ يَوْمَ الْعِيدِ قَبْلَ الصَّلاَةِ مَرْوَانُ فَقَامَ إِلَيْهِ رَجُلٌ فَقَالَ الصَّلاَةُ قَبْلَ الْخُطْبَةِ ‏.‏ فَقَالَ قَدْ تُرِكَ مَا هُنَالِكَ ‏.‏ فَقَالَ أَبُو سَعِيدٍ أَمَّا هَذَا فَقَدْ قَضَى مَا عَلَيْهِ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ وَذَلِكَ أَضْعَفُ الإِيمَانِ ‏"‏ 	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 12:15:24.849	2025-09-02 11:57:55.434	
cmb3ms0l4000hhqskqnzphnab	50	Le ~~Messager~~ d’Allâh (paix soit sur lui) a dit :\n\n« Aucun prophète qu’Allah ait envoyé avant moi vers sa communauté, n’a eu parmi son peuple des disciples et compagnons qui suivaient sa voie et obéissaient à son ordre. \n\nPuis après eux vinrent des successeurs qui disaient ce qu’ils ne faisaient pas et faisaient ce qu’ils n’étaient pas ordonnés de faire.\n\nQuiconque lutte contre eux par la main est croyant ;\n\nquiconque lutte contre eux par la langue est croyant ;\n\n quiconque lutte contre eux par le cœur est croyant, et au-delà de cela il n’y a pas de foi même pas au grain de moutarde. »\n\n**Abou Rafi‘** dit : \n\nJe l’ai rapporté à **Abdullah ibn Omar**, il me l’a rejeté. Puis vint **Ibn Mas‘ud** qui était à Qanâtah, **Abdullah ibn Omar** voulut que je l’accompagne pour lui rendre visite (car **Ibn Mas‘ud** était malade), alors je suis allé avec lui. \n\nQuand nous nous sommes assis devant lui, j’ai demandé à **Ibn Mas‘ud** au sujet de ce hadith, il me l’a rapporté comme je l’avais rapporté à **Ibn Omar.**	حَدَّثَنِي عَمْرٌو النَّاقِدُ، وَأَبُو بَكْرِ بْنُ النَّضْرِ وَعَبْدُ بْنُ حُمَيْدٍ - وَاللَّفْظُ لِعَبْدٍ - قَالُوا حَدَّثَنَا يَعْقُوبُ بْنُ إِبْرَاهِيمَ بْنِ سَعْدٍ، قَالَ حَدَّثَنِي أَبِي، عَنْ صَالِحِ بْنِ كَيْسَانَ، عَنِ الْحَارِثِ، عَنْ جَعْفَرِ بْنِ عَبْدِ اللَّهِ بْنِ الْحَكَمِ، عَنْ عَبْدِ الرَّحْمَنِ بْنِ الْمِسْوَرِ، عَنْ أَبِي رَافِعٍ، عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَا مِنْ نَبِيٍّ بَعَثَهُ اللَّهُ فِي أُمَّةٍ قَبْلِي إِلاَّ كَانَ لَهُ مِنْ أُمَّتِهِ حَوَارِيُّونَ وَأَصْحَابٌ يَأْخُذُونَ بِسُنَّتِهِ وَيَقْتَدُونَ بِأَمْرِهِ ثُمَّ إِنَّهَا تَخْلُفُ مِنْ بَعْدِهِمْ خُلُوفٌ يَقُولُونَ مَا لاَ يَفْعَلُونَ وَيَفْعَلُونَ مَا لاَ يُؤْمَرُونَ فَمَنْ جَاهَدَهُمْ بِيَدِهِ فَهُوَ مُؤْمِنٌ وَمَنْ جَاهَدَهُمْ بِلِسَانِهِ فَهُوَ مُؤْمِنٌ وَمَنْ جَاهَدَهُمْ بِقَلْبِهِ فَهُوَ مُؤْمِنٌ وَلَيْسَ وَرَاءَ ذَلِكَ مِنَ الإِيمَانِ حَبَّةُ خَرْدَلٍ ‏"‏ ‏.‏ قَالَ أَبُو رَافِعٍ فَحَدَّثْتُهُ عَبْدَ اللَّهِ بْنَ عُمَرَ فَأَنْكَرَهُ عَلَىَّ فَقَدِمَ ابْنُ مَسْعُودٍ فَنَزَلَ بِقَنَاةَ فَاسْتَتْبَعَنِي إِلَيْهِ عَبْدُ اللَّهِ بْنُ عُمَرَ يَعُودُهُ فَانْطَلَقْتُ مَعَهُ فَلَمَّا جَلَسْنَا سَأَلْتُ ابْنَ مَسْعُودٍ عَنْ هَذَا الْحَدِيثِ فَحَدَّثَنِيهِ كَمَا حَدَّثْتُهُ ابْنَ عُمَرَ ‏.‏ قَالَ صَالِحٌ وَقَدْ تُحُدِّثَ بِنَحْوِ ذَلِكَ عَنْ أَبِي رَافِعٍ ‏.‏\n	cm9vcp9lp0001hq6gin9xjo72	2025-05-25 12:24:33.017	2025-09-02 11:57:55.64	
cmb5aca5i0004hqawvo775oaa	55	Le ~~Prophète~~ ~~ﷺ~~ a dit :\n\n« La religion, c’est la sincérité (an-nasîha). »\n\nNous avons demandé : « Envers qui ? »\n\nIl répondit :\n\n« Envers Allah, envers Son Livre, envers Son ~~Messager~~, envers les dirigeants des musulmans et envers la masse des musulmans. »	حَدَّثَنَا مُحَمَّدُ بْنُ عَبَّادٍ الْمَكِّيُّ، حَدَّثَنَا سُفْيَانُ، قَالَ قُلْتُ لِسُهَيْلٍ إِنَّ عَمْرًا حَدَّثَنَا عَنِ الْقَعْقَاعِ، عَنْ أَبِيكَ، قَالَ وَرَجَوْتُ أَنْ يُسْقِطَ، عَنِّي رَجُلاً قَالَ فَقَالَ سَمِعْتُهُ مِنَ الَّذِي سَمِعَهُ مِنْهُ أَبِي كَانَ صَدِيقًا لَهُ بِالشَّامِ ثُمَّ حَدَّثَنَا سُفْيَانُ عَنْ سُهَيْلٍ عَنْ عَطَاءِ بْنِ يَزِيدَ عَنْ تَمِيمٍ الدَّارِيِّ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ ‏"‏ الدِّينُ النَّصِيحَةُ ‏"‏ قُلْنَا لِمَنْ قَالَ ‏"‏ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ ‏"‏ ‏	cm9vcp9lp0001hq6gin9xjo72	2025-05-26 16:11:55.879	2025-09-02 11:57:56.669	
\.


--
-- TOC entry 4137 (class 0 OID 39025)
-- Dependencies: 366
-- Data for Name: HadithTransmitter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HadithTransmitter" (id, "hadithId", "transmitterId", "order") FROM stdin;
cmf2hur0o003uhq4sphp8ndjt	cm9vcvuiw0000hqn8w2a0yrxq	cmb5fh269000chq8woopa7sxt	0
cmf2hur0o003vhq4sg9rxwt5w	cm9vcvuiw0000hqn8w2a0yrxq	cmeyhm4po0000hqwcxhzz1hg7	1
cmf2hur0o003whq4szjwp7sr2	cm9vcvuiw0000hqn8w2a0yrxq	cmb6kyg6z0001hqxwgf9tadyx	2
cmf2hur0o003xhq4sgry9bf3b	cm9vcvuiw0000hqn8w2a0yrxq	cmeyhqixf0001hqwc9b8xmipo	3
cmf2hur0o003yhq4sh4dfusji	cm9vcvuiw0000hqn8w2a0yrxq	cmeyhrl2h0002hqwcdzk1sgq7	4
cmf2hur0o003zhq4sduhcthw5	cm9vcvuiw0000hqn8w2a0yrxq	cmb5fh28b000nhq8w93wbsvur	5
\.


--
-- TOC entry 4135 (class 0 OID 39009)
-- Dependencies: 364
-- Data for Name: Sahaba; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Sahaba" (id, name, slug, "nameArabic", "createdAt", "updatedAt") FROM stdin;
cm9vcgarm0000hq44chyvfj3g	Abdallah ibn Omar	abdallah-ibn-omar	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.973
cm9vcgarn0001hq448s762h00	Abdallah ibn Abi Umayya	abdallah-ibn-abi-umayya	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.978
cm9vcgarn0002hq4456q5ntv4	Abdallah ibn Abbas	abdallah-ibn-abbas	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.982
cm9vcgarn0003hq44xxq156nr	Abou Bakr As-Siddiq	abou-bakr-as-siddiq	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.987
cm9vcgarn0004hq44javr0mtf	Abou Darda	abou-darda	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.992
cm9vcgarn0005hq44j0v9kvnf	Abou Huraira	abou-huraira	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:49.997
cm9vcgarn0006hq441whh7wv3	Abou Talib	abou-talib	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.001
cm9vcgarn0007hq44sfnidn1g	Abou Ayyub Al-Ansari	abou-ayyub-al-ansari	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.007
cm9vcgarn0008hq44agwokdmw	Abou Dharr Al-Ghifari	abou-dharr-al-ghifari	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.013
cm9vcgarn0009hq44r3jcdyxt	Abou Muslim Al-Khawlani	abou-muslim-al-khawlani	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.017
cm9vcgarn000ahq44ajv49uy6	Al-Ashajj Abd al-Qays	al-ashajj-abd-al-qays	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.022
cm9vcgarn000bhq44o4rk0edf	Al Mughirah ibn Shu'bah	al-mughirah-ibn-shubah	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.027
cm9vcgarn000chq44bboisieo	Ali ibn Abi Talib	ali-ibn-abi-talib	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.032
cm9vcgarn000dhq449s2aoas6	Anas ibn Malik	anas-ibn-malik	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.037
cm9vcgarn000ehq44b546jgbm	Bilal ibn Rabah	bilal-ibn-rabah	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.042
cm9vcgarn000fhq44iaedfe1b	Fatimah bint Muhammad	fatimah-bint-muhammad	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.046
cm9vcgarn000ghq44ea0as91l	Hassan ibn Ali	hassan-ibn-ali	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.051
cm9vcgarn000hhq44r2u13re0	Houmayd ibn Abder Rahman Al Houmayri	houmayd-ibn-abder-rahman-al-houmayri	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.056
cm9vcgarn000ihq44oth8ensx	Omar ibn al-Khattab	omar-ibn-al-khattab	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.061
cm9vcgarn000jhq44eiv1j507	Othman ibn Affan	othman-ibn-affan	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.067
cm9vcgarn000khq44jc8vms2h	Ma'bad Al Jouhani	mabad-al-jouhani	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.072
cm9vcgarn000lhq44mbjibk16	Muadh ibn Jabal	muadh-ibn-jabal	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.077
cm9vcgarn000mhq445ie9lc8c	Mujahid ibn Jabr	mujahid-ibn-jabr	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.082
cm9vcgarn000nhq44b8mfwpoi	Nou'man ibn Qawqal	nouman-ibn-qawqal	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.087
cm9vcgarn000ohq446eqiaa31	Salman Al-Farsi	salman-al-farsi	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.091
cm9vcgarn000phq441yye4p9i	Zayd ibn Harithah	zayd-ibn-harithah	\N	2025-04-24 12:33:38.435	2025-05-05 10:30:50.097
cmazhortc0001hqdc181t8j84	Oubada ibn as-Samit	oubada-ibn-as-samit	\N	2025-05-22 14:50:58.897	2025-05-22 14:53:29.614
cmazm2vsz0009hqdc0tstyxjk	Itban ibn Malik	itban-ibn-malik	\N	2025-05-22 16:53:55.715	2025-05-22 16:53:55.715
cmb0ycf8j0004hqg8vfvcxi7v	Salim ibn Abdallah	salim-ibn-abdallah	\N	2025-05-23 15:25:02.372	2025-05-23 15:25:02.372
cmb0yjs900007hqg8dc0k77ia	Bushair ibn Kaab	bushair-ibn-kaab	\N	2025-05-23 15:30:45.828	2025-05-23 15:30:45.828
cmb0yjylr0008hqg84eoinl0q	Imran ibn Husain	imran-ibn-husain	\N	2025-05-23 15:30:54.063	2025-05-23 15:30:54.063
cmb3ma7to000chqskzq1nyg6p	Abou Sa'id al-Khudri	abou-said-al-khudri	\N	2025-05-25 12:10:42.589	2025-05-25 12:10:42.589
cmb3mlktq000fhqsk2fsa4253	Abdallah ibn Mas'ud	abdallah-ibn-masud	\N	2025-05-25 12:19:32.654	2025-05-25 12:19:32.654
cmb3mnqdc000ghqsk8o1vl0xw	Abou Rafi'	abou-rafi	\N	2025-05-25 12:21:13.153	2025-05-25 12:21:13.153
\.


--
-- TOC entry 4136 (class 0 OID 39017)
-- Dependencies: 365
-- Data for Name: Transmitter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transmitter" (id, name, slug, "nameArabic", "createdAt", "updatedAt") FROM stdin;
cmb5fh23s0000hq8welt8jbp2	Abbad ibn Tamim	abbad-ibn-tamim	\N	2025-05-26 18:35:36.809	2025-05-26 18:35:36.809
cmb5fh2460001hq8wbcc0onjs	Abbas ibn Abd al-Muttalib	abbas-ibn-abd-al-muttalib	\N	2025-05-26 18:35:36.822	2025-05-26 18:35:36.822
cmb5fh24d0002hq8wazpxgct0	Abd al-Rahman ibn Awf	abd-al-rahman-ibn-awf	\N	2025-05-26 18:35:36.83	2025-05-26 18:35:36.83
cmb5fh24l0003hq8wd3elzd06	Abdallah ibn Abbas	abdallah-ibn-abbas	\N	2025-05-26 18:35:36.838	2025-05-26 18:35:36.838
cmb5fh24s0004hq8wg6tan7gb	Abdallah ibn Amr ibn al-Aas	abdallah-ibn-amr-ibn-al-aas	\N	2025-05-26 18:35:36.844	2025-05-26 18:35:36.844
cmb5fh24z0005hq8wd33c7h6l	Abdallah ibn Jafar	abdallah-ibn-jafar	\N	2025-05-26 18:35:36.851	2025-05-26 18:35:36.851
cmb5fh2550006hq8w6rnj9qbd	Abdallah ibn Mas'ud	abdallah-ibn-masud	\N	2025-05-26 18:35:36.858	2025-05-26 18:35:36.858
cmb5fh25c0007hq8wapm4he3n	Abdallah ibn Omar	abdallah-ibn-omar	\N	2025-05-26 18:35:36.865	2025-05-26 18:35:36.865
cmb5fh25k0008hq8wakqrhuir	Abdallah ibn Zaid	abdallah-ibn-zaid	\N	2025-05-26 18:35:36.872	2025-05-26 18:35:36.872
cmb5fh25r0009hq8w3t52pb54	Abdur Rahman ibn Abou Bakra	abdur-rahman-ibn-abou-bakra	\N	2025-05-26 18:35:36.879	2025-05-26 18:35:36.879
cmb5fh25x000ahq8w22hmy1l7	Abou Ayyub al Ansari	abou-ayyub-al-ansari	\N	2025-05-26 18:35:36.885	2025-05-26 18:35:36.885
cmb5fh263000bhq8wfqxpc67u	Abou Bakr as-Siddiq	abou-bakr-as-siddiq	\N	2025-05-26 18:35:36.891	2025-05-26 18:35:36.891
cmb5fh269000chq8woopa7sxt	Abou Bakr ibn Abou Shaiba	abou-bakr-ibn-abou-shaiba	\N	2025-05-26 18:35:36.898	2025-05-26 18:35:36.898
cmb5fh26f000dhq8wydbbahen	Abou Barza al-Aslami	abou-barza-al-aslami	\N	2025-05-26 18:35:36.904	2025-05-26 18:35:36.904
cmb5fh26l000ehq8wtjrgkiz0	Abou Darda	abou-darda	\N	2025-05-26 18:35:36.91	2025-05-26 18:35:36.91
cmb5fh26t000fhq8wrm8ymy0x	Abou Huraira	abou-huraira	\N	2025-05-26 18:35:36.917	2025-05-26 18:35:36.917
cmb5fh26y000ghq8wo6xp53ck	Abou Musa al-Ash'ari	abou-musa-al-ashari	\N	2025-05-26 18:35:36.923	2025-05-26 18:35:36.923
cmb5fh274000hhq8w07ng90bb	Abou Sa'id al-Khudri	abou-said-al-khudri	\N	2025-05-26 18:35:36.929	2025-05-26 18:35:36.929
cmb5fh27b000ihq8wvgiaqfpq	Abou Salama	abou-salama	\N	2025-05-26 18:35:36.935	2025-05-26 18:35:36.935
cmb5fh27i000jhq8wz14e0tto	Abou Sufyan	abou-sufyan	\N	2025-05-26 18:35:36.942	2025-05-26 18:35:36.942
cmb5fh27q000khq8won7zmmyt	Abou Umama	abou-umama	\N	2025-05-26 18:35:36.951	2025-05-26 18:35:36.951
cmb5fh27w000lhq8w343tn8ay	Abou Qatada	abou-qatada	\N	2025-05-26 18:35:36.956	2025-05-26 18:35:36.956
cmb5fh283000mhq8wins4bqvr	Aisha bint Abi Bakr	aisha-bint-abi-bakr	\N	2025-05-26 18:35:36.963	2025-05-26 18:35:36.963
cmb5fh28b000nhq8w93wbsvur	Ali ibn Abi Talib	ali-ibn-abi-talib	\N	2025-05-26 18:35:36.971	2025-05-26 18:35:36.971
cmb5fh28l000ohq8wzry599hy	Ali ibn Rabi'ah	ali-ibn-rabiah	\N	2025-05-26 18:35:36.981	2025-05-26 18:35:36.981
cmb5fh28v000phq8wakftezd4	Amr ibn al-Aas	amr-ibn-al-aas	\N	2025-05-26 18:35:36.991	2025-05-26 18:35:36.991
cmb5fh293000qhq8w42gy3oin	Anas ibn Malik	anas-ibn-malik	\N	2025-05-26 18:35:36.999	2025-05-26 18:35:36.999
cmb5fh298000rhq8wp0r8m9s9	Asma bint Abi Bakr	asma-bint-abi-bakr	\N	2025-05-26 18:35:37.005	2025-05-26 18:35:37.005
cmb5fh29j000shq8wr6pwhx87	Bilal ibn Rabah	bilal-ibn-rabah	\N	2025-05-26 18:35:37.016	2025-05-26 18:35:37.016
cmb5fh29q000thq8wr88kx639	Burayda ibn al-Husayb	burayda-ibn-al-husayb	\N	2025-05-26 18:35:37.022	2025-05-26 18:35:37.022
cmb5fh29w000uhq8wajjppm69	Fatima bint Muhammad	fatima-bint-muhammad	\N	2025-05-26 18:35:37.028	2025-05-26 18:35:37.028
cmb5fh2a3000vhq8wctpj7b40	Hafsa bint Omar	hafsa-bint-omar	\N	2025-05-26 18:35:37.036	2025-05-26 18:35:37.036
cmb5fh2a9000whq8wyck0iryl	Hamza ibn Abd al-Muttalib	hamza-ibn-abd-al-muttalib	\N	2025-05-26 18:35:37.041	2025-05-26 18:35:37.041
cmb5fh2ai000xhq8wfgmmvlr7	Jabir ibn Abdallah	jabir-ibn-abdallah	\N	2025-05-26 18:35:37.05	2025-05-26 18:35:37.05
cmb5fh2an000yhq8wxwqb5ugk	Khabbab ibn al-Aratt	khabbab-ibn-al-aratt	\N	2025-05-26 18:35:37.056	2025-05-26 18:35:37.056
cmb5fh2au000zhq8wphk7op5l	Malik ibn al-Huwayrith	malik-ibn-al-huwayrith	\N	2025-05-26 18:35:37.062	2025-05-26 18:35:37.062
cmb5fh2b00010hq8wmfxnin8p	Mousayib ibn Hazan	mousayib-ibn-hazan	\N	2025-05-26 18:35:37.069	2025-05-26 18:35:37.069
cmb5fh2b60011hq8wdb2fynim	Muadh ibn Jabal	muadh-ibn-jabal	\N	2025-05-26 18:35:37.074	2025-05-26 18:35:37.074
cmb5fh2bd0012hq8w396djcqt	Nou'man ibn Qawqal	nouman-ibn-qawqal	\N	2025-05-26 18:35:37.082	2025-05-26 18:35:37.082
cmb5fh2bk0013hq8wzcoqdpca	Omar ibn al-Khattab	omar-ibn-al-khattab	\N	2025-05-26 18:35:37.088	2025-05-26 18:35:37.088
cmb5fh2bq0014hq8w07gt9u1m	Othman ibn Affan	othman-ibn-affan	\N	2025-05-26 18:35:37.094	2025-05-26 18:35:37.094
cmb5fh2bw0015hq8wlfctv1xf	Oubada ibn as-Samit	oubada-ibn-as-samit	\N	2025-05-26 18:35:37.101	2025-05-26 18:35:37.101
cmb5fh2c20016hq8wvapyi2cp	Oqba ibn Amr	oqba-ibn-amr	\N	2025-05-26 18:35:37.106	2025-05-26 18:35:37.106
cmb5fh2c80017hq8w7qzec54w	Oum Salama	oum-salama	\N	2025-05-26 18:35:37.112	2025-05-26 18:35:37.112
cmb5fh2ce0018hq8w5cgaqp9e	Ousama ibn Zayd	ousama-ibn-zayd	\N	2025-05-26 18:35:37.118	2025-05-26 18:35:37.118
cmb5fh2cj0019hq8wsqzc1pie	Sa'd ibn Abi Waqqas	sad-ibn-abi-waqqas	\N	2025-05-26 18:35:37.124	2025-05-26 18:35:37.124
cmb5fh2cr001ahq8wk45ctnth	Salman al-Farsi	salman-al-farsi	\N	2025-05-26 18:35:37.132	2025-05-26 18:35:37.132
cmb5fh2cx001bhq8wr2l7t3sg	Talha ibn Ubayd Allah	talha-ibn-ubayd-allah	\N	2025-05-26 18:35:37.138	2025-05-26 18:35:37.138
cmb5fh2d3001chq8w3ntblk3v	Tariq ibn Ouchaym	tariq-ibn-ouchaym	\N	2025-05-26 18:35:37.143	2025-05-26 18:35:37.143
cmb5fh2d9001dhq8wpke3xzb8	Yahya ibn Ma'mar	yahya-ibn-mamar	\N	2025-05-26 18:35:37.15	2025-05-26 18:35:37.15
cmb5fh2dg001ehq8wx7yqi1ff	Yahya ibn Yamur	yahya-ibn-yamur	\N	2025-05-26 18:35:37.156	2025-05-26 18:35:37.156
cmb5fh2dm001fhq8w9vnutva2	Yazid al-Faqir	yazid-al-faqir	\N	2025-05-26 18:35:37.162	2025-05-26 18:35:37.162
cmb5fh2ds001ghq8wxmihcaej	Zayd ibn Thabit	zayd-ibn-thabit	\N	2025-05-26 18:35:37.169	2025-05-26 18:35:37.169
cmb5fh2dy001hhq8wx0j0duea	Zubair ibn al-Awwam	zubair-ibn-al-awwam	\N	2025-05-26 18:35:37.174	2025-05-26 18:35:37.174
cmb5fh2e6001ihq8wf4kbjts0	Inconnu	inconnu	\N	2025-05-26 18:35:37.183	2025-05-26 18:35:37.183
cmb5fh2ec001jhq8wzxa9apkd	Abou Abdallah As-Sunabihi	abou-abdallah-as-sunabihi	\N	2025-05-26 18:35:37.189	2025-05-26 18:35:37.189
cmb5fh2ei001khq8wfdwwt82o	Abbas	abbas	\N	2025-05-26 18:35:37.194	2025-05-26 18:35:37.194
cmb5fh2er001lhq8wjw4w8o49	Abda	abda	\N	2025-05-26 18:35:37.204	2025-05-26 18:35:37.204
cmb5fh2ex001mhq8wphbapslq	Itban ibn Malik	itban-ibn-malik	\N	2025-05-26 18:35:37.209	2025-05-26 18:35:37.209
cmb5fh2f4001nhq8w19jtppym	Imran ibn Husain	imran-ibn-husain	\N	2025-05-26 18:35:37.217	2025-05-26 18:35:37.217
cmb5fh2fa001ohq8w0wkfyh87	Sofian Ibn Abdillah Al Thaqafi	sofian-ibn-abdillah-al-thaqafi	\N	2025-05-26 18:35:37.223	2025-05-26 18:35:37.223
cmb5fh2fg001phq8wqe8jlv2m	Abou Moussa al-Achari	abou-moussa-al-achari	\N	2025-05-26 18:35:37.228	2025-05-26 18:35:37.228
cmb5fh2fo001qhq8w4s534ly2	Abou Chourayh Al Khouza'i	abou-chourayh-al-khouzai	\N	2025-05-26 18:35:37.236	2025-05-26 18:35:37.236
cmb5fh2fu001rhq8wijt6ps8f	Tariq ibn Shihab	tariq-ibn-shihab	\N	2025-05-26 18:35:37.242	2025-05-26 18:35:37.242
cmb5fh2g1001shq8wormpxrwg	Tamim ad-Dari	tamim-ad-dari	\N	2025-05-26 18:35:37.249	2025-05-26 18:35:37.249
cmb5fh2g7001thq8wc43ctkrr	Jarir Ibn Abdallah	jarir-ibn-abdallah	\N	2025-05-26 18:35:37.255	2025-05-26 18:35:37.255
cmb6ktqgm0000hqxwk3emxv4a	Muhammad ibn Jafar	muhammad-ibn-jafar	محمد بن جعفر	2025-05-27 13:53:12.503	2025-05-27 13:53:12.503
cmb6kyg6z0001hqxwgf9tadyx	Shu'ba ibn al-Hajjaj	shuba-ibn-al-hajjaj	\N	2025-05-27 13:56:52.476	2025-05-27 13:56:52.476
cmb9uft2h0000hq3se53y36er	Dawud ibn Rashid	dawud-ibn-rashid	داود بن رشيد	2025-05-29 20:45:37.382	2025-05-29 20:45:37.382
cmb9ujknk0001hq3sa02u38od	Ibn Jabir	ibn-jabir	ابْنِ جَابِرٍ	2025-05-29 20:48:33.105	2025-05-29 20:48:33.105
cmb9ukhx60002hq3sci12gbn6	Al-Walid ibn Muslim	al-walid-ibn-muslim	الوليد بن مسلم	2025-05-29 20:49:16.219	2025-05-29 20:49:16.219
cmb9um1210003hq3sdsm2tfl6	Umayr ibn Hani	umayr-ibn-hani	عُمَيْرُ بْنُ هَانِئٍ	2025-05-29 20:50:27.673	2025-05-29 20:50:27.673
cmb9umt5y0004hq3szbrnu426	Junada ibn Abi Omayya	junada-ibn-abi-omayya	\N	2025-05-29 20:51:04.103	2025-05-29 20:51:04.103
cmbax5orr0000hqbkw0he7drx	Zuhayr ibn Harb	zuhayr-ibn-harb	زهير بن حرب	2025-05-30 14:49:30.28	2025-05-30 14:49:30.28
cmbaxhvk90001hqbkscfmsy5k	Ismail ibn Ulayyah	ismail-ibn-ulayyah	إسماعيل بن علية	2025-05-30 14:58:58.953	2025-05-30 14:58:58.953
cmbaxldb70002hqbktzgi6uu1	Abd al-Aziz ibn Suhayb	abd-al-aziz-ibn-suhayb	عبد العزيز بن صهيب	2025-05-30 15:01:41.923	2025-05-30 15:01:41.923
cmbaxpkxx0007hqbkfqdlj4v8	Muhammad ibn Yahya ibn Abi Omar el-Mekki	muhammad-ibn-yahya-ibn-abi-omar-el-mekki	محمد بن يحيى بن أبي عمر المكي	2025-05-30 15:04:58.438	2025-05-30 15:04:58.438
cmbaxqerz0008hqbkcozbyshs	Bishr ibn al-Hakam	bishr-ibn-al-hakam	بشر بن الحكم	2025-05-30 15:05:37.104	2025-05-30 15:05:37.104
cmbaxrdqn0009hqbk6j2cc9dh	Abd al-Aziz ibn Muhammad ad-Darawardi	abd-al-aziz-ibn-muhammad-ad-darawardi	عبد العزيز بن محمد الدراوردي	2025-05-30 15:06:22.415	2025-05-30 15:06:22.415
cmbaxrx7z000ahqbk7z94ndsj	Yazid ibn al-Had	yazid-ibn-al-had	يزيد بن الهاد	2025-05-30 15:06:47.663	2025-05-30 15:06:47.663
cmbaxshmt000bhqbkivhxeacs	Muhammad ibn Ibrahim	muhammad-ibn-ibrahim	محمد بن إبراهيم	2025-05-30 15:07:14.117	2025-05-30 15:07:14.117
cmbaxt5f5000chqbkzkl5y5ev	Amir ibn Saad	amir-ibn-saad	عامر بن سعد	2025-05-30 15:07:44.946	2025-05-30 15:07:44.946
cmbay381w000khqbklq4tor6z	Muhammad ibn Ubayd al-Ghubari	muhammad-ibn-ubayd-al-ghubari	محمد بن عبيد الغبري	2025-05-30 15:15:34.916	2025-05-30 15:15:34.916
cmbay3s81000lhqbkvccsargp	Abou Awanah	abou-awanah	أبو عوانة	2025-05-30 15:16:01.058	2025-05-30 15:35:00.527
cmbayybf10000hq7ok48ecrdp	Abou Hassin	abou-hassin	أبو حصين	2025-05-30 15:39:45.614	2025-05-30 15:39:45.614
cmbaz1yxg0001hq7osoouihyt	Abu Salih as-Sammam	abu-salih-as-sammam	أبو صالح السمان	2025-05-30 15:42:36.052	2025-05-30 15:42:36.052
cmbazgaii0007hq7oe887g3s4	Muhammad ibn Abdallah ibn Noumayr	muhammad-ibn-abdallah-ibn-noumayr	محمد بن عبد الله بن نمير	2025-05-30 15:53:44.25	2025-05-30 15:53:44.25
cmbazhzyw0008hq7o9yyb1c5f	Abdallah ibn Noumayr	abdallah-ibn-noumayr	عبد الله بن نمير	2025-05-30 15:55:03.896	2025-05-30 15:55:03.896
cmbazirz10009hq7o8odtfwu8	Said ibn Oubayd	said-ibn-oubayd	سعيد بن عبيد	2025-05-30 15:55:40.189	2025-05-30 15:55:40.189
cmbazroe4000jhq7o85jjz37j	Al Mughirah ibn Shu'bah	al-mughirah-ibn-shubah	المغيرة بن شعبة	2025-05-30 16:02:35.452	2025-05-30 16:02:35.452
cmbb253wd000qhq7oq3upwb5n	Hafs ibn Asim	hafs-ibn-asim	حفص بن عاصم	2025-05-30 17:09:01.309	2025-05-30 17:09:01.309
cmbb3s7qa000rhq7ofbhivxjf	Ubayd Allah ibn Muadh al-Anbari	ubayd-allah-ibn-muadh-al-anbari	عبيد الله بن معاذ العنبرى	2025-05-30 17:54:58.979	2025-05-30 17:54:58.979
cmbb3tkzo000shq7o0cqfg1xq	Muadh ibn Muadh	muadh-ibn-muadh	معاذ بن معاذ	2025-05-30 17:56:02.82	2025-05-30 17:56:02.82
cmbb438iv000thq7o6dsxsn5a	Khubayb ibn Abd al-Rahman	khubayb-ibn-abd-al-rahman	خُبَيْبِ بْنِ عَبْدِ الرَّحْمَنِ	2025-05-30 18:03:33.224	2025-05-30 18:16:16.305
cmbb464fn000uhq7om2axs8vr	Muhammad ibn al-Muthanna	muhammad-ibn-al-muthanna	مُحَمَّدُ بْنُ الْمُثَنَّى	2025-05-30 18:05:47.891	2025-05-30 18:05:47.891
cmbb4bi4k000vhq7ocgnsl0as	Abd ar-Rahman ibn Mahdi	abd-ar-rahman-ibn-mahdi	عبد الرحمن بن مهدي	2025-05-30 18:09:58.916	2025-05-30 18:09:58.916
cmbb4mkk60011hq7oept5b6wl	Abdallah ibn Yazid	abdallah-ibn-yazid	عبد الله بن يزيد	2025-05-30 18:18:35.286	2025-05-30 18:18:35.286
cmbb4nus20012hq7ojlqr7box	Said ibn Abi Ayyoub	said-ibn-abi-ayyoub	سعيد بن ابي ايوب	2025-05-30 18:19:35.186	2025-05-30 18:19:35.186
cmbb4od8n0013hq7ox7ggv0fi	Abou Hani	abou-hani	ابو هانئ	2025-05-30 18:19:59.111	2025-05-30 18:19:59.111
cmbb4q8l10014hq7oxoc8d5r6	Abou Othman Moslim ibn Yassar	abou-othman-moslim-ibn-yassar	ابو عثمان مسلم بن يسار	2025-05-30 18:21:26.389	2025-05-30 18:21:26.389
cmeyhm4po0000hqwcxhzz1hg7	Ghundar	ghundar	غُنْدَر	2025-08-30 16:39:58.811	2025-08-30 16:39:58.811
cmeyhqixf0001hqwc9b8xmipo	Mansur ibn al-Muʿtamir	mansur-ibn-al-mutamir	منصور بن المعتمر	2025-08-30 16:43:23.86	2025-08-30 16:43:23.86
cmeyhrl2h0002hqwcdzk1sgq7	Rib’i ibn Hirash	ribi-ibn-hirash	\N	2025-08-30 16:44:13.29	2025-08-30 16:44:13.29
\.


--
-- TOC entry 4138 (class 0 OID 39032)
-- Dependencies: 367
-- Data for Name: _HadithToSahaba; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_HadithToSahaba" ("A", "B") FROM stdin;
cm9vcvujn0003hqn87tj23wuq	cm9vcgarn000bhq44o4rk0edf
\.


--
-- TOC entry 4132 (class 0 OID 38932)
-- Dependencies: 361
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f354ef5e-70a0-4aaf-b5de-4cb391df4e27	a677157d3d8242436edd7580b0bd44e2dbd5e625ef19bb6e93e28b0f3db6bad0	2025-08-30 13:26:28.786236+00	20250816134625_init_postgresql_with_search_optimization	\N	\N	2025-08-30 13:26:28.670997+00	1
f354e588-b1d0-47ae-9586-6026136a7423	c7907f457baffb83354e9ea05aa157c4b7f5738b9a86e48ef8438fe5c2f0324f	2025-08-30 13:26:28.894504+00	20250819140000_add_fuzzy_search_and_unaccent_support	\N	\N	2025-08-30 13:26:28.836194+00	1
b25b3b66-1b06-442f-93dd-3a2be5fd940b	8c266c0e82a1c442c0e5976f776bc063c2a15ca9a059b85180028b5e3dd9ebc8	2025-08-30 13:26:29.032182+00	20250830130412_update	\N	\N	2025-08-30 13:26:28.954989+00	1
\.


--
-- TOC entry 4139 (class 0 OID 39123)
-- Dependencies: 368
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, email, name, image, role, "createdAt", "updatedAt") FROM stdin;
b8511f90-2d66-44d0-844c-ed10ae495e50	nadfri@gmail.com	\N	\N	ADMIN	2025-08-30 15:35:12.975	2025-08-30 15:35:12.975
\.


--
-- TOC entry 4127 (class 0 OID 17003)
-- Dependencies: 352
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-08-16 13:03:54
20211116045059	2025-08-16 13:03:57
20211116050929	2025-08-16 13:03:58
20211116051442	2025-08-16 13:04:00
20211116212300	2025-08-16 13:04:02
20211116213355	2025-08-16 13:04:04
20211116213934	2025-08-16 13:04:06
20211116214523	2025-08-16 13:04:08
20211122062447	2025-08-16 13:04:10
20211124070109	2025-08-16 13:04:11
20211202204204	2025-08-16 13:04:13
20211202204605	2025-08-16 13:04:15
20211210212804	2025-08-16 13:04:20
20211228014915	2025-08-16 13:04:22
20220107221237	2025-08-16 13:04:24
20220228202821	2025-08-16 13:04:25
20220312004840	2025-08-16 13:04:27
20220603231003	2025-08-16 13:04:30
20220603232444	2025-08-16 13:04:31
20220615214548	2025-08-16 13:04:33
20220712093339	2025-08-16 13:04:35
20220908172859	2025-08-16 13:04:37
20220916233421	2025-08-16 13:04:39
20230119133233	2025-08-16 13:04:40
20230128025114	2025-08-16 13:04:43
20230128025212	2025-08-16 13:04:44
20230227211149	2025-08-16 13:04:46
20230228184745	2025-08-16 13:04:48
20230308225145	2025-08-16 13:04:49
20230328144023	2025-08-16 13:04:51
20231018144023	2025-08-16 13:04:53
20231204144023	2025-08-16 13:04:56
20231204144024	2025-08-16 13:04:58
20231204144025	2025-08-16 13:04:59
20240108234812	2025-08-16 13:05:01
20240109165339	2025-08-16 13:05:03
20240227174441	2025-08-16 13:05:06
20240311171622	2025-08-16 13:05:08
20240321100241	2025-08-16 13:05:12
20240401105812	2025-08-16 13:05:16
20240418121054	2025-08-16 13:05:19
20240523004032	2025-08-16 13:05:25
20240618124746	2025-08-16 13:05:27
20240801235015	2025-08-16 13:05:28
20240805133720	2025-08-16 13:05:30
20240827160934	2025-08-16 13:05:32
20240919163303	2025-08-16 13:05:34
20240919163305	2025-08-16 13:05:36
20241019105805	2025-08-16 13:05:37
20241030150047	2025-08-16 13:05:44
20241108114728	2025-08-16 13:05:46
20241121104152	2025-08-16 13:05:48
20241130184212	2025-08-16 13:05:50
20241220035512	2025-08-16 13:05:52
20241220123912	2025-08-16 13:05:53
20241224161212	2025-08-16 13:05:55
20250107150512	2025-08-16 13:05:57
20250110162412	2025-08-16 13:05:58
20250123174212	2025-08-16 13:06:00
20250128220012	2025-08-16 13:06:02
20250506224012	2025-08-16 13:06:03
20250523164012	2025-08-16 13:06:05
20250714121412	2025-08-16 13:06:07
\.


--
-- TOC entry 4131 (class 0 OID 17109)
-- Dependencies: 357
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4113 (class 0 OID 16546)
-- Dependencies: 335
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- TOC entry 4115 (class 0 OID 16588)
-- Dependencies: 337
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-08-16 13:03:52.210515
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-08-16 13:03:52.216157
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-08-16 13:03:52.22191
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-08-16 13:03:52.249849
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-08-16 13:03:52.411909
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-08-16 13:03:52.447971
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-08-16 13:03:52.452888
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-08-16 13:03:52.456422
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-08-16 13:03:52.458903
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-08-16 13:03:52.466352
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-08-16 13:03:52.471234
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-08-16 13:03:52.475414
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-08-16 13:03:52.481092
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-08-16 13:03:52.484217
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-08-16 13:03:52.487085
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-08-16 13:03:52.514672
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-08-16 13:03:52.517345
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-08-16 13:03:52.520675
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-08-16 13:03:52.524434
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-08-16 13:03:52.528829
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-08-16 13:03:52.532258
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-08-16 13:03:52.536943
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-08-16 13:03:52.550077
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-08-16 13:03:52.561473
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-08-16 13:03:52.56451
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-08-16 13:03:52.567132
\.


--
-- TOC entry 4114 (class 0 OID 16561)
-- Dependencies: 336
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- TOC entry 4128 (class 0 OID 17040)
-- Dependencies: 353
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4129 (class 0 OID 17054)
-- Dependencies: 354
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4140 (class 0 OID 40547)
-- Dependencies: 369
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
\.


--
-- TOC entry 4141 (class 0 OID 40554)
-- Dependencies: 370
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- TOC entry 3681 (class 0 OID 16658)
-- Dependencies: 338
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4185 (class 0 OID 0)
-- Dependencies: 330
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 57, true);


--
-- TOC entry 4186 (class 0 OID 0)
-- Dependencies: 356
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 3812 (class 2606 OID 16827)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 3770 (class 2606 OID 16531)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3835 (class 2606 OID 16933)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 3791 (class 2606 OID 16951)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 3793 (class 2606 OID 16961)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 3768 (class 2606 OID 16524)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 3814 (class 2606 OID 16820)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 3810 (class 2606 OID 16808)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3802 (class 2606 OID 17001)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 3804 (class 2606 OID 16795)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 3908 (class 2606 OID 43894)
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- TOC entry 3911 (class 2606 OID 43892)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 3839 (class 2606 OID 16986)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3762 (class 2606 OID 16514)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 16738)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 3824 (class 2606 OID 16867)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 3826 (class 2606 OID 16865)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3831 (class 2606 OID 16881)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3773 (class 2606 OID 16537)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3797 (class 2606 OID 16759)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3821 (class 2606 OID 16848)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 3816 (class 2606 OID 16839)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3755 (class 2606 OID 16921)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3757 (class 2606 OID 16501)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3875 (class 2606 OID 39000)
-- Name: Chapter Chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY (id);


--
-- TOC entry 3894 (class 2606 OID 39031)
-- Name: HadithTransmitter HadithTransmitter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HadithTransmitter"
    ADD CONSTRAINT "HadithTransmitter_pkey" PRIMARY KEY (id);


--
-- TOC entry 3866 (class 2606 OID 38992)
-- Name: Hadith Hadith_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Hadith"
    ADD CONSTRAINT "Hadith_pkey" PRIMARY KEY (id);


--
-- TOC entry 3881 (class 2606 OID 39016)
-- Name: Sahaba Sahaba_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sahaba"
    ADD CONSTRAINT "Sahaba_pkey" PRIMARY KEY (id);


--
-- TOC entry 3887 (class 2606 OID 39024)
-- Name: Transmitter Transmitter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transmitter"
    ADD CONSTRAINT "Transmitter_pkey" PRIMARY KEY (id);


--
-- TOC entry 3897 (class 2606 OID 39038)
-- Name: _HadithToSahaba _HadithToSahaba_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_HadithToSahaba"
    ADD CONSTRAINT "_HadithToSahaba_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3857 (class 2606 OID 38940)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3901 (class 2606 OID 39131)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3855 (class 2606 OID 17269)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3852 (class 2606 OID 17117)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 3844 (class 2606 OID 17007)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3776 (class 2606 OID 16554)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 3783 (class 2606 OID 16595)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 3785 (class 2606 OID 16593)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3781 (class 2606 OID 16571)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 3849 (class 2606 OID 17063)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 3847 (class 2606 OID 17048)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 3903 (class 2606 OID 40553)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3905 (class 2606 OID 40560)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 3771 (class 1259 OID 16532)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 3745 (class 1259 OID 16748)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3746 (class 1259 OID 16750)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3747 (class 1259 OID 16751)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3800 (class 1259 OID 16829)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 3833 (class 1259 OID 16937)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 3789 (class 1259 OID 16917)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4187 (class 0 OID 0)
-- Dependencies: 3789
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3794 (class 1259 OID 16745)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 3836 (class 1259 OID 16934)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 3837 (class 1259 OID 16935)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 3808 (class 1259 OID 16940)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 3805 (class 1259 OID 16801)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 3806 (class 1259 OID 16946)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 3906 (class 1259 OID 43895)
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- TOC entry 3909 (class 1259 OID 43896)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 3840 (class 1259 OID 16993)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 3841 (class 1259 OID 16992)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 3842 (class 1259 OID 16994)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 3748 (class 1259 OID 16752)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3749 (class 1259 OID 16749)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3758 (class 1259 OID 16515)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 3759 (class 1259 OID 16516)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 3760 (class 1259 OID 16744)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 3763 (class 1259 OID 16831)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 3766 (class 1259 OID 16936)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 3827 (class 1259 OID 16873)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 3828 (class 1259 OID 16938)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 3829 (class 1259 OID 16888)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 3832 (class 1259 OID 16887)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 3795 (class 1259 OID 16939)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 3798 (class 1259 OID 16830)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 3819 (class 1259 OID 16855)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 3822 (class 1259 OID 16854)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 3817 (class 1259 OID 16840)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 3818 (class 1259 OID 17002)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 3807 (class 1259 OID 16999)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 3799 (class 1259 OID 16828)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 3750 (class 1259 OID 16908)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4188 (class 0 OID 0)
-- Dependencies: 3750
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 3751 (class 1259 OID 16746)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 3752 (class 1259 OID 16505)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 3753 (class 1259 OID 16963)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 3870 (class 1259 OID 39057)
-- Name: Chapter_index_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Chapter_index_idx" ON public."Chapter" USING btree (index);


--
-- TOC entry 3871 (class 1259 OID 39052)
-- Name: Chapter_index_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Chapter_index_key" ON public."Chapter" USING btree (index);


--
-- TOC entry 3872 (class 1259 OID 39055)
-- Name: Chapter_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Chapter_name_idx" ON public."Chapter" USING btree (name);


--
-- TOC entry 3873 (class 1259 OID 39053)
-- Name: Chapter_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Chapter_name_key" ON public."Chapter" USING btree (name);


--
-- TOC entry 3876 (class 1259 OID 39056)
-- Name: Chapter_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Chapter_slug_idx" ON public."Chapter" USING btree (slug);


--
-- TOC entry 3877 (class 1259 OID 39054)
-- Name: Chapter_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Chapter_slug_key" ON public."Chapter" USING btree (slug);


--
-- TOC entry 3890 (class 1259 OID 39070)
-- Name: HadithTransmitter_hadithId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "HadithTransmitter_hadithId_idx" ON public."HadithTransmitter" USING btree ("hadithId");


--
-- TOC entry 3891 (class 1259 OID 39073)
-- Name: HadithTransmitter_hadithId_order_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HadithTransmitter_hadithId_order_key" ON public."HadithTransmitter" USING btree ("hadithId", "order");


--
-- TOC entry 3892 (class 1259 OID 39072)
-- Name: HadithTransmitter_hadithId_transmitterId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HadithTransmitter_hadithId_transmitterId_key" ON public."HadithTransmitter" USING btree ("hadithId", "transmitterId");


--
-- TOC entry 3895 (class 1259 OID 39071)
-- Name: HadithTransmitter_transmitterId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "HadithTransmitter_transmitterId_idx" ON public."HadithTransmitter" USING btree ("transmitterId");


--
-- TOC entry 3858 (class 1259 OID 39045)
-- Name: Hadith_chapterId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_chapterId_idx" ON public."Hadith" USING btree ("chapterId");


--
-- TOC entry 3859 (class 1259 OID 39048)
-- Name: Hadith_chapterId_numero_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_chapterId_numero_idx" ON public."Hadith" USING btree ("chapterId", numero);


--
-- TOC entry 3860 (class 1259 OID 39051)
-- Name: Hadith_matn_ar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_matn_ar_idx" ON public."Hadith" USING btree (matn_ar);


--
-- TOC entry 3861 (class 1259 OID 39133)
-- Name: Hadith_matn_en_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_matn_en_idx" ON public."Hadith" USING btree (matn_en);


--
-- TOC entry 3862 (class 1259 OID 39050)
-- Name: Hadith_matn_fr_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_matn_fr_idx" ON public."Hadith" USING btree (matn_fr);


--
-- TOC entry 3863 (class 1259 OID 39047)
-- Name: Hadith_numero_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Hadith_numero_idx" ON public."Hadith" USING btree (numero);


--
-- TOC entry 3864 (class 1259 OID 39044)
-- Name: Hadith_numero_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Hadith_numero_key" ON public."Hadith" USING btree (numero);


--
-- TOC entry 3878 (class 1259 OID 39064)
-- Name: Sahaba_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Sahaba_name_idx" ON public."Sahaba" USING btree (name);


--
-- TOC entry 3879 (class 1259 OID 39062)
-- Name: Sahaba_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Sahaba_name_key" ON public."Sahaba" USING btree (name);


--
-- TOC entry 3882 (class 1259 OID 39065)
-- Name: Sahaba_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Sahaba_slug_idx" ON public."Sahaba" USING btree (slug);


--
-- TOC entry 3883 (class 1259 OID 39063)
-- Name: Sahaba_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Sahaba_slug_key" ON public."Sahaba" USING btree (slug);


--
-- TOC entry 3884 (class 1259 OID 39068)
-- Name: Transmitter_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transmitter_name_idx" ON public."Transmitter" USING btree (name);


--
-- TOC entry 3885 (class 1259 OID 39066)
-- Name: Transmitter_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Transmitter_name_key" ON public."Transmitter" USING btree (name);


--
-- TOC entry 3888 (class 1259 OID 39069)
-- Name: Transmitter_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transmitter_slug_idx" ON public."Transmitter" USING btree (slug);


--
-- TOC entry 3889 (class 1259 OID 39067)
-- Name: Transmitter_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Transmitter_slug_key" ON public."Transmitter" USING btree (slug);


--
-- TOC entry 3898 (class 1259 OID 39074)
-- Name: _HadithToSahaba_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_HadithToSahaba_B_index" ON public."_HadithToSahaba" USING btree ("B");


--
-- TOC entry 3867 (class 1259 OID 39122)
-- Name: hadith_matn_ar_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hadith_matn_ar_trgm_idx ON public."Hadith" USING gin (lower(matn_ar) public.gin_trgm_ops);


--
-- TOC entry 3868 (class 1259 OID 39120)
-- Name: hadith_matn_fr_fts_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hadith_matn_fr_fts_idx ON public."Hadith" USING gin (to_tsvector('simple'::regconfig, matn_fr));


--
-- TOC entry 3869 (class 1259 OID 39121)
-- Name: hadith_matn_fr_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hadith_matn_fr_trgm_idx ON public."Hadith" USING gin (lower(matn_fr) public.gin_trgm_ops);


--
-- TOC entry 3899 (class 1259 OID 39132)
-- Name: profiles_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);


--
-- TOC entry 3850 (class 1259 OID 17270)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 3853 (class 1259 OID 17170)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 3774 (class 1259 OID 16560)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 3777 (class 1259 OID 16582)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 3845 (class 1259 OID 17074)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 3778 (class 1259 OID 17039)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 3779 (class 1259 OID 16583)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 3933 (class 2620 OID 17122)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 3932 (class 2620 OID 17027)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 3914 (class 2606 OID 16732)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3918 (class 2606 OID 16821)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3917 (class 2606 OID 16809)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 3916 (class 2606 OID 16796)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3923 (class 2606 OID 16987)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3912 (class 2606 OID 16765)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3920 (class 2606 OID 16868)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3921 (class 2606 OID 16941)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 3922 (class 2606 OID 16882)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3915 (class 2606 OID 16760)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3919 (class 2606 OID 16849)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3928 (class 2606 OID 39105)
-- Name: HadithTransmitter HadithTransmitter_hadithId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HadithTransmitter"
    ADD CONSTRAINT "HadithTransmitter_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES public."Hadith"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3929 (class 2606 OID 39100)
-- Name: HadithTransmitter HadithTransmitter_transmitterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HadithTransmitter"
    ADD CONSTRAINT "HadithTransmitter_transmitterId_fkey" FOREIGN KEY ("transmitterId") REFERENCES public."Transmitter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3927 (class 2606 OID 39095)
-- Name: Hadith Hadith_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Hadith"
    ADD CONSTRAINT "Hadith_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3930 (class 2606 OID 39110)
-- Name: _HadithToSahaba _HadithToSahaba_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_HadithToSahaba"
    ADD CONSTRAINT "_HadithToSahaba_A_fkey" FOREIGN KEY ("A") REFERENCES public."Hadith"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3931 (class 2606 OID 39115)
-- Name: _HadithToSahaba _HadithToSahaba_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_HadithToSahaba"
    ADD CONSTRAINT "_HadithToSahaba_B_fkey" FOREIGN KEY ("B") REFERENCES public."Sahaba"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3913 (class 2606 OID 16572)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 3924 (class 2606 OID 17049)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 3925 (class 2606 OID 17069)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 3926 (class 2606 OID 17064)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4085 (class 0 OID 16525)
-- Dependencies: 333
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4099 (class 0 OID 16927)
-- Dependencies: 350
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4090 (class 0 OID 16725)
-- Dependencies: 341
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4084 (class 0 OID 16518)
-- Dependencies: 332
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4094 (class 0 OID 16814)
-- Dependencies: 345
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4093 (class 0 OID 16802)
-- Dependencies: 344
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4092 (class 0 OID 16789)
-- Dependencies: 343
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4100 (class 0 OID 16977)
-- Dependencies: 351
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4083 (class 0 OID 16507)
-- Dependencies: 331
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4097 (class 0 OID 16856)
-- Dependencies: 348
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4098 (class 0 OID 16874)
-- Dependencies: 349
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4086 (class 0 OID 16533)
-- Dependencies: 334
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4091 (class 0 OID 16755)
-- Dependencies: 342
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4096 (class 0 OID 16841)
-- Dependencies: 347
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4095 (class 0 OID 16832)
-- Dependencies: 346
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4082 (class 0 OID 16495)
-- Dependencies: 329
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4105 (class 3256 OID 39352)
-- Name: profiles Profiles is accessible to users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiles is accessible to users" ON public.profiles FOR SELECT USING (true);


--
-- TOC entry 4104 (class 0 OID 39123)
-- Dependencies: 368
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4103 (class 0 OID 17255)
-- Dependencies: 360
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4087 (class 0 OID 16546)
-- Dependencies: 335
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4089 (class 0 OID 16588)
-- Dependencies: 337
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4088 (class 0 OID 16561)
-- Dependencies: 336
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4101 (class 0 OID 17040)
-- Dependencies: 353
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4102 (class 0 OID 17054)
-- Dependencies: 354
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4106 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 3674 (class 3466 OID 16621)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- TOC entry 3679 (class 3466 OID 16700)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- TOC entry 3673 (class 3466 OID 16619)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- TOC entry 3680 (class 3466 OID 16703)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- TOC entry 3675 (class 3466 OID 16622)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- TOC entry 3676 (class 3466 OID 16623)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


-- Completed on 2025-09-03 13:01:55

--
-- PostgreSQL database dump complete
--

\unrestrict av1SgeFj7hrAP7b33iBF4FfcVgzuWro7V1mLD4kuesBaS8Hsh4ndM12mERmbOln

